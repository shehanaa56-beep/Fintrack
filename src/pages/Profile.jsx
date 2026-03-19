import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState('Oozbek');
  const [role, setRole] = useState('Operator');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('sha5656');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const profileRef = ref(db, `users/${user.uid}/profile`);
    const unsubscribe = onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setName(data.name || 'Oozbek');
        setRole(data.role || 'Operator');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await set(ref(db, `users/${user.uid}/profile`), {
        name,
        role
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Profile update error:", error);
      alert('Failed to update profile.');
    }
  };

  if (loading) return <div className="p-4">Loading Profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Update</h1>
      </div>
      
      <div className="profile-card">
        <form onSubmit={handleUpdate}>
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="avatar-placeholder">
                <i className="bi bi-person"></i>
              </div>
              <button type="button" className="change-avatar-btn">
                <i className="bi bi-camera-fill"></i>
              </button>
            </div>
          </div>
          
          <div className="profile-form-group">
            <label className="form-label">Full Name</label>
            <div className="input-with-icon">
              <i className="bi bi-person-badge"></i>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
            </div>
          </div>

          <div className="profile-form-group">
            <label className="form-label">Role</label>
            <div className="input-with-icon">
              <i className="bi bi-briefcase-fill"></i>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role"
              />
            </div>
          </div>

          <div className="profile-form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <i className="bi bi-envelope-fill"></i>
              <input
                type="email"
                value={email}
                disabled
                placeholder="Email Address"
              />
            </div>
          </div>
          
          <div className="profile-form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon password-group">
              <i className="bi bi-lock-fill"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>
          
          <button type="submit" className="profile-update-btn">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
