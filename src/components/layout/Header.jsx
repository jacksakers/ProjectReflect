/**
 * Header Component
 * 
 * Top navigation bar with:
 * - Hamburger menu (left)
 * - Page title (center)
 */

import { Bars3Icon } from '@heroicons/react/24/outline';

function Header({ title, onMenuClick }) {
  return (
    <header className="bg-white border-b border-orange-200 sticky top-0 z-100">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="p-2 text-purple-900 hover:bg-orange-50 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        <h1 className="font-nunito text-xl font-bold text-purple-900">
          {title}
        </h1>
        
        {/* Spacer for centering */}
        <div className="w-10"></div>
      </div>
    </header>
  );
}

export default Header;
