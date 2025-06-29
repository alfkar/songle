import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'; 
import Login from '../components/Login';
import Player from '../components/Player'
import UserDashboard from '../components/UserDashboard';
import PlayerCard from '@/components/PlayerCard';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get('spotify_access_token');
    if (accessToken) {
      setIsLoggedIn(true);
      setToken(accessToken)
      fetchUserData(accessToken);
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, []); 

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('/api/user'); 
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch user data');
        setIsLoggedIn(false); 
        Cookies.remove('spotify_access_token');
        Cookies.remove('spotify_refresh_token');
        Cookies.remove('spotify_expires_in');
        Cookies.remove('spotify_expires');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoggedIn(false);
      Cookies.remove('spotify_access_token');
      Cookies.remove('spotify_refresh_token');
      Cookies.remove('spotify_expires_in');
      Cookies.remove('spotify_expires');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    router.push('/');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    const accessToken = Cookies.get('spotify_access_token');
    if (accessToken) {
      fetchUserData(accessToken);
    }
  };

  return (
    <div className='grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)'>
       <head>
         <title>Spotify PKCE Next.js</title>
       </head>
       <main>
         {isLoggedIn && userData ? (
           <div>
           <UserDashboard userData={userData} onLogout={handleLogout} />
           <PlayerCard token={token}>
           <Player token={token}></Player> 
           </PlayerCard>
 
           </div>
         ) : (
           <Login onLoginSuccess={handleLoginSuccess} />
         )}
       </main>
     </div>
   );
}