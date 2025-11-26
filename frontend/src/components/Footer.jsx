import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-col">
            <span className="footer-logo">Medflow</span>
            <p className="footer-description">
              Votre plateforme médicale de confiance
            </p>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Liens Rapides</h3>
            <ul className="footer-links">
              <li><Link to="/home">Accueil</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/doctors">Médecins</Link></li>
              <li><Link to="/appointment">Rendez-vous</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Services</h3>
            <ul className="footer-links">
              <li>Consultations</li>
              <li>Analyses</li>
              <li>Urgences</li>
              <li>Télémédecine</li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Contact</h3>
            <ul className="footer-links">
              <li>contact@medflow.com</li>
              <li>+33 1 23 45 67 89</li>
              <li>Paris, France</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Medflow. Tous droits réservés.</p>
          <div className="footer-legal">
            <Link to="/privacy">Confidentialité</Link>
            <Link to="/terms">Conditions</Link>
            <Link to="/legal">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;