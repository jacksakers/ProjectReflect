/**
 * DeliveredMessages Component
 * 
 * Shows recently delivered time capsules (limit 3-5):
 * - Display snippet of message
 * - Show if reply is available/completed
 * - Click to open full detail modal
 */

import { ChatBubbleLeftRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

function DeliveredMessages({ capsules, onViewDetail }) {
  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Opened today';
    if (diffDays === 1) return 'Opened yesterday';
    if (diffDays < 7) return `Opened ${diffDays} days ago`;
    if (diffDays < 30) return `Opened ${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `Opened ${Math.ceil(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCreatedDate = (date) => {
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

  // Show only the 5 most recent delivered messages
  const recentCapsules = capsules.slice(0, 5);

  if (recentCapsules.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">📭</div>
        <p className="font-nunito text-purple-700 italic">
          Messages from your past self will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentCapsules.map((capsule) => (
        <div
          key={capsule.id}
          onClick={() => onViewDetail(capsule)}
          className="bg-white rounded-xl shadow-sm p-4 border-2 border-green-100 hover:border-green-300 transition-colors cursor-pointer"
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="text-3xl flex-shrink-0">
              {capsule.openedPrematurely ? '📬' : '💌'}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <p className="font-nunito text-sm font-bold text-purple-900">
                  {formatDate(capsule.openedAt || capsule.openDate)}
                </p>
                {capsule.openedPrematurely && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                    Opened early
                  </span>
                )}
              </div>

              <p className="font-nunito text-xs text-purple-600 mb-2">
                Written on {formatCreatedDate(capsule.createdAt)}
              </p>

              {/* Message preview */}
              <p className="font-nunito text-purple-800 text-sm line-clamp-2 mb-3">
                {capsule.text}
              </p>

              {/* Tags and reply status */}
              <div className="flex flex-wrap items-center gap-2">
                {capsule.mood && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                    {getMoodEmoji(capsule.mood)} {capsule.mood}
                  </span>
                )}
                {capsule.category && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                    {getCategoryEmoji(capsule.category)} {capsule.category}
                  </span>
                )}
                {capsule.includeReply && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    capsule.replyText
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {capsule.replyText ? (
                      <>
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Replied
                      </>
                    ) : (
                      <>
                        <ChatBubbleLeftRightIcon className="w-3 h-3 mr-1" />
                        Reply available
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {capsules.length > 5 && (
        <p className="text-center font-nunito text-sm text-purple-600 py-2">
          + {capsules.length - 5} more in your Journal
        </p>
      )}
    </div>
  );
}

export default DeliveredMessages;
