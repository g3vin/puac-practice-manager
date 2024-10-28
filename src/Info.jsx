import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import './Info.css'

function Info() {
const navigate = useNavigate();

  const handleHomeNavigation = () => {
    navigate('/home');
 };

  return (
    <div>
      <HomeNavbar />
      <div className="info-container">
        <h1>Info</h1>
        <div className="range-calls-container">
        <h2>Range Calls</h2>
        <p><b>1st Whistle</b> - Head to the shooting line, you may knock an arrow but do NOT draw the bow</p>
        <p><b>2nd Whistle</b> - You may shoot</p>
        <p><b>3 Whistles</b> - Range is clear, you may pull your arrows</p>
        <p><b>4 or more Whistles</b> - EMERGENCY stop shooting IMMEDIATELY</p>
        </div>
        <h2>Rules</h2>
        <ol>
          <li>When shooting, always straddle the shooting line. Never pass the line or shoot from behind it while the range is hot</li>
          <li>Never load arrows into the bow, except while shooting</li>
          <li>When you go to get your arrows, leave you bow at least 5 feet behind the shooting line</li>
          <li>Never dry fire a bow, meaning shoot it without an arrow.</li>
          <li>Pull arrows from the base, to not bend them!</li>
          <li>Have fun!</li>
        </ol>
        <button type="button" onClick={handleHomeNavigation}>
          Got it! →
        </button>
      </div>
    </div>
  );
}

export default Info;