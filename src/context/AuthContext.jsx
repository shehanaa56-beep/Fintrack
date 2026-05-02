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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Sign-in error:", error.code, error.message);
      throw error;
    }
  };

  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Initialize profile in Database
      const { set } = await import('firebase/database');
      const profileRef = ref(db, `users/${user.uid}/profile`);
      await set(profileRef, {
        name: name || 'FinTrack User',
        createdAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error("Signup error:", error.code, error.message);
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
    signup,
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
