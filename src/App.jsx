import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './UserContext';

import LockedRoute from './LockedRoute';

import LandingPage from './LandingPage';

// website pages
import AboutArchery from './AboutArchery';
import OurRange from './OurRange';
import OurTeam from './OurTeam';
import Calendar from './Calendar';
import Competitions from './Competitions';
import Contact from './Contact';
import Join from './Join';
import Login from './Login';

// app pages
import Home from './Home';
import Welcome from './Welcome';
import Info from './Info';
import ManageMembers from './ManageMembers';
import ManagePractices from './ManagePractices';
import HomeNavbar from './HomeNavbar';

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
        <div>
          <HomeNavbar />
          <div id="main-content">
            <AppRoutes />
          </div>
        </div>
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
      <Route path="/about-archery" element={<AboutArchery />} />
      <Route path="/our-range" element={<OurRange />} />
      <Route path="/our-team" element={<OurTeam />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/competitions" element={<Competitions />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/join" element={<Join />} />
      <Route path="/login" element={<Login />} />
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