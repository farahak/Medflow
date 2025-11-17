'use client'

import React, { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import styles from './ConsultationPage.module.css'

export default function ConsultationPage() {
  const [consultations, setConsultations] = useState([
    { id: 1, patient: 'Jean Dupont', doctor: 'Dr. Laurent', date: '2024-01-15', diagnosis: 'Grippe', medicines: [{ name: 'Paracétamol', dosage: '500mg', duration: '7 jours' }] },
  ])
  
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    date: '',
    diagnosis: '',
    medicines: []
  })

  const [showForm, setShowForm] = useState(false)
  const patients = ['Jean Dupont', 'Marie Martin', 'Pierre Bernard', 'Sophie Leclerc']
  const doctors = ['Dr. Laurent', 'Dr. Leclerc', 'Dr. Martin']

  const handleAddMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: '', dosage: '', duration: '' }]
    })
  }

  const handleRemoveMedicine = (index) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.filter((_, i) => i !== index)
    })
  }

  const handleUpdateMedicine = (index, field, value) => {
    const updated = [...formData.medicines]
    updated[index][field] = value
    setFormData({...formData, medicines: updated})
  }

  const handleSaveConsultation = () => {
    if (!formData.patient || !formData.doctor || !formData.date || !formData.diagnosis) {
      alert('Veuillez remplir tous les champs requis')
      return
    }

    setConsultations([...consultations, { ...formData, id: Date.now() }])
    console.log('[v0] Consultation saved:', formData)
    alert('Consultation sauvegardée!')
    setFormData({
      patient: '',
      doctor: '',
      date: '',
      diagnosis: '',
      medicines: []
    })
    setShowForm(false)
  }

  const handleGeneratePDF = (consultationId) => {
    console.log('[v0] Generating PDF for consultation:', consultationId)
    alert('Génération du PDF en cours...')
  }

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Consultations & Ordonnances</h1>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Annuler' : 'Nouvelle Consultation'}
            </Button>
          </div>

          {showForm && (
            <Card className={styles.formCard}>
              <h2>Nouvelle Consultation</h2>
              <div className={styles.formGrid}>
                <div className={styles.formSection}>
                  <h3>Informations du Patient</h3>
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
                  <Input
                    label="Date *"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.formSection}>
                  <h3>Diagnostic</h3>
                  <textarea
                    placeholder="Entrez le diagnostic..."
                    className={styles.textarea}
                    rows="6"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                  ></textarea>
                </div>

                <div className={styles.formSection}>
                  <h3>Ordonnances</h3>
                  <div className={styles.prescriptionList}>
                    {formData.medicines.map((medicine, index) => (
                      <div key={index} className={styles.prescription}>
                        <Input
                          label="Médicament"
                          placeholder="Nom du médicament"
                          value={medicine.name}
                          onChange={(e) => handleUpdateMedicine(index, 'name', e.target.value)}
                        />
                        <Input
                          label="Dosage"
                          placeholder="Ex: 500mg"
                          value={medicine.dosage}
                          onChange={(e) => handleUpdateMedicine(index, 'dosage', e.target.value)}
                        />
                        <Input
                          label="Durée"
                          placeholder="Ex: 7 jours"
                          value={medicine.duration}
                          onChange={(e) => handleUpdateMedicine(index, 'duration', e.target.value)}
                        />
                        <Button size="sm" variant="danger" onClick={() => handleRemoveMedicine(index)}>Supprimer</Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" onClick={handleAddMedicine}>Ajouter un Médicament</Button>
                </div>
              </div>

              <div className={styles.actions}>
                <Button onClick={handleSaveConsultation}>Sauvegarder Consultation</Button>
                <Button variant="secondary" onClick={() => setShowForm(false)}>Annuler</Button>
              </div>
            </Card>
          )}

          <div className={styles.consultationsList}>
            {consultations.map(consultation => (
              <Card key={consultation.id} className={styles.consultationCard}>
                <div className={styles.consultationHeader}>
                  <div>
                    <h3>{consultation.patient}</h3>
                    <p>{consultation.doctor} • {consultation.date}</p>
                  </div>
                </div>
                <div className={styles.consultationContent}>
                  <div>
                    <h4>Diagnostic</h4>
                    <p>{consultation.diagnosis}</p>
                  </div>
                  {consultation.medicines.length > 0 && (
                    <div>
                      <h4>Ordonnances</h4>
                      <ul className={styles.medicineList}>
                        {consultation.medicines.map((med, idx) => (
                          <li key={idx}>
                            {med.name} ({med.dosage}) - {med.duration}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className={styles.consultationActions}>
                  <Button size="sm" onClick={() => handleGeneratePDF(consultation.id)}>Générer PDF</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
