import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import LockedRoute from './LockedRoute'; // Import the ProtectedRoute
import Home from './Home'; // Import your home component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true); // Update authentication state on login
  };

  return (
    <Router>
      <Routes>
        {/* Redirect root path to login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Login route */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {/* Protected home route */}
        <Route
          path="/home"
          element={
            <LockedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </LockedRoute>
          }
        />
        {/* Other routes can go here */}
      </Routes>
    </Router>
  );
}

export default App;