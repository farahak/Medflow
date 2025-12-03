import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './InvoiceList.module.css';

export default function InvoiceList() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await api.get('/facturation/invoices/');
            setInvoices(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setLoading(false);
        }
    };

    const downloadPDF = async (invoiceId) => {
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

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Liste des Factures</h1>
                <button onClick={() => navigate('/receptionist/dashboard')} className={styles.backBtn}>
                    ← Retour au tableau de bord
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Patient</th>
                            <th>Médecin</th>
                            <th>Consultation</th>
                            <th>Frais Extra</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td>#{invoice.id}</td>
                                <td>{new Date(invoice.created_at).toLocaleDateString('fr-FR')}</td>
                                <td>{invoice.patient_name || `Patient #${invoice.patient}`}</td>
                                <td>{invoice.medecin_name || `Médecin #${invoice.medecin}`}</td>
                                <td>{parseFloat(invoice.consultation_price).toFixed(2)} €</td>
                                <td>{parseFloat(invoice.extra_fees).toFixed(2)} €</td>
                                <td className={styles.total}>{parseFloat(invoice.total).toFixed(2)} €</td>
                                <td>
                                    <button
                                        onClick={() => downloadPDF(invoice.id)}
                                        className={styles.pdfBtn}
                                    >
                                        📥 PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {invoices.length === 0 && (
                    <p className={styles.noData}>Aucune facture trouvée</p>
                )}
            </div>
        </div>
    );
}
