/**
 * App Component
 * 
 * Main application component with routing setup.
 * Defines all routes and wraps pages in MainLayout.
 * Includes authentication flow.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import FuturePage from './pages/FuturePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/journal" element={
            <ProtectedRoute>
              <MainLayout>
                <JournalPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/future" element={
            <ProtectedRoute>
              <MainLayout>
                <FuturePage />
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
