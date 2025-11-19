/**
 * PlantDetailModal Component
 * 
 * Full-screen modal showing detailed information about a completed plant:
 * - Plant image/emoji
 * - Plant name and type
 * - Start and completion dates
 * - Total points earned
 * - Growth journey stats
 */

import { XMarkIcon } from '@heroicons/react/24/outline';

function PlantDetailModal({ plant, isOpen, onClose }) {
  if (!isOpen || !plant) return null;

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format date as short format
  const formatDateShort = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Calculate days to bloom
  const getDaysToBloom = () => {
    if (!plant.startedAt || !plant.completedAt) return '?';
    try {
      const start = new Date(plant.startedAt);
      const end = new Date(plant.completedAt);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return days;
    } catch (error) {
      return '?';
    }
  };

  // Get plant emoji (same logic as GardenPage)
  const getPlantEmoji = (plantId) => {
    const emojis = ['🌸', '🌺', '🌼', '🌻', '🌷', '🌹', '💐', '🏵️'];
    const index = plantId ? plantId.length % emojis.length : 0;
    return emojis[index];
  };

  const daysToBloom = getDaysToBloom();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      {/* Modal */}
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[70vh] overflow-y-auto 
                shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-orange-200 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="font-nunito text-xl font-bold text-purple-900">
            Plant Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-purple-900 hover:bg-orange-50 rounded-lg transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Plant Display */}
          <div className="text-center">
            <div className="text-8xl mb-4">
              {getPlantEmoji(plant.plantId)}
            </div>
            <h3 className="font-nunito text-2xl font-bold text-purple-900 mb-2">
              {plant.plantType || 'Mystery Flower'}
            </h3>
            <p className="font-nunito text-lg text-purple-600">
              Fully Bloomed
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Days to Bloom */}
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-900 mb-1">
                {daysToBloom}
              </div>
              <div className="font-nunito text-sm text-purple-700">
                {daysToBloom === 1 ? 'Day' : 'Days'} to Bloom
              </div>
            </div>

            {/* Points Earned */}
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-900 mb-1">
                {plant.finalPoints || plant.maxPoints || '?'}
              </div>
              <div className="font-nunito text-sm text-purple-700">
                Points Earned
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="font-nunito text-lg font-bold text-purple-900">
              Growth Journey
            </h4>
            
            {/* Started */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm">🌰</span>
              </div>
              <div>
                <div className="font-nunito text-sm font-semibold text-purple-900">
                  Planted
                </div>
                <div className="font-nunito text-sm text-purple-600">
                  {formatDateShort(plant.startedAt)}
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="ml-4 border-l-2 border-purple-200 h-6"></div>

            {/* Bloomed */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm">🌸</span>
              </div>
              <div>
                <div className="font-nunito text-sm font-semibold text-purple-900">
                  Bloomed
                </div>
                <div className="font-nunito text-sm text-purple-600">
                  {formatDateShort(plant.completedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="font-nunito text-sm text-purple-700 text-center">
              You nurtured this plant through {plant.finalPoints || plant.maxPoints || '?'} moments 
              of reflection and mindfulness.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-orange-200 px-6 py-4 rounded-b-3xl">
          <button
            onClick={onClose}
            className="w-full p-3 bg-purple-600 text-white rounded-xl text-base font-bold 
              transition-all duration-200 transform active:scale-95 hover:bg-purple-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlantDetailModal;
