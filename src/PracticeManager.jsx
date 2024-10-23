import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, getDoc, setDoc, arrayUnion, increment } from 'firebase/firestore'; 
import { useUser } from './UserContext';

function PracticeManager() {
  const { userId } = useUser();
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);
  const [practiceName, setPracticeName] = useState('');
  const [practiceDescription, setPracticeDescription] = useState('');
  const [attendanceLimit, setAttendanceLimit] = useState('none');
  const [currentPracticeData, setCurrentPracticeData] = useState(null);
  const [uptime, setUptime] = useState('');
  const [carpool, setCarpool] = useState('');
  const [makeFree, setMakeFree] = useState(false); // State for checkbox

  useEffect(() => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
    const defaultName = today.toLocaleDateString(undefined, options) + " Practice";
    setPracticeName(defaultName);
  }, []);

  useEffect(() => {
    const fetchActivePractice = async () => {
      const activePracticeRef = doc(db, 'settings', 'activePractice');
      const activePracticeDoc = await getDoc(activePracticeRef);
  
      if (activePracticeDoc.exists() && activePracticeDoc.data().isActive) {
        const { practiceId } = activePracticeDoc.data();
        const practiceDocRef = doc(db, 'practices', practiceId);
        const practiceDoc = await getDoc(practiceDocRef);


        if (practiceDoc.exists()) {
          setIsPracticeStarted(true);
          const practiceData = practiceDoc.data();
          setCurrentPracticeData(practiceData);

          const startDate = practiceData.startDateTime.toDate();
          startUptimeClock(startDate);
        }
      }
    };

    fetchActivePractice();
  }, []);

  const startUptimeClock = (startDate) => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeDiff = now - startDate; 
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setUptime(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(intervalId);
  };

  const startPractice = async () => {
    setIsPracticeStarted(true);
  
    try {
      const activePracticeRef = doc(db, 'settings', 'activePractice');
      const activePracticeDoc = await getDoc(activePracticeRef);
  
      if (!activePracticeDoc.exists()) {
        await setDoc(activePracticeRef, {
          isActive: false,
          practiceId: null,
        });
      }
  
      if (activePracticeDoc.exists() && activePracticeDoc.data().isActive) {
        alert("A practice is already active.");
        setIsPracticeStarted(false);
        return;
      }
  
      const practiceData = {
        name: practiceName,
        description: practiceDescription,
        startDateTime: new Date(),
        attendanceLimit: attendanceLimit === 'none' ? null : attendanceLimit,
        members: [userId],
        carpool
      };
  
      // Create a new practice document
      const practicesRef = collection(db, 'practices');
      const practiceDocRef = await addDoc(practicesRef, practiceData);
  
      // Update the activePractice document in settings
      await updateDoc(activePracticeRef, {
        isActive: true,
        practiceId: practiceDocRef.id,
      });
  
      // Update the user's document to include the new practice ID
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        practices: arrayUnion(practiceDocRef.id) // Add the new practice ID to the user's list of practices
      });
  
      setCurrentPracticeData(practiceData);
      startUptimeClock(practiceData.startDateTime);
  
    } catch (error) {
      console.error('Error starting practice:', error);
      alert('Failed to start practice. Please try again.');
      setIsPracticeStarted(false);
    }
  };  

  const endPractice = async () => {
    try {
      const activePracticeRef = doc(db, 'settings', 'activePractice');
      const activePracticeDoc = await getDoc(activePracticeRef);
  
      if (!activePracticeDoc.exists() || !activePracticeDoc.data().isActive) {
        alert("No active practice to end.");
        return;
      }
  
      const { practiceId } = activePracticeDoc.data();
      const practiceDocRef = doc(db, 'practices', practiceId);
      const practiceData = await getDoc(practiceDocRef);
      const attendees = practiceData.data().members || []; // Get the members of the practice

      // Update the practice document with the end time
      await updateDoc(practiceDocRef, {
        endDateTime: new Date(),
      });

      // Update the activePractice document in settings
      await updateDoc(activePracticeRef, {
        isActive: false,
        practiceId: null,
      });

      // Award paidPractice if "Make this practice free" is checked
      if (makeFree) {
        await Promise.all(attendees.map(async (attendeeId) => {
          if (!practiceData.data().carpool.includes(attendeeId)) { // Exclude carpool members
            const userRef = doc(db, 'users', attendeeId);
            await updateDoc(userRef, {
              paidPractices: increment(1) // Increment paidPractices
            });
          }
        }));
      }

      setIsPracticeStarted(false);
      setCurrentPracticeData(null);
      setUptime('');
      setMakeFree(false); // Reset checkbox

      console.log('Practice ended successfully');
    } catch (error) {
      console.error('Error ending practice:', error);
      alert('Failed to end practice. Please try again.');
    }
  };

  return (
    <div>
      {!isPracticeStarted ? (
        <>
          <input
            type="text"
            value={practiceName}
            onChange={(e) => setPracticeName(e.target.value)}
            placeholder="Practice Name"
          />
          <textarea
            value={practiceDescription}
            onChange={(e) => setPracticeDescription(e.target.value)}
            placeholder="Practice Description"
          />
          <input
            type="text"
            value={attendanceLimit}
            onChange={(e) => setAttendanceLimit(e.target.value)}
            placeholder="Attendance Limit (or 'none')"
          />
          <button onClick={startPractice}>Start Practice</button>
        </>
      ) : (
        <>
          {currentPracticeData && (
            <div>
              <h3>{currentPracticeData.name}</h3>
              <p>{currentPracticeData.description}</p>
              <p>
                Start Time: {currentPracticeData.startDateTime
                    ? currentPracticeData.startDateTime.toDate().toLocaleString() 
                    : 'Start time not available yet'}
              </p>
              <p>Attendance Limit: {currentPracticeData.attendanceLimit || 'Unlimited'}</p>
              <p>Practice Uptime: {uptime}</p>
              <label>
                <input
                  type="checkbox"
                  checked={makeFree}
                  onChange={() => setMakeFree(!makeFree)}
                />
                Make this practice free
              </label>
            </div>
          )}
          <button onClick={endPractice}>End Practice</button>
        </>
      )}
    </div>
  );
}

export default PracticeManager;