/**
 * MainLayout Component
 * 
 * Main app layout wrapper that includes:
 * - Header with hamburger menu
 * - Sidebar navigation
 * - Bottom navigation tabs
 * - Content area with proper spacing
 */

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/journal':
        return 'Journal';
      case '/future':
        return 'Future';
      default:
        return 'Project Reflect';
    }
  };

  return (
    <div className="min-h-screen bg-peach-50">
      <Header title={getPageTitle()} onMenuClick={() => setIsSidebarOpen(true)} />
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
}

export default MainLayout;
