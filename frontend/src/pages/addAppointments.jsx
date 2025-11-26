'use client'

import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'

export default function Appointment() {
  const { user } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [availabilities, setAvailabilities] = useState([])
  const [selectedAvailability, setSelectedAvailability] = useState(null)
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Récupérer tous les médecins
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/users/medecins/')
        setDoctors(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchDoctors()
  }, [])

  // Lorsque le médecin change, récupérer ses disponibilités
  useEffect(() => {
    if (!selectedDoctor) return
    const fetchAvailabilities = async () => {
      try {
        const res = await api.get(`/appointments/availabilities/?medecin=${selectedDoctor}`)
        setAvailabilities(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchAvailabilities()
  }, [selectedDoctor])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDoctor || !selectedAvailability) {
      setMessage('Veuillez sélectionner un médecin et une disponibilité')
      return
    }

    const payload = {
      medecin: selectedDoctor,
      start_datetime: selectedAvailability.start_datetime,
      end_datetime: selectedAvailability.end_datetime,
      reason
    }

    console.log('[Appointment] Sending payload:', payload)
    console.log('[Appointment] Selected doctor:', selectedDoctor)
    console.log('[Appointment] Selected availability:', selectedAvailability)

    try {
      const response = await api.post('/appointments/appointment/add/', payload)
      console.log('[Appointment] Success response:', response.data)
      setMessage('Rendez-vous créé avec succès !')
      setReason('')
      setSelectedAvailability(null)
      setSelectedDoctor(null)
      setAvailabilities([])
    } catch (err) {
      console.error('[Appointment] Error:', err)
      console.error('[Appointment] Error response:', err.response?.data)
      console.error('[Appointment] Error status:', err.response?.status)

      // Display the actual error from backend
      const errorMessage = err.response?.data?.detail ||
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        'Erreur lors de la création du rendez-vous'
      setMessage(errorMessage)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Prendre un rendez-vous</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Médecin</label>
          <select
            value={selectedDoctor || ''}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">-- Choisir un médecin --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.user.first_name} {doc.user.last_name} - {doc.specialty}
              </option>
            ))}
          </select>
        </div>

        {availabilities.length > 0 && (
          <div>
            <label>Disponibilité</label>
            <select
              value={selectedAvailability ? selectedAvailability.id : ''}
              onChange={(e) =>
                setSelectedAvailability(availabilities.find(a => a.id == e.target.value))
              }
            >
              <option value="">-- Choisir une disponibilité --</option>
              {availabilities.map((a) => (
                <option key={a.id} value={a.id}>
                  {new Date(a.start_datetime).toLocaleString()} - {new Date(a.end_datetime).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label>Raison</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motif de la consultation"
          />
        </div>

        <button type="submit">Prendre rendez-vous</button>
      </form>
    </div>
  )
}