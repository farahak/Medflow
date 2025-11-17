'use client'

import React, { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import styles from './BillingPage.module.css'

export default function BillingPage() {
  const [invoices, setInvoices] = useState([
    { id: 'INV001', patient: 'Jean Dupont', amount: 150, date: '2024-01-15', dueDate: '2024-01-22', status: 'Payée', items: [{ description: 'Consultation', price: 100 }, { description: 'Tests', price: 50 }] },
    { id: 'INV002', patient: 'Marie Martin', amount: 200, date: '2024-01-16', dueDate: '2024-01-23', status: 'En attente', items: [{ description: 'Consultation', price: 100 }, { description: 'Médicaments', price: 100 }] },
    { id: 'INV003', patient: 'Pierre Bernard', amount: 100, date: '2024-01-17', dueDate: '2024-01-24', status: 'Payée', items: [{ description: 'Consultation', price: 100 }] },
    { id: 'INV004', patient: 'Sophie Leclerc', amount: 300, date: '2024-01-18', dueDate: '2024-01-25', status: 'Retard', items: [{ description: 'Chirurgie mineure', price: 250 }, { description: 'Suivi', price: 50 }] },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  const handleMarkAsPaid = (invoiceId) => {
    setInvoices(invoices.map(inv =>
      inv.id === invoiceId ? { ...inv, status: 'Payée' } : inv
    ))
    console.log('[v0] Invoice marked as paid:', invoiceId)
    alert('Facture marquée comme payée!')
  }

  const handleDownloadPDF = (invoiceId) => {
    console.log('[v0] Downloading PDF for invoice:', invoiceId)
    alert('Téléchargement du PDF en cours...')
  }

  const handleSendReminder = (invoiceId) => {
    console.log('[v0] Sending reminder for invoice:', invoiceId)
    alert('Rappel envoyé au patient!')
  }

  const filteredInvoices = filterStatus === 'all'
    ? invoices
    : invoices.filter(inv => inv.status === filterStatus)

  const totalRevenue = invoices
    .filter(inv => inv.status === 'Payée')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const pendingAmount = invoices
    .filter(inv => inv.status !== 'Payée')
    .reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Facturation & Paiements</h1>
          </div>

          <div className={styles.summaryCards}>
            <Card className={styles.summaryCard}>
              <h3>Revenus Total</h3>
              <p className={styles.amount}>${totalRevenue}</p>
              <small>{invoices.filter(inv => inv.status === 'Payée').length} factures payées</small>
            </Card>
            <Card className={styles.summaryCard}>
              <h3>Montant Pendant</h3>
              <p className={styles.amount}>${pendingAmount}</p>
              <small>{invoices.filter(inv => inv.status !== 'Payée').length} factures en attente</small>
            </Card>
            <Card className={styles.summaryCard}>
              <h3>Total Factures</h3>
              <p className={styles.amount}>${invoices.reduce((sum, inv) => sum + inv.amount, 0)}</p>
              <small>{invoices.length} factures</small>
            </Card>
          </div>

          <Card>
            <div className={styles.filterBar}>
              <div className={styles.filters}>
                <button
                  className={`${styles.filterBtn} ${filterStatus === 'all' ? styles.active : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  Tous ({invoices.length})
                </button>
                <button
                  className={`${styles.filterBtn} ${filterStatus === 'Payée' ? styles.active : ''}`}
                  onClick={() => setFilterStatus('Payée')}
                >
                  Payées ({invoices.filter(i => i.status === 'Payée').length})
                </button>
                <button
                  className={`${styles.filterBtn} ${filterStatus === 'En attente' ? styles.active : ''}`}
                  onClick={() => setFilterStatus('En attente')}
                >
                  En attente ({invoices.filter(i => i.status === 'En attente').length})
                </button>
                <button
                  className={`${styles.filterBtn} ${filterStatus === 'Retard' ? styles.active : ''}`}
                  onClick={() => setFilterStatus('Retard')}
                >
                  Retard ({invoices.filter(i => i.status === 'Retard').length})
                </button>
              </div>
            </div>
          </Card>

          <Card>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>N° Facture</th>
                  <th>Patient</th>
                  <th>Montant</th>
                  <th>Date</th>
                  <th>Échéance</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td><strong>{invoice.id}</strong></td>
                    <td>{invoice.patient}</td>
                    <td>${invoice.amount}</td>
                    <td>{invoice.date}</td>
                    <td>{invoice.dueDate}</td>
                    <td>
                      <span className={`${styles.status} ${styles[invoice.status.toLowerCase()]}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className={styles.actions}>
                      <Button size="sm" onClick={() => handleViewInvoice(invoice)}>Détails</Button>
                      <Button size="sm" onClick={() => handleDownloadPDF(invoice.id)}>PDF</Button>
                      {invoice.status !== 'Payée' && (
                        <Button size="sm" variant="secondary" onClick={() => handleMarkAsPaid(invoice.id)}>Payer</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        title={`Facture ${selectedInvoice?.id}`}
        onClose={() => setIsModalOpen(false)}
      >
        {selectedInvoice && (
          <div className={styles.invoiceDetail}>
            <div className={styles.invoiceHeader}>
              <div>
                <h3>Patient: {selectedInvoice.patient}</h3>
                <p>Facture: {selectedInvoice.id}</p>
                <p>Date: {selectedInvoice.date}</p>
              </div>
              <div className={`${styles.status} ${styles[selectedInvoice.status.toLowerCase()]}`}>
                {selectedInvoice.status}
              </div>
            </div>

            <div className={styles.invoiceItems}>
              <h4>Détails</h4>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.description}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                  <tr className={styles.totalRow}>
                    <td><strong>Total</strong></td>
                    <td><strong>${selectedInvoice.amount}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.modalActions}>
              <Button onClick={() => handleDownloadPDF(selectedInvoice.id)}>Télécharger PDF</Button>
              {selectedInvoice.status !== 'Payée' && (
                <>
                  <Button variant="secondary" onClick={() => handleMarkAsPaid(selectedInvoice.id)}>Marquer Payée</Button>
                  <Button variant="secondary" onClick={() => handleSendReminder(selectedInvoice.id)}>Envoyer Rappel</Button>
                </>
              )}
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Fermer</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
