import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './ReceptionistAppointments.module.css';

export default function ReceptionistAppointments() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        filterAppointments();
    }, [statusFilter, searchTerm, appointments]);

    const filterAppointments = () => {
        let filtered = appointments;

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(a => a.status === statusFilter);
        }

        // Filter by patient name
        if (searchTerm) {
            filtered = filtered.filter(a => {
                const patientName = a.patient_name || '';
                const medName = a.medecin_name || '';
                const searchLower = searchTerm.toLowerCase();
                return patientName.toLowerCase().includes(searchLower) ||
                    medName.toLowerCase().includes(searchLower);
            });
        }

        setFilteredAppointments(filtered);
    };

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments/all/');
            setAppointments(response.data);
            setFilteredAppointments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setLoading(false);
        }
    };

    const updateStatus = async (appointmentId, newStatus) => {
        try {
            await api.patch(`/appointments/${appointmentId}/update-status/`, {
                status: newStatus
            });
            // Refresh appointments
            fetchAppointments();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    const handleGenerateInvoice = (appointment) => {
        if (appointment.status !== 'done') {
            alert('La facture ne peut être générée que pour les rendez-vous terminés');
            return;
        }

        // If invoice already exists, navigate to invoices list
        if (appointment.has_invoice) {
            navigate('/receptionist/invoices');
            return;
        }

        navigate(`/receptionist/generate-invoice/${appointment.id}`);
    };

    const downloadInvoicePDF = async (invoiceId) => {
        try {
            const response = await api.get(`/facturation/invoices/${invoiceId}/download_pdf/`, {
                responseType: 'blob'
            });

            // Create a blob URL and trigger download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `facture_${invoiceId}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Erreur lors du téléchargement du PDF');
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
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Gestion des Rendez-vous</h1>
                <button onClick={() => navigate('/receptionist/dashboard')} className={styles.backBtn}>
                    ← Retour au tableau de bord
                </button>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label>
                        Filtrer par statut:
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">Tous</option>
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmé</option>
                            <option value="done">Terminé</option>
                            <option value="cancelled">Annulé</option>
                        </select>
                    </label>
                </div>

                <div className={styles.filterGroup}>
                    <label>
                        Rechercher par nom:
                        <input
                            type="text"
                            placeholder="Nom du patient ou médecin..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </label>
                </div>
            </div>

            {/* Appointments Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Patient</th>
                            <th>Médecin</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAppointments.map(appointment => (
                            <tr key={appointment.id}>
                                <td>{appointment.id}</td>
                                <td>{new Date(appointment.start_datetime).toLocaleString('fr-FR')}</td>
                                <td>{appointment.patient_name || `Patient #${appointment.patient}`}</td>
                                <td>{appointment.medecin_name || `Médecin #${appointment.medecin}`}</td>
                                <td>{getStatusBadge(appointment.status)}</td>
                                <td className={styles.actions}>
                                    {appointment.status === 'pending' && (
                                        <button
                                            onClick={() => updateStatus(appointment.id, 'confirmed')}
                                            className={styles.confirmBtn}
                                        >
                                            Confirmer
                                        </button>
                                    )}
                                    {appointment.status === 'confirmed' && (
                                        <button
                                            onClick={() => updateStatus(appointment.id, 'done')}
                                            className={styles.doneBtn}
                                        >
                                            Terminer
                                        </button>
                                    )}
                                    {appointment.status === 'done' && !appointment.has_invoice && (
                                        <button
                                            onClick={() => handleGenerateInvoice(appointment)}
                                            className={styles.invoiceBtn}
                                        >
                                            Générer Facture
                                        </button>
                                    )}
                                    {appointment.status === 'done' && appointment.has_invoice && (
                                        <button
                                            onClick={() => downloadInvoicePDF(appointment.invoice_id)}
                                            className={styles.viewInvoiceBtn}
                                        >
                                            📥 Facture
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredAppointments.length === 0 && (
                    <p className={styles.noData}>Aucun rendez-vous trouvé</p>
                )}
            </div>
        </div>
    );
}
