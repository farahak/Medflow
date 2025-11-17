'use client'

import React, { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import styles from './PatientsList.module.css'

export default function PatientsList() {
  const [patients, setPatients] = useState([
    { id: 1, name: 'Jean Dupont', email: 'jean@email.com', phone: '06 12 34 56 78', age: 45, gender: 'M', status: 'Actif' },
    { id: 2, name: 'Marie Martin', email: 'marie@email.com', phone: '06 23 45 67 89', age: 32, gender: 'F', status: 'Actif' },
    { id: 3, name: 'Pierre Bernard', email: 'pierre@email.com', phone: '06 34 56 78 90', age: 58, gender: 'M', status: 'Actif' },
    { id: 4, name: 'Sophie Leclerc', email: 'sophie@email.com', phone: '06 45 67 89 01', age: 28, gender: 'F', status: 'Inactif' },
    { id: 5, name: 'Luc Dubois', email: 'luc@email.com', phone: '06 56 78 90 12', age: 55, gender: 'M', status: 'Actif' },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', age: '', gender: 'M', status: 'Actif' })

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setFormData(patient)
      setEditingId(patient.id)
    } else {
      setFormData({ name: '', email: '', phone: '', age: '', gender: 'M', status: 'Actif' })
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData({ name: '', email: '', phone: '', age: '', gender: 'M', status: 'Actif' })
  }

  const handleSavePatient = () => {
    if (!formData.name || !formData.email) {
      alert('Veuillez remplir tous les champs requis')
      return
    }

    if (editingId) {
      setPatients(patients.map(p => p.id === editingId ? { ...formData, id: editingId } : p))
      console.log('[v0] Patient updated:', formData)
    } else {
      setPatients([...patients, { ...formData, id: Date.now() }])
      console.log('[v0] Patient added:', formData)
    }
    handleCloseModal()
    alert(editingId ? 'Patient modifié avec succès!' : 'Patient ajouté avec succès!')
  }

  const handleDeletePatient = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient?')) {
      setPatients(patients.filter(p => p.id !== id))
      console.log('[v0] Patient deleted:', id)
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  )

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>Gestion des Patients</h1>
              <p>Total: {patients.length} patients</p>
            </div>
            <Button onClick={() => handleOpenModal()}>Ajouter un Patient</Button>
          </div>

          <Card>
            <div className={styles.searchBar}>
              <Input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Âge</th>
                  <th>Genre</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map(patient => (
                    <tr key={patient.id}>
                      <td><strong>{patient.name}</strong></td>
                      <td>{patient.email}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.age}</td>
                      <td>{patient.gender}</td>
                      <td>
                        <span className={`${styles.status} ${styles[patient.status.toLowerCase()]}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className={styles.actions}>
                        <Button size="sm" onClick={() => handleOpenModal(patient)}>Éditer</Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeletePatient(patient.id)}>Supprimer</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className={styles.emptyMessage}>
                      Aucun patient trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        title={editingId ? 'Modifier le Patient' : 'Ajouter un Patient'}
        onClose={handleCloseModal}
      >
        <div className={styles.modalForm}>
          <Input
            label="Nom *"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input
            label="Téléphone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <Input
            label="Âge"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
          />
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Genre</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className={styles.select}
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className={styles.select}
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
                <option value="Suspendu">Suspendu</option>
              </select>
            </div>
          </div>
          <div className={styles.modalActions}>
            <Button onClick={handleSavePatient}>
              {editingId ? 'Modifier' : 'Ajouter'}
            </Button>
            <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
