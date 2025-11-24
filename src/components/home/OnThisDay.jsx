/**
 * OnThisDay Component
 * 
 * Displays entries from specific time periods in the past:
 * - Yesterday
 * - 1 week ago
 * - 1 month ago  
 * - 1 year ago
 * 
 * Only shows sections that have entries.
 * Uses EntryCard for consistent display.
 */

import { useState } from 'react';
import { useOnThisDay } from '../../hooks/useOnThisDay';
import EntryCard from '../journal/EntryCard';
import EntryDetailModal from '../journal/EntryDetailModal';
import TimeCapsuleDetailModal from '../timecapsule/TimeCapsuleDetailModal';
import { useTimeCapsules } from '../../hooks/useTimeCapsules';

function OnThisDay() {
  const { entries, loading } = useOnThisDay();
  const { saveReply, deleteCapsule } = useTimeCapsules();
  const [selectedEntry, setSelectedEntry] = useState(null);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-nunito text-lg font-bold text-purple-900 mb-3">
          On This Day
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-3xl mb-2 animate-pulse">📖</div>
            <p className="font-nunito text-sm text-purple-700">Loading memories...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have any entries at all
  const hasAnyEntries = 
    entries.yesterday.length > 0 ||
    entries.weekAgo.length > 0 ||
    entries.monthAgo.length > 0 ||
    entries.yearAgo.length > 0;

  if (!hasAnyEntries) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-nunito text-lg font-bold text-purple-900 mb-3">
          On This Day
        </h3>
        <p className="font-nunito text-purple-700 italic">
          No entries from previous days... yet. Keep reflecting to build your collection of memories.
        </p>
      </div>
    );
  }

  const isTimeCapsule = (entry) => entry && entry.type === 'timeCapsule';

  // Time period configurations
  const timePeriods = [
    { key: 'yesterday', label: 'Yesterday', emoji: '☀️' },
    { key: 'weekAgo', label: '1 Week Ago', emoji: '📅' },
    { key: 'monthAgo', label: '1 Month Ago', emoji: '🌙' },
    { key: 'yearAgo', label: '1 Year Ago', emoji: '🎂' }
  ];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        <h3 className="font-nunito text-lg font-bold text-purple-900">
          On This Day
        </h3>

        {timePeriods.map(({ key, label, emoji }) => {
          const periodEntries = entries[key];
          
          // Only render section if there are entries
          if (periodEntries.length === 0) return null;

          return (
            <div key={key} className="space-y-3">
              {/* Section header */}
              <div className="flex items-center gap-2">
                <span className="text-xl" role="img" aria-label={label}>
                  {emoji}
                </span>
                <h4 className="font-nunito text-base font-bold text-purple-800">
                  {label}
                </h4>
                <span className="ml-auto font-nunito text-xs text-purple-600 font-semibold">
                  {periodEntries.length} {periodEntries.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              {/* Entry cards */}
              <div className="space-y-2">
                {periodEntries.map(entry => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onClick={() => setSelectedEntry(entry)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Entry detail modal */}
      {selectedEntry && isTimeCapsule(selectedEntry) ? (
        <TimeCapsuleDetailModal
          capsule={selectedEntry}
          isOpen={!!selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onDelete={deleteCapsule}
          onSaveReply={saveReply}
        />
      ) : (
        <EntryDetailModal
          entry={selectedEntry}
          isOpen={!!selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onDelete={() => {}} // We won't allow deletion from this view
        />
      )}
    </>
  );
}

export default OnThisDay;
