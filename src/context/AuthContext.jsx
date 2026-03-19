import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { ref, onValue } from 'firebase/database';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: 'Oozbek', role: 'Operator' });
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
              name: data.name || 'Oozbek',
              role: data.role || 'Operator'
            });
          }
          setLoading(false);
        });
        return () => {
          unsubscribeAuth();
          unsubscribeProfile();
        };
      } else {
        setProfile({ name: 'Oozbek', role: 'Operator' });
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
      console.error("Login error:", error.message);
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
