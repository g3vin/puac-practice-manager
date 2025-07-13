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
import LandingPage from './LandingPage';
import Join from './Join';

const protectedRoutes = [
  { path: '/home', element: <Home /> },
  { path: '/info', element: <Info /> },
  { path: '/manage-members', element: <ManageMembers /> },
  { path: '/manage-practices', element: <ManagePractices /> },
];

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
  const { userId } = useUser();
  const isAuthenticated = userId !== null;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />
      <Route
        path="/welcome"
        element={isAuthenticated ? <Welcome /> : <Navigate to="/login" />}
      />
      {protectedRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<LockedRoute>{element}</LockedRoute>}
        />
      ))}
    </Routes>
  );
}

export default App;