// lib/spotify.js

const SPOTIFY_TOKEN_ENDPOINT = process.env.SPOTIFY_TOKEN_ENDPOINT;
const SPOTIFY_USER_PROFILE_ENDPOINT = process.env.SPOTIFY_USER_PROFILE_ENDPOINT;
const SPOTIFY_PLAYLIST_ENDPOINT = process.env.SPOTIFY_GET_PLAYLIST_ENDPOINT;
const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID; 



export async function getToken(code, redirectUri, code_verifier) {
  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: code_verifier,
    }),
  });
  return await response.json();
}

export async function refreshToken(refreshToken) {
  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }),
  });
  return await response.json();
}

export async function getUserData(accessToken) {
  const response = await fetch(SPOTIFY_USER_PROFILE_ENDPOINT, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + accessToken },
  });
  return await response.json();
}
export async function getPlaylist(accessToken, playlistURI) {
  try{
    const response = await fetch(SPOTIFY_PLAYLIST_ENDPOINT + {playlistURI} + '/tracks', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + accessToken },
    });
    if(!response.ok){
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  }
  catch(error){
    console.error(error.message);
  }
}