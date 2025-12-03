import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './ReceptionistDashboard.module.css';

export default function ReceptionistDashboard() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        done: 0,
        today: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments/all/');
            const data = response.data;
            setAppointments(data.slice(0, 10)); // Show latest 10

            // Calculate stats
            const now = new Date();
            const todayStart = new Date(now.setHours(0, 0, 0, 0));
            const todayEnd = new Date(now.setHours(23, 59, 59, 999));

            setStats({
                total: data.length,
                pending: data.filter(a => a.status === 'pending').length,
                confirmed: data.filter(a => a.status === 'confirmed').length,
                done: data.filter(a => a.status === 'done').length,
                today: data.filter(a => {
                    const appointmentDate = new Date(a.start_datetime);
                    return appointmentDate >= todayStart && appointmentDate <= todayEnd;
                }).length
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: styles.statusPending,
            confirmed: styles.statusConfirmed,
            done: styles.statusDone,
            cancelled: styles.statusCancelled
        };
        return (
            <span className={`${styles.statusBadge} ${statusClasses[status]}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1>Réceptionniste - Tableau de Bord</h1>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total Rendez-vous</h3>
                    <p className={styles.statNumber}>{stats.total}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>En Attente</h3>
                    <p className={styles.statNumber}>{stats.pending}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Confirmés</h3>
                    <p className={styles.statNumber}>{stats.confirmed}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Terminés</h3>
                    <p className={styles.statNumber}>{stats.done}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Aujourd'hui</h3>
                    <p className={styles.statNumber}>{stats.today}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.actions}>
                <button onClick={() => navigate('/receptionist/appointments')} className={styles.actionBtn}>
                    📋 Voir tous les rendez-vous
                </button>
                <button onClick={() => navigate('/receptionist/doctors')} className={styles.actionBtn}>
                    👨‍⚕️ Voir les médecins
                </button>
                <button onClick={() => navigate('/receptionist/invoices')} className={styles.actionBtn}>
                    💰 Voir les factures
                </button>
            </div>

            {/* Recent Appointments */}
            <div className={styles.section}>
                <h2>Rendez-vous Récents</h2>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Patient</th>
                                <th>Médecin</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(appointment => (
                                <tr key={appointment.id}>
                                    <td>{new Date(appointment.start_datetime).toLocaleString('fr-FR')}</td>
                                    <td>{appointment.patient_name || 'N/A'}</td>
                                    <td>{appointment.medecin_name || 'N/A'}</td>
                                    <td>{getStatusBadge(appointment.status)}</td>
                                    <td>
                                        <button
                                            onClick={() => navigate(`/receptionist/appointments`)}
                                            className={styles.viewBtn}
                                        >
                                            Détails
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {appointments.length === 0 && (
                        <p className={styles.noData}>Aucun rendez-vous trouvé</p>
                    )}
                </div>
            </div>
        </div>
    );
}
