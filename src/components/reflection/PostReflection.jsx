/**
 * PostReflection Component
 * 
 * Final step - journal entry after meditation.
 * Saves complete reflection to Firestore.
 */

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';

function PostReflection({ triageAnswers, meditation, onComplete }) {
  const [reflectionText, setReflectionText] = useState('');
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const moods = [
    { id: 'peaceful', emoji: '😌', label: 'Peaceful' },
    { id: 'calm', emoji: '🙂', label: 'Calm' },
    { id: 'neutral', emoji: '😐', label: 'Neutral' },
    { id: 'hopeful', emoji: '🌟', label: 'Hopeful' },
    { id: 'grateful', emoji: '🙏', label: 'Grateful' }
  ];

  const toggleMood = (moodId) => {
    setSelectedMoods(prev => {
      if (prev.includes(moodId)) {
        return prev.filter(id => id !== moodId);
      } else {
        return [...prev, moodId];
      }
    });
  };

  // Helper to format thought categories for display
  const getThoughtLabels = () => {
    const thoughtMap = {
      'work': { label: 'Work', emoji: '💼' },
      'relationship': { label: 'Relationship', emoji: '💕' },
      'self': { label: 'Self', emoji: '🪞' },
      'family': { label: 'Family', emoji: '👨‍👩‍👧‍👦' },
      'health': { label: 'Health', emoji: '🏥' },
      'future': { label: 'Future', emoji: '🔮' },
      'other': { label: 'Other', emoji: '💭' }
    };

    const thoughts = Array.isArray(triageAnswers.thoughts) 
      ? triageAnswers.thoughts 
      : [triageAnswers.thoughts];

    return thoughts
      .filter(t => t && thoughtMap[t])
      .map(t => `${thoughtMap[t].emoji} ${thoughtMap[t].label}`);
  };

  // Helper to format body locations for display
  const getBodyLocationLabels = () => {
    const locationMap = {
      'tense_shoulders': { label: 'Tense Shoulders', emoji: '😣' },
      'jittery_stomach': { label: 'Jittery Stomach', emoji: '🦋' },
      'tight_chest': { label: 'Tight Chest', emoji: '😮‍💨' },
      'racing_heart': { label: 'Racing Heart', emoji: '💓' },
      'heavy_head': { label: 'Heavy Head', emoji: '🤯' },
      'calm_body': { label: 'Calm & Centered', emoji: '😌' },
      'tired_everywhere': { label: 'Tired Everywhere', emoji: '😴' }
    };

    const locations = Array.isArray(triageAnswers.bodyLocations) 
      ? triageAnswers.bodyLocations 
      : [triageAnswers.bodyLocations];

    return locations
      .filter(l => l && locationMap[l])
      .map(l => `${locationMap[l].emoji} ${locationMap[l].label}`);
  };

  const handleSave = async () => {
    if (!reflectionText.trim() || selectedMoods.length === 0) {
      setError('Please share a thought and choose at least one feeling.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const now = new Date();
      
      // Create the entry document (following Firebase flat structure)
      const entryData = {
        authorUid: currentUser.uid,
        text: reflectionText.trim(),
        mood: selectedMoods[0], // Primary mood for backward compatibility
        moods: selectedMoods, // All selected moods
        createdAt: serverTimestamp(),
        createdDate: now.toISOString().split('T')[0], // YYYY-MM-DD
        createdMonth: now.getMonth() + 1,
        createdDay: now.getDate(),
        entryType: 'daily_reflection',
        
        // Meditation context (flat structure)
        meditationType: meditation.id,
        meditationName: meditation.name,
        meditationDuration: meditation.duration,
        
        // Triage context (updated to support arrays)
        thoughtCategories: triageAnswers.thoughtCategories || [],
        thoughts: triageAnswers.thoughts || [],
        bodyLocations: triageAnswers.bodyLocations || [],
        
        // Optional fields for future use
        photoUrl: null,
        tags: []
      };

      // Save entry to Firestore
      await addDoc(collection(db, 'entries'), entryData);

      // Update user stats (increment counters)
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        totalReflections: increment(1),
        totalCheckIns: increment(1),
        currentPlantCheckIns: increment(1),
        currentPlantProgress: increment(1)
      });

      // Call completion handler
      onComplete({
        entry: entryData,
        mood: selectedMoods[0],
        moods: selectedMoods
      });

    } catch (err) {
      console.error('Error saving reflection:', err);
      setError('A small hiccup. Let\'s try that again gently.');
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-nunito text-2xl font-bold text-purple-900 mb-2">
          How are you feeling now?
        </h1>
        <p className="font-nunito text-lg text-purple-700">
          Take a moment to capture this feeling.
        </p>
      </div>

      {/* Mood Selection */}
      <div className="mb-6">
        <h2 className="font-nunito text-lg font-bold text-purple-900 mb-3">
          Right now, I feel... <span className="text-sm font-normal text-purple-600">(select all that apply)</span>
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {moods.map((moodOption) => (
            <button
              key={moodOption.id}
              onClick={() => toggleMood(moodOption.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedMoods.includes(moodOption.id)
                  ? 'border-purple-600 bg-purple-50 shadow-md'
                  : 'border-purple-200 bg-white hover:border-purple-400'
              }`}
            >
              <div className="text-3xl mb-1">{moodOption.emoji}</div>
              <div className="font-nunito text-sm font-semibold text-purple-900">
                {moodOption.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Context Summary - What you were feeling before */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5 mb-6">
        <h3 className="font-nunito text-sm font-bold text-purple-900 mb-3 uppercase tracking-wide">
          Before you meditated
        </h3>
        
        <div className="space-y-3">
          <div>
            <p className="font-nunito text-xs font-semibold text-purple-700 mb-1">
              What was weighing on you:
            </p>
            <div className="flex flex-wrap gap-2">
              {getThoughtLabels().map((label, idx) => (
                <span key={idx} className="font-nunito text-sm bg-white px-3 py-1 rounded-full text-purple-800 border border-purple-200">
                  {label}
                </span>
              ))}
              {triageAnswers.customThought && (
                <span className="font-nunito text-sm bg-white px-3 py-1 rounded-full text-purple-800 border border-purple-200 italic">
                  "{triageAnswers.customThought}"
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="font-nunito text-xs font-semibold text-purple-700 mb-1">
              Where you felt it in your body:
            </p>
            <div className="flex flex-wrap gap-2">
              {getBodyLocationLabels().map((label, idx) => (
                <span key={idx} className="font-nunito text-sm bg-white px-3 py-1 rounded-full text-purple-800 border border-purple-200">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-purple-200">
            <p className="font-nunito text-xs font-semibold text-purple-700 mb-1">
              You chose to practice:
            </p>
            <span className="font-nunito text-sm bg-purple-600 text-white px-3 py-1 rounded-full inline-block">
              {meditation.emoji} {meditation.name} ({meditation.duration} min)
            </span>
          </div>
        </div>
      </div>

      {/* Reflection Text */}
      <div className="mb-6">
        <h2 className="font-nunito text-lg font-bold text-purple-900 mb-3">
          What's on your mind?
        </h2>
        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="Let your thoughts flow. There's no right or wrong here..."
          rows={8}
          className="w-full p-4 rounded-xl border-2 border-purple-200 bg-white focus:border-purple-400 focus:ring-0 font-nunito resize-none"
        />
        <p className="font-nunito text-sm text-purple-700 mt-2">
          This is just for you. Write as much or as little as feels right.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <p className="font-nunito text-red-700">{error}</p>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving || !reflectionText.trim() || selectedMoods.length === 0}
        className={`w-full p-4 rounded-xl text-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 ${
          isSaving || !reflectionText.trim() || selectedMoods.length === 0
            ? 'bg-purple-200 text-purple-700 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {isSaving ? 'Saving your reflection...' : 'Save my thought'}
      </button>
    </div>
  );
}

export default PostReflection;
