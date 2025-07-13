import { useNavigate } from 'react-router-dom';
import "./LandingPage.css";
import HomeNavbar from './HomeNavbar';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <HomeNavbar />
      <div className="landing-page">
        <h1>Purdue Archery</h1>
        <div className="content-section">
          <h2>About Us</h2>
          <p>
            Purdue Archery Club is dedicated to fostering a community of archers
            on campus. Whether you're a beginner or an NCAA competitor, join us!
          </p>
        </div>
        <div className="content-section">
          <h2>Our Equipment</h2>
          <p>
            We provide barebows, recurve, and compound setups. All members get
            access to rental gear and coaching sessions.
          </p>
        </div>
        <div className="content-section">
          <h2>Our Equipment</h2>
          <p>
            We provide barebows, recurve, and compound setups. All members get
            access to rental gear and coaching sessions.
          </p>
        </div>
        <div className="content-section">
          <h2>Our Equipment</h2>
          <p>
            We provide barebows, recurve, and compound setups. All members get
            access to rental gear and coaching sessions.
          </p>
        </div>
        <div className="content-section">
          <h2>Our Equipment</h2>
          <p>
            We provide barebows, recurve, and compound setups. All members get
            access to rental gear and coaching sessions.
          </p>
        </div>
        <div className="content-section">
          <h2>Our Equipment</h2>
          <p>
            We provide barebows, recurve, and compound setups. All members get
            access to rental gear and coaching sessions.
          </p>
        </div>
        <div className="content-section">
          <h2>Our Equipment</h2>
          <p>
            We provide barebows, recurve, and compound setups. All members get
            access to rental gear and coaching sessions.
          </p>
        </div>
        <div className="content-section">
          <h2>Our Equipment</h2>
          <p>
            We provide barebows, recurve, and compound setups. All members get
            access to rental gear and coaching sessions.
          </p>
        </div>
        <div className="content-section">
          <button onClick={() => navigate('/join')}>Join Now</button>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
