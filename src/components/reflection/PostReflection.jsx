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
  const [mood, setMood] = useState('');
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

  const handleSave = async () => {
    if (!reflectionText.trim() || !mood) {
      setError('Please share a thought and choose how you feel.');
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
        mood: mood,
        createdAt: serverTimestamp(),
        createdDate: now.toISOString().split('T')[0], // YYYY-MM-DD
        createdMonth: now.getMonth() + 1,
        createdDay: now.getDate(),
        entryType: 'daily_reflection',
        
        // Meditation context (flat structure)
        meditationType: meditation.id,
        meditationName: meditation.name,
        meditationDuration: meditation.duration,
        
        // Triage context (flat structure)
        thoughtCategory: triageAnswers.thoughtCategory,
        thoughtContent: triageAnswers.thought,
        bodyLocation: triageAnswers.bodyLocation,
        
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
        mood: mood
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
          Right now, I feel...
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {moods.map((moodOption) => (
            <button
              key={moodOption.id}
              onClick={() => setMood(moodOption.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                mood === moodOption.id
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

      {/* Context Summary */}
      <div className="bg-orange-100 rounded-xl p-4 mb-6">
        <p className="font-nunito text-sm text-purple-800">
          <strong>You reflected on:</strong> {triageAnswers.thought}
          <br />
          <strong>Meditation:</strong> {meditation.name} ({meditation.duration} min)
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving || !reflectionText.trim() || !mood}
        className={`w-full p-4 rounded-xl text-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 ${
          isSaving || !reflectionText.trim() || !mood
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
