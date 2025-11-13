/**
 * CalendarView Component
 * 
 * Interactive calendar that:
 * - Shows current month/year
 * - Highlights dates with journal entries
 * - Allows date selection to filter entries
 * - Navigates between months
 */

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function CalendarView({ entries, selectedDate, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const hasEntryOnDate = (day) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return entries.some(entry => isSameDay(entry.createdAt, checkDate));
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    // If clicking the same date, deselect it
    if (selectedDate && isSameDay(selectedDate, clickedDate)) {
      onDateSelect(null);
    } else {
      onDateSelect(clickedDate);
    }
  };

  // Generate calendar grid
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const hasEntry = hasEntryOnDate(day);
    const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isSelected = selectedDate && isSameDay(selectedDate, dateObj);
    const isToday = isSameDay(new Date(), dateObj);
    
    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`
          aspect-square p-2 rounded-lg font-nunito font-semibold text-sm
          transition-all duration-200 relative
          ${isSelected 
            ? 'bg-purple-600 text-white shadow-lg scale-105' 
            : hasEntry
              ? 'bg-purple-100 text-purple-900 hover:bg-purple-200'
              : 'text-purple-400 hover:bg-purple-50'
          }
          ${isToday && !isSelected ? 'ring-2 ring-purple-400' : ''}
        `}
      >
        {day}
        {hasEntry && !isSelected && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full" />
        )}
      </button>
    );
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      {/* Header with month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="w-5 h-5 text-purple-700" />
        </button>
        
        <h2 className="font-nunito text-lg font-bold text-purple-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRightIcon className="w-5 h-5 text-purple-700" />
        </button>
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-nunito text-xs font-semibold text-purple-600 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-purple-100 flex items-center justify-center gap-4 text-xs font-nunito">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-purple-600" />
          <span className="text-purple-700">Has entry</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-lg ring-2 ring-purple-400" />
          <span className="text-purple-700">Today</span>
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
