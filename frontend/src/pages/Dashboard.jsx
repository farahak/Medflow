'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import Button from '../components/Button'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    patients: 245,
    appointments: 18,
    revenue: 12500,
    pending: 5,
    doctors: 8,
    consultations: 42
  })

  const [recentData, setRecentData] = useState({
    appointments: [
      { id: 1, patient: 'Jean Dupont', doctor: 'Dr. Laurent', time: '09:00', status: 'Confirmé' },
      { id: 2, patient: 'Marie Martin', doctor: 'Dr. Leclerc', time: '10:30', status: 'En attente' },
      { id: 3, patient: 'Pierre Bernard', doctor: 'Dr. Laurent', time: '14:00', status: 'Confirmé' },
    ],
    patients: [
      { id: 1, name: 'Jean Dupont', lastVisit: '2024-01-15', status: 'Actif' },
      { id: 2, name: 'Marie Martin', lastVisit: '2024-01-16', status: 'Actif' },
      { id: 3, name: 'Pierre Bernard', lastVisit: '2024-01-17', status: 'Inactif' },
    ]
  })

  useEffect(() => {
    console.log('[v0] Dashboard loaded for role:', user?.role)
  }, [user])

  const renderRoleBasedContent = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <div className={styles.roleContent}>
            <h2>Vue Administrateur</h2>
            <div className={styles.quickStats}>
              <div className={styles.statBox}>
                <p>Staff Total</p>
                <strong>{stats.doctors}</strong>
              </div>
              <div className={styles.statBox}>
                <p>Taux d'occupation</p>
                <strong>87%</strong>
              </div>
              <div className={styles.statBox}>
                <p>Revenus Mensuels</p>
                <strong>${stats.revenue}</strong>
              </div>
            </div>
          </div>
        )
      case 'doctor':
        return (
          <div className={styles.roleContent}>
            <h2>Vue Médecin</h2>
            <div className={styles.quickStats}>
              <div className={styles.statBox}>
                <p>Consultations Aujourd'hui</p>
                <strong>{stats.appointments}</strong>
              </div>
              <div className={styles.statBox}>
                <p>Patients Suiuis</p>
                <strong>142</strong>
              </div>
              <div className={styles.statBox}>
                <p>Ordonnances Pendantes</p>
                <strong>{stats.pending}</strong>
              </div>
            </div>
          </div>
        )
      case 'receptionist':
        return (
          <div className={styles.roleContent}>
            <h2>Vue Réceptionniste</h2>
            <div className={styles.quickStats}>
              <div className={styles.statBox}>
                <p>Rendez-vous Aujourd'hui</p>
                <strong>{stats.appointments}</strong>
              </div>
              <div className={styles.statBox}>
                <p>Paiements Pendants</p>
                <strong>${stats.pending * 50}</strong>
              </div>
              <div className={styles.statBox}>
                <p>Nouveaux Patients</p>
                <strong>12</strong>
              </div>
            </div>
          </div>
        )
      case 'patient':
        return (
          <div className={styles.roleContent}>
            <h2>Bienvenue, {user?.name}!</h2>
            <div className={styles.patientInfo}>
              <Card>
                <h3>Prochains Rendez-vous</h3>
                <p>Vous n'avez pas de rendez-vous prévu</p>
                <Button>Prendre Rendez-vous</Button>
              </Card>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>Tableau de Bord</h1>
              <p className={styles.clinic}>{user?.clinic} • {user?.role}</p>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIcon}>👥</div>
                <div>
                  <h3>Patients</h3>
                  <p className={styles.statNumber}>{stats.patients}</p>
                </div>
              </div>
            </Card>

            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIcon}>📅</div>
                <div>
                  <h3>Rendez-vous</h3>
                  <p className={styles.statNumber}>{stats.appointments}</p>
                </div>
              </div>
            </Card>

            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIcon}>💰</div>
                <div>
                  <h3>Revenus Ce Mois</h3>
                  <p className={styles.statNumber}>${stats.revenue}</p>
                </div>
              </div>
            </Card>

            <Card className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statIcon}>⏳</div>
                <div>
                  <h3>En Attente</h3>
                  <p className={styles.statNumber}>{stats.pending}</p>
                </div>
              </div>
            </Card>
          </div>

          {renderRoleBasedContent()}

          <div className={styles.contentGrid}>
            <Card>
              <h2>Rendez-vous Prochains</h2>
              <table className={styles.miniTable}>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Médecin</th>
                    <th>Heure</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentData.appointments.map(apt => (
                    <tr key={apt.id}>
                      <td>{apt.patient}</td>
                      <td>{apt.doctor}</td>
                      <td>{apt.time}</td>
                      <td><span className={`${styles.badge} ${styles[apt.status.toLowerCase()]}`}>{apt.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card>
              <h2>Actions Rapides</h2>
              <div className={styles.quickActions}>
                <Button onClick={() => console.log('[v0] Adding patient')}>Nouveau Patient</Button>
                <Button variant="secondary" onClick={() => console.log('[v0] Adding appointment')}>Nouveau Rendez-vous</Button>
                <Button variant="secondary" onClick={() => console.log('[v0] Creating consultation')}>Nouvelle Consultation</Button>
                <Button variant="secondary" onClick={() => console.log('[v0] Creating invoice')}>Nouvelle Facture</Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
