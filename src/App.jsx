import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './UserContext';
import Login from './Login';
import LockedRoute from './LockedRoute';
import Home from './Home';
import Welcome from './Welcome';
import Info from './Info';
import ManageMembers from './ManageMembers';
import ManagePractices from './ManagePractices';

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
  const { userId, loading } = useUser();
  const isAuthenticated = userId !== null;

  return (
      <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
              path="/home"
              element={
                  <LockedRoute>
                      <Home />
                  </LockedRoute>
              }
          />
          <Route
              path="/welcome"
              element={isAuthenticated ? <Welcome /> : <Navigate to="/login" />}
          />
          <Route
              path="/info"
              element={
                  <LockedRoute>
                      <Info />
                  </LockedRoute>
              }
          />
          <Route
              path="/manage-members"
              element={
                  <LockedRoute>
                      <ManageMembers />
                  </LockedRoute>
              }
          />
          <Route
              path="/manage-practices"
              element={
                  <LockedRoute>
                      <ManagePractices />
                  </LockedRoute>
              }
          />
      </Routes>
  );
}

export default App;