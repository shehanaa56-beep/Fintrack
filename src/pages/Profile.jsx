import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { ref, onValue, update } from 'firebase/database';
import './Profile.css';
const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState('FinTrack User');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('sha5656');
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const profileRef = ref(db, `users/${user.uid}/profile`);
    const unsubscribe = onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setName(data.name || 'FinTrack User');
        if (data.avatar) setAvatar(data.avatar);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    if (file.size > 1048576) {
      alert('Image is too large. Please choose an image under 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setUploading(true);
        const base64String = event.target.result;
        
        await update(ref(db, `users/${user.uid}/profile`), { avatar: base64String });
        setAvatar(base64String);
        alert('Avatar uploaded successfully!');
      } catch (error) {
        console.error("Avatar upload error:", error);
        alert('Failed to upload avatar.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await update(ref(db, `users/${user.uid}/profile`), {
        name
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
              {avatar ? (
                <img src={avatar} alt="Avatar" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  <i className="bi bi-person"></i>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
              />
              <button 
                type="button" 
                className="change-avatar-btn" 
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
              >
                {uploading ? <i className="bi bi-hourglass-split"></i> : <i className="bi bi-camera-fill"></i>}
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
