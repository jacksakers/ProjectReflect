/**
 * AuthContext
 * 
 * Provides authentication state and methods throughout the app:
 * - Current user
 * - Login, signup, logout methods
 * - Loading state
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Sign up a new user and create their user document
   */
  async function signup(email, password, displayName = '') {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore (as per database.txt)
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName || email.split('@')[0],
        createdAt: serverTimestamp(),
        currentPlantProgress: 0,
        currentPlantCheckIns: 0,
        totalCheckIns: 0,
        totalReflections: 0,
        notificationSettings: {
          quickCheckInTimes: ['09:00', '14:00', '20:00'],
          dailyReflectionTime: '21:00',
          enabled: true
        },
        ai_suggested_question: null,
        ai_suggested_meditation: null
      });

      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Log in an existing user
   */
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Log out the current user
   */
  async function logout() {
    return signOut(auth);
  }

  /**
   * Listen for auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({
            ...user,
            userData: userDoc.data()
          });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
