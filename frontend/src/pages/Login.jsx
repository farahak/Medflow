'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'
import styles from './Login.module.css'
import { useNavigate } from "react-router-dom";


export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('receptionist')
  const [errors, setErrors] = useState({})
  const { login, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && onLoginSuccess) {
      onLoginSuccess(role)
    }
  }, [isAuthenticated, role, onLoginSuccess])

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email requis'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email invalide'
    }

    if (!password) {
      newErrors.password = 'Mot de passe requis'
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit faire au least 6 caractères'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const userData = await login(email, password)
      console.log('User data from login:', userData)
      console.log('User role:', userData?.role)

      // Redirect doctors to dashboard, others to home
      if (userData?.role === 'medecin') {
        console.log('Redirecting to dashboard')
        navigate("/dashboard")
      } else {
        console.log('Redirecting to home')
        navigate("/home")
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ form: error.message || 'Identifiants invalides. Veuillez réessayer.' })
    }
  }

  const testCredentials = [
    { role: 'admin', email: 'admin@medflow.com' },
    { role: 'doctor', email: 'doctor@medflow.com' },
    { role: 'receptionist', email: 'receptionist@medflow.com' },
    { role: 'patient', email: 'patient@medflow.com' }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <span className={styles.icon}>🏥</span>
          <h1>MedFlow</h1>
          <p>Gestion Clinique Médicale</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.form && <div className={styles.error}>{errors.form}</div>}

          <Input
            label="Email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />



          <Button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? 'Connexion...' : 'Se Connecter'}
          </Button>
        </form>

        <div className={styles.credentials}>
          <p>Identifiants de test (mot de passe: password):</p>
          <div className={styles.credentialsList}>
            {testCredentials.map(cred => (
              <small key={cred.role}>
                <strong>{cred.role}:</strong> {cred.email}
              </small>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
