/**
 * JournalPage Component
 * 
 * The "Past" - Review all previous entries:
 * - Search bar and calendar navigation
 * - Reverse-chronological list of entries
 * - Entry cards with date, mood, and snippet
 */

function JournalPage() {
  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search your reflections..."
            className="flex-1 p-3 rounded-xl border-2 border-purple-200 bg-white focus:border-purple-400 focus:ring-0 font-nunito"
          />
          <button className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
            📅
          </button>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {/* Placeholder for when there are no entries */}
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">📖</div>
          <h3 className="font-nunito text-xl font-bold text-purple-900 mb-2">
            Your journal awaits
          </h3>
          <p className="font-nunito text-lg text-purple-700">
            Start your first reflection to begin your journey.
          </p>
        </div>
      </div>
    </div>
  );
}

export default JournalPage;
