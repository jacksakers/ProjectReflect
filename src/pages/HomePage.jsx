/**
 * HomePage Component
 * 
 * The "Present" - Main hub showing:
 * - Current plant progress
 * - Primary CTA: Start Daily Reflection
 * - Secondary CTA: Log a Quick Thought
 * - "On This Day" module
 * - Today's Question module
 */

function HomePage() {
  console.log('HomePage is rendering');
  
  return (
    <div className="space-y-6">
      {/* Plant Progress Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="font-nunito text-xl font-bold text-purple-900 mb-2">
            Day 5: Your sprout is growing!
          </h2>
          <div className="w-full bg-peach-100 rounded-full h-3 mb-2">
            <div className="bg-purple-600 h-3 rounded-full" style={{ width: '35%' }}></div>
          </div>
          <p className="font-nunito text-sm text-mauve-700">7 check-ins • 23 to flower</p>
        </div>
      </div>

      {/* Primary CTA */}
      <button className="w-full p-4 bg-purple-600 text-white rounded-xl text-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 hover:bg-purple-700">
        Start Daily Reflection
      </button>

      {/* Secondary CTA */}
      <button className="w-full p-4 bg-mauve-400 text-white rounded-xl text-lg font-bold shadow-md transition-all duration-200 transform active:scale-95 hover:bg-mauve-500">
        Log a Quick Thought
      </button>

      {/* On This Day Module */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-nunito text-lg font-bold text-purple-900 mb-3">
          On This Day
        </h3>
        <p className="font-nunito text-mauve-700 italic">
          No entries from previous years on this day... yet.
        </p>
      </div>

      {/* Today's Question Module */}
      <div className="bg-peach-100 rounded-2xl shadow-sm p-6">
        <h3 className="font-nunito text-sm font-bold text-purple-900 mb-2">
          An idea for you...
        </h3>
        <p className="font-nunito text-lg text-purple-800">
          What made you smile today?
        </p>
      </div>
    </div>
  );
}

export default HomePage;
