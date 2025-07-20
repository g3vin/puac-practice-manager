import { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import './HomeNavbar.css';
import { useNavigate } from 'react-router-dom';

import logoutIcon from './assets/logoutIcon.png';
import homeIcon from './assets/homeicon.png';

const HomeNavbar = () => {
    const { userId, hasLoggedIn } = useUser();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const isWideScreen = windowWidth > 1050;
    const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
    const [visible, setVisible] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

  useEffect(() => {
    const content = document.getElementById('main-content');
    if (content) content.classList.toggle('blur', menuOpen);

    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      if (content) content.classList.remove('blur');
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

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




    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            document.documentElement.setAttribute('data-theme', storedTheme);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
            setVisible(isVisible);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos]);


    return (
        <div className={`home-navbar-container ${!visible ? 'navbar-hidden' : ''}`}>
            <div className="home_navbar">
                <div className="navbar-top-row">
                    {!isWideScreen && (<p onClick={handleLogin} style={{margin:0, paddingRight:20, paddingLeft:10}}>Login</p>)}
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
                        <p onClick={handleLogin} style={{marginTop:0, marginBottom:0, cursor: 'pointer'}}>Login</p>
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
                    </div>
                )}
            </div>
        </div>

    );
};

export default HomeNavbar;