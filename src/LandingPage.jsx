import { useNavigate } from 'react-router-dom';
import "./LandingPage.css";
import HomeNavbar from './HomeNavbar';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
        <div className='landing-page'>
        <p>Under Construction!</p>
        </div>
    </>
  );
}

export default LandingPage;
