import { useNavigate } from 'react-router-dom';
import "./LandingPage.css";
import HomeNavbar from './HomeNavbar';
import Footer from './Footer';
import Gallery from './Gallery';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <HomeNavbar />
      <div className="landing-page">
        <h1>Purdue Archery</h1>
        <div className="content-section">
          <p>
            Purdue University Archery Club (PUAC) is a student-run organization focused on archery development at Purdue University. We welcome all skill levels, from brand-new shooters to tournament winning archers!
          </p>
        </div>
        <Gallery />
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
      <Footer />
    </>
  );
}

export default LandingPage;
