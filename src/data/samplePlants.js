/**
 * Sample Plant Types Data
 * 
 * This file contains the initial plant types that should be added to the
 * plant_types collection in Firestore. You can add these manually through
 * the Firebase Console or use a one-time script.
 * 
 * Instructions:
 * 1. Go to Firebase Console > Firestore Database
 * 2. Create a collection called "plant_types"
 * 3. Add documents with the data below (use the ID as the document ID)
 */

export const SAMPLE_PLANT_TYPES = [
  {
    id: 'cosmic_rose',
    name: 'Cosmic Rose',
    description: 'A mystical rose that blooms with the energy of the stars.',
    pointsToBloom: 30,
    difficulty: 'medium',
    rarity: 'rare',
    isActive: true
  },
  {
    id: 'golden_fern',
    name: 'Golden Fern',
    description: 'A delicate fern with leaves that shimmer like gold.',
    pointsToBloom: 20,
    difficulty: 'easy',
    rarity: 'common',
    isActive: true
  },
  {
    id: 'midnight_lily',
    name: 'Midnight Lily',
    description: 'A rare lily that blooms under the light of the moon.',
    pointsToBloom: 40,
    difficulty: 'hard',
    rarity: 'rare',
    isActive: true
  },
  {
    id: 'sunrise_tulip',
    name: 'Sunrise Tulip',
    description: 'A vibrant tulip that captures the colors of dawn.',
    pointsToBloom: 25,
    difficulty: 'medium',
    rarity: 'common',
    isActive: true
  },
  {
    id: 'crystal_orchid',
    name: 'Crystal Orchid',
    description: 'An elegant orchid with petals like precious gems.',
    pointsToBloom: 35,
    difficulty: 'medium',
    rarity: 'rare',
    isActive: true
  },
  {
    id: 'rainbow_daisy',
    name: 'Rainbow Daisy',
    description: 'A cheerful daisy that displays all the colors of the rainbow.',
    pointsToBloom: 18,
    difficulty: 'easy',
    rarity: 'common',
    isActive: true
  },
  {
    id: 'phoenix_bloom',
    name: 'Phoenix Bloom',
    description: 'A legendary flower that rises from the ashes of adversity.',
    pointsToBloom: 50,
    difficulty: 'hard',
    rarity: 'legendary',
    isActive: true
  },
  {
    id: 'tranquil_lotus',
    name: 'Tranquil Lotus',
    description: 'A peaceful lotus that brings serenity to all who see it.',
    pointsToBloom: 28,
    difficulty: 'medium',
    rarity: 'uncommon',
    isActive: true
  }
];

/**
 * To add these to Firestore, you can either:
 * 
 * Option 1: Manual Entry (Recommended for now)
 * - Go to Firebase Console
 * - Navigate to Firestore Database
 * - Create collection "plant_types"
 * - For each plant above, create a document with:
 *   - Document ID: use the 'id' field (e.g., 'cosmic_rose')
 *   - Fields: copy all other fields (name, description, etc.)
 * 
 * Option 2: One-time Import Script
 * - You could create a one-time admin script that uses the Firebase Admin SDK
 * - This would be useful if you have many plants to add
 * 
 * Option 3: Cloud Function
 * - Create a callable Cloud Function that initializes the database
 * - Call it once during setup
 */
