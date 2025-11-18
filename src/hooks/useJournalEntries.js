/**
 * useJournalEntries Hook
 * 
 * Fetches and manages user's journal entries and delivered time capsules from Firestore.
 * Provides real-time updates, loading state, and error handling.
 * 
 * Returns:
 * - entries: Array of entry objects and delivered time capsules sorted by date (newest first)
 * - loading: Boolean indicating data fetch status
 * - error: Error message if fetch fails
 * - deleteEntry: Function to delete an entry by ID
 */

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export function useJournalEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      const now = new Date();
      
      // Query regular journal entries
      const entriesQuery = query(
        collection(db, 'entries'),
        where('authorUid', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      // Query delivered time capsules (opened or past open date)
      const capsulesQuery = query(
        collection(db, 'timeCapsules'),
        where('authorUid', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      let entriesData = [];
      let capsulesData = [];
      let entriesLoaded = false;
      let capsulesLoaded = false;

      const updateCombinedData = () => {
        if (entriesLoaded && capsulesLoaded) {
          // Combine and sort all items by date
          const allItems = [
            ...entriesData.map(e => ({ ...e, type: 'entry' })),
            ...capsulesData
              .filter(c => c.openDate <= now || c.status === 'opened')
              .map(c => ({ ...c, type: 'timeCapsule', createdAt: c.openedAt || c.openDate }))
          ].sort((a, b) => b.createdAt - a.createdAt);
          
          setEntries(allItems);
          setLoading(false);
        }
      };

      // Listen to entries
      const unsubscribeEntries = onSnapshot(
        entriesQuery,
        (querySnapshot) => {
          entriesData = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            let createdAtDate = data.createdAt.toDate();
            entriesData.push({
              id: doc.id,
              ...data,
              createdAt: createdAtDate,
            });
          });
          entriesLoaded = true;
          updateCombinedData();
        },
        (err) => {
          console.error('Error fetching entries:', err);
          setError('Failed to load journal entries');
          setLoading(false);
        }
      );

      // Listen to time capsules
      const unsubscribeCapsules = onSnapshot(
        capsulesQuery,
        (querySnapshot) => {
          capsulesData = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            capsulesData.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate(),
              openDate: data.openDate?.toDate(),
              openedAt: data.openedAt?.toDate(),
              repliedAt: data.repliedAt?.toDate()
            });
          });
          capsulesLoaded = true;
          updateCombinedData();
        },
        (err) => {
          console.error('Error fetching time capsules:', err);
          // Don't set error for time capsules, let entries still load
          capsulesLoaded = true;
          updateCombinedData();
        }
      );

      // Cleanup listeners on unmount
      return () => {
        unsubscribeEntries();
        unsubscribeCapsules();
      };
    } catch (err) {
      console.error('Error setting up listeners:', err);
      setError('Failed to load journal entries');
      setLoading(false);
    }
  }, [currentUser]);

  /**
   * Delete an entry or time capsule by ID
   */
  const deleteEntry = async (itemId, itemType = 'entry') => {
    try {
      const collectionName = itemType === 'timeCapsule' ? 'timeCapsules' : 'entries';
      await deleteDoc(doc(db, collectionName, itemId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting item:', err);
      return { success: false, error: err.message };
    }
  };

  return { entries, loading, error, deleteEntry };
}
