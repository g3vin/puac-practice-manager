import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const ViewUsersPastPractices = ({ userId , goBack }) => {
    const [pastPractices, setPastPractices] = useState([]);

    useEffect(() => {
        const fetchPastPractices = async () => {
            if (userId) {
                try {
                    const userDocRef = doc(db, 'users', userId);
                    const userDocSnapshot = await getDoc(userDocRef);

                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        const practiceIds = userData.practices || [];

                        const practicesPromises = practiceIds.map(async (practiceId) => {
                            const practiceDocRef = doc(db, 'practices', practiceId);
                            const practiceDocSnapshot = await getDoc(practiceDocRef);

                            if (practiceDocSnapshot.exists()) {
                                return {
                                    id: practiceDocSnapshot.id,
                                    ...practiceDocSnapshot.data(),
                                };
                            } else {
                                return null;
                            }
                        });

                        const practices = await Promise.all(practicesPromises);
                        setPastPractices(practices.filter(practice => practice !== null));
                    } else {
                        console.error("No such user document!");
                    }
                } catch (error) {
                    console.error("Error fetching past practices: ", error.message);
                }
            } else {
                console.error("userId is undefined");
            }
        };

        fetchPastPractices();
    }, [userId]);

    return (
        <div className="past-practices-container">
            <button className="back-to-user-info" onClick={goBack}>Back</button>
            {pastPractices.length > 0 ? (
                pastPractices.map((practice) => (
                    <div key={practice.id} className="past-practice-item">
                        <p>{practice.name}</p>
                        <p>{`Date: ${practice.startDateTime.toDate().toLocaleString()}`}</p>
                    </div>
                ))
            ) : (
                <p>No past practices found.</p>
            )}
        </div>
    );
};

export default ViewUsersPastPractices;