/**
 * MeditationSelection Component
 * 
 * Suggests meditations based on triage answers.
 * User can choose from 2-3 recommended meditations.
 */

import { ChevronLeftIcon } from '@heroicons/react/24/outline';

function MeditationSelection({ triageAnswers, onSelect, onBack }) {
  // Meditation library with different types
  const meditations = {
    body_scan: {
      id: 'body_scan',
      name: 'Body Scan',
      duration: 5,
      description: 'Ground yourself by bringing awareness to each part of your body.',
      emoji: '🧘',
      matchKeywords: ['tense_shoulders', 'tight_chest', 'tired_everywhere', 'jittery_stomach']
    },
    breath_focus: {
      id: 'breath_focus',
      name: 'Breath Focus',
      duration: 5,
      description: 'Find calm through the simple rhythm of your breathing.',
      emoji: '🌬️',
      matchKeywords: ['racing_heart', 'jittery_stomach', 'tight_chest']
    },
    thought_observation: {
      id: 'thought_observation',
      name: 'Thought Observation',
      duration: 6,
      description: 'Watch your thoughts pass like clouds, without judgment.',
      emoji: '☁️',
      matchKeywords: ['work', 'future', 'self', 'heavy_head']
    },
    loving_kindness: {
      id: 'loving_kindness',
      name: 'Loving Kindness',
      duration: 7,
      description: 'Cultivate compassion for yourself and others.',
      emoji: '💝',
      matchKeywords: ['relationship', 'family', 'self']
    },
    grounding: {
      id: 'grounding',
      name: '5-4-3-2-1 Grounding',
      duration: 5,
      description: 'Connect with the present moment through your senses.',
      emoji: '🌿',
      matchKeywords: ['racing_heart', 'heavy_head', 'work']
    }
  };

  // Smart meditation recommendation logic
  const getSuggestedMeditations = () => {
    const { thoughtCategories = [], bodyLocations = [] } = triageAnswers;
    const allMeditations = Object.values(meditations);
    
    // Score each meditation based on how well it matches
    const scored = allMeditations.map(meditation => {
      let score = 0;
      
      // Check if any body location matches
      bodyLocations.forEach(location => {
        if (meditation.matchKeywords.includes(location)) {
          score += 2;
        }
      });
      
      // Check if any thought category matches
      thoughtCategories.forEach(category => {
        if (meditation.matchKeywords.includes(category)) {
          score += 2;
        }
      });
      
      return { ...meditation, score };
    });

    // Sort by score and return top 3
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  };

  const suggestions = getSuggestedMeditations();
  const topSuggestion = suggestions[0];
  const otherSuggestions = suggestions.slice(1);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="p-2 text-purple-900 hover:bg-orange-100 rounded-lg transition-colors mr-3"
          aria-label="Go back"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="font-nunito text-2xl font-bold text-purple-900">
          Choose a meditation
        </h1>
      </div>

      {/* Context Message */}
      <div className="bg-orange-100 rounded-2xl p-4 mb-6">
        <p className="font-nunito text-lg text-purple-800">
          Based on what you shared, here are some meditations that might help.
        </p>
      </div>

      {/* Top Recommendation */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <span className="font-nunito text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            Recommended for you
          </span>
        </div>
        <button
          onClick={() => onSelect(topSuggestion)}
          className="w-full bg-white rounded-2xl shadow-md p-6 border-2 border-purple-400 hover:border-purple-600 transition-all duration-200 text-left hover:shadow-lg transform hover:scale-[1.02]"
        >
          <div className="flex items-start">
            <div className="text-4xl mr-4">{topSuggestion.emoji}</div>
            <div className="flex-1">
              <h3 className="font-nunito text-xl font-bold text-purple-900 mb-1">
                {topSuggestion.name}
              </h3>
              <p className="font-nunito text-purple-700 mb-2">
                {topSuggestion.description}
              </p>
              <p className="font-nunito text-sm text-purple-600 font-semibold">
                {topSuggestion.duration} minutes
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Other Options */}
      <div className="space-y-3">
        <p className="font-nunito text-sm font-semibold text-purple-700 mb-3">
          Other options
        </p>
        {otherSuggestions.map((meditation) => (
          <button
            key={meditation.id}
            onClick={() => onSelect(meditation)}
            className="w-full bg-white rounded-xl shadow-sm p-5 border-2 border-purple-200 hover:border-purple-400 transition-all duration-200 text-left hover:shadow-md"
          >
            <div className="flex items-start">
              <div className="text-3xl mr-3">{meditation.emoji}</div>
              <div className="flex-1">
                <h3 className="font-nunito text-lg font-bold text-purple-900 mb-1">
                  {meditation.name}
                </h3>
                <p className="font-nunito text-sm text-purple-700 mb-1">
                  {meditation.description}
                </p>
                <p className="font-nunito text-xs text-purple-600 font-semibold">
                  {meditation.duration} minutes
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MeditationSelection;
