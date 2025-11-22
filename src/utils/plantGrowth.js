import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * Plant Growth Utilities
 * 
 * Handles all plant growth calculations, stage progression,
 * and seed queue management for the garden gamification system.
 */

/**
 * Calculate the current plant stage (0-4) based on points
 * @param {number} currentPoints - Points accumulated for current plant
 * @param {number} maxPoints - Total points needed to bloom
 * @returns {number} Stage (0=seed, 1=sprout, 2=bud, 3=bloomed)
 */
export const getPlantStage = (currentPoints, maxPoints) => {
  if (currentPoints <= 0) return 0;
  if (currentPoints >= maxPoints) return 3;
  
  const progress = currentPoints / maxPoints;
  
  if (progress < 0.2) return 0;      // seed
  if (progress < 0.4) return 1;      // sprout
  if (progress < 1.0) return 2;      // bud
  return 3;                           // bloomed
};

/**
 * Get the filename for the current stage
 * @param {number} stage - Stage number (0-4)
 * @returns {string} Filename (e.g., 'sprout.png')
 */
export const getStageFilename = (stage) => {
  const filenames = ['seed.png', 'sprout.png', 'bud.png', 'bloomed.png'];
  return filenames[stage] || 'seed.png';
};

/**
 * Get the display name for a stage
 * @param {number} stage - Stage number (0-4)
 * @returns {string} Display name
 */
export const getStageName = (stage) => {
  const names = ['Seed', 'Sprout', 'Bud', 'Bloomed'];
  return names[stage] || 'Seed';
};

/**
 * Shuffle an array (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get plant image URL with error handling
 * @param {string} plantId - Plant identifier (e.g., 'pinkadilly')
 * @param {number} stage - Current stage (0-3)
 * @param {string} storageFolder - Optional storage folder path from plant_types document
 * @returns {Promise<string|null>} Image URL or null if unavailable
 */
export const getPlantImageUrl = async (plantId, stage, storageFolder = null) => {
  if (!plantId) return null;

  console.log('Getting image URL for plantId:', plantId, 'stage:', stage, 'storageFolder:', storageFolder);
  
  try {
    const filename = getStageFilename(stage);
    // Use storageFolder if provided, otherwise use plantId
    const folder = storageFolder || plantId;
    
    // Create reference to the file in Firebase Storage
    const path = `game_assets/plants/${folder}/${filename}`;
    const imageRef = ref(storage, path);
    
    // Get the download URL with token
    const url = await getDownloadURL(imageRef);
    console.log('Generated image URL:', url);
    
    return url;
  } catch (error) {
    console.error('Error getting image URL:', error);
    return null;
  }
};

/**
 * Calculate progress percentage
 * @param {number} currentPoints - Current points
 * @param {number} maxPoints - Maximum points needed
 * @returns {number} Percentage (0-100)
 */
export const getProgressPercentage = (currentPoints, maxPoints) => {
  if (maxPoints <= 0) return 0;
  return Math.min(100, Math.round((currentPoints / maxPoints) * 100));
};

/**
 * Get points to next stage
 * @param {number} currentPoints - Current points
 * @param {number} maxPoints - Maximum points
 * @returns {number} Points needed for next stage
 */
export const getPointsToNextStage = (currentPoints, maxPoints) => {
  const currentStage = getPlantStage(currentPoints, maxPoints);
  if (currentStage >= 4) return 0; // Already bloomed
  
  const nextStageThresholds = [
    Math.ceil(maxPoints * 0.2),  // to sprout
    Math.ceil(maxPoints * 0.4),  // to bud
    maxPoints                     // to bloom
  ];
  
  return nextStageThresholds[currentStage] - currentPoints;
};
