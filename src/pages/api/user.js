
import { getUserData as getSpotifyUserData } from '../../lib/spotify';
import { parse } from 'cookie';

export default async function handler(req, res) {
  const cookies = parse(req.headers.cookie || '');
  const accessToken = cookies.spotify_access_token;

  if (!accessToken) {
    return res.status(401).json({ message: 'No access token provided.' });
  }

  try {
    const userData = await getSpotifyUserData(accessToken);
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Failed to fetch user data.' });
  }
}