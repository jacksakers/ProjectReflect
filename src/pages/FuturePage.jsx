/**
 * FuturePage Component
 * 
 * The "Future" - Planning and anticipation:
 * - Time Capsule feature (V2)
 * - Scheduled Reflections feature (V2)
 * - Ask Future You a Question
 */

function FuturePage() {
  return (
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

        <button className="w-full p-4 bg-purple-600 text-white rounded-xl text-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 hover:bg-purple-700">
          Ask Future You a Question
        </button>
      </div>

      {/* Sealed Messages */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-nunito text-lg font-bold text-purple-900 mb-4">
          Sealed Messages
        </h3>
        <p className="font-nunito text-purple-700 italic text-center py-4">
          No messages waiting to be opened.
        </p>
      </div>

      {/* Delivered Messages */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-nunito text-lg font-bold text-purple-900 mb-4">
          Delivered Messages
        </h3>
        <p className="font-nunito text-purple-700 italic text-center py-4">
          Messages from your past self will appear here.
        </p>
      </div>
    </div>
  );
}

export default FuturePage;
