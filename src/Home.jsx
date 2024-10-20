import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useUser } from './UserContext';
import './Home.css';
import HomeNavbar from './HomeNavbar';
import PracticeManager from './PracticeManager';

function Home() {
  const { userId } = useUser();
  const [nameFirst, setNameFirst] = useState('');
  const [role, setRole] = useState('');
  const [activeTile, setActiveTile] = useState(null);
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setNameFirst(userData.nameFirst);
          setRole(userData.role);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Fetch active practice status from Firestore
  useEffect(() => {
    const fetchActivePractice = async () => {
      const activePracticeRef = doc(db, 'settings', 'activePractice');
      const activePracticeDoc = await getDoc(activePracticeRef);

      if (activePracticeDoc.exists() && activePracticeDoc.data().isActive) {
        setIsPracticeStarted(true); // Set state to true if a practice is active
      } else {
        setIsPracticeStarted(false); // Set to false if no practice is active
      }
    };

    fetchActivePractice();
  }, []);

  const handleTileClick = (tileIndex) => {
    setActiveTile(tileIndex);
  };

  const handleCloseModal = () => {
    setActiveTile(null);
  };

  const memberTiles = ['Check Into Practice', 'Purchase Practices', 'View Your Past Practices'];
  const officerTiles = ['Start a Practice', 'Club Practice History', 'Manage Members'];

  const tiles = role === 'Officer' ? [...officerTiles, ...memberTiles] : memberTiles;

  const tileContent = [
    {
      title: isPracticeStarted ? 'End Practice' : 'Start a Practice',
      content: <PracticeManager />,
    },
    {
      title: 'Club Practice History',
      content: <p>Review past practices held by the club.</p>,
    },
    {
      title: 'Manage Members',
      content: <p>Manage member details and roles here.</p>,
    },
    {
      title: 'Check Into Practice',
      content: <p>Here, you can check into a practice</p>,
    },
    {
      title: 'Purchase Practices',
      content: <>
        <p>Your first two practices are always free! All practices after are $3 each and can be purchased on our TooCool page.</p>
        <a href="https://www.toocoolpurdue.com/TooCOOLPurdueWL/vECItemCatalogOrganizationItems/OrganizationItemsGallery.aspx?Organization=p0RCbTmGOlE%3D" target="_blank" rel="noopener noreferrer">
          <button>Purchase Practices →</button>
        </a></>,
    },
    {
      title: 'Your Past Practices',
      content: <p>See all your past practice sessions.</p>,
    }
  ];

  return (
    <>
      <HomeNavbar />
      <h1>Hi, {nameFirst}</h1>
      <div className={`container ${activeTile !== null ? 'blurred' : ''}`}>
        <div className="tiles">
          {tiles.map((tile, index) => (
            <div
              key={index}
              className="tile"
              onClick={() => handleTileClick(index)}
            >
              {tile}
            </div>
          ))}
        </div>
      </div>

      {activeTile !== null && (
        <div className="overlay">
          <div className="modal">
            <button className="close-button" onClick={handleCloseModal}>X</button>
            <h2>{tileContent[activeTile].title}</h2>
            {tileContent[activeTile].content}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;