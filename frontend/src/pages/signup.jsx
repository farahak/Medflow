'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'
import styles from './Signup.module.css'   // <--- ton fichier CSS

const Signup = () => {
  const router = useRouter()
  const { signup, login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState('patient')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1️⃣ Signup backend
      const res = await signup(email, password, firstName, lastName, role)

      // 2️⃣ Stocker tokens + user
      const { user, access, refresh } = res
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)

      // 3️⃣ Redirect
      router.push('/dashboard')

    } catch (err) {
      console.log("Signup error:", err)
      setError(err.response?.data?.detail || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.icon}>🩺</span>
          <h1>Create Account</h1>
          <p>Join our health platform</p>
        </div>

        {/* Error message */}
        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>

          <div>
            <label>First Name</label>
            <input
              type="text"
              required
              className={styles.select}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label>Last Name</label>
            <input
              type="text"
              required
              className={styles.select}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              required
              className={styles.select}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              required
              className={styles.select}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Role selection */}
          <div className={styles.roleSelect}>
            <label>Choose Role</label>
            <select
              className={styles.select}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="patient">Patient</option>
              <option value="medecin">Médecin</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>

          {/* Signup button */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Test credentials */}
        <div className={styles.credentials}>
          <p>You will receive:</p>
          <small>User + Access Token + Refresh Token</small>
        </div>
      </div>
    </div>
  )
}

export default Signup
