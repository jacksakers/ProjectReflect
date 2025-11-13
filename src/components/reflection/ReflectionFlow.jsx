/**
 * ReflectionFlow Component
 * 
 * Orchestrates the daily reflection core loop:
 * 1. Triage Questions
 * 2. Meditation Selection
 * 3. Meditation Guide
 * 4. Post-Reflection Journal
 */

import { useState } from 'react';
import TriageQuestions from './TriageQuestions';
import MeditationSelection from './MeditationSelection';
import MeditationGuide from './MeditationGuide';
import PostReflection from './PostReflection';

const STEPS = {
  TRIAGE: 'triage',
  MEDITATION_SELECT: 'meditation_select',
  MEDITATION: 'meditation',
  POST_REFLECTION: 'post_reflection',
  COMPLETE: 'complete'
};

function ReflectionFlow({ onComplete, onClose }) {
  const [currentStep, setCurrentStep] = useState(STEPS.TRIAGE);
  const [triageAnswers, setTriageAnswers] = useState({});
  const [selectedMeditation, setSelectedMeditation] = useState(null);

  const handleTriageComplete = (answers) => {
    setTriageAnswers(answers);
    setCurrentStep(STEPS.MEDITATION_SELECT);
  };

  const handleMeditationSelected = (meditation) => {
    setSelectedMeditation(meditation);
    setCurrentStep(STEPS.MEDITATION);
  };

  const handleMeditationComplete = () => {
    setCurrentStep(STEPS.POST_REFLECTION);
  };

  const handleReflectionComplete = async (reflectionData) => {
    // This will save the complete entry to Firestore
    setCurrentStep(STEPS.COMPLETE);
    if (onComplete) {
      onComplete(reflectionData);
    }
  };

  return (
    <div className="fixed inset-0 bg-orange-50 z-50 overflow-y-auto">
      <div className="min-h-screen pt-16 pb-20">
        {currentStep === STEPS.TRIAGE && (
          <TriageQuestions 
            onComplete={handleTriageComplete}
            onClose={onClose}
          />
        )}

        {currentStep === STEPS.MEDITATION_SELECT && (
          <MeditationSelection 
            triageAnswers={triageAnswers}
            onSelect={handleMeditationSelected}
            onBack={() => setCurrentStep(STEPS.TRIAGE)}
          />
        )}

        {currentStep === STEPS.MEDITATION && (
          <MeditationGuide 
            meditation={selectedMeditation}
            onComplete={handleMeditationComplete}
          />
        )}

        {currentStep === STEPS.POST_REFLECTION && (
          <PostReflection 
            triageAnswers={triageAnswers}
            meditation={selectedMeditation}
            onComplete={handleReflectionComplete}
          />
        )}

        {currentStep === STEPS.COMPLETE && (
          <div className="max-w-2xl mx-auto px-4 py-12 text-center">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="font-nunito text-2xl font-bold text-purple-900 mb-4">
              Beautiful work
            </h2>
            <p className="font-nunito text-lg text-purple-700 mb-8">
              Your reflection has been saved. Your plant thanks you.
            </p>
            <button
              onClick={onClose}
              className="w-full max-w-md mx-auto p-4 bg-purple-600 text-white rounded-xl text-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 hover:bg-purple-700"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReflectionFlow;
