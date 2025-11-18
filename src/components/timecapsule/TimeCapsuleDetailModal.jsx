/**
 * TimeCapsuleDetailModal Component
 * 
 * Full-screen modal for viewing delivered time capsules:
 * - Shows full message text
 * - All metadata (dates, mood, category)
 * - Reply section (if enabled)
 * - Delete option
 */

import { useState } from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

function TimeCapsuleDetailModal({ capsule, isOpen, onClose, onDelete, onSaveReply }) {
  const [replyText, setReplyText] = useState(capsule?.replyText || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !capsule) return null;

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatShortDate = (date) => {
    if (!date) return '';
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

  const getMoodLabel = (mood) => {
    return mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : '';
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

  const getCategoryLabel = (category) => {
    return category ? category.charAt(0).toUpperCase() + category.slice(1) : '';
  };

  const handleSaveReply = async () => {
    if (!replyText.trim()) return;

    setIsSaving(true);
    const result = await onSaveReply(capsule.id, replyText.trim());
    
    if (result.success) {
      // Reply saved successfully
    }
    
    setIsSaving(false);
  };

  const handleDelete = async () => {
    await onDelete(capsule.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const hasReply = capsule.replyText && capsule.replyText.trim();

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-orange-50 w-full h-full overflow-y-auto animate-slide-up max-h-[80vh]">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-purple-100 p-4 flex justify-between items-center shadow-sm z-10">
            <div className="flex-1">
              <h2 className="font-nunito text-xl font-bold text-purple-900">
                💌 Message from Past You
              </h2>
              <p className="font-nunito text-sm text-purple-600">
                {capsule.openedPrematurely ? 'Opened early on' : 'Opened on'} {formatShortDate(capsule.openedAt || capsule.openDate)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-purple-400 hover:text-purple-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Metadata card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-nunito font-bold text-purple-900 mb-1">Written</p>
                  <p className="font-nunito text-purple-700">{formatShortDate(capsule.createdAt)}</p>
                </div>
                <div>
                  <p className="font-nunito font-bold text-purple-900 mb-1">Sealed for</p>
                  <p className="font-nunito text-purple-700">
                    {Math.ceil((capsule.openDate - capsule.createdAt) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>

              {/* Tags */}
              {(capsule.mood || capsule.category) && (
                <div className="mt-4 pt-4 border-t border-purple-100 flex flex-wrap gap-2">
                  {capsule.mood && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                      {getMoodEmoji(capsule.mood)} {getMoodLabel(capsule.mood)}
                    </span>
                  )}
                  {capsule.category && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
                      {getCategoryEmoji(capsule.category)} {getCategoryLabel(capsule.category)}
                    </span>
                  )}
                </div>
              )}

              {capsule.openedPrematurely && (
                <div className="mt-4 pt-4 border-t border-purple-100">
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <p className="font-nunito text-sm text-yellow-800">
                      ⚠️ This message was opened before its scheduled date
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Message card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-nunito text-lg font-bold text-purple-900 mb-4">
                Your Message
              </h3>
              <div className="prose prose-purple max-w-none">
                <p className="font-nunito text-lg text-purple-800 whitespace-pre-wrap leading-relaxed">
                  {capsule.text}
                </p>
              </div>
            </div>

            {/* Reply section */}
            {capsule.includeReply && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-nunito text-lg font-bold text-purple-900 mb-4">
                  Your Reply
                </h3>
                
                {hasReply ? (
                  <div>
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
                      <p className="font-nunito text-sm text-green-800 mb-2">
                        ✅ Replied on {formatShortDate(capsule.repliedAt)}
                      </p>
                      <p className="font-nunito text-purple-800 whitespace-pre-wrap leading-relaxed">
                        {capsule.replyText}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="How do you feel reading this now? What's changed?"
                      className="w-full p-4 rounded-xl border-2 border-purple-200 focus:border-purple-600 focus:outline-none font-nunito text-lg text-purple-900 resize-none"
                      rows="6"
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={handleSaveReply}
                        disabled={!replyText.trim() || isSaving}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl font-nunito font-bold shadow-md transition-all duration-200 transform active:scale-95 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Saving...' : '💬 Save Reply'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delete button */}
            <div className="pt-1">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-xl font-nunito font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <TrashIcon className="w-5 h-5" />
                Delete this time capsule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🗑️</div>
              <h3 className="font-nunito text-xl font-bold text-purple-900 mb-2">
                Delete this time capsule?
              </h3>
              <p className="font-nunito text-purple-700">
                This action cannot be undone. The message and any reply will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 p-3 bg-purple-100 text-purple-700 rounded-xl font-nunito font-bold hover:bg-purple-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default TimeCapsuleDetailModal;
