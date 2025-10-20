import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './Pages/Landing/LandingPage';
import LoginPage from './Pages/Landing/LoginPage';
import SignupPage from './Pages/Landing/SignupPage';
import NavigationBar from './Components/NavigationBar';
import Dashboard from './Pages/Dashboard';
import ContentEditor from './Pages/ContentEditor';
import ReadabilityScoreEditor from './Pages/ReadabilityScoreEditor';
import SettingsPage from './Pages/SettingsPage';
import NotificationSystem from './Pages/NotificationSystem';
import GrammarChecker from './Pages/GrammarChecker';
import PastGrammar from './Pages/PastGrammar';
import ViewDraft from './Pages/viewdraft';
import SEOTools from './Pages/SEOTools';   // ✅ NEW PAGE IMPORT
import SentimentAnalysis from './Pages/SentimentAnalysis';
import SEOTools from './Pages/SEOTools';   
import HelpAndSupport from './Pages/HelpAndSupport';
import Document from './Pages/Document';


const App = () => {
  const location = useLocation();

  // Pages where sidebar/nav should not show
  const hiddenNavPaths = ["/", "/signin", "/get-started"];
  const showNavigation = !hiddenNavPaths.includes(location.pathname);

  return (
    <div className="flex">
      {/* Navigation sidebar (only shows if not in hidden paths) */}
      {showNavigation && <NavigationBar />}

      {/* Main content */}
      <div className={`flex-1 ${showNavigation ? "lg:ml-64 pt-16 lg:pt-0" : ""}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/content-editor" element={<ContentEditor />} />
          <Route path="/readability-score" element={<ReadabilityScoreEditor />} />
          <Route path="/view-drafts" element={<ViewDraft />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/get-started" element={<SignupPage />} />
          <Route path="/profile" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationSystem />} />
          <Route path="/grammar-check" element={<GrammarChecker />} />
          <Route path="/past-grammar" element={<PastGrammar />} />
          <Route path="/seo-tools" element={<SEOTools />} />   {/* ✅ NEW ROUTE */}
          <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
          <Route path="/seo-tools" element={<SEOTools />} />   
          <Route path="/help" element={<HelpAndSupport />} />
          <Route path="/new-document" element={<Document />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;