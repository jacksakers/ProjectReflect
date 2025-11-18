/**
 * FuturePage Component
 * 
 * The "Future" - Planning and anticipation:
 * - Time Capsule feature
 * - Sealed messages with premature opening option
 * - Delivered messages with reply functionality
 */

import { useState } from 'react';
import { useTimeCapsules } from '../hooks/useTimeCapsules';
import CreateTimeCapsule from '../components/timecapsule/CreateTimeCapsule';
import SealedMessages from '../components/timecapsule/SealedMessages';
import DeliveredMessages from '../components/timecapsule/DeliveredMessages';
import TimeCapsuleDetailModal from '../components/timecapsule/TimeCapsuleDetailModal';

function FuturePage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  
  const {
    sealedCapsules,
    deliveredCapsules,
    loading,
    error,
    createCapsule,
    openCapsule,
    deleteCapsule,
    saveReply
  } = useTimeCapsules();

  const handleCreateCapsule = async (capsuleData) => {
    const result = await createCapsule(capsuleData);
    if (result.success) {
      setShowCreateModal(false);
    }
    return result;
  };

  const handleOpenCapsule = async (capsuleId, isPremature) => {
    await openCapsule(capsuleId, isPremature);
  };

  const handleDeleteCapsule = async (capsuleId) => {
    await deleteCapsule(capsuleId);
  };

  const handleViewDetail = (capsule) => {
    setSelectedCapsule(capsule);
  };

  const handleSaveReply = async (capsuleId, replyText) => {
    return await saveReply(capsuleId, replyText);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">💌</div>
          <p className="font-nunito text-purple-700">Loading your messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="font-nunito text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Time Capsule Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💌</div>
            <h2 className="font-nunito text-xl font-bold text-purple-900 mb-2">
              Messages to Your Future Self
            </h2>
            <p className="font-nunito text-lg text-purple-700">
              Ask a question or share a thought with the you of tomorrow.
            </p>
          </div>

          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full p-4 bg-purple-600 text-white rounded-xl text-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 hover:bg-purple-700"
          >
            ✍️ Create a Time Capsule
          </button>
        </div>

        {/* Sealed Messages */}
        <div>
          <h3 className="font-nunito text-lg font-bold text-purple-900 mb-4">
            Sealed Messages
            {sealedCapsules.length > 0 && (
              <span className="ml-2 text-purple-600">({sealedCapsules.length})</span>
            )}
          </h3>
          <SealedMessages
            capsules={sealedCapsules}
            onOpen={handleOpenCapsule}
            onDelete={handleDeleteCapsule}
          />
        </div>

        {/* Delivered Messages */}
        <div>
          <h3 className="font-nunito text-lg font-bold text-purple-900 mb-4">
            Recently Delivered
            {deliveredCapsules.length > 0 && (
              <span className="ml-2 text-purple-600">({deliveredCapsules.length})</span>
            )}
          </h3>
          <DeliveredMessages
            capsules={deliveredCapsules}
            onViewDetail={handleViewDetail}
          />
        </div>
      </div>

      {/* Create Time Capsule Modal */}
      <CreateTimeCapsule
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateCapsule}
      />

      {/* Time Capsule Detail Modal */}
      <TimeCapsuleDetailModal
        capsule={selectedCapsule}
        isOpen={!!selectedCapsule}
        onClose={() => setSelectedCapsule(null)}
        onDelete={handleDeleteCapsule}
        onSaveReply={handleSaveReply}
      />
    </>
  );
}

export default FuturePage;
