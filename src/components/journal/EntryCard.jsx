/**
 * EntryCard Component
 * 
 * Displays a journal entry or time capsule in the list view:
 * - Date and time
 * - Mood emoji
 * - Text snippet (truncated)
 * - Meditation type badge (if applicable)
 * - Time capsule badge (if applicable)
 * - Click to open full entry
 */

import { CalendarIcon, SparklesIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

function EntryCard({ entry, onClick }) {
  const isTimeCapsule = entry.type === 'timeCapsule';
  
  // Format date nicely
  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    
    const today = new Date();
    const entryDate = new Date(date);
    
    // Check if today
    if (entryDate.toDateString() === today.toDateString()) {
      return `Today at ${entryDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      })}`;
    }
    
    // Check if yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (entryDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${entryDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      })}`;
    }
    
    // Otherwise show full date
    return entryDate.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: entryDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Get mood emoji
  const getMoodEmoji = () => {
    const moodMap = {
      // Regular reflection moods
      peaceful: '😌',
      calm: '🙂',
      neutral: '😐',
      hopeful: '🌟',
      grateful: '🙏',
      happy: '😊',
      anxious: '😰',
      tired: '😴',
      frustrated: '😤',
      // Time capsule moods
      curious: '🤔',
      excited: '✨',
      reflective: '🪞'
    };
    return moodMap[entry.mood] || (isTimeCapsule ? '💌' : '💭');
  };

  // Truncate text for preview
  const getTextSnippet = () => {
    if (!entry.text) return 'No text';
    const maxLength = 150;
    if (entry.text.length <= maxLength) return entry.text;
    return entry.text.substring(0, maxLength) + '...';
  };

  // Get meditation type display name (uses meditationName from Firebase)
  const getMeditationName = () => {
    // First check if we have the meditationName field directly
    if (entry.meditationName) return entry.meditationName;
    
    // Fallback to meditationType if meditationName isn't present
    if (!entry.meditationType) return null;
    const nameMap = {
      body_scan: 'Body Scan',
      breath_focus: 'Breath Focus',
      thought_observation: 'Thought Observation',
      loving_kindness: 'Loving Kindness',
      grounding: 'Grounding'
    };
    return nameMap[entry.meditationType] || entry.meditationType;
  };

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-200 text-left hover:scale-[1.01] active:scale-[0.99] ${
        isTimeCapsule ? 'bg-gradient-to-br from-green-50 to-white border-2 border-green-200' : 'bg-white'
      }`}
    >
      {/* Header with date and mood */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-purple-600">
          {isTimeCapsule ? (
            <EnvelopeIcon className="w-4 h-4" />
          ) : (
            <CalendarIcon className="w-4 h-4" />
          )}
          <span className="font-nunito text-sm font-semibold">
            {formatDate(entry.createdAt)}
          </span>
        </div>
        <div className="text-2xl" role="img" aria-label="Mood">
          {getMoodEmoji()}
        </div>
      </div>

      {/* Entry text snippet */}
      <p className="font-nunito text-purple-900 mb-3 leading-relaxed">
        {getTextSnippet()}
      </p>

      {/* Footer with metadata */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Time capsule badge */}
        {isTimeCapsule && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-nunito font-semibold">
            💌 Time Capsule
            {entry.openedPrematurely && ' (Opened Early)'}
          </span>
        )}

        {/* Meditation badge */}
        {(entry.meditationType || entry.meditationName) && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-nunito font-semibold">
            <SparklesIcon className="w-3 h-3" />
            {getMeditationName()}
          </span>
        )}

        {/* Quick thought badge */}
        {entry.quickThought && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-nunito font-semibold">
            💭 Quick Thought
          </span>
        )}

        {/* Thought/Time capsule category badge */}
        {(entry.thoughtCategory || entry.category) && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-nunito">
            {(() => {
              const categoryMap = {
                work: '💼',
                relationship: '💕',
                self: '🪞',
                family: '👨‍👩‍👧‍👦',
                health: '🏥',
                future: '🔮',
                dreams: '🔮',
                gratitude: '✨',
                question: '❓'
              };
              return categoryMap[entry.thoughtCategory || entry.category] || '💭';
            })()}
          </span>
        )}
        
        {/* Reply badge for time capsules */}
        {isTimeCapsule && entry.includeReply && entry.replyText && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-nunito font-semibold">
            💬 Replied
          </span>
        )}
      </div>
    </button>
  );
}

export default EntryCard;
