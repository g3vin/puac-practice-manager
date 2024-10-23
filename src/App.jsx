import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import LockedRoute from './LockedRoute'; // Import the LockedRoute for protected routes
import Home from './Home'; // Import your Home component
import Welcome from './Welcome'; // Import your Welcome component
import Info from './Info'; // Import your Info component
import { UserProvider, useUser } from './UserContext'; // Import UserProvider and useUser
import ManageMembers from './ManageMembers';

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

function AppRoutes() {
  const { userId } = useUser(); // Access userId from context
  const isAuthenticated = userId !== null; // Determine if the user is authenticated based on userId

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <LockedRoute isAuthenticated={isAuthenticated}>
            <Home />
          </LockedRoute>
        }
      />
      <Route
        path="/welcome"
        element={
          true || isAuthenticated ? <Welcome /> : <Navigate to="/home" />
        }
      />
      <Route
        path="/info"
        element={
          <LockedRoute isAuthenticated={isAuthenticated}>
            <Info />
          </LockedRoute>
        }
      />
      <Route
        path="/manage-members"
        element={
          <LockedRoute isAuthenticated={isAuthenticated}>
            <ManageMembers />
          </LockedRoute>
        }
      />
    </Routes>
  );
}

export default App;