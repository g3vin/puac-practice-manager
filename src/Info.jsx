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
        <h2>Rules</h2>
        <ol>
          <li>When shooting, always straddle the shooting line. Never pass the line or shoot from behind it while the range is hot</li>
          <li>Never load arrows, except while shooting</li>
          <li>Wear closed toed shoes if possible!</li>
          <li>Don't shoot cross range. This means shoot directly in-front of the target you are aiming for</li>
          <li>When you go to get your arrows, leave you bow at least 5 feet behind the shooting line</li>
          <li>Never dry fire a bow, meaning shoot it without an arrow. This can break them, especially our compounds!</li>
          <li>Have fun!</li>
        </ol>
        <h2>Range Calls</h2>
        <p><b>1st Whistle</b> - Head to the shooting line, you may knock an arrow but do NOT draw the bow</p>
        <p><b>2nd Whistle</b> - You may shoot</p>
        <p><b>3 Whistles</b> - Range is clear, you may pull your arrows</p>
        <p><b>4 or more Whistles</b> - EMERGENCY stop shooting IMMEDIATELY</p>
        <h2>How to use this app</h2>
        <p>Once a practice has started, click the "Check Into Practice" button. To view practices you have attended, or your total number of paid practices, click the "View Past Practices" button. To buy more practices, click on the "Purchase Practices" button</p>
        <button type="button" onClick={handleHomeNavigation}>
          Got it! →
        </button>
      </div>
    </div>
  );
}

export default Info;