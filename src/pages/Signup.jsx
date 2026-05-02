import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Reusing Login styles for consistency

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name);
      navigate('/');
    } catch (err) {
      console.error("Signup error:", err);
      const errorCode = err.code || '';
      
      if (errorCode === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else if (errorCode === 'auth/weak-password') {
        setError('Password is too weak. Use a stronger password.');
      } else if (errorCode === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(err.message || 'An unexpected error occurred during signup.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-icon">
              <img src="/logo.png" alt="FinTrack Logo" className="login-logo-img" />
            </div>
            <h1>Join FinTrack</h1>
            <p>Start managing your finances effectively.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <i className="bi bi-person"></i>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <i className="bi bi-envelope"></i>
                <input
                  type="email"
                  id="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <i className="bi bi-lock"></i>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <i className="bi bi-shield-lock"></i>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="login-btn" style={{ marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <i className="bi bi-person-plus"></i>}
            </button>

            <div className="auth-footer" style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>
              Already have an account? <Link to="/login" style={{ color: '#6366f1', fontWeight: '600', textDecoration: 'none' }}>Login here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
