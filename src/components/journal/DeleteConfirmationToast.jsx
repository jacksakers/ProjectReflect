/**
 * DeleteConfirmationToast Component
 * 
 * Toast that appears to confirm entry deletion:
 * - Shows entry date/mood
 * - Confirm and cancel buttons
 * - Auto-dismisses after action
 */

import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

function DeleteConfirmationToast({ entry, isOpen, onConfirm, onCancel }) {
  if (!isOpen || !entry) return null;

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    const entryDate = new Date(date);
    return entryDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 flex justify-center animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-md w-full border-2 border-red-200">
        <div className="flex items-start gap-3">
          {/* Warning icon */}
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="font-nunito font-bold text-lg text-red-900 mb-1">
              Delete this entry?
            </h3>
            <p className="font-nunito text-sm text-red-700 mb-4">
              Your reflection from <strong>{formatDate(entry.createdAt)}</strong> will be permanently deleted. This cannot be undone.
            </p>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl font-nunito font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 px-4 bg-purple-100 text-purple-900 rounded-xl font-nunito font-semibold hover:bg-purple-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={onCancel}
            className="flex-shrink-0 p-1 hover:bg-red-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationToast;
