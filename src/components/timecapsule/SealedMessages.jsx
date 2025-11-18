/**
 * SealedMessages Component
 * 
 * Displays list of sealed time capsules:
 * - Shows open date countdown
 * - Option to open prematurely (with confirmation)
 * - Option to delete
 */

import { useState } from 'react';
import { TrashIcon, EnvelopeOpenIcon } from '@heroicons/react/24/outline';

function SealedMessages({ capsules, onOpen, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const getDaysUntilOpen = (openDate) => {
    const now = new Date();
    const diff = openDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Opens today';
    if (days === 1) return 'Opens tomorrow';
    if (days < 7) return `Opens in ${days} days`;
    if (days < 30) return `Opens in ${Math.ceil(days / 7)} weeks`;
    if (days < 365) return `Opens in ${Math.ceil(days / 30)} months`;
    return `Opens in ${Math.ceil(days / 365)} years`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMoodEmoji = (mood) => {
    const moods = {
      hopeful: '🌟',
      curious: '🤔',
      grateful: '🙏',
      anxious: '😰',
      excited: '✨',
      reflective: '🪞'
    };
    return moods[mood] || '';
  };

  const getCategoryEmoji = (category) => {
    const categories = {
      work: '💼',
      relationship: '💕',
      self: '🪞',
      dreams: '🔮',
      gratitude: '✨',
      question: '❓'
    };
    return categories[category] || '';
  };

  const handleOpenClick = (capsule) => {
    setConfirmOpen(capsule);
  };

  const handleConfirmOpen = async () => {
    if (confirmOpen) {
      await onOpen(confirmOpen.id, true); // true = premature opening
      setConfirmOpen(null);
    }
  };

  const handleDeleteClick = (capsule) => {
    setConfirmDelete(capsule);
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete) {
      await onDelete(confirmDelete.id);
      setConfirmDelete(null);
    }
  };

  if (capsules.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <p className="font-nunito text-purple-700 italic">
          No sealed messages. Create one to open later!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {capsules.map((capsule) => (
          <div
            key={capsule.id}
            className="bg-white rounded-xl shadow-sm p-4 border-2 border-purple-100 hover:border-purple-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Header with date and countdown */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔒</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-nunito text-sm font-bold text-purple-900">
                      {getDaysUntilOpen(capsule.openDate)}
                    </p>
                    <p className="font-nunito text-xs text-purple-600">
                      Created {formatDate(capsule.createdAt)} • Opens {formatDate(capsule.openDate)}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {capsule.includeReply && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      ✍️ Reply enabled
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleOpenClick(capsule)}
                  className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                  title="Open prematurely"
                >
                  <EnvelopeOpenIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(capsule)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Premature Open Confirmation */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="font-nunito text-xl font-bold text-purple-900 mb-2">
                Open this message early?
              </h3>
              <p className="font-nunito text-purple-700">
                This message was meant to open on <strong>{formatDate(confirmOpen.openDate)}</strong>. 
                Opening it now will mark it as opened prematurely.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOpen(null)}
                className="flex-1 p-3 bg-purple-100 text-purple-700 rounded-xl font-nunito font-bold hover:bg-purple-200 transition-colors"
              >
                Keep it sealed
              </button>
              <button
                onClick={handleConfirmOpen}
                className="flex-1 p-3 bg-purple-600 text-white rounded-xl font-nunito font-bold hover:bg-purple-700 transition-colors"
              >
                Open now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🗑️</div>
              <h3 className="font-nunito text-xl font-bold text-purple-900 mb-2">
                Delete this sealed message?
              </h3>
              <p className="font-nunito text-purple-700">
                This action cannot be undone. The message will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 p-3 bg-purple-100 text-purple-700 rounded-xl font-nunito font-bold hover:bg-purple-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 p-3 bg-red-600 text-white rounded-xl font-nunito font-bold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SealedMessages;
