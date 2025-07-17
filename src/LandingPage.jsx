import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LandingPage.css";
import Gallery from './Gallery';
import Footer from './Footer';

function LandingPage() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [unlocked, setUnlocked] = useState(false);


useEffect(() => {
  const maxScroll = 600; 
  const arrow = document.querySelector('.arrow');

  const onScroll = () => {
    const scrollY = Math.min(window.scrollY, maxScroll);
    // move arrow
    const progress = scrollY / maxScroll;
    const viewportWidth = window.innerWidth;
    const maxTranslate = (viewportWidth - 200) / 2;
    if (arrow) arrow.style.transform = `translateX(${progress * maxTranslate}px)`;

    // if arrow centered, unlock
    if (progress >= 1 && !unlocked) {
      setUnlocked(true);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', blockWheel, {passive: false});
    }
  };

  // prevent wheel from moving past maxScroll
  const blockWheel = (e) => {
    if (window.scrollY >= maxScroll && !unlocked) {
      e.preventDefault();
      window.scrollTo({ top: maxScroll, behavior: 'instant' });
    }
  };

  // attach listeners
  window.addEventListener('scroll', onScroll);
  window.addEventListener('wheel', blockWheel, { passive: false });

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('wheel', blockWheel);
  };
}, [unlocked]);


  return (
    <div className={`landing-page ${unlocked ? 'unlocked' : ''}`} ref={pageRef}>
      <div className="hero-title">
        <div className="arrow-container">
          <div className="arrow">
            <div className="arrow-head"></div>
            <div className="arrow-shaft"></div>
            <div className="arrow-fletching"></div>
          </div>
        </div>
        <h1>Purdue Archery</h1>
      </div>

      <div className="content-section">
        <p>
          Purdue University Archery Club (PUAC) is a student-run organization focused on archery development at Purdue University. We welcome all skill levels, from brand-new shooters to tournament-winning archers!
        </p>
      </div>

      <Gallery />

      <div className="content-section">
        <h2>Our Equipment</h2>
        <p>
          We provide barebows, recurve, and compound setups. All members get access to rental gear and coaching sessions.
        </p>
      </div>

      <div className="content-section">
        <button onClick={() => navigate('/join')}>Join Now</button>
      </div>
    <Footer />
    </div>
  );
}

export default LandingPage;
