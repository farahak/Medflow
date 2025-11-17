'use client'

import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar({ currentPage, onNavigate, userRole, onLogout }) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    onLogout?.()
  }

  const menuItems = [
    { label: 'Dashboard', page: 'dashboard', roles: ['admin', 'doctor', 'receptionist'] },
    { label: 'Patients', page: 'patients', roles: ['admin', 'doctor', 'receptionist'] },
    { label: 'Rendez-vous', page: 'appointments', roles: ['admin', 'doctor', 'receptionist'] },
    { label: 'Consultations', page: 'consultations', roles: ['admin', 'doctor'] },
    { label: 'Facturation', page: 'billing', roles: ['admin', 'receptionist'] },
    { label: 'Portail Patient', page: 'patient-portal', roles: ['patient'] },
    { label: 'Paramètres', page: 'settings', roles: ['admin'] },
  ]

  const visibleItems = menuItems.filter(item => item.roles.includes(user?.role || userRole))

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.icon}>🏥</span>
          <span className={styles.text}>MedFlow</span>
        </div>

        <ul className={styles.menu}>
          {visibleItems.map(item => (
            <li key={item.page}>
              <button
                onClick={() => onNavigate(item.page)}
                className={`${styles.menuItem} ${currentPage === item.page ? styles.active : ''}`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.userSection}>
          <span className={styles.userEmail}>{user?.email}</span>
          <span className={styles.userRole}>{user?.role}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>Déconnexion</button>
        </div>
      </div>
    </nav>
  )
}
