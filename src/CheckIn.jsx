import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import { useUser } from './UserContext';

function CheckIn( {onClose} ) {
  const { userId } = useUser();
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);
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

      await updateDoc(userRef, {
        practices: arrayUnion(activePracticeId)
      });

      await updateDoc(practiceRef, {
        members: arrayUnion(userId)
      });
      
      setAlreadyCheckedIn(true);

      if (onClose) {
        onClose();
      }

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