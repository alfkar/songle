import React, { useState, useEffect } from 'react';
import { getPlaylist, getSongsFromPlaylist } from '@/lib/spotify';
import { useRouter } from 'next/router';
const SONGLE_PLAYLIST_ID = process.env.NEXT_PUBLIC_SONGLE_PLAYLIST_ID; 

export default function PlayerCard(props) {
  const [playlistInfo, setPlaylistInfo] = useState();
  const [token, setToken] = useState('');

  useEffect(() => {
    const accessToken = props.token
    if (accessToken) {
      setToken(accessToken);
    } else {
      setError("No Spotify access token found.");
    }
  }, []);

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
        }
        const mappedPlaylistInfo = {
            URI: data.uri,
            snapshot_id: data.snapshot_id,
            tracks: songs
          }
        setPlaylistInfo(mappedPlaylistInfo)
        }
        else{
          console.log("Response not OK")
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
  }
    
  } 



  return (
    <div>

    </div>
  );
}