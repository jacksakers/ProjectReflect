/**
 * CreateTimeCapsule Component
 * 
 * Modal for creating time capsule messages:
 * - Write message text
 * - Select seal duration
 * - Optional mood/category tags
 * - Toggle reply section option
 */

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function CreateTimeCapsule({ isOpen, onClose, onSave }) {
  const [message, setMessage] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('1-month');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [includeReply, setIncludeReply] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const durations = [
    { id: '1-week', label: '1 Week', days: 7 },
    { id: '1-month', label: '1 Month', days: 30 },
    { id: '3-months', label: '3 Months', days: 90 },
    { id: '6-months', label: '6 Months', days: 180 },
    { id: '1-year', label: '1 Year', days: 365 },
    { id: '2-years', label: '2 Years', days: 730 },
  ];

  const moods = [
    { id: 'hopeful', emoji: '🌟', label: 'Hopeful' },
    { id: 'curious', emoji: '🤔', label: 'Curious' },
    { id: 'grateful', emoji: '🙏', label: 'Grateful' },
    { id: 'anxious', emoji: '😰', label: 'Anxious' },
    { id: 'excited', emoji: '✨', label: 'Excited' },
    { id: 'reflective', emoji: '🪞', label: 'Reflective' },
  ];

  const categories = [
    { id: 'work', emoji: '💼', label: 'Work' },
    { id: 'relationship', emoji: '💕', label: 'Relationship' },
    { id: 'self', emoji: '🪞', label: 'Self' },
    { id: 'dreams', emoji: '🔮', label: 'Dreams' },
    { id: 'gratitude', emoji: '✨', label: 'Gratitude' },
    { id: 'question', emoji: '❓', label: 'Question' },
  ];

  const calculateOpenDate = () => {
    const duration = durations.find(d => d.id === selectedDuration);
    const openDate = new Date();
    openDate.setDate(openDate.getDate() + duration.days);
    return openDate;
  };

  const formatOpenDate = () => {
    const date = calculateOpenDate();
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleSave = async () => {
    if (!message.trim()) return;

    setIsSaving(true);
    
    const capsuleData = {
      text: message.trim(),
      mood: selectedMood,
      category: selectedCategory,
      includeReply,
      openDate: calculateOpenDate()
    };

    const result = await onSave(capsuleData);
    
    if (result.success) {
      // Reset form
      setMessage('');
      setSelectedDuration('1-month');
      setSelectedMood('');
      setSelectedCategory('');
      setIncludeReply(false);
      onClose();
    }
    
    setIsSaving(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center 
                    z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[76vh] 
                        overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-purple-100 p-5 pb-2
                        flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="font-nunito text-2xl font-bold text-purple-900">
              💌 Message to Future You
            </h2>
            <p className="font-nunito text-sm text-purple-700">
              Will open on {formatOpenDate()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 pt-2">
          {/* Message Text */}
          <div>
            <label className="block font-nunito text-lg font-bold text-purple-900 mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="What do you want to tell or ask your future self?"
              className="w-full p-4 rounded-xl border-2 border-purple-200 focus:border-purple-600 focus:outline-none font-nunito text-lg text-purple-900 resize-none"
              rows="8"
              autoFocus
            />
            <p className="font-nunito text-sm text-purple-600 mt-2">
              💡 Tip: Ask a question, share a hope, or document this moment
            </p>
          </div>

          {/* Seal Duration */}
          <div>
            <label className="block font-nunito text-lg font-bold text-purple-900 mb-3">
              How long to seal it?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {durations.map((duration) => (
                <button
                  key={duration.id}
                  onClick={() => setSelectedDuration(duration.id)}
                  className={`p-3 rounded-xl font-nunito font-semibold transition-all ${
                    selectedDuration === duration.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reply Section Toggle */}
          <div className="bg-purple-50 rounded-xl p-4">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={includeReply}
                onChange={(e) => setIncludeReply(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="ml-3">
                <span className="font-nunito font-bold text-purple-900 block">
                  Include a reply section
                </span>
                <span className="font-nunito text-sm text-purple-700">
                  Add space to answer your own question when this opens
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-purple-100 p-6 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 p-4 bg-purple-100 text-purple-700 rounded-xl font-nunito text-lg font-bold hover:bg-purple-200 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!message.trim() || isSaving}
            className="flex-1 p-4 bg-purple-600 text-white rounded-xl font-nunito text-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Sealing...' : '🔒 Seal Message'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTimeCapsule;
