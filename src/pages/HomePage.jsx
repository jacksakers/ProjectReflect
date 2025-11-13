/**
 * HomePage Component
 * 
 * The "Present" - Main hub showing:
 * - Current plant progress
 * - Primary CTA: Start Daily Reflection
 * - Secondary CTA: Log a Quick Thought
 * - "On This Day" module
 * - Today's Question module
 */

import { useState } from 'react';
import ReflectionFlow from '../components/reflection/ReflectionFlow';
import QuickThought from '../components/QuickThought';

function HomePage() {
  const [showReflectionFlow, setShowReflectionFlow] = useState(false);
  const [showQuickThought, setShowQuickThought] = useState(false);
  
  const handleReflectionComplete = (reflectionData) => {
    console.log('Reflection completed:', reflectionData);
    setShowReflectionFlow(false);
    // Could add a success toast or update plant progress here
  };

  if (showReflectionFlow) {
    return (
      <ReflectionFlow 
        onComplete={handleReflectionComplete}
        onClose={() => setShowReflectionFlow(false)}
      />
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Plant Progress Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="font-nunito text-xl font-bold text-purple-900 mb-2">
            Day 5: Your sprout is growing!
          </h2>
          <div className="w-full bg-orange-100 rounded-full h-3 mb-2">
            <div className="bg-purple-600 h-3 rounded-full" style={{ width: '35%' }}></div>
          </div>
          <p className="font-nunito text-sm text-purple-700">7 check-ins • 23 to flower</p>
        </div>
      </div>

      {/* Primary CTA */}
      <button 
        onClick={() => setShowReflectionFlow(true)}
        className="w-full p-4 bg-purple-600 text-white rounded-xl text-lg 
          font-bold shadow-md transition-all duration-200 transform active:scale-95 
          hover:bg-purple-700"
      >
        Start a Reflection
      </button>

      {/* Secondary CTA */}
      <button 
        onClick={() => setShowQuickThought(true)}
        className="w-full p-4 bg-purple-400 text-white rounded-xl text-lg 
          font-bold shadow-md transition-all duration-200 transform active:scale-95 
          hover:bg-purple-500"
      >
        Log a Quick Thought
      </button>

      {/* Quick Thought Modal */}
      <QuickThought 
        isOpen={showQuickThought} 
        onClose={() => setShowQuickThought(false)} 
      />

      {/* On This Day Module */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-nunito text-lg font-bold text-purple-900 mb-3">
          On This Day
        </h3>
        <p className="font-nunito text-purple-700 italic">
          No entries from previous years on this day... yet.
        </p>
      </div>

      {/* Today's Question Module */}
      <div className="bg-orange-100 rounded-2xl shadow-sm p-6">
        <h3 className="font-nunito text-sm font-bold text-purple-900 mb-2">
          An idea for you...
        </h3>
        <p className="font-nunito text-lg text-purple-800">
          What made you smile today?
        </p>
      </div>
    </div>
  );
}

export default HomePage;
