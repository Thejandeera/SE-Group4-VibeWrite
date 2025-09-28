import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './Pages/Landing/LandingPage.js';
import LoginPage from './Pages/Landing/LoginPage.js';
import SignupPage from './Pages/Landing/SignupPage.js';
import NavigationBar from './Components/NavigationBar.js';
import Dashboard from './Pages/Dashboard.js';
import ContentEditor from './Pages/ContentEditor.js';
import ReadabilityScoreEditor from './Pages/ReadabilityScoreEditor.js';
import SettingsPage from './Pages/SettingsPage.js';
import NotificationSystem from './Pages/NotificationSystem.js';
import GrammarChecker from './Pages/GrammarChecker.js';
import PastGrammar from './Pages/PastGrammar.js';
import ViewDraft from './Pages/ViewDraft.js'; 
import SEOTools from './Pages/SEOTools.js'; 
import SentimentAnalysis from './Pages/SentimentAnalysis.js'; 

const App = () => {
  const location = useLocation();

  // Pages where sidebar/nav should not show (e.g., login, sign-up, landing)
  const hiddenNavPaths = ["/", "/signin", "/get-started"];
  const showNavigation = !hiddenNavPaths.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {showNavigation && <NavigationBar />}

      <main className={`flex-1 transition-all duration-300 ${showNavigation ? "lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6" : "p-4 sm:p-6"}`}>
        <Routes>
          {/* Landing/Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/get-started" element={<SignupPage />} />

          {/* Core Application Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/content-editor" element={<ContentEditor />} />
          <Route path="/view-drafts" element={<ViewDraft />} />
          
          {/* Tool Routes */}
          <Route path="/readability-score" element={<ReadabilityScoreEditor />} />
          <Route path="/grammar-check" element={<GrammarChecker />} />
          <Route path="/past-grammar" element={<PastGrammar />} />
          <Route path="/seo-tools" element={<SEOTools />} /> 
          <Route path="/sentiment-analysis" element={<SentimentAnalysis />} /> {/* New Route Added */}
          
          {/* Utility/User Routes */}
          <Route path="/profile" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationSystem />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
