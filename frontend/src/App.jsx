import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './Pages/Landing/LandingPage';
import LoginPage from './Pages/Landing/LoginPage';
import SignupPage from './Pages/Landing/SignupPage';
import NavigationBar from './Components/NavigationBar';
import Dashboard from './Pages/Dashboard';
import Settings from './Pages/Settings';

const Dummy = ({ text }) => (
  <div style={{ padding: '4rem', textAlign: 'center', fontSize: '2rem' }}>{text}</div>
);

const App = () => {
  const location = useLocation();

 
  const hiddenNavPaths = ["/", "/signin", "/get-started"];
  const showNavigation = !hiddenNavPaths.includes(location.pathname);

  return (
    <div className="flex">
     
      {showNavigation && <NavigationBar />}

      
      <div className={`flex-1 ${showNavigation ? "lg:ml-64 pt-16 lg:pt-0" : ""}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/features" element={<Dummy text="Features Page" />} />
          <Route path="/pricing" element={<Dummy text="Pricing Page" />} />
          <Route path="/reviews" element={<Dummy text="Reviews Page" />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/get-started" element={<SignupPage />} />
          <Route path="/profile" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
