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
 * @returns {number} Stage (0=seed, 1=sprout, 2=sapling, 3=bud, 4=bloomed)
 */
export const getPlantStage = (currentPoints, maxPoints) => {
  if (currentPoints <= 0) return 0;
  if (currentPoints >= maxPoints) return 4;
  
  const progress = currentPoints / maxPoints;
  
  if (progress < 0.2) return 0;      // seed
  if (progress < 0.4) return 1;      // sprout
  if (progress < 0.7) return 2;      // sapling
  if (progress < 1.0) return 3;      // bud
  return 4;                           // bloomed
};

/**
 * Get the filename for the current stage
 * @param {number} stage - Stage number (0-4)
 * @returns {string} Filename (e.g., 'sprout.png')
 */
export const getStageFilename = (stage) => {
  const filenames = ['seed.png', 'sprout.png', 'sapling.png', 'bud.png', 'bloomed.png'];
  return filenames[stage] || 'seed.png';
};

/**
 * Get the display name for a stage
 * @param {number} stage - Stage number (0-4)
 * @returns {string} Display name
 */
export const getStageName = (stage) => {
  const names = ['Seed', 'Sprout', 'Sapling', 'Budding', 'Bloomed'];
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
 * @param {string} plantId - Plant identifier
 * @param {number} stage - Current stage (0-4)
 * @returns {string|null} Image URL or null if unavailable
 */
export const getPlantImageUrl = (plantId, stage) => {
  if (!plantId) return null;
  
  const filename = getStageFilename(stage);
  // For Firebase Storage, construct the URL
  // This is a placeholder - you'll need to adjust based on your Firebase Storage setup
  return `https://firebasestorage.googleapis.com/v0/b/your-project-id.appspot.com/o/game_assets%2Fplants%2F${plantId}%2F${filename}?alt=media`;
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
    Math.ceil(maxPoints * 0.4),  // to sapling
    Math.ceil(maxPoints * 0.7),  // to bud
    maxPoints                     // to bloom
  ];
  
  return nextStageThresholds[currentStage] - currentPoints;
};
