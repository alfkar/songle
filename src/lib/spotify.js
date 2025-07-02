
const SPOTIFY_TOKEN_ENDPOINT = process.env.NEXT_PUBLIC_SPOTIFY_TOKEN_ENDPOINT;
const SPOTIFY_USER_PROFILE_ENDPOINT = process.env.NEXT_PUBLIC_SPOTIFY_USER_PROFILE_ENDPOINT;
const SPOTIFY_PLAYLIST_ENDPOINT = process.env.NEXT_PUBLIC_SPOTIFY_GET_PLAYLIST_ENDPOINT;
const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID; 
const PLAYLIST_ID = process.env.NEXT_PUBLIC_SONGLE_PLAYLIST_ID;
const SPOTIFY_PLAY_SONG_ENDPINT = process.env.NEXT_PUBLIC_SPOTIFY_PLAY_SONG;

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
/**
 * Gets information from a spotify playlist
 * @param {string} accessToken Spotify access token for authentication
 */

export async function getUserData(accessToken) {
  const response = await fetch(SPOTIFY_USER_PROFILE_ENDPOINT, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + accessToken },
  });
  return await response.json();
}
export async function getPlaylist(accessToken, playlistURI) {
    const url = SPOTIFY_PLAYLIST_ENDPOINT.concat(playlistURI)
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + accessToken },
    });
    return response;
}
/**
 * Recursively fetches all songs from a given Spotify playlist, handling pagination.
 * @param {string} accessToken The Spotify access token for authentication.
 * @param {string|null} [nextUrl=null] (Optional) The URL for the next page of results provided by the Spotify API.
 * This parameter is used internally for recursive calls.
 * @returns {Promise<Array<Object>>} A Promise that resolves to an array of Spotify track objects.
 * Each object represents a track in the playlist.
 * https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks
 */
export async function getSongsFromPlaylist(accessToken, nextUrl=null) {
  let requestURL=SPOTIFY_PLAYLIST_ENDPOINT.concat(PLAYLIST_ID, '/tracks')
  if(nextUrl){
    console.log("Next URL: ", nextUrl)
    requestURL=nextUrl
  }
  try {
    const response = await fetch(requestURL, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + accessToken },
    });
    if (response.ok){
      const data = await response.json();
      const currentTracks = data.items
      .filter(item => item.track && item.track.uri) 
      .map(item => item.track); 

      console.log("Next URl: ", data.next)
      if(!data.next){
        return currentTracks
      }
      const remainingTracks = await getSongsFromPlaylist(accessToken, data.next);
      return currentTracks.concat(remainingTracks);
    }
  }catch (error){
  console.error('Error fetching songs from playlist', error);
  throw error
  }
}

export async function playSong(accessToken, index, playerID) {
  
  const url = `https://api.spotify.com/v1/me/player/play?device_id=${playerID}`; 
  console.log("url: ", url)
  const playlistURI = `spotify:playlist:${PLAYLIST_ID}`;

  const requestBody = {
    context_uri: playlistURI,
    offset: {
      position: index 
    },
    position_ms: 0
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(requestBody) 
  });


  return response
}

