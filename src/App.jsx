import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import LockedRoute from './LockedRoute'; // Import the ProtectedRoute
import Home from './Home'; // Import your home component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/home"
          element={
            <LockedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </LockedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;