import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sophie Martin",
      role: "Patiente",
      content: "Une équipe formidable et très à l'écoute. La prise de rendez-vous est simple et rapide."
    },
    {
      name: "Marc Dubois",
      role: "Patient",
      content: "Le suivi est excellent. Je recommande vivement cette clinique pour son professionnalisme."
    },
    {
      name: "Julie Bernard",
      role: "Patiente",
      content: "Interface très intuitive pour gérer mes rendez-vous. Très satisfaite du service."
    }
  ];

  return (
    <section className="testimonials section">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="section-title">Ce Que Disent Nos Patients</h2>
        </div>

        <div className="grid grid-3">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card card">
              <p className="testimonial-content">"{t.content}"</p>
              <div className="testimonial-author">
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
