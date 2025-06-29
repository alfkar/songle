import React, { useState, useEffect } from 'react';
import { getPlaylist, getSongsFromPlaylist } from '@/lib/spotify';
import Prando from 'prando';

const SONGLE_PLAYLIST_ID = process.env.NEXT_PUBLIC_SONGLE_PLAYLIST_ID; 

// Changed props to { initialToken, children } to destructure both the token prop and the children prop
export default function PlayerCard({ token: initialToken, children }) {
  const [playlistInfo, setPlaylistInfo] = useState();
  const [token, setToken] = useState('');

  useEffect(() => {
    if (initialToken) {
      setToken(initialToken);
    } else {
      console.error("No Spotify access token found.");
    }
  }, [initialToken]);

  useEffect(() => {
    if (token) {
     fetchPlaylist(token);
    }
  }, [token]);
  
  const fetchPlaylist = async (token) => {
      try{
        const response = await getPlaylist(token, SONGLE_PLAYLIST_ID);
        if(response.ok){
        const data = await response.json()
        let songs = localStorage.getItem(data.snapshot_id);
        if(!songs){
          songs = await fetchSongsFromPlaylist(token);
          localStorage.setItem(data.snapshot_id, JSON.stringify(songs)); 
        } else {
          // If songs exist in localStorage, parse them
          songs = JSON.parse(songs);
        }
        const mappedPlaylistInfo = {
            URI: data.uri,
            snapshot_id: data.snapshot_id,
            tracks: songs
          }
        setPlaylistInfo(mappedPlaylistInfo)
        }
        else{
          console.log("Response not OK", response.status);
        }
      } 
      catch(error){
      console.error('Error fetching playlist:', error);
      }       
  }

  const fetchSongsFromPlaylist = async (token) => {
    try{
      const songs = await getSongsFromPlaylist(token)
      return songs
    }catch(error){
      console.error('Error fetching songs:', error);
      return [];
  }
  }

  const dailyIndex = (nSongs) => {
    let date = new Date().toISOString().split("T")[0];
    let index = new Prando(date).nextInt(0, nSongs);
    return index;
  } 

  return (
    <div>
      {playlistInfo && (
        <>
          <h3>Playlist: {playlistInfo.snapshot_id}</h3>
          {/* This line renders whatever JSX is passed between <PlayerCard> and </PlayerCard> */}
          {children} 
        </>
      )}
      {!playlistInfo && <p>Loading playlist info...</p>}
    </div>
  );
}