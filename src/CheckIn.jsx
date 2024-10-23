import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from './firebase';
import { useUser } from './UserContext';

function CheckIn() {
  const { userId } = useUser();
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);
  const [carpoolHelp, setCarpoolHelp] = useState(false);
  const [activePracticeId, setActivePracticeId] = useState(null);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

  useEffect(() => {
    const fetchActivePractice = async () => {
      const activePracticeRef = doc(db, 'settings', 'activePractice');
      const activePracticeDoc = await getDoc(activePracticeRef);
  
      if (activePracticeDoc.exists()) {
        const data = activePracticeDoc.data();
        if (data.isActive) {
          setIsPracticeStarted(true);
          setActivePracticeId(data.practiceId);
        } else {
          setIsPracticeStarted(false);
        }
      } else {
        setIsPracticeStarted(false);
      }
    };

    fetchActivePractice();
  }, []);

  useEffect(() => {
    const checkIfAlreadyCheckedIn = async () => {
      if (activePracticeId && userId) {
        try {
          const userRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userRef);
  
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Check if the activePracticeId is already in the user's practices field
            if (userData.practices && userData.practices.includes(activePracticeId)) {
              setAlreadyCheckedIn(true);
            } else {
              setAlreadyCheckedIn(false);
            }
          }
        } catch (error) {
          console.error('Error checking if user is already checked into practice:', error);
        }
      }
    };

    checkIfAlreadyCheckedIn();
  }, [activePracticeId, userId]);

  const handleCheckIn = async () => {
    if (!activePracticeId) {
      alert('No active practice.');
      return;
    }

    if (alreadyCheckedIn) {
      alert('You have already checked into this practice.');
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      const practiceRef = doc(db, 'practices', activePracticeId);

      // Add the practice to user's "practices" field
      await updateDoc(userRef, {
        practices: arrayUnion(activePracticeId)
      });

      // Add the userId to the practice's "members" field
      await updateDoc(practiceRef, {
        members: arrayUnion(userId)
      });

      // If user helped drive for carpool, add 1 to Purchased practices
      if (carpoolHelp) {
        await updateDoc(userRef, {
          paidPractices: increment(1)
        });
        await updateDoc(practiceRef, {
            carpool: arrayUnion(userId)
          });
      }

      alert('You have successfully checked into the practice!');
      setAlreadyCheckedIn(true);

    } catch (error) {
      console.error('Error checking into practice:', error);
      alert('Failed to check into practice. Please try again.');
    }
  };

  return (
    <div>
      {isPracticeStarted ? (
        <>
          {alreadyCheckedIn ? (
            <p>You have already checked into this practice.</p>
          ) : (
            <>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={carpoolHelp}
                    onChange={(e) => setCarpoolHelp(e.target.checked)}
                  />
                  Helped drive for carpool
                </label>
              </div>
              <button onClick={handleCheckIn}>Check In</button>
            </>
          )}
        </>
      ) : (
        <p>A practice hasn't started yet.</p>
      )}
    </div>
  );
}

export default CheckIn;
