/**
 * useJournalEntries Hook
 * 
 * Fetches and manages user's journal entries from Firestore.
 * Provides real-time updates, loading state, and error handling.
 * 
 * Returns:
 * - entries: Array of entry objects sorted by date (newest first)
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
      // Query entries collection for current user's entries, ordered by date
      const q = query(
        collection(db, 'entries'),
        where('authorUid', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const entriesData = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            let createdAtDate = null;
            
            // Handle different date formats (Firestore Timestamp or ISO string)
            if (data.createdAt) {
              if (typeof data.createdAt.toDate === 'function') {
                // Firestore Timestamp
                createdAtDate = data.createdAt.toDate();
              } else if (typeof data.createdAt === 'string') {
                // ISO string
                createdAtDate = new Date(data.createdAt);
              }
            }
            
            entriesData.push({
              id: doc.id,
              ...data,
              createdAt: createdAtDate,
            });
          });
          setEntries(entriesData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching entries:', err);
          setError('Failed to load journal entries');
          setLoading(false);
        }
      );

      // Cleanup listener on unmount
      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up entries listener:', err);
      setError('Failed to load journal entries');
      setLoading(false);
    }
  }, [currentUser]);

  /**
   * Delete an entry by ID
   */
  const deleteEntry = async (entryId) => {
    try {
      await deleteDoc(doc(db, 'entries', entryId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting entry:', err);
      return { success: false, error: err.message };
    }
  };

  return { entries, loading, error, deleteEntry };
}
