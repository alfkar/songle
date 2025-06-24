// pages/api/spotify-refresh.js

import { refreshToken as refreshSpotifyToken } from '../../lib/spotify';
import { serialize, parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const cookies = parse(req.headers.cookie || '');
  const storedRefreshToken = cookies.spotify_refresh_token;

  if (!storedRefreshToken) {
    return res.status(400).json({ message: 'No refresh token available' });
  }

  try {
    const newTokens = await refreshSpotifyToken(storedRefreshToken);

    res.setHeader('Set-Cookie', [
      serialize('spotify_access_token', newTokens.access_token, { path: '/', httpOnly: false, maxAge: newTokens.expires_in }),
      serialize('spotify_expires_in', newTokens.expires_in.toString(), { path: '/', httpOnly: false, maxAge: newTokens.expires_in }),
      serialize('spotify_expires', (Date.now() + newTokens.expires_in * 1000).toString(), { path: '/', httpOnly: false, maxAge: newTokens.expires_in }),
      newTokens.refresh_token ? serialize('spotify_refresh_token', newTokens.refresh_token, { path: '/', httpOnly: false }) : '',
    ].filter(Boolean)); 

    res.status(200).json(newTokens);
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Failed to refresh token' });
  }
}