import React, { useState } from 'react';
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, arrayUnion } from 'firebase/firestore';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';
import HomeNavbar from './HomeNavbar';

function Welcome() {
  const { userId, email } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [nameFirst, setNameFirst] = useState('');
  const [nameLast, setNameLast] = useState('');
  const [bowType, setBowType] = useState('');
  const [personalEquipment, setPersonalEquipment] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const userDoc = doc(db, "users", userId);
      const emailPaidCountsDoc = doc(db, "emailPaidCounts", email);

      const emailPaidCountsSnap = await getDoc(emailPaidCountsDoc);
      const paidPracticesFromEmail = emailPaidCountsSnap.exists()
        ? emailPaidCountsSnap.data().paid || 0
        : 0;

      const practicesSnapshot = await getDocs(collection(db, "practices"));
      let practiceList = [];
      let carpoolCount = 0;

      practicesSnapshot.forEach((practice) => {
        const practiceData = practice.data();

        if (practiceData.emails?.includes(email)) {
          practiceList.push(practice.id);
          updateDoc(practice.ref, { members: arrayUnion(userId) });
        }

        if (practiceData.carpoolEmails?.includes(email)) {
          carpoolCount += 1;
          updateDoc(practice.ref, { carpool: arrayUnion(userId) });
        }
      });

      await setDoc(userDoc, {
        nameFirst,
        nameLast,
        bowType,
        personalEquipment,
        hasLoggedIn: true,
        paidPractices: 2 + paidPracticesFromEmail + carpoolCount,
        practices: practiceList
      }, { merge: true });

      setNameFirst('');
      setNameLast('');
      setBowType('');
      setPersonalEquipment('');
      setShowForm(false);

      navigate('/info');
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  return (
    <div className="container">
      <HomeNavbar />
      {!showForm && <h1>Welcome to the Purdue University Archery Club!</h1>}
      {!showForm && <p>To get to know you better, please answer a couple short questions. Your responses can always be changed later!</p>}
      {!showForm && (
        <button onClick={() => setShowForm(true)}>Enter Your Information →</button>
      )}
      
      {showForm && (
        <form onSubmit={handleFormSubmit}>
          <h1>My Profile</h1>
          <div>
            <label>Preferred First Name</label>
            <input
              type="text"
              value={nameFirst}
              onChange={(e) => setNameFirst(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Preferred Last Name</label>
            <input
              type="text"
              value={nameLast}
              onChange={(e) => setNameLast(e.target.value)}
              required
            />
          </div>
          <div>
            <select
              value={bowType}
              onChange={(e) => setBowType(e.target.value)}
              required
            >
              <option value="" disabled>Choose your preferred bow type</option>
              <option value="Compound">Compound</option>
              <option value="Recurve">Recurve</option>
              <option value="Barebow">Barebow</option>
              <option value="undecided">I'm not sure yet!</option>
            </select>
          </div>
          <div>
            <select
              value={personalEquipment}
              onChange={(e) => setPersonalEquipment(e.target.value)}
              required
            >
              <option value="" disabled>Do you have personal equipment?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default Welcome;