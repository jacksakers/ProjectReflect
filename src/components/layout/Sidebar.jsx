/**
 * Sidebar Component
 * 
 * Slide-out navigation menu with secondary items:
 * - Your Full Garden
 * - Profile
 * - Settings
 * - Logout
 */

import { 
  XMarkIcon, 
  SparklesIcon, 
  UserCircleIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { icon: SparklesIcon, label: 'Your Full Garden', onClick: () => {} },
    { icon: UserCircleIcon, label: 'Profile', onClick: () => {} },
    { icon: Cog6ToothIcon, label: 'Settings', onClick: () => {} },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-peach-200">
            <h2 className="font-nunito text-2xl font-bold text-purple-900">
              Project Reflect
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-purple-900 hover:bg-peach-50 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      item.onClick();
                      onClose();
                    }}
                    className="w-full flex items-center gap-4 p-4 text-purple-900 hover:bg-peach-50 rounded-xl transition-colors"
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="font-nunito text-lg font-semibold">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-peach-200">
            <button
              onClick={onClose}
              className="w-full flex items-center gap-4 p-4 text-mauve-700 hover:bg-peach-50 rounded-xl transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span className="font-nunito text-lg font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
