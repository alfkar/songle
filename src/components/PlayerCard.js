import React, { useState, useEffect, useRef } from 'react';
import { getPlaylist, getSongsFromPlaylist, playSong } from '@/lib/spotify';
import Prando from 'prando';
import Player from '@/components/Player'
import SongPicker from '@/components/SongPicker'
const SONGLE_PLAYLIST_ID = process.env.NEXT_PUBLIC_SONGLE_PLAYLIST_ID;
import {Button} from '@/components/ui/8bit/button'
import { Avatar, AvatarImage} from "@/components/ui/8bit/avatar"
import { Card,CardHeader,CardContent, CardTitle } from './ui/8bit/card';
import {
  Alert,
} from "./ui/8bit/alert"
import { CardDescription } from './ui/card';


export default function PlayerCard({ token: initialToken, children }) {
  const [playlistInfo, setPlaylistInfo] = useState();
  const [token, setToken] = useState('');
  const [playerInfo, setPlayerReady] = useState(false);
  const [currentDate, setCurrentDate] = useState(null);
  const [dailySongName, setDailySongName] = useState('');
  // Timer state variables
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(null);
  
  useEffect(() => {
  let date = new Date().toDateString();
  {setCurrentDate(date)}
  })

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
    dailySong();
    
  }, [token]);
  useEffect(() => {
    if(playlistInfo){
      dailySong();
    }
  }, [playlistInfo])

  // Cleanup the interval when the component unmounts
  useEffect(() => {
    return () => {
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
      }
    };
  }, [timerIntervalId]);

  /**
   * Formats the given number of milliseconds into SS:T format (seconds:tenths).
   * @param {number} milliseconds - The total number of milliseconds.
   * @returns {string} The formatted time string.
   */
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);

    const seconds = totalSeconds;

    const remainingMilliseconds = milliseconds % 1000;

    const tenths = Math.floor(remainingMilliseconds / 100);

    const pad = (num) => num.toString().padStart(2, '0');
    if(milliseconds<0){
      return "00:0"
    }
    return `${pad(seconds)}:${tenths}`;
  };

  /**
   * Starts the timer.
   */
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      const now = Date.now(); 
      startTimeRef.current = now+1500; 
      setElapsedTime(0); 

      const interval = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
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
      startTimeRef.current = null; 
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
  const dailySong = () => {
    if(!playlistInfo){
      console.error("Playlist info not ready")
      return
    }
    const songName = playlistInfo.songs[dailyIndex(playlistInfo.length)].name
    console.log(songName)
    setDailySongName(songName)
  }
  const playDailySong = async () => {
    if(!playerInfo.ready){
      console.log('Player not ready')
      return
    }
    if (isRunning) {
        console.log('Song already playing, cannot start a new one.');
        return;
    }
    try{
      const response = await playSong(token, dailyIndex(playlistInfo.length), playerInfo.id)
      if(response.ok){
        startTimer()
      }
    }catch(error){
      console.error('Error playing song', error)
    }
  }

  const handleCorrectGuess = (isCorrect) => {
    console.log("Song guess is: ", isCorrect)
    if (isCorrect) {
      stopTimer();
    } else{
      startTimeRef.current -=5000;
      setElapsedTime(elapsedTime+5000);
    }
  }

  const playerIsReadyHandler = (playerID) => {
    const mappedPlayerInfo = {
      id: playerID,
      ready: true,
    }
    setPlayerReady(mappedPlayerInfo);
  }

  return (
      <Card className="mw-40">
      <CardTitle className="text-3xl flex items-center justify-center">Songle</CardTitle>
      <CardHeader className="text-1xl flex items-center justify-center">{currentDate}</CardHeader>
      <CardContent>
      {playlistInfo && (
        <>
          <Player token={initialToken} isReady={playerIsReadyHandler} startTimer={startTimer}></Player>
          {!isRunning ? (
            <div className="flex justify-center gap-4">
              <Button onClick={playDailySong} disabled={!playerInfo.ready}> Play Daily Song</Button>
            </div>
          ) : (
            <div className="flex-col flex items-center justify-center">
              <Avatar variant="retro" className="w-90 h-26">
                  <AvatarImage src={"/music.gif"}alt="Profile" className="w-108 h-25 object-cover mt-2"/>
              </Avatar>
              <p className=" text-4xl font-bold flex items-center justify-center mt-4">
                {formatTime(elapsedTime)}
              </p>

            </div>
          )}
          <div className="mt-5">
            <SongPicker
            songs={playlistInfo.songs}
            dailySong={dailySongName}
            handleSongGuess={handleCorrectGuess}
            elapsedTime={elapsedTime}
            formatTime={formatTime}
            isRunning={isRunning}
              />
          </div>

        </>
      )}
      {!playlistInfo && <p>Loading playlist info...</p>}

      </CardContent>
      </Card>
   
  );
}