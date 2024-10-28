import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState(null);
    const [hasLoggedIn, setHasLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                setEmail(user.email);

                const userDoc = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()) {
                    setHasLoggedIn(docSnap.data().hasLoggedIn);
                }
            } else {
                setUserId(null);
                setEmail(null);
                setHasLoggedIn(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ userId, email, hasLoggedIn, setHasLoggedIn, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);