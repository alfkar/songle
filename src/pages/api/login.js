
import { generateRandomString, generateCodeChallenge } from '../../lib/pcke'; // Re-use PKCE logic

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
const AUTHORIZATION_ENDPOINT = process.env.NEXT_PUBLIC_SPOTIFY_AUTHORIZATION_ENDPOINT;
const SCOPE = 'streaming \
              user-read-private \
              user-read-email \
              user-modify-playback-state';

export default async function handler(req, res) {
  const code_verifier = generateRandomString(64);
  const code_challenge = await generateCodeChallenge(code_verifier);

  res.setHeader('Set-Cookie', `spotify_code_verifier=${code_verifier}; Path=/; HttpOnly; SameSite=Lax; Max-Age=300`); 

  const authUrl = new URL(AUTHORIZATION_ENDPOINT);
  const params = {
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPE,
    code_challenge_method: 'S256',
    code_challenge: code_challenge,
    redirect_uri: REDIRECT_URI,
  };

  authUrl.search = new URLSearchParams(params).toString();
  res.redirect(authUrl.toString());
}
