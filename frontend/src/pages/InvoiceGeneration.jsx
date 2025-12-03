import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './InvoiceGeneration.module.css';

export default function InvoiceGeneration() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [consultationPrice, setConsultationPrice] = useState('');
    const [extraFees, setExtraFees] = useState('0.00');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAppointment();
    }, [appointmentId]);

    const fetchAppointment = async () => {
        try {
            const response = await api.get(`/appointments/appointments/${appointmentId}/`);
            const data = response.data;
            setAppointment(data);

            // Try to get the doctor's default price
            // This would need to be added to the appointment serializer
            setConsultationPrice(data.medecin_consultation_price || '50.00');
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointment:', error);
            alert('Erreur lors du chargement du rendez-vous');
            navigate('/receptionist/appointments');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await api.post('/facturation/generate/', {
                appointment_id: appointmentId,
                consultation_price: parseFloat(consultationPrice),
                extra_fees: parseFloat(extraFees)
            });

            alert('Facture générée avec succès!');
            navigate('/receptionist/invoices');
        } catch (error) {
            console.error('Error generating invoice:', error);
            alert(error.response?.data?.detail || 'Erreur lors de la génération de la facture');
            setSubmitting(false);
        }
    };

    const calculateTotal = () => {
        const consultation = parseFloat(consultationPrice) || 0;
        const extra = parseFloat(extraFees) || 0;
        return (consultation + extra).toFixed(2);
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Générer une Facture</h1>
                <button onClick={() => navigate('/receptionist/appointments')} className={styles.backBtn}>
                    ← Retour
                </button>
            </div>

            {appointment && (
                <div className={styles.content}>
                    {/* Appointment Details */}
                    <div className={styles.section}>
                        <h2>Détails du Rendez-vous</h2>
                        <div className={styles.details}>
                            <p><strong>ID:</strong> {appointment.id}</p>
                            <p><strong>Patient:</strong> {appointment.patient_name || `Patient #${appointment.patient}`}</p>
                            <p><strong>Médecin:</strong> {appointment.medecin_name || `Médecin #${appointment.medecin}`}</p>
                            <p><strong>Date:</strong> {new Date(appointment.start_datetime).toLocaleString('fr-FR')}</p>
                            <p><strong>Statut:</strong> {appointment.status}</p>
                        </div>
                    </div>

                    {/* Invoice Form */}
                    <div className={styles.section}>
                        <h2>Informations de Facturation</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="consultationPrice">Prix de Consultation (€)</label>
                                <input
                                    type="number"
                                    id="consultationPrice"
                                    value={consultationPrice}
                                    onChange={(e) => setConsultationPrice(e.target.value)}
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="extraFees">Frais Supplémentaires (€)</label>
                                <input
                                    type="number"
                                    id="extraFees"
                                    value={extraFees}
                                    onChange={(e) => setExtraFees(e.target.value)}
                                    step="0.01"
                                    min="0"
                                />
                            </div>

                            <div className={styles.total}>
                                <strong>Total:</strong> {calculateTotal()} €
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={submitting}
                            >
                                {submitting ? 'Génération...' : 'Générer la Facture'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
