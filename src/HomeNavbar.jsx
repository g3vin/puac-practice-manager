import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import './HomeNavbar.css';
import { useNavigate } from 'react-router-dom';
import logoutIcon from './assets/logoutIcon.png'; // Make sure to update this path

const HomeNavbar = () => {
    const { userId, setUserId, loading } = useUser();
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

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUserId(null);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="home_navbar">
            {userId && (
                <button className="logout-button" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <img src={logoutIcon} alt="Logout" />
                </button>
            )}
            <div className="nav_content">
                <div className="divider-left"></div>
                <h2 onClick={() => navigate('/home')}>
                    {windowWidth < 700 ? 'PUAC' : 'Purdue University Archery Club'}
                </h2>
                <div className="divider-right"></div>
            </div>
        </div>
    );
};

export default HomeNavbar;