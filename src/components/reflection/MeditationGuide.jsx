/**
 * MeditationGuide Component
 * 
 * Displays meditation text with proper pacing.
 * Shows progress and allows user to complete when ready.
 * Plays a bell sound when new instructions appear (can be muted).
 */

import { useState, useEffect, useRef } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

function MeditationGuide({ meditation, onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    // Load mute preference from localStorage
    const saved = localStorage.getItem('meditationBellMuted');
    return saved === 'true';
  });
  
  const audioRef = useRef(null);
  const endBellRef = useRef(null);

  // Meditation scripts based on type
  const meditationScripts = {
    body_scan: [
      {
        title: "Find your space",
        text: "Get comfortable. You can sit or lie down. Close your eyes if that feels right, or soften your gaze.",
        duration: 30
      },
      {
        title: "Begin with breath",
        text: "Take three deep breaths. In through your nose, out through your mouth. Feel your body settle.",
        duration: 45
      },
      {
        title: "Your feet",
        text: "Bring your awareness to your feet. Notice any sensations. Warmth, coolness, tingling, or nothing at all. All of it is okay.",
        duration: 40
      },
      {
        title: "Up through your legs",
        text: "Slowly move your attention up. Your ankles, calves, knees, thighs. Just noticing. No need to change anything.",
        duration: 45
      },
      {
        title: "Your core",
        text: "Notice your stomach, your chest. Feel them rise and fall with each breath. This is your anchor.",
        duration: 40
      },
      {
        title: "Your shoulders and arms",
        text: "Bring awareness to your shoulders. Are they holding tension? Your arms, your hands. Just observe.",
        duration: 40
      },
      {
        title: "Your face and head",
        text: "Notice your jaw, your face, the top of your head. Let everything soften, just a little.",
        duration: 35
      },
      {
        title: "Whole body",
        text: "Now feel your whole body at once. Breathing, present, here. You did this. Well done.",
        duration: 30
      }
    ],
    breath_focus: [
      {
        title: "Settle in",
        text: "Find a comfortable position. Let your body relax. Place one hand on your chest, one on your belly.",
        duration: 30
      },
      {
        title: "Natural breathing",
        text: "Don't change your breath yet. Just notice it. Is it fast? Slow? Shallow? Deep? No judgment.",
        duration: 40
      },
      {
        title: "Counting breaths",
        text: "Breathe in for 1... 2... 3... 4. Hold gently. Out for 1... 2... 3... 4... 5... 6. Again.",
        duration: 50
      },
      {
        title: "Following the breath",
        text: "Feel the cool air as you breathe in. The warm air as you breathe out. In. Out. Simple.",
        duration: 45
      },
      {
        title: "When your mind wanders",
        text: "Your mind will wander. That's what minds do. When you notice, gently return to your breath. No frustration.",
        duration: 40
      },
      {
        title: "The rhythm",
        text: "Your breath is always with you. It's a friend. Trust it. Return to it. In. Out.",
        duration: 45
      },
      {
        title: "Coming back",
        text: "Take three more deep breaths. Wiggle your fingers. Open your eyes when you're ready.",
        duration: 30
      }
    ],
    thought_observation: [
      {
        title: "Get grounded",
        text: "Sit comfortably. Feel the weight of your body. You are here. Right now. That's all you need.",
        duration: 30
      },
      {
        title: "Notice the thoughts",
        text: "Thoughts are happening. That's okay. You don't need to stop them. Just notice them arriving.",
        duration: 40
      },
      {
        title: "Clouds in the sky",
        text: "Imagine each thought is a cloud. It floats into view. You see it. Then it floats away. You don't grab it.",
        duration: 45
      },
      {
        title: "The loud thought",
        text: "There might be one loud thought. The one that keeps coming back. Just say 'I see you' and let it pass again.",
        duration: 45
      },
      {
        title: "You are not your thoughts",
        text: "You are the sky, not the clouds. The thoughts come and go. You remain. Steady. Whole.",
        duration: 40
      },
      {
        title: "Gentle return",
        text: "When you're ready, take a deep breath. Feel your body. You practiced watching. That's enough.",
        duration: 35
      }
    ],
    loving_kindness: [
      {
        title: "Find your center",
        text: "Close your eyes. Place a hand on your heart. Feel its beat. This is where we start.",
        duration: 30
      },
      {
        title: "For yourself",
        text: "Say quietly: 'May I be safe. May I be peaceful. May I be kind to myself.' Mean it.",
        duration: 45
      },
      {
        title: "Someone you love",
        text: "Think of someone you care about. See their face. 'May you be safe. May you be peaceful. May you be happy.'",
        duration: 50
      },
      {
        title: "Someone neutral",
        text: "Think of someone you don't know well. A neighbor. A cashier. Extend the same wish. 'May you be safe.'",
        duration: 45
      },
      {
        title: "Someone difficult",
        text: "If you're ready, think of someone who challenges you. This is hard. 'May you be peaceful.' You don't have to mean it fully. The practice is the point.",
        duration: 50
      },
      {
        title: "For everyone",
        text: "Now expand it outward. Everyone. 'May all beings be safe. May all beings be peaceful. May all beings be loved.'",
        duration: 45
      },
      {
        title: "Back to you",
        text: "Return your hand to your heart. 'May I be loved.' You did something brave today.",
        duration: 30
      }
    ],
    grounding: [
      {
        title: "Right now",
        text: "This is about the present moment. Not the past. Not the future. Just now.",
        duration: 30
      },
      {
        title: "5 things you see",
        text: "Look around. Name 5 things you can see. Say them out loud or in your mind. A chair. A light. Your hand.",
        duration: 40
      },
      {
        title: "4 things you can touch",
        text: "Notice 4 things you can physically feel. The floor under your feet. Your clothes. The air on your skin.",
        duration: 40
      },
      {
        title: "3 things you hear",
        text: "Listen. What are 3 sounds? Traffic? A hum? Your own breath? Just listen.",
        duration: 40
      },
      {
        title: "2 things you can smell",
        text: "Can you notice 2 scents? Fresh or stale air? Soap? Fabric? Bring your attention to your nose.",
        duration: 40
      },
      {
        title: "1 thing you can taste",
        text: "What can you taste right now? Even if it's just the inside of your mouth. Notice it.",
        duration: 35
      },
      {
        title: "You are here",
        text: "You did it. You came back to now. Whenever you feel unmoored, you can return here. 5, 4, 3, 2, 1.",
        duration: 30
      }
    ]
  };

  const script = meditationScripts[meditation.id] || meditationScripts.breath_focus;
  const totalPhases = script.length;
  const currentStep = script[currentPhase];

  // Play bell sound when phase changes
  useEffect(() => {
    if (!isMuted && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Audio playback failed:', err);
      });
    }
  }, [currentPhase, isMuted]);

  // Save mute preference to localStorage
  useEffect(() => {
    localStorage.setItem('meditationBellMuted', isMuted.toString());
  }, [isMuted]);

  // Timer effect
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Auto-advance to next phase based on duration
  useEffect(() => {
    if (isPaused) return;
    
    if (timeElapsed >= currentStep.duration && currentPhase < totalPhases - 1) {
      setCurrentPhase(prev => prev + 1);
      setTimeElapsed(0);
    }
  }, [timeElapsed, currentPhase, totalPhases, currentStep.duration, isPaused]);

  // Play end bell when meditation completes
  useEffect(() => {
    if (currentPhase === totalPhases - 1 && timeElapsed >= currentStep.duration) {
      if (!isMuted && endBellRef.current) {
        endBellRef.current.play().catch(err => {
          console.log('End bell playback failed:', err);
        });
      }
    }
  }, [currentPhase, totalPhases, timeElapsed, currentStep.duration, isMuted]);

  const progress = ((currentPhase + 1) / totalPhases) * 100;
  const isComplete = currentPhase === totalPhases - 1;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = script.reduce((sum, phase) => sum + phase.duration, 0);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col justify-between">
      {/* Hidden audio elements */}
      <audio ref={audioRef} src="/meditation-bell.mp3" preload="auto" />
      <audio ref={endBellRef} src="/end-bell.mp3" preload="auto" />
      
      {/* Top Section - Progress */}
      <div>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="font-nunito text-sm text-purple-700">
              {meditation.name}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-nunito text-sm text-purple-700">
                {formatTime(timeElapsed + (currentPhase * 40))} / {formatTime(totalDuration)}
              </span>
              {/* Mute button */}
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg hover:bg-orange-200 transition-colors"
                aria-label={isMuted ? 'Unmute bell' : 'Mute bell'}
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="w-5 h-5 text-purple-700" />
                ) : (
                  <SpeakerWaveIcon className="w-5 h-5 text-purple-700" />
                )}
              </button>
            </div>
          </div>
          <div className="w-full bg-orange-100 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Phase indicator */}
        <div className="text-center mb-4">
          <span className="font-nunito text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            {currentPhase + 1} of {totalPhases}
          </span>
        </div>
      </div>

      {/* Middle Section - Meditation Text */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-xl">
          <h2 className="font-nunito text-2xl font-bold text-purple-900 mb-6">
            {currentStep.title}
          </h2>
          <p className="font-nunito text-xl text-purple-800 leading-relaxed">
            {currentStep.text}
          </p>
        </div>
      </div>

      {/* Bottom Section - Controls */}
      <div className="space-y-3 mt-6">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="w-full p-4 bg-purple-300 text-white rounded-xl text-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 hover:bg-purple-500"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>

        {isComplete && (
          <button
            onClick={onComplete}
            className="w-full p-4 bg-purple-600 text-white rounded-xl text-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 hover:bg-purple-700"
          >
            Continue to Reflection
          </button>
        )}

        {!isComplete && currentPhase < totalPhases - 1 && (
          <button
            onClick={() => {
              setCurrentPhase(prev => prev + 1);
              setTimeElapsed(0);
            }}
            className="w-full p-3 text-purple-600 hover:bg-orange-100 rounded-xl text-sm font-semibold transition-colors"
          >
            Skip to next phase
          </button>
        )}
      </div>
    </div>
  );
}

export default MeditationGuide;
