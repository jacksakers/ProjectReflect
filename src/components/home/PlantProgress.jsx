/**
 * PlantProgress Component
 * 
 * Displays the current plant's growth progress with:
 * - Plant image (with emoji fallback)
 * - Stage name and plant type
 * - Progress bar
 * - Points information
 */

import { useState, useEffect } from 'react';
import { usePlantGrowth } from '../../hooks/usePlantGrowth';
import { getStageName, getProgressPercentage, getPointsToNextStage, getPlantImageUrl } from '../../utils/plantGrowth';

function PlantProgress() {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const { currentPlant, plantType, isLoading, getCurrentStage } = usePlantGrowth();
  
  // Get current stage and plant info
  const currentStage = getCurrentStage();
  const stageName = getStageName(currentStage);
  const progressPercent = currentPlant 
    ? getProgressPercentage(currentPlant.currentPoints, currentPlant.maxPoints)
    : 0;
  const pointsToNext = currentPlant 
    ? getPointsToNextStage(currentPlant.currentPoints, currentPlant.maxPoints)
    : 0;
  
  // Stage emojis as fallback
  const stageEmojis = ['🌰', '🌱', '🌿', '🌺', '🌸'];
  const currentEmoji = stageEmojis[currentStage] || '🌱';
  
  // Load image URL when plant or stage changes
  useEffect(() => {
    if (plantType && currentPlant) {
      console.log('PlantProgress - plantType:', plantType);
      console.log('PlantProgress - currentPlant:', currentPlant);
      
      // Get image URL asynchronously
      getPlantImageUrl(
        currentPlant.plantId, 
        currentStage, 
        plantType.storageFolder || plantType.storagePath || null
      ).then((url) => {
        console.log('PlantProgress - loaded imageUrl:', url);
        setImageUrl(url);
        setImageError(false);
      }).catch((err) => {
        console.error('PlantProgress - error loading image:', err);
        setImageUrl(null);
        setImageError(true);
      });
    } else {
      setImageUrl(null);
    }
  }, [plantType, currentPlant, currentStage]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="text-center">
        {isLoading ? (
          <div className="text-6xl mb-4">⏳</div>
        ) : imageUrl && !imageError ? (
          // Show image with fallback to emoji on error
          <div className="mb-4 flex justify-center">
            <img 
              src={imageUrl}
              alt={`${stageName} stage`}
              className="w-24 h-24 object-contain"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          // Fallback to emoji if no image or image failed
          <div className="text-6xl mb-4">{currentEmoji}</div>
        )}
        
        <h2 className="font-nunito text-xl font-bold text-purple-900 mb-2">
          {isLoading ? 'Loading your garden...' : 
           plantType ? `${stageName}: A ${plantType.name} is growing!` :
           `${stageName}: Your plant is growing!`}
        </h2>
        
        {!isLoading && currentPlant && (
          <>
            <div className="w-full bg-orange-100 rounded-full h-3 mb-2">
              <div 
                className="bg-purple-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="font-nunito text-sm text-purple-700">
              {currentPlant.currentPoints} check-in points • {pointsToNext > 0 ? `${pointsToNext} to next stage` : 'Ready to bloom!'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default PlantProgress;
