import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';

function Info() {
  const navigate = useNavigate();

  const handleHomeNavigation = () => {
    navigate('/home');
  };

  return (
    <div>
      <HomeNavbar />
      <div className="container">
        <h1>Info</h1>
        <button type="button" onClick={handleHomeNavigation}>
          Got it! →
        </button>
      </div>
    </div>
  );
}

export default Info;