import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import './HomeNavbar.css';
import { useNavigate } from 'react-router-dom';
import logoutIcon from './assets/logoutIcon.png';
import homeIcon from './assets/homeicon.png';

const HomeNavbar = () => {
    const { userId, hasLoggedIn, loading } = useUser();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Watch for changes in `hasLoggedIn` to immediately reflect login status
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
        navigate('/home');
    };

    const handleInfo = () => {
        if (userId && hasLoggedIn) {
            navigate('/info');
        } else {
            console.log("Please log in to access this page.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='home-navbar-container'>
            <div className="home_navbar">
                {userId && hasLoggedIn && (
                    <button className="logout-button" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <img src={logoutIcon} alt="Logout" />
                    </button>
                )}
                {userId && hasLoggedIn && (
                    <button className="home-button" onClick={handleHome} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <img src={homeIcon} alt="Home" />
                    </button>
                )}
                <div className="nav_content">
                    <div className="divider-left"></div>
                        <h1 onClick={handleInfo} style={{ cursor: 'pointer' }}>
                            {windowWidth < 700 ? 'PUAC' : 'Purdue Archery'}
                        </h1>
                    <div className="divider-right"></div>
                </div>
            </div>
        </div>
    );
};

export default HomeNavbar;