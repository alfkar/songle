import React, { useState, useEffect } from 'react';

function WebPlayback({token, isReady, stopPlaying}) {
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [id, setId] = useState('');
    const [isPaused, setPaused] = useState(true);
    const [isActive, setActive] = useState(false);

useEffect(() => {

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {

        const player = new window.Spotify.Player({
            name: 'Songle',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5
        });

        setPlayer(player);

        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            isReady(device_id)
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });


        player.connect().then(success => {
            if (success) {
              console.log('The Web Playback SDK successfully connected to Spotify!');
            }
          })
          

        player.addListener('player_state_changed', ( state => {

            if (!state) {
                return;
            }
        
            setTrack(state.track_window.current_track);
            setPaused(state.paused);
        
            player.getCurrentState().then( state => {
                (!state)? setActive(false) : setActive(true)

            });
    

        
        }));
        return () => {
            if (player) {
                player.disconnect(); // Disconnect the Spotify player
                console.log('Spotify Web Playback SDK disconnected during cleanup.');
            }
        }

    };
}, []);

useEffect(() => {
    if (stopPlaying && player) {
        console.log('Stopping playback...');
        player.pause();
    }
}, [stopPlaying, player]); 


return (
    <>
        <div className="container">
            <div className="main-wrapper">
            </div>
        </div>
     </>
)

}

export default WebPlayback

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}
