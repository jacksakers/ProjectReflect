/**
 * useTimeCapsules Hook
 * 
 * Manages time capsule messages:
 * - Fetches sealed and delivered capsules
 * - Handles opening (premature or normal)
 * - Handles deletion
 * - Saves replies to delivered messages
 * 
 * A capsule is "delivered" when current date >= openDate
 */

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export function useTimeCapsules() {
  const [sealedCapsules, setSealedCapsules] = useState([]);
  const [deliveredCapsules, setDeliveredCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      // Query all time capsules for current user
      const q = query(
        collection(db, 'timeCapsules'),
        where('authorUid', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const now = new Date();
          const sealed = [];
          const delivered = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const capsule = {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate(),
              openDate: data.openDate?.toDate(),
              openedAt: data.openedAt?.toDate(),
              repliedAt: data.repliedAt?.toDate()
            };

            // Check if capsule should be delivered
            if (capsule.openDate <= now || capsule.status === 'opened') {
              delivered.push(capsule);
            } else {
              sealed.push(capsule);
            }
          });

          setSealedCapsules(sealed);
          setDeliveredCapsules(delivered);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching time capsules:', err);
          setError('Failed to load time capsules');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up time capsules listener:', err);
      setError('Failed to load time capsules');
      setLoading(false);
    }
  }, [currentUser]);

  /**
   * Create a new time capsule
   */
  const createCapsule = async (capsuleData) => {
    try {
      const capsuleDoc = {
        authorUid: currentUser.uid,
        text: capsuleData.text,
        mood: capsuleData.mood || null,
        category: capsuleData.category || null,
        includeReply: capsuleData.includeReply || false,
        replyText: '',
        status: 'sealed', // 'sealed' or 'opened'
        createdAt: Timestamp.now(),
        openDate: Timestamp.fromDate(capsuleData.openDate),
        openedAt: null,
        repliedAt: null,
        openedPrematurely: false
      };

      await addDoc(collection(db, 'timeCapsules'), capsuleDoc);
      return { success: true };
    } catch (err) {
      console.error('Error creating time capsule:', err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Open a sealed capsule (premature or on time)
   */
  const openCapsule = async (capsuleId, isPremature = false) => {
    try {
      await updateDoc(doc(db, 'timeCapsules', capsuleId), {
        status: 'opened',
        openedAt: Timestamp.now(),
        openedPrematurely: isPremature
      });
      return { success: true };
    } catch (err) {
      console.error('Error opening capsule:', err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Delete a time capsule
   */
  const deleteCapsule = async (capsuleId) => {
    try {
      await deleteDoc(doc(db, 'timeCapsules', capsuleId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting capsule:', err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Save a reply to a delivered capsule
   */
  const saveReply = async (capsuleId, replyText) => {
    try {
      await updateDoc(doc(db, 'timeCapsules', capsuleId), {
        replyText: replyText,
        repliedAt: Timestamp.now()
      });
      return { success: true };
    } catch (err) {
      console.error('Error saving reply:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    sealedCapsules,
    deliveredCapsules,
    loading,
    error,
    createCapsule,
    openCapsule,
    deleteCapsule,
    saveReply
  };
}
