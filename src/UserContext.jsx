import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                setEmail(user.email);
            } else {
                setUserId(null);
                setEmail(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ userId, email, loading }}> 
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);