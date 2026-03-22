import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Savings from './pages/Savings';
import Leaves from './pages/Leaves';
import ExtraHours from './pages/ExtraHours';
import Salary from './pages/Salary';
import './App.css';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Profile from './pages/Profile';

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
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
            {/* Redirect any other unknown routes to dashboard */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return <AppContent />;
}

export default App;
