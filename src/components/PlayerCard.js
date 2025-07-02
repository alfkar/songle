import React, { useState, useEffect } from 'react';
import { getPlaylist, getSongsFromPlaylist, playSong } from '@/lib/spotify';
import Prando from 'prando';
import Player from '@/components/Player'
import SongPicker from '@/components/SongPicker'
const SONGLE_PLAYLIST_ID = process.env.NEXT_PUBLIC_SONGLE_PLAYLIST_ID;
import {Button} from '@/components/ui/8bit/button'

export default function PlayerCard({ token: initialToken, children }) {
  const [playlistInfo, setPlaylistInfo] = useState();
  const [token, setToken] = useState('');
  const [playerInfo, setPlayerReady] = useState(false);

  // Timer state variables
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

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

  // Cleanup the interval when the component unmounts
  useEffect(() => {
    return () => {
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
      }
    };
  }, [timerIntervalId]);

  /**
   * Formats the given number of seconds into HH:MM:SS format.
   * @param {number} seconds - The total number of seconds.
   * @returns {string} The formatted time string.
   */
  const formatTime = (totalTenths) => {
    const minutes = Math.floor(totalTenths / 600); 
    const seconds = Math.floor((totalTenths % 600) / 10); 
    const tenths = totalTenths % 10; 

    const pad = (num) => num.toString().padStart(2, '0');

    return `${pad(minutes)}:${pad(seconds)}:${tenths}`;
};

  /**
   * Starts the timer.
   */
  const startTimer = () => {
    if (!isRunning) { 
      setIsRunning(true);
      const interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1); 
      }, 100);
      setTimerIntervalId(interval);
    }
  };

  /**
   * Stops the timer.
   */
  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      if (timerIntervalId) {
        clearInterval(timerIntervalId); 
        setTimerIntervalId(null);
      }
    }
  };


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
      const response = await playSong(token, dailyIndex(playlistInfo.length), playerInfo.id)
      console.log("playsong response: ", response)
      if (response.ok) {
        startTimer(); 
      }
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
          {/* Timer Display */}
          <div className="text-center text-4xl font-bold my-4">
            {formatTime(elapsedTime)}
          </div>
          <div className="flex justify-center gap-4">
            <Button onClick={playDailySong} disabled={isRunning || !playerInfo.ready}> Play Daily Song</Button>
          </div>
          <SongPicker songs={playlistInfo.songs} dailySong={"Father And Son"} handleSongGuess={handleCorrectGuess}> </SongPicker>
          {children}
        </>
      )}
      {!playlistInfo && <p>Loading playlist info...</p>}
    </div>
  );
}
