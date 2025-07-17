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
      <div className="info-container">
        <h1>Info</h1>
        <div className="range-calls-container">
        <h2>Range Calls</h2>
        <p><b>2 Whistles</b> - Head to the shooting line, you may knock an arrow but do NOT draw the bow</p>
        <p><b>1 Whistle (Following the first 2)</b> - You may shoot</p>
        <p><b>3 Whistles</b> - Range is clear, you may pull your arrows</p>
        <p><b>5+ Whistles</b> - EMERGENCY stop shooting IMMEDIATELY</p>
        </div>
        <h2>Rules</h2>
        <ol>
          <li>When shooting, always straddle the shooting line. Never pass the shooting line unless 3 whistles have been blown and the range is clear to pull arrows.</li>
          <li>When you go to get your arrows, leave your bow behind the shooting line</li>
          <li>Never dry fire a bow (meaning shoot without an arrow).</li>
          <li>Pull arrows from the target by their the base, this is to not bend them.</li>
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