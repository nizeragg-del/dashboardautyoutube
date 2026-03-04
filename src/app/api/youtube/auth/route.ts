import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const origin = new URL(request.url).origin;
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID não fornecido' }, { status: 400 });
    }

    if (!clientId) {
        return NextResponse.json({ error: 'YOUTUBE_CLIENT_ID não configurado no servidor' }, { status: 500 });
    }

    const redirectUri = `${origin}/api/youtube/callback`;

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/youtube.upload');
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');
    authUrl.searchParams.append('state', userId); // Passando o ID do usuário para o callback

    return NextResponse.redirect(authUrl.toString());
}
