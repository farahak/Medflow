import { useState, useEffect } from 'react';
import api from '../api/axios';
import styles from './DoctorsGallery.module.css';

export default function DoctorsGallery() {
    const [doctors, setDoctors] = useState([]);
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

    if (loading) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Nos Médecins</h1>
                <p>Découvrez notre équipe médicale qualifiée</p>
            </div>

            <div className={styles.doctorsGrid}>
                {doctors.map(doctor => (
                    <div key={doctor.id} className={styles.doctorCard}>
                        <div className={styles.photoContainer}>
                            {doctor.photo ? (
                                <img
                                    src={doctor.photo.startsWith('http') ? doctor.photo : `http://localhost:8000${doctor.photo}`}
                                    alt={`Dr. ${doctor.first_name} ${doctor.last_name}`}
                                    className={styles.photo}
                                />
                            ) : (
                                <div className={styles.photoPlaceholder}>
                                    <span>👨‍⚕️</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.info}>
                            <h2>Dr. {doctor.first_name} {doctor.last_name}</h2>
                            <p className={styles.specialty}>{doctor.specialty || 'Médecin Généraliste'}</p>

                            {doctor.phone && (
                                <p className={styles.contact}>📞 {doctor.phone}</p>
                            )}

                            {doctor.consultation_price && (
                                <p className={styles.price}>
                                    💰 Consultation: {parseFloat(doctor.consultation_price).toFixed(2)} €
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {doctors.length === 0 && (
                <p className={styles.noData}>Aucun médecin disponible pour le moment</p>
            )}
        </div>
    );
}
