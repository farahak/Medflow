import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path) => location.pathname === path;

  // Menu items for doctors only
  const doctorMenuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/appointments', label: 'Rendez-vous' },
    { path: '/add-availability', label: 'Disponibilités' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-logo">
          <span>Medflow</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {doctorMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <p className="sidebar-user-name">{user?.first_name || 'Dr.'} {user?.last_name || 'Médecin'}</p>
          <p className="sidebar-user-role">Médecin</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
