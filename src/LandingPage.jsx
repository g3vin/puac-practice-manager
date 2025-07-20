import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import Gallery from './Gallery';
import Footer from './Footer';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const maxScroll = 750;
    const arrow = document.querySelector('.arrow');

    const onScroll = () => {
      const scrollY = Math.min(window.scrollY, maxScroll);
      const progress = scrollY / maxScroll;
      const maxTranslate = window.innerWidth / 2;
      if (arrow) {
        arrow.style.transform = `translateX(${progress * maxTranslate - 200}px)`;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="landing-page">
      <div className="hero-title">
        <div className="arrow-container">
          <div className="arrow">
            <div className="arrow-fletching"></div>
            <div className="arrow-shaft"></div>
            <div className="arrow-head"></div>
          </div>
        </div>
        <h1>Purdue Archery</h1>
      </div>

      <div style={{height: 2000}}></div>

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