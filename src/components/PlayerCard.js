import React, { useState, useEffect } from 'react';
import { getPlaylist, getSongsFromPlaylist, playSong } from '@/lib/spotify';
import Prando from 'prando';
import Player from '@/components/Player'
import SongPicker from '@/components/SongPicker'
const SONGLE_PLAYLIST_ID = process.env.NEXT_PUBLIC_SONGLE_PLAYLIST_ID; 
import {Button} from '@/components/ui/8bit/button'
// Changed props to { initialToken, children } to destructure both the token prop and the children prop
export default function PlayerCard({ token: initialToken, children }) {
  const [playlistInfo, setPlaylistInfo] = useState();
  const [token, setToken] = useState('');
  const [playerInfo, setPlayerReady] = useState(false);

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
            length: data.tracks.total,
            songs: songs
          }
        setPlaylistInfo(mappedPlaylistInfo);
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

  const playDailySong = async () => {
    if(!playerInfo.ready){
      console.log('Player not ready')
      return
    }
    try{
      console.log('PLayerInfo: ', playerInfo)
    const resposnse = await playSong(token, dailyIndex(playlistInfo.length), playerInfo.id)
    }catch(error){
      console.error('Error playing song', error)
    }
  } 

  const handleCorrectGuess = (isCorrect) => {
    console.log("Song guess is: ", isCorrect)
  }
  const playerIsReadyHandler = (playerID) => {
    const mappedPlayerInfo = {
      id: playerID,
      ready: true,
    }
    setPlayerReady(mappedPlayerInfo);

  }
  return (
    <div className="flex flex-col gap-2 mt-6">
      {playlistInfo && (
        <>
          <Player token={initialToken} isReady={playerIsReadyHandler}></Player> 
          <Button onClick={playDailySong()}> Play Daily Song</Button>
          <SongPicker songs={playlistInfo.songs} dailySong={"Father And Son"} handleSongGuess={handleCorrectGuess}> </SongPicker>
          {children} 
        </>
      )}
      {!playlistInfo && <p>Loading playlist info...</p>}
    </div>
  );
}