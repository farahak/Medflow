'use client'

import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import styles from './PatientPortal.module.css'

export default function PatientPortal() {
  const navigate = useNavigate()

  const handleBookAppointment = () => {
    navigate('/addAppointments')
  }

  const handleViewConsultations = () => {
    navigate('/profile') // Redirects to Profile for history
  }

  const handleDownloadDocuments = () => {
    console.log('[v0] Opening documents download')
    alert('Affichage de vos documents...')
  }

  const handleMessaging = () => {
    navigate('/messages')
  }

  const handlePayment = () => {
    console.log('[v0] Opening payment')
    alert('Redirection vers le paiement sécurisé (Stripe)...')
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <span className={styles.logo}>🏥 MedFlow Patient</span>
          <Button onClick={() => window.location.href = '/login'}>Déconnexion</Button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.hero}>
            <h1>Portail Patient MedFlow</h1>
            <p>Gérez vos rendez-vous, consultations et documents médicaux en ligne</p>
          </section>

          <div className={styles.features}>
            <Card className={styles.featureCard}>
              <div className={styles.featureIcon}>📅</div>
              <h3>Réservez vos Rendez-vous</h3>
              <p>Prenez facilement rendez-vous avec vos médecins de confiance</p>
              <Button onClick={handleBookAppointment}>Réserver Maintenant</Button>
            </Card>

            <Card className={styles.featureCard}>
              <div className={styles.featureIcon}>📋</div>
              <h3>Vos Consultations</h3>
              <p>Accédez à vos dossiers et résultats de consultations</p>
              <Button onClick={handleViewConsultations}>Consulter</Button>
            </Card>

            <Card className={styles.featureCard}>
              <div className={styles.featureIcon}>📄</div>
              <h3>Vos Documents</h3>
              <p>Téléchargez ordonnances et résultats d'analyses</p>
              <Button onClick={handleDownloadDocuments}>Télécharger</Button>
            </Card>

            <Card className={styles.featureCard}>
              <div className={styles.featureIcon}>💬</div>
              <h3>Messagerie</h3>
              <p>Contactez vos médecins directement</p>
              <Button onClick={handleMessaging}>Messagerie</Button>
            </Card>

            <Card className={styles.featureCard}>
              <div className={styles.featureIcon}>💳</div>
              <h3>Paiement Sécurisé</h3>
              <p>Payez vos consultations directement en ligne</p>
              <Button onClick={handlePayment}>Payer</Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
