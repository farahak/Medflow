'use client'

import React, { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import styles from './AppointmentsList.module.css'

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([
    { id: 1, patient: 'Jean Dupont', doctor: 'Dr. Laurent', date: '2024-01-20', time: '09:00', status: 'Confirmé', notes: 'Consultation générale' },
    { id: 2, patient: 'Marie Martin', doctor: 'Dr. Leclerc', date: '2024-01-20', time: '10:30', status: 'En attente', notes: 'Suivi cardio' },
    { id: 3, patient: 'Pierre Bernard', doctor: 'Dr. Laurent', date: '2024-01-20', time: '14:00', status: 'Confirmé', notes: 'Contrôle annuel' },
    { id: 4, patient: 'Sophie Leclerc', doctor: 'Dr. Leclerc', date: '2024-01-21', time: '11:00', status: 'Annulé', notes: '' },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    status: 'En attente',
    notes: ''
  })

  const doctors = ['Dr. Laurent', 'Dr. Leclerc', 'Dr. Martin', 'Dr. Dubois']
  const patients = ['Jean Dupont', 'Marie Martin', 'Pierre Bernard', 'Sophie Leclerc', 'Luc Dubois']

  const handleOpenModal = (appointment = null) => {
    if (appointment) {
      setFormData(appointment)
      setEditingId(appointment.id)
    } else {
      setFormData({
        patient: '',
        doctor: '',
        date: '',
        time: '',
        status: 'En attente',
        notes: ''
      })
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const handleSaveAppointment = () => {
    if (!formData.patient || !formData.doctor || !formData.date || !formData.time) {
      alert('Veuillez remplir tous les champs requis')
      return
    }

    if (editingId) {
      setAppointments(appointments.map(a => a.id === editingId ? { ...formData, id: editingId } : a))
      console.log('[v0] Appointment updated:', formData)
    } else {
      setAppointments([...appointments, { ...formData, id: Date.now() }])
      console.log('[v0] Appointment created:', formData)
    }
    handleCloseModal()
    alert(editingId ? 'Rendez-vous modifié!' : 'Rendez-vous créé!')
  }

  const handleCancelAppointment = (id) => {
    if (window.confirm('Annuler ce rendez-vous?')) {
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Annulé' } : a))
      console.log('[v0] Appointment cancelled:', id)
    }
  }

  const handleConfirmAppointment = (id) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Confirmé' } : a))
    console.log('[v0] Appointment confirmed:', id)
  }

  const filteredAppointments = filterStatus === 'all'
    ? appointments
    : appointments.filter(a => a.status === filterStatus)

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>Rendez-vous</h1>
              <p>Total: {appointments.length} rendez-vous</p>
            </div>
            <Button onClick={() => handleOpenModal()}>Nouveau Rendez-vous</Button>
          </div>

          <Card>
            <div className={styles.filterBar}>
              <div className={styles.filters}>
                <button
                  className={`${styles.filterBtn} ${filterStatus === 'all' ? styles.active : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  Tous ({appointments.length})
                </button>
                <button
                  className={`${styles.filterBtn} ${filterStatus === 'Confirmé' ? styles.active : ''}`}
                  onClick={() => setFilterStatus('Confirmé')}
                >
                  Confirmés ({appointments.filter(a => a.status === 'Confirmé').length})
                </button>
                <button
                  className={`${styles.filterBtn} ${filterStatus === 'En attente' ? styles.active : ''}`}
                  onClick={() => setFilterStatus('En attente')}
                >
                  En attente ({appointments.filter(a => a.status === 'En attente').length})
                </button>
                <button
                  className={`${styles.filterBtn} ${filterStatus === 'Annulé' ? styles.active : ''}`}
                  onClick={() => setFilterStatus('Annulé')}
                >
                  Annulés ({appointments.filter(a => a.status === 'Annulé').length})
                </button>
              </div>
            </div>
          </Card>

          <div className={styles.appointmentsGrid}>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(apt => (
                <Card key={apt.id} className={styles.appointmentCard}>
                  <div className={styles.appointmentHeader}>
                    <div>
                      <h3>{apt.patient}</h3>
                      <p className={styles.doctor}>{apt.doctor}</p>
                    </div>
                    <span className={`${styles.status} ${styles[apt.status.toLowerCase().replace(' ', '-')]}`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className={styles.appointmentDetails}>
                    <p><strong>Date:</strong> {apt.date}</p>
                    <p><strong>Heure:</strong> {apt.time}</p>
                    {apt.notes && <p><strong>Notes:</strong> {apt.notes}</p>}
                  </div>
                  <div className={styles.appointmentActions}>
                    {apt.status !== 'Annulé' && (
                      <>
                        <Button size="sm" onClick={() => handleOpenModal(apt)}>Éditer</Button>
                        {apt.status === 'En attente' && (
                          <Button size="sm" variant="secondary" onClick={() => handleConfirmAppointment(apt.id)}>Confirmer</Button>
                        )}
                        <Button size="sm" variant="danger" onClick={() => handleCancelAppointment(apt.id)}>Annuler</Button>
                      </>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className={styles.emptyState}>
                <p>Aucun rendez-vous trouvé</p>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        title={editingId ? 'Modifier le Rendez-vous' : 'Nouveau Rendez-vous'}
        onClose={handleCloseModal}
      >
        <div className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Patient *</label>
              <select
                value={formData.patient}
                onChange={(e) => setFormData({...formData, patient: e.target.value})}
                className={styles.select}
              >
                <option value="">Sélectionner un patient</option>
                {patients.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Médecin *</label>
              <select
                value={formData.doctor}
                onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                className={styles.select}
              >
                <option value="">Sélectionner un médecin</option>
                {doctors.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <Input
              label="Date *"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
            <Input
              label="Heure *"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className={styles.select}
            >
              <option value="En attente">En attente</option>
              <option value="Confirmé">Confirmé</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>
          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Notes additionnelles..."
          />
          <div className={styles.modalActions}>
            <Button onClick={handleSaveAppointment}>
              {editingId ? 'Modifier' : 'Créer'}
            </Button>
            <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
