/**
 * EntryCard Component
 * 
 * Displays a journal entry in the list view:
 * - Date and time
 * - Mood emoji
 * - Text snippet (truncated)
 * - Meditation type badge (if applicable)
 * - Click to open full entry
 */

import { CalendarIcon, SparklesIcon } from '@heroicons/react/24/outline';

function EntryCard({ entry, onClick }) {
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
      peaceful: '😌',
      calm: '🙂',
      neutral: '😐',
      hopeful: '🌟',
      grateful: '🙏',
      happy: '😊',
      anxious: '😰',
      tired: '😴',
      frustrated: '😤'
    };
    return moodMap[entry.mood] || '💭';
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
      className="w-full bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-200 text-left hover:scale-[1.01] active:scale-[0.99]"
    >
      {/* Header with date and mood */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-purple-600">
          <CalendarIcon className="w-4 h-4" />
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

        {/* Thought category badge */}
        {entry.thoughtCategory && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-nunito">
            {(() => {
              const categoryMap = {
                work: '💼',
                relationship: '💕',
                self: '🪞',
                family: '👨‍👩‍👧‍👦',
                health: '🏥',
                future: '🔮'
              };
              return categoryMap[entry.thoughtCategory] || '💭';
            })()}
          </span>
        )}
      </div>
    </button>
  );
}

export default EntryCard;
