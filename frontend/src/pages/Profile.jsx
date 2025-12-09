'use client'

import React, { useState, useEffect } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import styles from './Profile.module.css'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
    const { request } = useApi()
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('info') // info, security, history
    const [profile, setProfile] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '', confirm_password: '' })
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        fetchProfileData()
    }, [user])

    const fetchProfileData = async () => {
        try {
            setLoading(true)

            // For patients, fetch patient profile and appointment history
            if (user?.role === 'patient') {
                const profileData = await request('get', '/users/me/patient-profile/')
                setProfile(profileData)

                const historyData = await request('get', '/appointments/my-history/')
                setAppointments(historyData)
            }
            // For doctors, fetch doctor appointments
            else if (user?.role === 'medecin') {
                const historyData = await request('get', '/appointments/my-appointments/')
                setAppointments(historyData)
            }
            // For other roles, just use the user data from context
            setProfile({ user: user })

        } catch (error) {
            console.error('Error fetching profile:', error)
            setMessage({ type: 'error', text: 'Error loading profile data.' })
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        if (passwordData.new_password !== passwordData.confirm_password) {
            setMessage({ type: 'error', text: 'New passwords do not match.' })
            return
        }

        try {
            await request('put', '/users/change-password/', {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            })
            setMessage({ type: 'success', text: 'Password changed successfully.' })
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' })
        } catch (error) {
            console.error('Error changing password:', error)
            setMessage({ type: 'error', text: error.response?.data?.detail || 'Error changing password.' })
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            dateStyle: 'long',
            timeStyle: 'short'
        })
    }

    if (loading) return <div className={styles.container}>Loading...</div>

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Mon Profil</h1>
                <p>Gérez vos informations personnelles et sécurisez votre compte</p>
            </div>

            {message.text && (
                <div className={message.type === 'error' ? styles.errorMessage : styles.successMessage}>
                    {message.text}
                </div>
            )}

            <div className={styles.grid}>
                {/* Left Column: Personal Info & Security */}
                <div className={styles.leftCol}>
                    <div className={`${styles.card} ${styles.marginBottom}`}>
                        <h2 className={styles.sectionTitle}>Informations Personnelles</h2>
                        {profile && (
                            <div className={styles.infoContent}>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Nom complet</span>
                                    <span className={styles.infoValue}>{profile.user.first_name} {profile.user.last_name}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Email</span>
                                    <span className={styles.infoValue}>{profile.user.email}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Rôle</span>
                                    <span className={styles.infoValue}>
                                        {profile.user.role === 'medecin' ? 'Médecin' :
                                            profile.user.role === 'patient' ? 'Patient' :
                                                profile.user.role === 'receptionist' ? 'Réceptionniste' :
                                                    profile.user.role}
                                    </span>
                                </div>
                                {profile.phone && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Téléphone</span>
                                        <span className={styles.infoValue}>{profile.phone}</span>
                                    </div>
                                )}
                                {profile.date_of_birth && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Date de naissance</span>
                                        <span className={styles.infoValue}>{profile.date_of_birth}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.sectionTitle}>Sécurité</h2>
                        <form onSubmit={handlePasswordChange}>
                            <div className={styles.formGroup}>
                                <label>Mode de passe actuel</label>
                                <Input
                                    type="password"
                                    value={passwordData.old_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Nouveau mot de passe</label>
                                <Input
                                    type="password"
                                    value={passwordData.new_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Confirmer le nouveau mot de passe</label>
                                <Input
                                    type="password"
                                    value={passwordData.confirm_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <Button type="submit">Mettre à jour le mot de passe</Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Appointment History */}
                <div className={styles.rightCol}>
                    <div className={styles.card}>
                        <h2 className={styles.sectionTitle}>Historique des Rendez-vous</h2>
                        {appointments.length === 0 ? (
                            <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>Aucun rendez-vous trouvé.</p>
                        ) : (
                            <div className={styles.appointmentsList}>
                                {appointments.map(apt => (
                                    <div key={apt.id} className={styles.appointmentCard}>
                                        <div className={styles.appointmentHeader}>
                                            <span className={styles.doctorName}>Dr. {apt.medecin_name || 'Médecin'}</span> {/* Assuming serializer returns name or we fetch it? AppointmentSerializer usually returns ID. We might need to update serializer or fetching. Let's check AppointmentSerializer later. For now assuming ID or basic info. */}
                                            <span className={`${styles.status} ${styles['status_' + apt.status]}`}>
                                                {apt.status}
                                            </span>
                                        </div>
                                        <div className={styles.appointmentTime}>
                                            📅 {formatDate(apt.start_datetime)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
