
import { getToken } from '../../lib/spotify';
import { serialize, parse } from 'cookie';

const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

export default async function handler(req, res) {
  const { code } = req.query;
  const cookies = parse(req.headers.cookie || '');
  const code_verifier = cookies.spotify_code_verifier;

  if (!code || !code_verifier) {
    console.error('Missing code or code_verifier');
    return res.redirect('/?error=auth_failed');
  }

  try {
    const tokenResponse = await getToken(code, REDIRECT_URI, code_verifier);
    res.setHeader('Set-Cookie', serialize('spotify_code_verifier', '', {
      path: '/',
      httpOnly: true,
      maxAge: 0, 
    }));

    res.setHeader('Set-Cookie', [
      serialize('spotify_access_token', tokenResponse.access_token, { path: '/', httpOnly: false, maxAge: tokenResponse.expires_in }),
      serialize('spotify_refresh_token', tokenResponse.refresh_token, { path: '/', httpOnly: false }),
      serialize('spotify_expires_in', tokenResponse.expires_in.toString(), { path: '/', httpOnly: false, maxAge: tokenResponse.expires_in }),
      serialize('spotify_expires', (Date.now() + tokenResponse.expires_in * 1000).toString(), { path: '/', httpOnly: false, maxAge: tokenResponse.expires_in }),
    ]);

    res.redirect('/');

  } catch (error) {
    console.error('Token exchange failed:', error);
    res.redirect('/?error=token_exchange_failed');
  }
}