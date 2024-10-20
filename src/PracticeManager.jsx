import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore'; 
import { useUser } from './UserContext';

function PracticeManager() {
  const { userId } = useUser();
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);
  const [practiceName, setPracticeName] = useState('');
  const [practiceDescription, setPracticeDescription] = useState('');
  const [attendanceLimit, setAttendanceLimit] = useState('none');
  const [practices, setPractices] = useState([]);

  useEffect(() => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'};
    const defaultName = today.toLocaleDateString(undefined, options) + " Practice";
    setPracticeName(defaultName);
  }, []);

  const startPractice = async () => {
    const activePracticeRef = doc(db, 'settings', 'activePractice');
    const activePracticeDoc = await getDoc(activePracticeRef);
  
    if (activePracticeDoc.exists() && activePracticeDoc.data().isActive) {
      alert("A practice is already active. End the current practice first.");
      return;
    }
  
    const practiceData = {
      name: practiceName,
      description: practiceDescription,
      startDateTime: new Date(),
      attendanceLimit: attendanceLimit === 'none' ? null : attendanceLimit
    };
  
    const practicesRef = collection(db, 'practices');
    const practiceDocRef = await addDoc(practicesRef, practiceData);
  
    await updateDoc(activePracticeRef, {
      practiceId: practiceDocRef.id,
      startDateTime: practiceData.startDateTime,
      isActive: true
    });
  
    setIsPracticeStarted(true);
  };
  
  const endPractice = async () => {
    const activePracticeRef = doc(db, 'settings', 'activePractice');
    const activePracticeDoc = await getDoc(activePracticeRef);
  
    if (!activePracticeDoc.exists() || !activePracticeDoc.data().isActive) {
      alert("No active practice to end.");
      return;
    }
  
    const { practiceId } = activePracticeDoc.data();
  
    const practiceDocRef = doc(db, 'practices', practiceId);
    await updateDoc(practiceDocRef, {
      endDateTime: new Date(),
    });
  
    await updateDoc(activePracticeRef, {
      isActive: false,
      practiceId: null,
    });
  
    setIsPracticeStarted(false);
  };  

  const handleCheckIn = async (droveForCarpool) => {
    const userDocRef = doc(db, 'users', userId);
    const checkInData = {
      practiceId: practiceId,
      droveForCarpool: droveForCarpool,
    };
  
    await updateDoc(userDocRef, {
      practices: [...practices, checkInData],
    });
  
    if (droveForCarpool) {
      await updateDoc(userDocRef, {
        paidPractices: [...paidPractices, checkInData],
      });
    } else {
      if (isPracticeFree) {
        await updateDoc(userDocRef, {
          paidPractices: [...paidPractices, checkInData],
        });
      }
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
          <button onClick={endPractice}>End Practice</button>
          <div>
            <label>
              <input type="checkbox" onChange={handleCheckIn} />
              Make this practice free
            </label>
          </div>
        </>
      )}
    </div>
  );
}

export default PracticeManager;