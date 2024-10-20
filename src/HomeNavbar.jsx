import React, { useState, useEffect } from 'react';
import './HomeNavbar.css';

const HomeNavbar = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="home_navbar">
            <div className="nav_content">
                <div className="divider-left"></div>
                <h2>{windowWidth < 700 ? 'PUAC' : 'Purdue University Archery Club'}</h2>
                <div className="divider-right"></div>
            </div>
        </div>
    );
};

export default HomeNavbar;