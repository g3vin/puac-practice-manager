import React, { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from './firebase';
import { useUser } from './UserContext';
import './Home.css';
import HomeNavbar from './HomeNavbar';
import PracticeManager from './PracticeManager';
import CheckIn from './CheckIn';
import ManageMembers from './ManageMembers';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { userId } = useUser();
  const navigate = useNavigate(); // Initialize the navigate function
  const [nameFirst, setNameFirst] = useState('');
  const [role, setRole] = useState('');
  const [activeTile, setActiveTile] = useState(null);
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);
  const [currentPracticeData, setCurrentPracticeData] = useState(null);
  const [membersInAttendance, setMembersInAttendance] = useState([]);

  // Fetch user data
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

  // Fetch active practice data and listen for updates
  useEffect(() => {
    const fetchActivePractice = () => {
      const activePracticeRef = doc(db, 'settings', 'activePractice');
      
      // Listen for real-time updates
      const unsubscribe = onSnapshot(activePracticeRef, async (activePracticeDoc) => {
        if (activePracticeDoc.exists()) {
          const data = activePracticeDoc.data();
          console.log("Active practice data: ", data); // Log active practice data

          if (data.isActive) {
            setIsPracticeStarted(true);
            const practiceDocRef = doc(db, 'practices', data.practiceId);
            const practiceDoc = await getDoc(practiceDocRef);

            if (practiceDoc.exists()) {
              const practiceData = practiceDoc.data();
              console.log("Current practice data: ", practiceData); // Log practice data
              setCurrentPracticeData({ id: practiceDoc.id, ...practiceData });

              // Listen for changes in the members field of the practice document
              const unsubscribeMembers = onSnapshot(practiceDocRef, (updatedPracticeDoc) => {
                const updatedData = updatedPracticeDoc.data();
                if (updatedData && updatedData.members) {
                  // Fetch the names of members in attendance
                  const memberPromises = updatedData.members.map(async (memberId) => {
                    const memberDocRef = doc(db, 'users', memberId);
                    const memberDoc = await getDoc(memberDocRef);
                    if (memberDoc.exists()) {
                      // Return member data along with their ID
                      return { id: memberDoc.id, ...memberDoc.data() };
                    } else {
                      return null;
                    }
                  });

                  Promise.all(memberPromises).then((memberData) => {
                    setMembersInAttendance(memberData.filter((member) => member !== null));
                  });
                }
              });

              // Cleanup listener for members when practice changes
              return () => unsubscribeMembers();
            }
          } else {
            setIsPracticeStarted(false);
            setCurrentPracticeData(null);
            setMembersInAttendance([]);
          }
        } else {
          setIsPracticeStarted(false);
          setCurrentPracticeData(null);
          setMembersInAttendance([]);
        }
      });
      
      return () => unsubscribe();
    };

    fetchActivePractice();
  }, []);

  const handleRemoveMember = async (memberId) => {
    // Ask for confirmation before proceeding
    const isConfirmed = window.confirm("Are you sure you want to remove this member from practice?");
    
    if (!isConfirmed) {
      return; // Exit if the user cancels
    }

    try {
      const practiceRef = doc(db, 'practices', currentPracticeData.id);
      await updateDoc(practiceRef, {
        members: arrayRemove(memberId)
      });

      console.log(`Member with ID ${memberId} removed from practice.`);

      const userRef = doc(db, 'users', memberId);
      await updateDoc(userRef, {
        practices: arrayRemove(currentPracticeData.id)
      });

      console.log(`Practice ID ${currentPracticeData.id} removed from user ${memberId}.`);
    } catch (error) {
      console.error("Error removing member from practice: ", error);
    }
  };

  const handleTileClick = (tileIndex) => {
    if (tileIndex === 2) {
      navigate('/manage-members'); // Navigate to Manage Members on tile click
    } else {
      setActiveTile(tileIndex);
    }
  };

  const handleCloseModal = () => {
    setActiveTile(null);
  };

  // Define tiles based on role
  const tiles = [
    ...(role === 'Officer' ? [
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
        content: <p>Click to manage members.</p>, // Placeholder content
      },
    ] : []),
    {
      title: 'Check Into Practice',
      content: <CheckIn />,
    },
    {
      title: 'Purchase Practices',
      content: <>
        <p>Your first two practices are always free! All practices after are $3 each and can be purchased on our TooCool page.</p>
        <a href="https://www.toocoolpurdue.com/TooCOOLPurdueWL/vECItemCatalogOrganizationItems/OrganizationItemsGallery.aspx?Organization=p0RCbTmGOlE%3D" target="_blank" rel="noopener noreferrer">
          <button>Purchase Practices →</button>
        </a>
      </>,
    },
    {
      title: 'Your Past Practices',
      content: <p>See all your past practice sessions.</p>,
    }
  ];

  return (
    <>
      <HomeNavbar />
      <div className="welcome-container">
        <h1>Hi, {nameFirst}</h1>
      </div>

      {isPracticeStarted && currentPracticeData && (
        <div className="attendance-container">
          <h2>{currentPracticeData.name}</h2>
          <h2>{membersInAttendance.length} Members in Attendance</h2>
          
          <table>
            <thead>
              <tr>
                <th>Name</th>
                {role === 'Officer' && <th>Email</th>}
                {role === 'Officer' && <th>Remaining Paid Practices</th>}
                {role === 'Officer' && <th></th>}
              </tr>
            </thead>
            <tbody>
              {membersInAttendance.map((member, index) => {
                const remainingPaidPractices = member.paidPractices - member.practices.length;

                return (
                  <tr key={member.id}>
                    <td className="center-text">{member.nameFirst} {member.nameLast}</td>
                    {role === 'Officer' && <td className="center-text">{member.email}</td>}
                    {role === 'Officer' && (
                      <td className="center-text" style={{ color: remainingPaidPractices < 0 ? 'red' : 'green' }}>
                        {remainingPaidPractices}
                      </td>
                    )}
                    {role === 'Officer' && (
                      <td className="center-text">
                        <button onClick={() => handleRemoveMember(member.id)}>Remove</button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className={`container ${activeTile !== null ? 'blurred' : ''}`}>
        <div className="tiles">
          {tiles.map((tile, index) => (
            <div
              key={index}
              className="tile"
              onClick={() => handleTileClick(index)}
            >
              {tile.title}
            </div>
          ))}
        </div>
      </div>

      {activeTile !== null && (
        <div className="overlay">
          <div className="modal">
            <button className="close-button" onClick={handleCloseModal}>X</button>
            <h2>{tiles[activeTile].title}</h2>
            {tiles[activeTile].content}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;