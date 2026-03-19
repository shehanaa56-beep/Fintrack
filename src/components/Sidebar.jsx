import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { to: '/', label: 'Dashboard', icon: <i className="bi bi-grid-fill"></i> },
  { to: '/income', label: 'Income', icon: <i className="bi bi-graph-up-arrow"></i> },
  { to: '/expenses', label: 'Expenses', icon: <i className="bi bi-graph-down-arrow"></i> },
  { to: '/savings', label: 'Savings', icon: <i className="bi bi-piggy-bank-fill"></i> },
  { to: '/profile', label: 'Profile', icon: <i className="bi bi-person-circle"></i> },
];

const officeItems = [
  { to: '/leaves', label: 'Leaves', icon: <i className="bi bi-calendar-x-fill"></i> },
  { to: '/extra-hours', label: 'Extra Hours', icon: <i className="bi bi-clock-history"></i> },
  { to: '/salary', label: 'Salary', icon: <i className="bi bi-cash-stack"></i> },
];

import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { logout, profile } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button className="mobile-toggle" onClick={toggleMenu}>
        <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={closeMenu}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="user-avatar">
              <i className="bi bi-person"></i>
            </div>
            <div className="user-info">
              <span className="user-name">{profile?.name || 'Oozbek'}</span>
              <span className="user-role">{profile?.role || 'Operator'}</span>
            </div>
          </div>
          <button className="close-sidebar" onClick={closeMenu}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {navItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={closeMenu}
              >
                {icon}
                <span className="nav-label">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-section">
            <span className="section-header">OFFICE</span>
            <nav className="sidebar-nav">
              {officeItems.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                  onClick={closeMenu}
                >
                  {icon}
                  <span className="nav-label">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="sidebar-footer">
          <button
            onClick={() => {
              closeMenu();
              logout();
            }}
            className="nav-item logout-btn"
          >
            <i className="bi bi-box-arrow-left"></i>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
