import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const userId = url.searchParams.get('state'); // O userId foi passado como 'state' no auth route
    const origin = url.origin;

    if (!code) {
        return new NextResponse('Código não fornecido', { status: 400 });
    }

    if (!userId) {
        return new NextResponse('User ID não recebido no callback', { status: 400 });
    }

    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const redirectUri = `${origin}/api/youtube/callback`;

    const missing = [];
    if (!clientId) missing.push('YOUTUBE_CLIENT_ID');
    if (!clientSecret) missing.push('YOUTUBE_CLIENT_SECRET');
    if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');

    if (missing.length > 0) {
        return new NextResponse(`Configuração de servidor incompleta. Faltam: ${missing.join(', ')}`, { status: 500 });
    }

    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Erro na troca do token:', data);
            return new NextResponse(`Erro do Google: ${data.error_description || data.error}`, { status: 400 });
        }

        const refreshToken = data.refresh_token;

        if (!refreshToken) {
            // Se o usuário não marcou 'consent' na primeira vez, ou já autorizou antes sem revogar, o Google não envia refresh token novamente.
            return new NextResponse('Nenhum refresh_token retornado. Por favor, revogue o acesso do app na sua conta Google e tente novamente.', { status: 400 });
        }

        // Salvar diretamente no Supabase usando a Service Role Key para ignorar RLS nas rotas de API
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        const { error: dbError } = await supabaseAdmin
            .from('profiles')
            .update({ yt_refresh_token: refreshToken })
            .eq('id', userId);

        if (dbError) {
            console.error('Erro ao salvar token no banco:', dbError);
            return new NextResponse('Erro ao salvar o canal no banco de dados.', { status: 500 });
        }

        const htmlResponse = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Autenticação do YouTube</title>
                <style>
                    body { background: #050505; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
                    .loader { border: 4px solid #f3f3f3; border-top: 4px solid #FF0000; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin-bottom: 20px; }
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                </style>
            </head>
            <body>
                <div class="loader"></div>
                <div>Canal vinculado com sucesso! Redirecionando...</div>
                <script>
                    setTimeout(() => {
                        window.location.href = '/settings?oauth=success';
                    }, 1500);
                </script>
            </body>
            </html>
        `;

        return new NextResponse(htmlResponse, {
            headers: { 'Content-Type': 'text/html' },
        });

    } catch (error) {
        console.error('OAuth Callback Error:', error);
        return new NextResponse('Erro interno ao processar OAuth', { status: 500 });
    }
}
