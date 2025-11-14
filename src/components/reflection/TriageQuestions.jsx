/**
 * TriageQuestions Component
 * 
 * First step in reflection flow - asks contextual questions:
 * 1. What's weighing on your mind?
 * 2. Where in your body do you feel it?
 */

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function TriageQuestions({ onComplete, onClose }) {
  const [selectedThoughts, setSelectedThoughts] = useState([]);
  const [selectedBodyLocations, setSelectedBodyLocations] = useState([]);
  const [customThought, setCustomThought] = useState('');

  const thoughtCategories = [
    { id: 'work', label: 'Work', emoji: '💼' },
    { id: 'relationship', label: 'Relationship', emoji: '💕' },
    { id: 'self', label: 'Self', emoji: '🪞' },
    { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { id: 'health', label: 'Health', emoji: '🏥' },
    { id: 'future', label: 'Future', emoji: '🔮' },
    { id: 'other', label: 'Something else...', emoji: '💭' }
  ];

  const bodyLocations = [
    { id: 'tense_shoulders', label: 'Tense Shoulders', emoji: '😣' },
    { id: 'jittery_stomach', label: 'Jittery Stomach', emoji: '🦋' },
    { id: 'tight_chest', label: 'Tight Chest', emoji: '😮‍💨' },
    { id: 'racing_heart', label: 'Racing Heart', emoji: '💓' },
    { id: 'heavy_head', label: 'Heavy Head', emoji: '🤯' },
    { id: 'calm_body', label: 'Calm & Centered', emoji: '😌' },
    { id: 'tired_everywhere', label: 'Tired Everywhere', emoji: '😴' }
  ];

  const toggleThought = (thoughtId) => {
    if (thoughtId === 'other') {
      // "Other" is exclusive - if selected, clear all and select only "other"
      setSelectedThoughts(['other']);
    } else {
      setSelectedThoughts(prev => {
        // Remove "other" if it was previously selected
        const withoutOther = prev.filter(id => id !== 'other');
        
        if (withoutOther.includes(thoughtId)) {
          // Remove if already selected
          return withoutOther.filter(id => id !== thoughtId);
        } else {
          // Add to selection
          return [...withoutOther, thoughtId];
        }
      });
    }
  };

  const toggleBodyLocation = (locationId) => {
    setSelectedBodyLocations(prev => {
      if (prev.includes(locationId)) {
        // Remove if already selected
        return prev.filter(id => id !== locationId);
      } else {
        // Add to selection
        return [...prev, locationId];
      }
    });
  };

  const canContinue = selectedThoughts.length > 0 && selectedBodyLocations.length > 0 && 
    (!selectedThoughts.includes('other') || customThought.trim());

  const handleContinue = () => {
    if (!canContinue) return;

    // Prepare thoughts data
    const thoughtData = selectedThoughts.includes('other') 
      ? [customThought] 
      : selectedThoughts;

    onComplete({
      thoughts: thoughtData,
      thoughtCategories: selectedThoughts,
      bodyLocations: selectedBodyLocations
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-nunito text-2xl font-bold text-purple-900">
          Let's check in
        </h1>
        <button
          onClick={onClose}
          className="p-2 text-purple-900 hover:bg-orange-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Question 1: What's weighing on your mind? */}
      <div className="mb-8">
        <h2 className="font-nunito text-xl font-bold text-purple-900 mb-2">
          What's weighing on your mind?
        </h2>
        <p className="text-sm text-purple-600 mb-4">Select all that apply</p>
        <div className="grid grid-cols-2 gap-3">
          {thoughtCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => toggleThought(category.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedThoughts.includes(category.id)
                  ? 'border-purple-600 bg-purple-50 shadow-md'
                  : 'border-purple-200 bg-white hover:border-purple-400'
              }`}
            >
              <div className="text-2xl mb-1">{category.emoji}</div>
              <div className="font-nunito font-semibold text-purple-900">
                {category.label}
              </div>
            </button>
          ))}
        </div>

        {/* Custom thought input if "Other" is selected */}
        {selectedThoughts.includes('other') && (
          <div className="mt-4">
            <input
              type="text"
              value={customThought}
              onChange={(e) => setCustomThought(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-4 rounded-xl border-2 border-purple-200 bg-white focus:border-purple-400 focus:ring-0 font-nunito"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Question 2: Where do you feel it? */}
      <div className="mb-8">
        <h2 className="font-nunito text-xl font-bold text-purple-900 mb-2">
          Where in your body do you feel it?
        </h2>
        <p className="text-sm text-purple-600 mb-4">Select all that apply</p>
        <div className="grid grid-cols-1 gap-3">
          {bodyLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => toggleBodyLocation(location.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center ${
                selectedBodyLocations.includes(location.id)
                  ? 'border-purple-600 bg-purple-50 shadow-md'
                  : 'border-purple-200 bg-white hover:border-purple-400'
              }`}
            >
              <div className="text-2xl mr-3">{location.emoji}</div>
              <div className="font-nunito font-semibold text-purple-900">
                {location.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className={`w-full p-4 rounded-xl text-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 ${
          canContinue
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-purple-200 text-purple-700 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
}

export default TriageQuestions;
