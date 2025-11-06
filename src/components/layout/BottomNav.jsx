/**
 * BottomNav Component
 * 
 * Bottom tab bar for primary navigation:
 * - Home (Sprout icon)
 * - Journal (Book icon)
 * - Future (Time Capsule icon)
 */

import { NavLink } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, BookOpenIcon as BookOpenIconSolid, ClockIcon as ClockIconSolid } from '@heroicons/react/24/solid';

function BottomNav() {
  const navItems = [
    {
      to: '/',
      label: 'Home',
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
    },
    {
      to: '/journal',
      label: 'Journal',
      icon: BookOpenIcon,
      activeIcon: BookOpenIconSolid,
    },
    {
      to: '/future',
      label: 'Future',
      icon: ClockIcon,
      activeIcon: ClockIconSolid,
    },
  ];

  return (
    <nav className="bg-white border-t border-peach-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center py-3 px-6 transition-colors ${
                  isActive
                    ? 'text-purple-600'
                    : 'text-mauve-700 hover:text-purple-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <item.activeIcon className="h-6 w-6 mb-1" />
                  ) : (
                    <item.icon className="h-6 w-6 mb-1" />
                  )}
                  <span className="font-nunito text-xs font-semibold">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default BottomNav;
