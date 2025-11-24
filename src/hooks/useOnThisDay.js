/**
 * useOnThisDay Hook
 * 
 * Fetches entries from specific time periods in the past:
 * - Yesterday
 * - 1 week ago
 * - 1 month ago
 * - 1 year ago
 * 
 * Returns organized entries by time period with loading state.
 */

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export function useOnThisDay() {
  const [entries, setEntries] = useState({
    yesterday: [],
    weekAgo: [],
    monthAgo: [],
    yearAgo: []
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchEntriesForPeriod = async () => {
      try {
        const now = new Date();
        
        // Helper to get date range (start and end of day)
        const getDateRange = (daysAgo) => {
          const targetDate = new Date(now);
          targetDate.setDate(targetDate.getDate() - daysAgo);
          
          const startOfDay = new Date(targetDate);
          startOfDay.setHours(0, 0, 0, 0);
          
          const endOfDay = new Date(targetDate);
          endOfDay.setHours(23, 59, 59, 999);
          
          return {
            start: Timestamp.fromDate(startOfDay),
            end: Timestamp.fromDate(endOfDay)
          };
        };

        // Helper to get entries for a specific date range
        const getEntriesForRange = async (startTimestamp, endTimestamp) => {
          // Query regular entries
          const entriesQuery = query(
            collection(db, 'entries'),
            where('authorUid', '==', currentUser.uid),
            where('createdAt', '>=', startTimestamp),
            where('createdAt', '<=', endTimestamp)
          );

          // Query time capsules (that were opened on this date)
          const capsulesQuery = query(
            collection(db, 'timeCapsules'),
            where('authorUid', '==', currentUser.uid),
            where('openDate', '>=', startTimestamp),
            where('openDate', '<=', endTimestamp),
            where('status', '==', 'opened')
          );

          const [entriesSnapshot, capsulesSnapshot] = await Promise.all([
            getDocs(entriesQuery),
            getDocs(capsulesQuery)
          ]);

          const allEntries = [];

          entriesSnapshot.forEach((doc) => {
            const data = doc.data();
            allEntries.push({
              id: doc.id,
              ...data,
              type: 'entry',
              createdAt: data.createdAt.toDate()
            });
          });

          capsulesSnapshot.forEach((doc) => {
            const data = doc.data();
            allEntries.push({
              id: doc.id,
              ...data,
              type: 'timeCapsule',
              createdAt: data.openedAt?.toDate() || data.openDate?.toDate()
            });
          });

          // Sort by time (newest first)
          return allEntries.sort((a, b) => b.createdAt - a.createdAt);
        };

        // Fetch entries for each time period
        const yesterday = getDateRange(1);
        const weekAgo = getDateRange(7);
        const monthAgo = getDateRange(30);
        const yearAgo = getDateRange(365);

        const [yesterdayEntries, weekAgoEntries, monthAgoEntries, yearAgoEntries] = await Promise.all([
          getEntriesForRange(yesterday.start, yesterday.end),
          getEntriesForRange(weekAgo.start, weekAgo.end),
          getEntriesForRange(monthAgo.start, monthAgo.end),
          getEntriesForRange(yearAgo.start, yearAgo.end)
        ]);

        setEntries({
          yesterday: yesterdayEntries,
          weekAgo: weekAgoEntries,
          monthAgo: monthAgoEntries,
          yearAgo: yearAgoEntries
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching "On This Day" entries:', err);
        setLoading(false);
      }
    };

    fetchEntriesForPeriod();
  }, [currentUser]);

  return { entries, loading };
}
