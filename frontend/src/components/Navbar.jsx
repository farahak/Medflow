import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/home" className="navbar-logo">
            <span>Medflow</span>
          </Link>

          <div className="navbar-menu">
            <Link to="/home" className="navbar-link">Accueil</Link>
            <Link to="/services" className="navbar-link">Services</Link>
            <Link to="/doctors" className="navbar-link">Médecins</Link>
            <Link to="/contact" className="navbar-link">Contact</Link>

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="navbar-link">👤 Profil</Link>
                <Link to="/messages" className="navbar-link">💬 Messages</Link>
                {user?.role === 'patient' && (
                  <Link to="/addAppointments" className="navbar-link">Prendre rendez-vous</Link>
                )}
                {user?.role === 'medecin' && (
                  <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                )}
                {user?.role === 'receptionist' && (
                  <Link to="/receptionist/dashboard" className="navbar-link">Dashboard</Link>
                )}
                <button onClick={handleLogout} className="btn btn-secondary">Déconnexion</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">Connexion</Link>
            )}
          </div>

          <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {isOpen && (
          <div className="navbar-mobile">
            <Link to="/home" className="navbar-mobile-link" onClick={() => setIsOpen(false)}>Accueil</Link>
            <Link to="/services" className="navbar-mobile-link" onClick={() => setIsOpen(false)}>Services</Link>
            <Link to="/doctors" className="navbar-mobile-link" onClick={() => setIsOpen(false)}>Médecins</Link>
            <Link to="/contact" className="navbar-mobile-link" onClick={() => setIsOpen(false)}>Contact</Link>

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="navbar-mobile-link" onClick={() => setIsOpen(false)}>👤 Profil</Link>
                <Link to="/messages" className="navbar-mobile-link" onClick={() => setIsOpen(false)}>💬 Messages</Link>
                {user?.role === 'patient' && (
                  <Link to="/addAppointments" className="navbar-mobile-link" onClick={() => setIsOpen(false)}>Prendre rendez-vous</Link>
                )}
                {user?.role === 'medecin' && (
                  <Link to="/dashboard" className="navbar-mobile-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
                )}
                {user?.role === 'receptionist' && (
                  <Link to="/receptionist/dashboard" className="navbar-mobile-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
                )}
                <button onClick={handleLogout} className="navbar-mobile-link">Déconnexion</button>
              </>
            ) : (
              <Link to="/login" className="navbar-mobile-link" onClick={() => setIsOpen(false)}>Connexion</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;