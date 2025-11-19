/**
 * usePlantGrowth Hook
 * 
 * Manages plant growth state, point accumulation, and plant completion.
 * Handles the "deck of cards" seed queue system to ensure variety.
 */

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { getPlantStage, shuffleArray } from '../utils/plantGrowth';

export function usePlantGrowth() {
  const { currentUser } = useAuth();
  const [currentPlant, setCurrentPlant] = useState(null);
  const [plantType, setPlantType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load current plant data with real-time listener
  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const userRef = doc(db, 'users', currentUser.uid);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(
      userRef,
      async (userDoc) => {
        try {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const currentPlantData = userData.currentPlant;

            if (currentPlantData) {
              setCurrentPlant(currentPlantData);

              // Load plant type details if plantId changed
              if (currentPlantData.plantId && currentPlantData.plantId !== currentPlant?.plantId) {
                const plantTypeRef = doc(db, 'plant_types', currentPlantData.plantId);
                const plantTypeDoc = await getDoc(plantTypeRef);
                
                if (plantTypeDoc.exists()) {
                  setPlantType(plantTypeDoc.data());
                }
              }
            } else {
              // Initialize first plant if none exists
              await initializeFirstPlant();
            }
          } else {
            // Create user document with first plant
            await initializeFirstPlant();
          }
          setIsLoading(false);
        } catch (err) {
          console.error('Error loading plant data:', err);
          setError(err.message);
          setIsLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to plant data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [currentUser]);

  /**
   * Initialize the first plant for a new user
   */
  const initializeFirstPlant = async () => {
    try {
      const newPlant = await getNextPlant();
      
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        email: currentUser.email,
        displayName: currentUser.displayName || '',
        createdAt: new Date().toISOString(),
        currentPlant: newPlant,
        seedQueue: []
      }, { merge: true });

      setCurrentPlant(newPlant);

      // Load plant type
      if (newPlant.plantId) {
        const plantTypeRef = doc(db, 'plant_types', newPlant.plantId);
        const plantTypeDoc = await getDoc(plantTypeRef);
        if (plantTypeDoc.exists()) {
          setPlantType(plantTypeDoc.data());
        }
      }
    } catch (err) {
      console.error('Error initializing first plant:', err);
      setError(err.message);
    }
  };

  /**
   * Get the next plant from the seed queue (or create new queue)
   */
  const getNextPlant = async () => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      let seedQueue = [];

      if (userDoc.exists()) {
        seedQueue = userDoc.data().seedQueue || [];
      }

      // If queue is empty, refill it
      if (seedQueue.length === 0) {
        seedQueue = await refillSeedQueue();
      }

      // Pop the first plant from the queue
      const nextPlantId = seedQueue[0];
      const remainingQueue = seedQueue.slice(1);

      // Update user's seed queue
      await updateDoc(userRef, {
        seedQueue: remainingQueue
      });

      // Get plant type details
      const plantTypeRef = doc(db, 'plant_types', nextPlantId);
      const plantTypeDoc = await getDoc(plantTypeRef);
      
      const plantData = plantTypeDoc.exists() ? plantTypeDoc.data() : {};

      return {
        plantId: nextPlantId,
        currentPoints: 0,
        maxPoints: plantData.pointsToBloom || 10,
        startedAt: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error getting next plant:', err);
      // Return a default plant if there's an error
      return {
        plantId: 'default_plant',
        currentPoints: 0,
        maxPoints: 10,
        startedAt: new Date().toISOString()
      };
    }
  };

  /**
   * Refill the seed queue with all available plants (shuffled)
   */
  const refillSeedQueue = async () => {
    try {
      // Get all active plant types
      const plantsQuery = query(
        collection(db, 'plant_types'),
        where('isActive', '==', true)
      );
      
      const plantsSnapshot = await getDocs(plantsQuery);
      const plantIds = plantsSnapshot.docs.map(doc => doc.id);

      // If no plants exist, return empty array
      if (plantIds.length === 0) {
        console.warn('No plant types found in database');
        return [];
      }

      // Shuffle the plant IDs
      return shuffleArray(plantIds);
    } catch (err) {
      console.error('Error refilling seed queue:', err);
      return [];
    }
  };

  /**
   * Add points to current plant
   * @param {number} points - Number of points to add (1 for quick thought, 2 for reflection)
   */
  const addPoints = async (points) => {
    if (!currentUser || !currentPlant) return;

    try {
      const newPoints = currentPlant.currentPoints + points;
      const maxPoints = currentPlant.maxPoints;

      // Check if plant has bloomed
      if (newPoints >= maxPoints) {
        await completePlant(newPoints);
      } else {
        // Update current plant points
        const userRef = doc(db, 'users', currentUser.uid);
        const updatedPlant = {
          ...currentPlant,
          currentPoints: newPoints
        };

        await updateDoc(userRef, {
          currentPlant: updatedPlant
        });

        setCurrentPlant(updatedPlant);
      }
    } catch (err) {
      console.error('Error adding points:', err);
      setError(err.message);
    }
  };

  /**
   * Complete the current plant and start a new one
   */
  const completePlant = async (finalPoints) => {
    try {
      // Save completed plant to garden
      const gardenRef = collection(db, 'users', currentUser.uid, 'garden');
      await addDoc(gardenRef, {
        plantId: currentPlant.plantId,
        plantType: plantType?.name || 'Unknown Plant',
        finalPoints: finalPoints,
        maxPoints: currentPlant.maxPoints,
        startedAt: currentPlant.startedAt,
        completedAt: new Date().toISOString()
      });

      // Get next plant
      const newPlant = await getNextPlant();

      // Update user's current plant
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        currentPlant: newPlant
      });

      setCurrentPlant(newPlant);

      // Load new plant type
      if (newPlant.plantId) {
        const plantTypeRef = doc(db, 'plant_types', newPlant.plantId);
        const plantTypeDoc = await getDoc(plantTypeRef);
        if (plantTypeDoc.exists()) {
          setPlantType(plantTypeDoc.data());
        }
      }
    } catch (err) {
      console.error('Error completing plant:', err);
      setError(err.message);
    }
  };

  /**
   * Get current plant stage (0-4)
   */
  const getCurrentStage = () => {
    if (!currentPlant) return 0;
    return getPlantStage(currentPlant.currentPoints, currentPlant.maxPoints);
  };

  return {
    currentPlant,
    plantType,
    isLoading,
    error,
    addPoints,
    getCurrentStage
  };
}
