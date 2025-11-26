'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useApi } from '../hooks/useApi'
import Card from '../components/Card'
import Button from '../components/Button'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user } = useAuth()
  const { getDoctorAppointments, getMyAvailabilities, loading } = useApi()

  const [stats, setStats] = useState({
    patients: 245,
    appointments: 0,
    revenue: 12500,
    pending: 0,
    doctors: 8,
    consultations: 42
  })

  const [recentData, setRecentData] = useState({
    appointments: [],
    availabilities: [],
    patients: []
  })

  // Fetch doctor's data when component mounts
  useEffect(() => {
    console.log('[Dashboard] Loaded for role:', user?.role)

    if (user?.role === 'medecin') {
      fetchDoctorData()
    }
  }, [user])

  const fetchDoctorData = async () => {
    try {
      console.log('[Dashboard] Fetching doctor appointments...')

      // Fetch appointments
      const appointmentsData = await getDoctorAppointments()
      console.log('[Dashboard] Appointments data received:', appointmentsData)
      console.log('[Dashboard] Appointments array:', Array.isArray(appointmentsData))
      console.log('[Dashboard] Appointments length:', appointmentsData?.length)

      // TODO: Uncomment when availability endpoint is available
      // Fetch availabilities
      // const availabilitiesData = await getMyAvailabilities()
      // console.log('[Dashboard] Availabilities data:', availabilitiesData)

      // Update state with real data
      setRecentData(prev => {
        const newData = {
          ...prev,
          appointments: appointmentsData || [],
          // availabilities: availabilitiesData || []
        }
        console.log('[Dashboard] Updating recentData to:', newData)
        return newData
      })

      // Update stats
      setStats(prev => ({
        ...prev,
        appointments: appointmentsData?.length || 0,
        pending: appointmentsData?.filter(apt => apt.status === 'pending')?.length || 0
      }))

      console.log('[Dashboard] Data fetch complete')

    } catch (error) {
      console.error('[Dashboard] Error fetching doctor data:', error)
      console.error('[Dashboard] Error details:', error.response?.data)
    }
  }

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
      case 'medecin':
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
    <div className={styles.dashboardContent}>
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
          {loading ? (
            <p>Chargement...</p>
          ) : recentData.appointments.length > 0 ? (
            <table className={styles.miniTable}>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Heure</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentData.appointments.slice(0, 5).map(apt => (
                  <tr key={apt.id}>
                    <td>{apt.patient_name || apt.patient || 'N/A'}</td>
                    <td>{apt.date || new Date(apt.created_at).toLocaleDateString()}</td>
                    <td>{apt.time || apt.start_time || 'N/A'}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[apt.status?.toLowerCase()]}`}>
                        {apt.status === 'pending' ? 'En attente' :
                          apt.status === 'confirmed' ? 'Confirmé' :
                            apt.status === 'cancelled' ? 'Annulé' : apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucun rendez-vous pour le moment</p>
          )}
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

        {user?.role === 'medecin' && (
          <Card>
            <h2>Mes Disponibilités</h2>
            {loading ? (
              <p>Chargement...</p>
            ) : recentData.availabilities.length > 0 ? (
              <table className={styles.miniTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Heure Début</th>
                    <th>Heure Fin</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentData.availabilities.slice(0, 5).map(avail => (
                    <tr key={avail.id}>
                      <td>{avail.date || new Date(avail.created_at).toLocaleDateString()}</td>
                      <td>{avail.start_time}</td>
                      <td>{avail.end_time}</td>
                      <td>
                        <span className={`${styles.badge} ${avail.is_booked ? styles.cancelled : styles.confirmed}`}>
                          {avail.is_booked ? 'Réservé' : 'Disponible'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucune disponibilité ajoutée</p>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
