import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useUser } from './UserContext';
import 'src/ViewPastPractices.css'

const ViewPastPractices = () => {
    const { userId } = useUser();
    const [pastPractices, setPastPractices] = useState([]);
    const [paidPracticesCount, setPaidPracticesCount] = useState(0);

    useEffect(() => {
        const fetchPastPractices = async () => {
            if (userId) {
                try {
                    const userDocRef = doc(db, 'users', userId);
                    const userDocSnapshot = await getDoc(userDocRef);

                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        const practiceIds = userData.practices || [];
                        const paidPracticesCount = userData.paidPractices || 0;
                        const attendedPracticesCount = practiceIds.length;

                        const netPracticesCount = paidPracticesCount - attendedPracticesCount;
                        setPaidPracticesCount(netPracticesCount);

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

    const renderPurchasedPracticesMessage = () => {
        if (paidPracticesCount > 0) {
            return (
                <p>
                    You have <span style={{ color: 'green' }}>{paidPracticesCount}</span> purchased practices left.
                </p>
            );
        } else if (paidPracticesCount === 0) {
            return (
                <p>
                    You have <span style={{ color: 'green' }}>0</span> purchased practices left.
                </p>
            );
        } else {
            return (
                <div>
                    <p>
                        You have <span style={{ color: 'red' }}>{Math.abs(paidPracticesCount)}</span> outstanding practices! Please pay for these immediately.
                    </p>
                    <a href="https://www.toocoolpurdue.com/TooCOOLPurdueWL/vECItemCatalogOrganizationItems/OrganizationItemsGallery.aspx?Organization=p0RCbTmGOlE%3D" target="_blank" rel="noopener noreferrer">
                        <button>Purchase Practices →</button>
                    </a>
                </div>
            );
        }
    };

    return (
        <div className="past-practices-container">
            <p>You have attended {pastPractices.length} practices.</p>
            {renderPurchasedPracticesMessage()}
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

export default ViewPastPractices;