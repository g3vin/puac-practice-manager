import { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import './HomeNavbar.css';
import { useNavigate } from 'react-router-dom';

import logoutIcon from './assets/logoutIcon.png';
import homeIcon from './assets/homeicon.png';

const HomeNavbar = () => {
    const { userId, hasLoggedIn} = useUser();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const isWideScreen = windowWidth > 1050;

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (userId && hasLoggedIn) {
            console.log("User is logged in, updating UI");
        }
    }, [hasLoggedIn, userId]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleHome = () => {
        navigate('/');
    };

    const handleAboutArchery = () => {
        navigate('/about-archery');
    }

    const handleOurRange = () => {
        navigate('/our-range');
    }

    const handleOurTeam = () => {
        navigate('/our-team');
    }

    const handleCalendar = () => {
        navigate('/calendar');
    }

    const handleCompetitions = () => {
        navigate('/competitions');
    }

    const handleContact = () => {
        navigate('/contact');
    }

    const handleJoin = () => {
        navigate('/join');
    }

    const handleLogin = () => {
        navigate('/home');
    };

    // Helper: get the closest non-transparent background color of an element or its parents
    function getBackgroundColor(el) {
        if (!el || el === document.documentElement) return null;

  const bg = window.getComputedStyle(el).backgroundColor;
  
  // Check for rgba with alpha less than 1 (transparent)
  if (bg.startsWith('rgba')) {
    const alpha = parseFloat(bg.split(',')[3]);
    if (alpha === 0) {
      // Transparent, check parent recursively
      return getBackgroundColor(el.parentElement);
    }
  }
  
  if (bg === 'transparent' || bg === 'inherit') {
    return getBackgroundColor(el.parentElement);
  }
  
  return bg;
}

const checkBackground = () => {
  const navbar = document.querySelector('.home-navbar-container');
  if (!navbar) return;

  const rect = navbar.getBoundingClientRect();

  navbar.style.pointerEvents = 'none';

  const samplePoints = [
    [rect.left + rect.width * 0.25, rect.top + rect.height / 2], 
    [rect.left + rect.width * 0.5, rect.top + rect.height / 2],
    [rect.left + rect.width * 0.75, rect.top + rect.height / 2],
    [rect.left + rect.width * 0.5, rect.top + rect.height * 0.25],
    [rect.left + rect.width * 0.5, rect.top + rect.height * 0.75]
  ];

  let totalBrightness = 0;
  let validSamples = 0;

  for (const [x, y] of samplePoints) {
    const el = document.elementFromPoint(x, y);
    if (!el) continue;

    const bg = getBackgroundColor(el);
    if (!bg) continue;

    const match = bg.match(/\d+/g);
    if (!match) continue;

    const [r, g, b] = match.map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    totalBrightness += brightness;
    validSamples++;
  }

  navbar.style.pointerEvents = '';

  if (validSamples === 0) return;

  const avgBrightness = totalBrightness / validSamples;
  const isLight = avgBrightness > 160;

  navbar.classList.toggle('dark', isLight);
};

useEffect(() => {
    let timeout;

    const handleScrollOrResize = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            checkBackground();
        }, 100); // Adjust debounce time if needed
    };

    window.addEventListener('scroll', handleScrollOrResize);
    window.addEventListener('resize', handleScrollOrResize);
    checkBackground(); // Run once initially

    return () => {
        window.removeEventListener('scroll', handleScrollOrResize);
        window.removeEventListener('resize', handleScrollOrResize);
    };
}, []);

useEffect(() => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
    setTimeout(() => checkBackground(), 50);
  }
}, []);

    return (
        <div className='home-navbar-container'>
  <div className="home_navbar">
    <div className="navbar-top-row">
      <div className="nav_content">
        <h1 onClick={handleHome} style={{ cursor: 'pointer' }}>PUAC</h1>
        {isWideScreen && (
            <div className="navbar-inline-links">
            <p onClick={handleAboutArchery}>About Archery</p>
            <p onClick={handleOurRange}>Our Range</p>
            <p onClick={handleOurTeam}>Our Team</p>
            <p onClick={handleCalendar}>Calendar</p>
            <p onClick={handleCompetitions}>Competitions</p>
            <p onClick={handleContact}>Contact</p>
            <p onClick={handleJoin}>Join</p>
            </div>
        )}
        </div>

                    <h2
            className="theme-toggle"
            onClick={() => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                setTimeout(() => checkBackground(), 50);
            }}
            >
            🌓
            </h2>

            {isWideScreen && (
                <button onClick={handleLogin}>Login</button>
            )}

      {!isWideScreen && (
        <div
          id="nav-icon3"
          className={menuOpen ? 'open' : ''}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
    </div>

    {!isWideScreen && (
      <div className={`navbar-expanded-links ${menuOpen ? 'show' : ''}`}>
        <p onClick={handleAboutArchery}>About Archery</p>
        <p onClick={handleOurRange}>Our Range</p>
        <p onClick={handleOurTeam}>Our Team</p>
        <p onClick={handleCalendar}>Calendar</p>
        <p onClick={handleCompetitions}>Competitions</p>
        <p onClick={handleContact}>Contact</p>
        <p onClick={handleJoin}>Join</p>
        <button onClick={handleLogin}>Login</button>
      </div>
    )}
  </div>
</div>

    );
};

export default HomeNavbar;
