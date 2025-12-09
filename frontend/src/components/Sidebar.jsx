import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path) => location.pathname === path;

  // Define menu items based on role
  const getMenuItems = () => {
    const commonItems = [
      { path: '/profile', label: '👤 Mon Profil', icon: '👤' },
      { path: '/messages', label: '💬 Messages', icon: '💬' },
    ];

    if (user?.role === 'medecin') {
      return [
        { path: '/dashboard', label: '📊 Dashboard', icon: '📊' },
        { path: '/appointments', label: '📅 Rendez-vous', icon: '📅' },
        { path: '/add-availability', label: '🕒 Disponibilités', icon: '🕒' },
        ...commonItems,
      ];
    }

    if (user?.role === 'patient') {
      return [
        { path: '/addAppointments', label: '📅 Prendre RDV', icon: '📅' },
        ...commonItems,
      ];
    }

    if (user?.role === 'receptionist') {
      return [
        { path: '/receptionist/dashboard', label: '📊 Dashboard', icon: '📊' },
        { path: '/receptionist/appointments', label: '📅 Rendez-vous', icon: '📅' },
        { path: '/receptionist/doctors', label: '👨‍⚕️ Médecins', icon: '👨‍⚕️' },
        { path: '/receptionist/invoices', label: '💰 Factures', icon: '💰' },
        ...commonItems,
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-logo">
          <span>Medflow</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
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
          <p className="sidebar-user-name">{user?.first_name || user?.email?.split('@')[0] || 'User'}</p>
          <p className="sidebar-user-role">{user?.role === 'medecin' ? 'Médecin' : user?.role === 'patient' ? 'Patient' : user?.role === 'receptionist' ? 'Réceptionniste' : user?.role}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
