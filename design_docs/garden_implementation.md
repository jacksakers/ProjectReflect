# Garden Gamification System

## Overview
The garden gamification system rewards users for their mindfulness activities by growing virtual plants. Users earn points for reflections and quick thoughts, which nurture their current plant until it blooms. All completed plants are saved in their personal garden.

## Point System
- **Quick Thought**: 1 point
- **Full Reflection**: 2 points

## How It Works

### 1. Plant Growth Cycle
- Users start with a random plant from the catalog
- Points are accumulated as users complete activities
- Plants progress through 5 stages:
  - Stage 0: Seed 🌰
  - Stage 1: Sprout 🌱
  - Stage 2: Sapling 🌿
  - Stage 3: Budding 🌺
  - Stage 4: Bloomed 🌸

- When a plant reaches its `pointsToBloom` threshold, it completes and is saved to the garden
- A new random plant automatically starts

### 2. Seed Queue System
To ensure variety and prevent the same plant appearing twice in a row, we use a "deck of cards" approach:

1. When a user needs a new plant, the system checks their `seedQueue`
2. If the queue is empty, it fills it with all active plant types (shuffled)
3. The first plant ID is popped from the queue
4. This ensures users will see all plants before any repeats

### 3. Database Structure

#### `plant_types` Collection
Contains the catalog of all available plants (read-only for users):

```javascript
{
  id: 'cosmic_rose',           // Document ID
  name: 'Cosmic Rose',
  description: 'A mystical rose...',
  pointsToBloom: 30,           // Points needed to complete
  difficulty: 'medium',         // easy, medium, hard
  rarity: 'rare',              // common, uncommon, rare, legendary
  isActive: true               // Whether plant is in rotation
}
```

#### `users/{uid}` Document
Tracks the user's current plant progress:

```javascript
{
  currentPlant: {
    plantId: 'cosmic_rose',
    currentPoints: 15,
    maxPoints: 30,
    startedAt: '2025-11-19T...'
  },
  seedQueue: ['golden_fern', 'midnight_lily', ...]
}
```

#### `users/{uid}/garden/{plantId}` Subcollection
Stores all completed plants:

```javascript
{
  plantId: 'cosmic_rose',
  plantType: 'Cosmic Rose',
  finalPoints: 32,
  maxPoints: 30,
  startedAt: '2025-11-15T...',
  completedAt: '2025-11-19T...'
}
```

## Setup Instructions

### 1. Initialize Plant Types
You need to add plant types to Firestore:

**Option A: Manual (Firebase Console)**
1. Go to Firebase Console > Firestore Database
2. Create collection `plant_types`
3. Use the data from `src/data/samplePlants.js`
4. For each plant, create a document where:
   - Document ID = the plant's `id` field
   - Add all other fields (name, description, pointsToBloom, etc.)

**Option B: Programmatic**
Create a one-time script or Cloud Function to bulk-import the sample plants.

### 2. Deploy Firestore Rules
The security rules have been updated to:
- Allow authenticated users to read from `plant_types`
- Prevent direct writes to `plant_types` (admin only)
- Allow users to read/write their own garden subcollection

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### 3. User Initialization
When a new user signs up or first accesses the app:
- The `usePlantGrowth` hook automatically initializes their first plant
- A random plant is selected and set as `currentPlant`
- The user document is created with default values

## Components & Files

### Core Logic
- `src/utils/plantGrowth.js` - Plant calculation utilities
- `src/hooks/usePlantGrowth.js` - React hook for plant state management

### UI Components
- `src/pages/HomePage.jsx` - Displays current plant progress
- `src/pages/GardenPage.jsx` - Shows all completed plants
- `src/components/garden/PlantDetailModal.jsx` - Detailed plant info modal

### Integration Points
- `src/components/QuickThought.jsx` - Awards 1 point on save
- `src/components/reflection/ReflectionFlow.jsx` - Awards 2 points on completion

## Image Support (Future Enhancement)

Currently, the system uses emoji placeholders. To add actual plant images:

1. **Upload Images to Firebase Storage**
   ```
   /game_assets/plants/{plantId}/seed.png
   /game_assets/plants/{plantId}/sprout.png
   /game_assets/plants/{plantId}/sapling.png
   /game_assets/plants/{plantId}/bud.png
   /game_assets/plants/{plantId}/bloomed.png
   ```

2. **Update Image Loading**
   Modify `getPlantImageUrl()` in `plantGrowth.js` with your Firebase Storage bucket:
   ```javascript
   return `https://firebasestorage.googleapis.com/v0/b/YOUR-PROJECT.appspot.com/o/game_assets%2Fplants%2F${plantId}%2F${filename}?alt=media`;
   ```

3. **Add Image Component**
   Create an `<img>` element with error handling in HomePage and GardenPage:
   ```jsx
   <img 
     src={imageUrl} 
     onError={() => setImageError(true)}
     alt={plantName}
   />
   ```

## Error Handling

The system includes robust error handling:

- **Missing Plant Types**: Falls back to a default plant with 30 points
- **Empty Seed Queue**: Automatically refills from available plants
- **Image Failures**: Falls back to emoji representations
- **Network Errors**: Displays loading states and error messages

## Adding New Plants

To add a new plant to the system:

1. Create document in `plant_types` collection:
   ```javascript
   {
     id: 'new_plant_id',
     name: 'New Plant Name',
     description: 'Description here',
     pointsToBloom: 25,
     difficulty: 'medium',
     rarity: 'common',
     isActive: true
   }
   ```

2. (Optional) Upload 5 stage images to Firebase Storage

3. The plant will automatically appear in user rotation - no code changes needed!

## Testing

To test the garden system:

1. **Quick Growth**: Temporarily reduce `pointsToBloom` values to 5-10 points for faster testing
2. **Complete a Plant**: Log several quick thoughts or reflections
3. **View Garden**: Click "Your Full Garden" in the sidebar
4. **Check Different Plants**: Complete multiple plants to see variety
5. **Test Queue**: Complete enough plants to verify the seed queue refills

## Future Enhancements

Potential additions to the system:

- [ ] Seasonal/special event plants
- [ ] Plant trading or gifting between users
- [ ] Achievement badges for rare plants
- [ ] Customizable plant pots/backgrounds
- [ ] Plant care streaks and bonuses
- [ ] Export garden as shareable image
