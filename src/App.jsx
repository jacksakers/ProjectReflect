/**
 * App Component
 * 
 * Main application component with routing setup.
 * Defines all routes and wraps pages in MainLayout.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import FuturePage from './pages/FuturePage';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/future" element={<FuturePage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
