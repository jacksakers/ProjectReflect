/**
 * EntryDetailModal Component
 * 
 * Full-screen modal showing complete entry details:
 * - Full text content
 * - All metadata (date, mood, meditation, triage answers)
 * - Photo if uploaded
 * - Delete button
 */

import { XMarkIcon, TrashIcon, SparklesIcon, CalendarIcon } from '@heroicons/react/24/outline';

function EntryDetailModal({ entry, isOpen, onClose, onDelete }) {
  if (!isOpen || !entry) return null;

  // Format date nicely
  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    const entryDate = new Date(date);
    return entryDate.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Get mood emoji and label
  const getMoodDisplay = () => {
    const moodMap = {
      peaceful: { emoji: '😌', label: 'Peaceful' },
      calm: { emoji: '🙂', label: 'Calm' },
      neutral: { emoji: '😐', label: 'Neutral' },
      hopeful: { emoji: '🌟', label: 'Hopeful' },
      grateful: { emoji: '🙏', label: 'Grateful' },
      happy: { emoji: '😊', label: 'Happy' },
      anxious: { emoji: '😰', label: 'Anxious' },
      tired: { emoji: '😴', label: 'Tired' },
      frustrated: { emoji: '😤', label: 'Frustrated' }
    };
    return moodMap[entry.mood] || { emoji: '💭', label: 'Reflective' };
  };

  // Get meditation type display name
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
      grounding: '5-4-3-2-1 Grounding'
    };
    return nameMap[entry.meditationType] || entry.meditationType;
  };

  // Get body location display (uses flat field structure)
  const getBodyLocationLabel = () => {
    if (!entry.bodyLocation) return null;
    const bodyMap = {
      tense_shoulders: 'Tense Shoulders',
      jittery_stomach: 'Jittery Stomach',
      tight_chest: 'Tight Chest',
      racing_heart: 'Racing Heart',
      heavy_head: 'Heavy Head',
      calm_body: 'Calm & Centered',
      tired_everywhere: 'Tired Everywhere'
    };
    return bodyMap[entry.bodyLocation] || entry.bodyLocation;
  };

  // Get thought category label (uses flat field structure)
  const getThoughtLabel = () => {
    if (!entry.thoughtCategory) return null;
    const thoughtMap = {
      work: 'Work',
      relationship: 'Relationship',
      self: 'Self',
      family: 'Family',
      health: 'Health',
      future: 'Future'
    };
    return thoughtMap[entry.thoughtCategory] || entry.thoughtCategory;
  };
  
  // Get emoji for thought category
  const getThoughtEmoji = () => {
    if (!entry.thoughtCategory) return '💭';
    const emojiMap = {
      work: '💼',
      relationship: '💕',
      self: '🪞',
      family: '👨‍👩‍👧‍👦',
      health: '🏥',
      future: '🔮'
    };
    return emojiMap[entry.thoughtCategory] || '💭';
  };
  
  // Get emoji for body location
  const getBodyEmoji = () => {
    if (!entry.bodyLocation) return '🧘';
    const emojiMap = {
      tense_shoulders: '😣',
      jittery_stomach: '🦋',
      tight_chest: '😮‍💨',
      racing_heart: '💓',
      heavy_head: '🤯',
      calm_body: '😌',
      tired_everywhere: '😴'
    };
    return emojiMap[entry.bodyLocation] || '🧘';
  };

  const mood = getMoodDisplay();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-purple-100 p-5 flex items-start justify-between rounded-t-3xl">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <CalendarIcon className="w-4 h-4" />
                <span className="font-nunito text-sm font-semibold">
                  {formatDate(entry.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl" role="img" aria-label="Mood">
                  {mood.emoji}
                </span>
                <span className="font-nunito text-lg font-bold text-purple-900">
                  {mood.label}
                </span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-100 rounded-xl transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="w-6 h-6 text-purple-700" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Metadata badges */}
            {(entry.meditationType || entry.meditationName || entry.quickThought) && (
              <div className="flex flex-wrap gap-2">
                {(entry.meditationType || entry.meditationName) && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-nunito font-semibold">
                    <SparklesIcon className="w-4 h-4" />
                    {getMeditationName()}
                  </span>
                )}
                
                {entry.quickThought && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-nunito font-semibold">
                    💭 Quick Thought
                  </span>
                )}
              </div>
            )}

            {/* Triage context */}
            {(entry.thoughtCategory || entry.bodyLocation) && (
              <div className="bg-purple-50 rounded-2xl p-4 space-y-3">
                <h4 className="font-nunito font-bold text-purple-900 text-sm uppercase tracking-wide">
                  Reflection Context
                </h4>
                
                {getThoughtLabel() && (
                  <div className="flex items-start gap-3">
                    <div className="text-lg">{getThoughtEmoji()}</div>
                    <div>
                      <div className="font-nunito text-xs text-purple-600 mb-0.5">What was on your mind</div>
                      <div className="font-nunito text-purple-900">{getThoughtLabel()}</div>
                    </div>
                  </div>
                )}
                
                {getBodyLocationLabel() && (
                  <div className="flex items-start gap-3">
                    <div className="text-lg">{getBodyEmoji()}</div>
                    <div>
                      <div className="font-nunito text-xs text-purple-600 mb-0.5">Where you felt it</div>
                      <div className="font-nunito text-purple-900">{getBodyLocationLabel()}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Entry text */}
            <div className="space-y-2">
              <h4 className="font-nunito font-bold text-purple-900 text-sm uppercase tracking-wide">
                Your Reflection
              </h4>
              <p className="font-nunito text-lg text-purple-900 leading-relaxed whitespace-pre-wrap">
                {entry.text || 'No text recorded'}
              </p>
            </div>

            {/* Photo if present */}
            {entry.photoUrl && (
              <div className="space-y-2">
                <h4 className="font-nunito font-bold text-purple-900 text-sm uppercase tracking-wide">
                  Photo
                </h4>
                <img 
                  src={entry.photoUrl} 
                  alt="Journal entry photo"
                  className="w-full rounded-2xl shadow-sm"
                />
              </div>
            )}

            {/* Delete button */}
            <div className="pt-4 border-t border-purple-100">
              <button
                onClick={() => onDelete(entry)}
                className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-xl font-nunito font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <TrashIcon className="w-5 h-5" />
                Delete this entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EntryDetailModal;
