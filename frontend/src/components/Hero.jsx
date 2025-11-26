import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Votre santé,<br />notre priorité
          </h1>

          <p className="hero-description">
            Medflow vous offre des soins médicaux de qualité avec une gestion
            de rendez-vous simplifiée et un suivi personnalisé.
          </p>

          <div className="hero-actions">
            <Link to="/appointment" className="btn btn-primary">
              Prendre rendez-vous
            </Link>
            <Link to="/services" className="btn btn-outline">
              Nos services
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">50+</div>
              <div className="hero-stat-label">Médecins</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">10k+</div>
              <div className="hero-stat-label">Patients</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">24/7</div>
              <div className="hero-stat-label">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;