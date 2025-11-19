/**
 * GardenPage Component
 * 
 * Display all completed plants in a trophy case/collection view.
 * Users can click on plants to see more details.
 */

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import PlantDetailModal from '../components/garden/PlantDetailModal';

function GardenPage() {
  const [completedPlants, setCompletedPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const loadCompletedPlants = async () => {
      try {
        setIsLoading(true);
        const gardenRef = collection(db, 'users', currentUser.uid, 'garden');
        const gardenQuery = query(gardenRef, orderBy('completedAt', 'desc'));
        const snapshot = await getDocs(gardenQuery);

        const plants = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCompletedPlants(plants);
      } catch (error) {
        console.error('Error loading garden:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompletedPlants();
  }, [currentUser]);

  const handlePlantClick = (plant) => {
    setSelectedPlant(plant);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  // Plant stage emoji (for fallback display)
  const getPlantEmoji = (plantId) => {
    // You can customize this based on plantId
    const emojis = ['🌸', '🌺', '🌼', '🌻', '🌷', '🌹', '💐', '🏵️'];
    const index = plantId ? plantId.length % emojis.length : 0;
    return emojis[index];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <p className="font-nunito text-lg text-purple-700">Loading your garden...</p>
        </div>
      </div>
    );
  }

  if (completedPlants.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">🌰</div>
          <h2 className="font-nunito text-2xl font-bold text-purple-900 mb-3">
            Your Garden Awaits
          </h2>
          <p className="font-nunito text-lg text-purple-700">
            Complete your first reflection to grow your first flower. 
            Each plant you nurture will bloom here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-nunito text-3xl font-bold text-purple-900 mb-2">
          Your Garden
        </h1>
        <p className="font-nunito text-lg text-purple-700">
          {completedPlants.length} {completedPlants.length === 1 ? 'flower' : 'flowers'} bloomed
        </p>
      </div>

      {/* Plant Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {completedPlants.map((plant) => (
          <button
            key={plant.id}
            onClick={() => handlePlantClick(plant)}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md 
              transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <div className="text-center">
              {/* Plant Image/Emoji */}
              <div className="text-5xl mb-3">
                {getPlantEmoji(plant.plantId)}
              </div>
              
              {/* Plant Name */}
              <h3 className="font-nunito text-lg font-bold text-purple-900 mb-1">
                {plant.plantType || 'Mystery Flower'}
              </h3>
              
              {/* Completion Date */}
              <p className="font-nunito text-sm text-purple-600">
                {formatDate(plant.completedAt)}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Plant Detail Modal */}
      <PlantDetailModal
        plant={selectedPlant}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedPlant(null);
        }}
      />
    </div>
  );
}

export default GardenPage;
