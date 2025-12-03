import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './ReceptionistDoctors.module.css';

export default function ReceptionistDoctors() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [availabilities, setAvailabilities] = useState({});
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/users/medecins/');
            setDoctors(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setLoading(false);
        }
    };

    const fetchDoctorAvailabilities = async (doctorId) => {
        try {
            const response = await api.get(`/appointments/doctor/${doctorId}/availabilities/`);
            setAvailabilities(prev => ({ ...prev, [doctorId]: response.data }));
            setSelectedDoctor(doctorId);
        } catch (error) {
            console.error('Error fetching availabilities:', error);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Liste des Médecins & Disponibilités</h1>
                <button onClick={() => navigate('/receptionist/dashboard')} className={styles.backBtn}>
                    ← Retour au tableau de bord
                </button>
            </div>

            <div className={styles.content}>
                {/* Doctors List */}
                <div className={styles.doctorsSection}>
                    <h2>Médecins</h2>
                    <div className={styles.doctorsList}>
                        {doctors.map(doctor => (
                            <div
                                key={doctor.id}
                                className={`${styles.doctorCard} ${selectedDoctor === doctor.id ? styles.active : ''}`}
                                onClick={() => fetchDoctorAvailabilities(doctor.id)}
                            >
                                <div className={styles.doctorInfo}>
                                    <h3>Dr. {doctor.first_name} {doctor.last_name}</h3>
                                    <p className={styles.specialty}>{doctor.specialty || 'Généraliste'}</p>
                                    <p className={styles.email}>{doctor.user?.email}</p>
                                    {doctor.phone && <p className={styles.phone}>📞 {doctor.phone}</p>}
                                    {doctor.consultation_price && (
                                        <p className={styles.price}>💰 {parseFloat(doctor.consultation_price).toFixed(2)} €</p>
                                    )}
                                </div>
                                <button className={styles.viewBtn}>
                                    Voir Disponibilités →
                                </button>
                            </div>
                        ))}
                    </div>
                    {doctors.length === 0 && (
                        <p className={styles.noData}>Aucun médecin trouvé</p>
                    )}
                </div>

                {/* Availabilities */}
                {selectedDoctor && availabilities[selectedDoctor] && (
                    <div className={styles.availabilitiesSection}>
                        <h2>Disponibilités</h2>
                        <div className={styles.availabilitiesList}>
                            {availabilities[selectedDoctor].map(availability => (
                                <div key={availability.id} className={styles.availabilityCard}>
                                    <div className={styles.dateTime}>
                                        <p className={styles.date}>
                                            📅 {new Date(availability.start_datetime).toLocaleDateString('fr-FR')}
                                        </p>
                                        <p className={styles.time}>
                                            🕐 {new Date(availability.start_datetime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            {' - '}
                                            {new Date(availability.end_datetime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {availabilities[selectedDoctor].length === 0 && (
                            <p className={styles.noData}>Aucune disponibilité trouvée</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
