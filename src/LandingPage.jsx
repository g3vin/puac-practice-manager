import { useNavigate } from 'react-router-dom';
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className='landing-page'>
      <h1>Purdue Archery</h1>
      <button onClick={() => navigate('/login')}>Sign in</button>
    </div>
  );
}

export default LandingPage;
