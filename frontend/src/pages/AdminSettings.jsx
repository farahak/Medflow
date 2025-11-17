'use client'

import React, { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import styles from './AdminSettings.module.css'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    clinicName: 'Clinique Centrale',
    address: '123 Rue de la Santé',
    city: 'Paris',
    phone: '+33 1 23 45 67 89',
    email: 'contact@clinique.com',
    website: 'www.clinique-centrale.fr',
    taxId: 'FR12345678901',
    openingHours: 'Lun-Ven 09:00-18:00',
  })

  const [staff, setStaff] = useState([
    { id: 1, name: 'Dr. Laurent', role: 'Médecin', specialty: 'Généraliste', status: 'Actif' },
    { id: 2, name: 'Dr. Leclerc', role: 'Médecin', specialty: 'Cardiologue', status: 'Actif' },
    { id: 3, name: 'Marie Dupont', role: 'Réceptionniste', specialty: 'N/A', status: 'Actif' },
  ])

  const [services, setServices] = useState([
    { id: 1, name: 'Consultation Générale', price: 100, duration: '30 min' },
    { id: 2, name: 'Consultation Spécialisée', price: 150, duration: '45 min' },
    { id: 3, name: 'Tests Médicaux', price: 50, duration: '20 min' },
  ])

  const [activeTab, setActiveTab] = useState('clinic')
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [staffFormData, setStaffFormData] = useState({ name: '', role: 'Médecin', specialty: '', status: 'Actif' })
  const [serviceFormData, setServiceFormData] = useState({ name: '', price: '', duration: '' })

  const handleSaveClinicSettings = () => {
    console.log('[v0] Clinic settings saved:', settings)
    alert('Paramètres clinique sauvegardés!')
  }

  const handleAddStaff = () => {
    if (!staffFormData.name) {
      alert('Veuillez entrer le nom')
      return
    }
    setStaff([...staff, { ...staffFormData, id: Date.now() }])
    setStaffFormData({ name: '', role: 'Médecin', specialty: '', status: 'Actif' })
    setIsStaffModalOpen(false)
    alert('Membre du staff ajouté!')
  }

  const handleRemoveStaff = (id) => {
    if (window.confirm('Supprimer ce membre du staff?')) {
      setStaff(staff.filter(s => s.id !== id))
      console.log('[v0] Staff member removed:', id)
    }
  }

  const handleAddService = () => {
    if (!serviceFormData.name || !serviceFormData.price) {
      alert('Veuillez remplir tous les champs')
      return
    }
    setServices([...services, { ...serviceFormData, id: Date.now() }])
    setServiceFormData({ name: '', price: '', duration: '' })
    setIsServiceModalOpen(false)
    alert('Service ajouté!')
  }

  const handleRemoveService = (id) => {
    if (window.confirm('Supprimer ce service?')) {
      setServices(services.filter(s => s.id !== id))
      console.log('[v0] Service removed:', id)
    }
  }

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Paramètres Administration</h1>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'clinic' ? styles.active : ''}`}
              onClick={() => setActiveTab('clinic')}
            >
              Clinique
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'staff' ? styles.active : ''}`}
              onClick={() => setActiveTab('staff')}
            >
              Staff ({staff.length})
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'services' ? styles.active : ''}`}
              onClick={() => setActiveTab('services')}
            >
              Services ({services.length})
            </button>
          </div>

          {activeTab === 'clinic' && (
            <Card className={styles.settingsCard}>
              <h2>Informations Clinique</h2>
              <div className={styles.formGrid}>
                <Input
                  label="Nom de la Clinique"
                  value={settings.clinicName}
                  onChange={(e) => setSettings({...settings, clinicName: e.target.value})}
                />
                <Input
                  label="Téléphone"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                />
                <Input
                  label="Email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                />
                <Input
                  label="Site Web"
                  value={settings.website}
                  onChange={(e) => setSettings({...settings, website: e.target.value})}
                />
                <Input
                  label="Adresse"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                />
                <Input
                  label="Ville"
                  value={settings.city}
                  onChange={(e) => setSettings({...settings, city: e.target.value})}
                />
                <Input
                  label="Numéro SIRET"
                  value={settings.taxId}
                  onChange={(e) => setSettings({...settings, taxId: e.target.value})}
                />
                <Input
                  label="Horaires"
                  value={settings.openingHours}
                  onChange={(e) => setSettings({...settings, openingHours: e.target.value})}
                />
              </div>
              <Button onClick={handleSaveClinicSettings}>Sauvegarder</Button>
            </Card>
          )}

          {activeTab === 'staff' && (
            <div>
              <div className={styles.actionBar}>
                <Button onClick={() => setIsStaffModalOpen(true)}>Ajouter Membre</Button>
              </div>
              <div className={styles.itemsList}>
                {staff.map(member => (
                  <Card key={member.id} className={styles.itemCard}>
                    <div className={styles.itemHeader}>
                      <div>
                        <h3>{member.name}</h3>
                        <p>{member.role} • {member.specialty}</p>
                      </div>
                      <span className={`${styles.status} ${styles[member.status.toLowerCase()]}`}>
                        {member.status}
                      </span>
                    </div>
                    <div className={styles.itemActions}>
                      <Button size="sm" variant="secondary">Éditer</Button>
                      <Button size="sm" variant="danger" onClick={() => handleRemoveStaff(member.id)}>Supprimer</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <div className={styles.actionBar}>
                <Button onClick={() => setIsServiceModalOpen(true)}>Ajouter Service</Button>
              </div>
              <div className={styles.itemsList}>
                {services.map(service => (
                  <Card key={service.id} className={styles.itemCard}>
                    <div className={styles.itemHeader}>
                      <div>
                        <h3>{service.name}</h3>
                        <p>{service.duration}</p>
                      </div>
                      <strong className={styles.price}>${service.price}</strong>
                    </div>
                    <div className={styles.itemActions}>
                      <Button size="sm" variant="secondary">Éditer</Button>
                      <Button size="sm" variant="danger" onClick={() => handleRemoveService(service.id)}>Supprimer</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Modal
        isOpen={isStaffModalOpen}
        title="Ajouter un Membre du Staff"
        onClose={() => setIsStaffModalOpen(false)}
      >
        <div className={styles.modalForm}>
          <Input
            label="Nom *"
            value={staffFormData.name}
            onChange={(e) => setStaffFormData({...staffFormData, name: e.target.value})}
            required
          />
          <div className={styles.formGroup}>
            <label>Rôle</label>
            <select
              value={staffFormData.role}
              onChange={(e) => setStaffFormData({...staffFormData, role: e.target.value})}
              className={styles.select}
            >
              <option value="Médecin">Médecin</option>
              <option value="Réceptionniste">Réceptionniste</option>
              <option value="Infirmier">Infirmier</option>
              <option value="Administrateur">Administrateur</option>
            </select>
          </div>
          <Input
            label="Spécialité"
            value={staffFormData.specialty}
            onChange={(e) => setStaffFormData({...staffFormData, specialty: e.target.value})}
          />
          <div className={styles.formGroup}>
            <label>Statut</label>
            <select
              value={staffFormData.status}
              onChange={(e) => setStaffFormData({...staffFormData, status: e.target.value})}
              className={styles.select}
            >
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="Congé">En congé</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <Button onClick={handleAddStaff}>Ajouter</Button>
            <Button variant="secondary" onClick={() => setIsStaffModalOpen(false)}>Annuler</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isServiceModalOpen}
        title="Ajouter un Service"
        onClose={() => setIsServiceModalOpen(false)}
      >
        <div className={styles.modalForm}>
          <Input
            label="Nom du Service *"
            value={serviceFormData.name}
            onChange={(e) => setServiceFormData({...serviceFormData, name: e.target.value})}
            required
          />
          <Input
            label="Prix *"
            type="number"
            value={serviceFormData.price}
            onChange={(e) => setServiceFormData({...serviceFormData, price: e.target.value})}
            required
          />
          <Input
            label="Durée"
            value={serviceFormData.duration}
            onChange={(e) => setServiceFormData({...serviceFormData, duration: e.target.value})}
            placeholder="Ex: 30 min"
          />
          <div className={styles.modalActions}>
            <Button onClick={handleAddService}>Ajouter</Button>
            <Button variant="secondary" onClick={() => setIsServiceModalOpen(false)}>Annuler</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
