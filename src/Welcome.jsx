import React, { useState } from 'react';
import { db } from './firebase'; // Import Firestore
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore methods
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Welcome.css';
import HomeNavbar from './HomeNavbar';

function Welcome() {
  const { userId } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [nameFirst, setNameFirst] = useState('');
  const [nameLast, setNameLast] = useState('');
  const [bowType, setBowType] = useState(''); // Initialize bowType as an empty string
  const [personalEquipment, setPersonalEquipment] = useState(''); // Initialize personalEquipment as an empty string
  const navigate = useNavigate(); // Initialize useNavigate

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Create a user document in Firestore with the user's information and update hasLoggedIn to true
      const userDoc = doc(db, "users", userId);
      await setDoc(userDoc, {
        nameFirst,
        nameLast,
        bowType,
        personalEquipment,
        hasLoggedIn: true,
        paidPractices: 2,
        practices,
      }, { merge: true });
  
      // Clear the form fields after submission
      setNameFirst('');
      setNameLast('');
      setBowType('');
      setPersonalEquipment('');
      setShowForm(false);

      // Navigate to the Info page
      navigate('/info');
    } catch (error) {
      console.error("Error writing document: ", error); // Log the error
    }
  };

  return (
    <div className="container"> {/* Add the container class here */}
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
            <label>Prefered First Name</label>
            <input
              type="text"
              value={nameFirst}
              onChange={(e) => setNameFirst(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Prefered Last Name</label>
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
              <option value="" disabled>Choose your prefered bow type</option>
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