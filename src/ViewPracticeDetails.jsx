import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import 'src/ViewPracticeDetails.css'

const ViewPracticeDetails = ({ practice, goBack }) => {
  const [attendees, setAttendees] = useState([]);
  const [carpoolers, setCarpoolers] = useState([]);
  const [viewingAttendees, setViewingAttendees] = useState(false);
  const [viewingCarpoolers, setViewingCarpoolers] = useState(false);

  useEffect(() => {
    const fetchAttendees = async () => {
      const practiceDocRef = doc(db, 'practices', practice.id);
      const practiceDocSnapshot = await getDoc(practiceDocRef);

      if (practiceDocSnapshot.exists()) {
        const data = practiceDocSnapshot.data();
        const memberIds = data.members || [];
        const carpoolMemberIds = data.carpool || [];

        const attendeesData = await Promise.all(
          memberIds.map(async (memberId) => {
            const userDocRef = doc(db, 'users', memberId);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
              const { nameFirst, nameLast, email } = userDocSnapshot.data();
              return { nameFirst, nameLast, email };
            } else {
              return null;
            }
          })
        );

        const carpoolersData = await Promise.all(
          carpoolMemberIds.map(async (memberId) => {
            const userDocRef = doc(db, 'users', memberId);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
              const { nameFirst, nameLast, email } = userDocSnapshot.data();
              return { nameFirst, nameLast, email };
            } else {
              return null;
            }
          })
        );

        setAttendees(attendeesData.filter((attendee) => attendee !== null));
        setCarpoolers(carpoolersData.filter((carpooler) => carpooler !== null));
      }
    };

    fetchAttendees();
  }, [practice.id]);

  const handleDeletePractice = async () => {
    if (window.confirm("Are you sure you want to delete this practice?")) {
      const practiceDocRef = doc(db, 'practices', practice.id);
      await deleteDoc(practiceDocRef);
      goBack();
    }
  };

  const getFormattedDate = (date) => (date ? date.toDate().toLocaleString() : 'N/A');
  const getPracticeLength = () => {
    if (practice.startDateTime && practice.endDateTime) {
      const length = (practice.endDateTime.toDate() - practice.startDateTime.toDate()) / (1000 * 60);
      return `${length} mins`;
    }
    return 'N/A';
  };

  return (
    <div className="practice-details-container">
      {!viewingAttendees && !viewingCarpoolers ? (
        <>
            <h2>{practice.name}</h2>
            <p><strong>Description:</strong> {practice.description}</p>
            <p><strong>Attendance Limit:</strong> {practice.attendanceLimit || 'N/A'}</p>
            <p><strong>Date:</strong> {getFormattedDate(practice.startDateTime)}</p>
            <p><strong>Length:</strong> {getPracticeLength()}</p>

            <div className="practice-details-container-buttons">
                <button onClick={() => setViewingAttendees(true)}>View Attendees</button>
                <button onClick={() => setViewingCarpoolers(true)}>View Carpool List</button>
                <button onClick={handleDeletePractice} className="delete-button">Delete Practice</button>
            </div>
        </>
      ) : viewingAttendees ? (
        <div className="attendees-modal">
          <button className="back-button" onClick={() => setViewingAttendees(false)}>Back to Practice</button>
          <h3>Attendees</h3>
          {attendees.length > 0 ? (
            attendees.map((attendee, index) => (
              <div key={index} className="attendee-item">
                <p><strong>Name:</strong> {attendee.nameFirst} {attendee.nameLast}</p>
                <p><strong>Email:</strong> {attendee.email}</p>
              </div>
            ))
          ) : (
            <p>No attendees found.</p>
          )}
        </div>
      ) : (
        <div className="carpoolers-modal">
          <button className="back-button" onClick={() => setViewingCarpoolers(false)}>Back to Practice</button>
          <h3>Carpool List</h3>
          {carpoolers.length > 0 ? (
            carpoolers.map((carpooler, index) => (
              <div key={index} className="carpooler-item">
                <p><strong>Name:</strong> {carpooler.nameFirst} {carpooler.nameLast}</p>
                <p><strong>Email:</strong> {carpooler.email}</p>
              </div>
            ))
          ) : (
            <p>No carpoolers found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewPracticeDetails;
