import React from 'react';

export default function Login() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Please log in with Spotify to continue.</p>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
}