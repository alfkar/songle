import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/8bit/avatar"
import { Badge } from '@/components/ui/8bit/badge';
export default function UserDashboard({ userData, onLogout, onRefreshToken }) {
  const [user, setUser] = useState(userData);
  const [tokenInfo, setTokenInfo] = useState({});

  useEffect(() => {
    const access_token = Cookies.get('spotify_access_token');
    const refresh_token = Cookies.get('spotify_refresh_token');
    const expires_in = Cookies.get('spotify_expires_in');
    const expires = Cookies.get('spotify_expires');

    setTokenInfo({
      access_token,
      refresh_token,
      expires_in: parseInt(expires_in),
      expires: new Date(parseInt(expires)),
    });

  }, []);

  const handleRefresh = async () => {
    try {
      const response = await fetch('/api/spotify-refresh', { method: 'POST' });
      if (response.ok) {
        const newTokens = await response.json();
        setTokenInfo({
          access_token: newTokens.access_token,
          refresh_token: newTokens.refresh_token || tokenInfo.refresh_token, 
          expires_in: newTokens.expires_in,
          expires: new Date(Date.now() + newTokens.expires_in * 1000),
        });
        alert('Token refreshed successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to refresh token: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      alert('An error occurred during token refresh.');
    }
  };

  const handleLogout = () => {
    Cookies.remove('spotify_access_token');
    Cookies.remove('spotify_refresh_token');
    Cookies.remove('spotify_expires_in');
    Cookies.remove('spotify_expires');
    onLogout(); 
  };

  return (
    <div>
      {user?.images && user.images.length > 0 && (
        <div className="flex flex-row gap-4 items-center">
        <Avatar variant="retro" className="size-20">
            <AvatarImage src={user.images[0].url}alt="Profile" />
        </Avatar>
        <Badge className="text-xl">{user?.display_name || user?.id}</Badge>
        </div>
      )}
      <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
    </div>
  );
}