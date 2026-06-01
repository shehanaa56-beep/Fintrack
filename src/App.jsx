import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Savings from './pages/Savings';
import Leaves from './pages/Leaves';
import ExtraHours from './pages/ExtraHours';
import Salary from './pages/Salary';
import Monthly from './pages/Monthly';
import './App.css';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import InstallPWA from './components/InstallPWA';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading FinTrack...</p>
      </div>
    );
  }

  return (
    <Router>
      <InstallPWA />
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="app-layout">
          <Sidebar />
          <main className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/income" element={<Income />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/leaves" element={<Leaves />} />
              <Route path="/extra-hours" element={<ExtraHours />} />
              <Route path="/salary" element={<Salary />} />
              <Route path="/monthly" element={<Monthly />} />
              {/* Redirect any other unknown routes to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

function App() {
  return <AppContent />;
}

export default App;
