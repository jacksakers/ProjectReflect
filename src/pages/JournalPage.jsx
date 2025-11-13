/**
 * JournalPage Component
 * 
 * The "Past" - Review all previous entries:
 * - Search bar and calendar navigation
 * - Reverse-chronological list of entries
 * - Entry cards with date, mood, and snippet
 */

import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useJournalEntries } from '../hooks/useJournalEntries';
import CalendarView from '../components/journal/CalendarView';
import EntryCard from '../components/journal/EntryCard';
import EntryDetailModal from '../components/journal/EntryDetailModal';
import DeleteConfirmationToast from '../components/journal/DeleteConfirmationToast';

function JournalPage() {
  const { entries, loading, error, deleteEntry } = useJournalEntries();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [entryToDelete, setEntryToDelete] = useState(null);

  // Filter entries based on search and date
  const filteredEntries = useMemo(() => {
    let filtered = [...entries];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.text?.toLowerCase().includes(query) ||
        entry.mood?.toLowerCase().includes(query) ||
        entry.triageAnswers?.customThought?.toLowerCase().includes(query)
      );
    }

    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter(entry => {
        if (!entry.createdAt) return false;
        const entryDate = new Date(entry.createdAt);
        return entryDate.getFullYear() === selectedDate.getFullYear() &&
               entryDate.getMonth() === selectedDate.getMonth() &&
               entryDate.getDate() === selectedDate.getDate();
      });
    }

    return filtered;
  }, [entries, searchQuery, selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
  };

  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;
    
    const result = await deleteEntry(entryToDelete.id);
    
    if (result.success) {
      setEntryToDelete(null);
      setSelectedEntry(null);
    } else {
      alert('Failed to delete entry. Please try again.');
    }
  };

  const handleCancelDelete = () => {
    setEntryToDelete(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">📖</div>
          <p className="font-nunito text-lg text-purple-700">Loading your journal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl shadow-sm p-8 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="font-nunito text-xl font-bold text-red-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="font-nunito text-lg text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your reflections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-purple-200 bg-white focus:border-purple-400 focus:ring-0 font-nunito"
            />
          </div>
          <button 
            onClick={() => setShowCalendar(!showCalendar)}
            className={`p-3 rounded-xl transition-colors font-nunito font-semibold flex items-center gap-2 ${
              showCalendar 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Active filters display */}
        {(searchQuery || selectedDate) && (
          <div className="mt-3 pt-3 border-t border-purple-100 flex items-center gap-2 flex-wrap">
            <span className="font-nunito text-sm text-purple-600">Active filters:</span>
            {selectedDate && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-nunito font-semibold">
                📅 {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-nunito font-semibold">
                🔍 "{searchQuery}"
              </span>
            )}
            <button
              onClick={clearFilters}
              className="ml-auto inline-flex items-center gap-1 px-3 py-1 text-purple-600 hover:text-purple-800 text-sm font-nunito font-semibold"
            >
              <XMarkIcon className="w-4 h-4" />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Calendar View (toggleable) */}
      {showCalendar && (
        <CalendarView 
          entries={entries}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">
              {entries.length === 0 ? '📖' : '🔍'}
            </div>
            <h3 className="font-nunito text-xl font-bold text-purple-900 mb-2">
              {entries.length === 0 
                ? 'Your journal awaits' 
                : 'No entries found'
              }
            </h3>
            <p className="font-nunito text-lg text-purple-700">
              {entries.length === 0
                ? 'Start your first reflection to begin your journey.'
                : 'Try adjusting your search or date filter.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="font-nunito text-sm text-purple-600 px-2">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} found
            </div>
            
            {/* Entry cards */}
            {filteredEntries.map(entry => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onClick={() => setSelectedEntry(entry)}
              />
            ))}
          </>
        )}
      </div>

      {/* Entry Detail Modal */}
      <EntryDetailModal
        entry={selectedEntry}
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        onDelete={handleDeleteClick}
      />

      {/* Delete Confirmation Toast */}
      <DeleteConfirmationToast
        entry={entryToDelete}
        isOpen={!!entryToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default JournalPage;
