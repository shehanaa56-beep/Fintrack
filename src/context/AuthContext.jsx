import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { ref, onValue } from 'firebase/database';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: 'FinTrack User' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const profileRef = ref(db, `users/${currentUser.uid}/profile`);
        const unsubscribeProfile = onValue(profileRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setProfile({
              name: data.name || 'FinTrack User',
              avatar: data.avatar || null
            });
          }
          setLoading(false);
        });
        return () => {
          unsubscribeAuth();
          unsubscribeProfile();
        };
      } else {
        setProfile({ name: 'FinTrack User' });
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const login = async (email, password) => {
    if (email !== 'shehanaa56@gmail.com') {
      throw new Error('Unauthorized email');
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Sign-in error:", error.code, error.message);
      
      // Auto-create only for this specific case if it's the first time
      if (email === 'shehanaa56@gmail.com' && password === 'sha5656') {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          try {
            console.log("Attempting to auto-create authorized user...");
            await createUserWithEmailAndPassword(auth, email, password);
            return true;
          } catch (createError) {
            console.error("Auto-creation error:", createError.message);
            throw createError;
          }
        }
      }
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    profile,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
