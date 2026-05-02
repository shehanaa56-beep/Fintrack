import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login catch:", err);
      const errorCode = err.code || '';
      
      if (err.message === 'Unauthorized email') {
        setError('Only authorized users can access this application.');
      } else if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        setError('Invalid credentials. Please verify your email and password in the Firebase Console.');
      } else if (errorCode === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later or reset your password.');
      } else if (errorCode === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
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
            <h1>FinTrack</h1>
            <p>Welcome back! Please login to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
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
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" disabled={loading} />
                <span>Remember me</span>
              </label>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login to Dashboard'}
              {!loading && <i className="bi bi-arrow-right"></i>}
            </button>

{/* 
            <div className="auth-footer" style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>
              Don't have an account? <Link to="/signup" style={{ color: '#6366f1', fontWeight: '600', textDecoration: 'none' }}>Sign up here</Link>
            </div>
            */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
