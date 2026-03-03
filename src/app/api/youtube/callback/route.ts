import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const origin = url.origin;

    if (!code) {
        return new NextResponse('Código não fornecido', { status: 400 });
    }

    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const redirectUri = `${origin}/api/youtube/callback`;

    if (!clientId || !clientSecret) {
        return new NextResponse('Configuração de servidor incompleta.', { status: 500 });
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
            return new NextResponse('Nenhum refresh_token retornado. Por favor, revogue o acesso na sua conta Google e tente novamente, garantindo as permissões completas.', { status: 400 });
        }

        const htmlResponse = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Autenticação do YouTube</title>
                <style>
                    body { background: #050505; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
                </style>
            </head>
            <body>
                <div>Conectando seu canal...</div>
                <script>
                    sessionStorage.setItem('yt_refresh_token', '${refreshToken}');
                    window.location.href = '/settings?oauth=success';
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
