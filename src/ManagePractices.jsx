import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, deleteDoc, writeBatch} from 'firebase/firestore';
import HomeNavbar from './HomeNavbar';
import ViewPracticeDetails from './ViewPracticeDetails';
import "src/ManageMembers.css";

function ManagePractices() {
  const [practices, setPractices] = useState([]);
  const [activePracticeId, setActivePracticeId] = useState(null);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [viewingCarpool, setViewingCarpool] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchActivePractice = async () => {
      const activePracticeDocRef = doc(db, 'settings', 'activePractice');
      const activePracticeDocSnapshot = await getDoc(activePracticeDocRef);

      if (activePracticeDocSnapshot.exists()) {
        const data = activePracticeDocSnapshot.data();
        if (data.isActive) {
          setActivePracticeId(data.practiceId);
        }
      }
    };

    const fetchPractices = async () => {
      const practicesCollection = collection(db, 'practices');
      const practicesSnapshot = await getDocs(practicesCollection);
      const practicesData = practicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      practicesData.sort((a, b) => b.startDateTime.toDate() - a.startDateTime.toDate());

      const filteredPractices = activePracticeId 
        ? practicesData.filter(practice => practice.id !== activePracticeId) 
        : practicesData;

      setPractices(filteredPractices);
    };

    fetchActivePractice().then(fetchPractices);
  }, [activePracticeId]);

  const filteredPractices = practices.filter((practice) => {
    const practiceName = practice.name.toLowerCase();
    const formattedDate = practice.startDateTime.toDate().toLocaleDateString();
    return (
      practiceName.includes(searchTerm.toLowerCase()) ||
      formattedDate.includes(searchTerm)
    );
  });

  const deletePractice = async (practiceId) => {
      const confirmDelete = window.confirm("Are you sure you want to remove this practice?");
      if (confirmDelete) {
          const practiceRef = doc(db, 'practices', practiceId);
  
          const usersCollection = collection(db, 'users');
          const usersSnapshot = await getDocs(usersCollection);
          
          const batch = writeBatch(db);
  
          usersSnapshot.docs.forEach((userDoc) => {
              const userData = userDoc.data();
              const userPractices = userData.practices || [];
  
              if (userPractices.includes(practiceId)) {
                  const updatedPractices = userPractices.filter(id => id !== practiceId);
                  batch.update(userDoc.ref, { practices: updatedPractices });
              }
          });
  
          await batch.commit();
  
          await deleteDoc(practiceRef);
          setPractices(practices.filter(practice => practice.id !== practiceId));
      }
  };
  

  const viewDetails = (practice) => {
    setSelectedPractice(practice);
    setViewingDetails(true);
  };

  const viewCarpool = (practice) => {
    setSelectedPractice(practice);
    setViewingCarpool(true);
  };

  return (
    <div>
      <HomeNavbar />
      <div className={`container2 ${viewingDetails || viewingCarpool ? 'blurred' : ''}`}>
        <h1>Manage Club Practices</h1>
        <input
          type="text"
          placeholder="Search practices by name or date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th className="responsive-hide">Attendance Limit</th>
                <th className="responsive-hide">Length</th>
                <th className="responsive-hide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPractices.map((practice) => (
                <tr key={practice.id}>
                  <td onClick={() => viewDetails(practice)}>{practice.name}</td>
                  <td onClick={() => viewDetails(practice)}>
                    {practice.startDateTime ? practice.startDateTime.toDate().toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="responsive-hide">{practice.attendanceLimit || 'N/A'}</td>
                  <td className="responsive-hide">
                    {practice.startDateTime && practice.endDateTime ? (
                      (() => {
                        const durationInMinutes = (practice.endDateTime.toDate() - practice.startDateTime.toDate()) / (1000 * 60);
                        const roundedMinutes = Math.round(durationInMinutes);
                        const hours = Math.floor(roundedMinutes / 60);
                        const minutes = roundedMinutes % 60;

                        return `${hours} hrs ${minutes} mins`;
                      })()
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="responsive-hide">
                    <button onClick={() => deletePractice(practice.id)}>Remove</button>
                    <button onClick={() => viewDetails(practice)}>View Details</button>
                    <button onClick={() => viewCarpool(practice)}>View Carpool</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewingDetails && selectedPractice && (
        <div className="overlay" onClick={() => setViewingDetails(false)}>
          <div className="modal2" onClick={(e) => e.stopPropagation()}>
            <ViewPracticeDetails practice={selectedPractice} goBack={() => setViewingDetails(false)} />
          </div>
        </div>
      )}

      {viewingCarpool && selectedPractice && (
        <div className="overlay" onClick={() => setViewingCarpool(false)}>
          <div className="modal2" onClick={(e) => e.stopPropagation()}>
            <ViewPracticeDetails practice={selectedPractice} goBack={() => setViewingCarpool(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagePractices;
