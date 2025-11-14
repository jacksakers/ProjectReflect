/**
 * QuickThought Component
 * 
 * A lightweight modal for logging quick thoughts/feelings:
 * - Minimal friction - just type and save
 * - Suggests voice typing for ease
 * - Optional mood/category tags
 * - Saves to entries collection with quickThought flag
 */

import { useState } from 'react';
import { XMarkIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

function QuickThought({ isOpen, onClose }) {
  const [thought, setThought] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { currentUser } = useAuth();

  // Quick mood options (simpler than full reflection)
  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'calm', emoji: '😌', label: 'Calm' },
    { id: 'grateful', emoji: '🙏', label: 'Grateful' },
    { id: 'anxious', emoji: '😰', label: 'Anxious' },
    { id: 'tired', emoji: '😴', label: 'Tired' },
    { id: 'frustrated', emoji: '😤', label: 'Frustrated' },
  ];

  // Optional categories for context
  const categories = [
    { id: 'work', emoji: '💼', label: 'Work' },
    { id: 'relationship', emoji: '💕', label: 'Relationship' },
    { id: 'self', emoji: '🪞', label: 'Self' },
    { id: 'gratitude', emoji: '✨', label: 'Gratitude' },
    { id: 'moment', emoji: '📸', label: 'Moment' },
  ];

  const handleSave = async () => {
    if (!thought.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      const now = new Date();
      
      // Save to entries collection with quickThought flag
      await addDoc(collection(db, 'entries'), {
        authorUid: currentUser.uid,
        text: thought.trim(),
        mood: selectedMood || null,
        category: selectedCategory || null,
        quickThought: true, // Flag to distinguish from full reflections
        createdAt: serverTimestamp(),
        createdDate: now.toISOString().split('T')[0], // YYYY-MM-DD for queries
        createdMonth: now.getMonth() + 1,
        createdDay: now.getDate(),
        entryType: 'quick_thought',
        photoUrl: null,
        tags: []
      });

      // Reset and close
      setThought('');
      setSelectedMood('');
      setSelectedCategory('');
      onClose();
    } catch (error) {
      console.error('Error saving quick thought:', error);
      alert('Failed to save thought. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    // Save on Ctrl/Cmd + Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center pt-20 pb-20">
      {/* Modal */}
      <div className="bg-white rounded-3xl w-full sm:max-w-lg max-h-full overflow-y-auto shadow-2xl animate-slide-up mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-orange-200 px-6 
            py-4 flex items-center justify-between rounded-t-3xl z-15">
          <h2 className="font-nunito text-xl font-bold text-purple-900">
            Quick Thought
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-purple-700 hover:bg-orange-50 rounded-lg transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">

          {/* Text Input */}
          <div>
            <label className="font-nunito text-sm font-semibold text-purple-900 mb-2 block">
              What's on your mind?
            </label>
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Just felt a wave of gratitude for my morning coffee..."
              className="w-full h-32 p-4 rounded-xl border-2 border-purple-200 bg-white focus:border-purple-400 focus:ring-0 font-nunito resize-none"
              autoFocus
            />
          </div>

          {/* Optional: How are you feeling? */}
          <div>
            <label className="font-nunito text-sm font-semibold text-purple-900 mb-3 block">
              How are you feeling? (optional)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id === selectedMood ? '' : mood.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedMood === mood.id
                      ? 'border-purple-400 bg-purple-50 scale-105'
                      : 'border-purple-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="font-nunito text-xs font-semibold text-purple-900">
                    {mood.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional: Category */}
          <div>
            <label className="font-nunito text-sm font-semibold text-purple-900 mb-3 block">
              Tag it (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? '' : cat.id)}
                  className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-purple-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="font-nunito text-sm font-semibold text-purple-900">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-orange-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white border-2 border-purple-200 text-purple-700 rounded-xl font-nunito font-bold hover:bg-orange-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!thought.trim() || isSaving}
            className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-xl font-nunito font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickThought;
