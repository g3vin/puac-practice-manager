import React, { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from './firebase';
import { useUser } from './UserContext';
import './Home.css';
import HomeNavbar from './HomeNavbar';
import PracticeManager from './PracticeManager';
import CheckIn from './CheckIn';
import { useNavigate } from 'react-router-dom';
import ViewPastPractices from './ViewPastPractices';

function Home() {
  const { userId } = useUser();
  const navigate = useNavigate();
  const [nameFirst, setNameFirst] = useState('');
  const [role, setRole] = useState('');
  const [activeTile, setActiveTile] = useState(null);
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);
  const [currentPracticeData, setCurrentPracticeData] = useState(null);
  const [membersInAttendance, setMembersInAttendance] = useState([]);

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

  useEffect(() => {
    const fetchActivePractice = () => {
      const activePracticeRef = doc(db, 'settings', 'activePractice');
      
      const unsubscribe = onSnapshot(activePracticeRef, async (activePracticeDoc) => {
        if (activePracticeDoc.exists()) {
          const data = activePracticeDoc.data();
          console.log("Active practice data: ", data);

          if (data.isActive) {
            setIsPracticeStarted(true);
            const practiceDocRef = doc(db, 'practices', data.practiceId);
            const practiceDoc = await getDoc(practiceDocRef);

            if (practiceDoc.exists()) {
              const practiceData = practiceDoc.data();
              console.log("Current practice data: ", practiceData);
              setCurrentPracticeData({ id: practiceDoc.id, ...practiceData });

              const unsubscribeMembers = onSnapshot(practiceDocRef, (updatedPracticeDoc) => {
                const updatedData = updatedPracticeDoc.data();
                if (updatedData && updatedData.members) {
                  const memberPromises = updatedData.members.map(async (memberId) => {
                    const memberDocRef = doc(db, 'users', memberId);
                    const memberDoc = await getDoc(memberDocRef);

                    if (memberDoc.exists()) {
                      return { id: memberDoc.id, ...memberDoc.data() };
                    }
                    else {
                      return null;
                    }
                  });

                  Promise.all(memberPromises).then((memberData) => {
                    setMembersInAttendance(memberData.filter((member) => member !== null));
                  });
                }
              });

              setActiveTile(null);
              return () => unsubscribeMembers();
            }
          } else {
            setIsPracticeStarted(false);
            setActiveTile(null);
            setCurrentPracticeData(null);
            setMembersInAttendance([]);
          }
        } else {
          setIsPracticeStarted(false);
          setActiveTile(null);
          setCurrentPracticeData(null);
          setMembersInAttendance([]);
        }
      });
      
      return () => unsubscribe();
    };

    fetchActivePractice();
  }, []);

  const handleRemoveMember = async (memberId) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this member from practice?");
    
    if (!isConfirmed) {
      return;
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
      if (role === 'Officer') {
        navigate('/manage-members');
      } else {
        setActiveTile(tileIndex);
      }
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
        content: <p>Click to manage members.</p>,
      },
    ] : []),
    {
      title: 'Check Into Practice',
      content: <CheckIn />,
    },
    {
      title: 'Purchase Practices',
      content: <>
        <p class="purchase-msg">Your first two practices are always free! All practices after are $3 each and can be purchased on our TooCool page.</p>
        <a href="https://www.toocoolpurdue.com/TooCOOLPurdueWL/vECItemCatalogOrganizationItems/OrganizationItemsGallery.aspx?Organization=p0RCbTmGOlE%3D" target="_blank" rel="noopener noreferrer">
          <button>Purchase Practices →</button>
        </a>
      </>,
    },
    {
      title: 'Your Past Practices',
      content: <ViewPastPractices />,
    }
  ];

  return (
    <>
      <HomeNavbar />
      <div className="flex-container">
        <div className="welcome-container">
          <h1>Hi, {nameFirst}</h1>
        </div>

        {isPracticeStarted && currentPracticeData && (
          <div className="attendance-container">
            <h2>{currentPracticeData.name}</h2>
            <h4>{membersInAttendance.length} Members in Attendance</h4>
            
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Name</th>
                  {role === 'Officer' && <th>Email</th>}
                  {role === 'Officer' && <th>Remaining Paid Practices</th>}
                  {role === 'Officer' && <th></th>}
                </tr>
              </thead>
              <tbody>
                {membersInAttendance.map((member) => {
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

            <div className="responsive-attendance">
              {membersInAttendance.map((member) => {
                const remainingPaidPractices = member.paidPractices - member.practices.length;
                return (
                  <div className="responsive-member" key={member.id}>
                    <div className="responsive-member-info">
                      <div>
                          <span className="responsive-name">
                              {member.nameFirst} {member.nameLast}
                          </span>
                          {role === 'Officer' && (
                              <span className="responsive-email">
                                  {member.email}
                              </span>
                          )}
                      </div>
                    </div>
                    {role === 'Officer' && (
                      <div className="responsive-practice-info">
                        <span className="responsive-paid-practices" style={{ color: remainingPaidPractices < 0 ? 'red' : 'green' }}>
                          {remainingPaidPractices}
                        </span>
                        <button className="responsive-remove-button" onClick={() => handleRemoveMember(member.id)}>Remove</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
          <div className="overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>

              <h2>{tiles[activeTile].title}</h2>
              {tiles[activeTile].content}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;