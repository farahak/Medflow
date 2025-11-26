import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      title: 'Rendez-vous en ligne',
      description: 'Prenez rendez-vous 24h/24 depuis notre plateforme sécurisée'
    },
    {
      title: 'Application mobile',
      description: 'Gérez vos consultations depuis votre smartphone'
    },
    {
      title: 'Sécurité des données',
      description: 'Vos données médicales sont cryptées et protégées'
    },
    {
      title: 'Résultats rapides',
      description: 'Recevez vos résultats d\'analyses en temps réel'
    }
  ];

  return (
    <section className="features section">
      <div className="container">
        <div className="features-header">
          <h2 className="section-title">Pourquoi choisir Medflow ?</h2>
          <p className="section-subtitle">
            Découvrez les avantages de notre plateforme médicale
          </p>
        </div>

        <div className="grid grid-4">
          {features.map((feature, index) => (
            <div key={index} className="card">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;