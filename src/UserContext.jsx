import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set userId to the authenticated user's ID
      } else {
        setUserId(null); // Clear userId if not authenticated
      }
    });

    return () => unsubscribe(); // Clean up subscription
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}> {/* Pass setUserId */}
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);