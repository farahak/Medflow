'use client'

import React, { useState, useEffect } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import styles from './Messaging.module.css'
import { useApi } from '../hooks/useApi'

export default function Messaging() {
    const { request } = useApi()
    const [messages, setMessages] = useState([])
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showCompose, setShowCompose] = useState(false)

    // Compose state
    const [doctors, setDoctors] = useState([])
    const [composeData, setComposeData] = useState({ recipient: '', subject: '', body: '' })
    const [sending, setSending] = useState(false)

    useEffect(() => {
        fetchMessages()
        fetchDoctors()
    }, [])

    const fetchMessages = async () => {
        try {
            setLoading(true)
            const data = await request('get', '/messaging/')
            setMessages(data)
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchDoctors = async () => {
        try {
            const data = await request('get', '/users/medecins/')
            setDoctors(data)
        } catch (error) {
            console.error('Error fetching doctors:', error)
        }
    }

    const handleSelectMessage = async (msg) => {
        setSelectedMessage(msg)
        // Mark as read if I am the recipient and it is not read
        if (!msg.is_read) {
            try {
                const data = await request('get', `/messaging/${msg.id}/`)
                // Updates state to show it is read
                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
                setSelectedMessage(data)
            } catch (e) {
                console.error(e)
            }
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()
        setSending(true)
        try {
            await request('post', '/messaging/', {
                recipient_id: composeData.recipient,
                subject: composeData.subject,
                body: composeData.body
            })
            setShowCompose(false)
            setComposeData({ recipient: '', subject: '', body: '' })
            fetchMessages() // Refresh list
        } catch (error) {
            console.error('Error sending message:', error)
            alert('Failed to send message')
        } finally {
            setSending(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Messagerie</h1>
                <Button onClick={() => setShowCompose(true)}>+ Nouveau Message</Button>
            </div>

            <div className={styles.layout}>
                {/* Sidebar List */}
                <div className={styles.sidebar}>
                    <div className={styles.messageList}>
                        {loading ? (
                            <div style={{ padding: '1rem' }}>Chargement...</div>
                        ) : messages.length === 0 ? (
                            <div style={{ padding: '1rem', color: '#777' }}>Aucun message</div>
                        ) : (
                            messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`${styles.messageItem} ${selectedMessage?.id === msg.id ? styles.active : ''} ${!msg.is_read ? styles.unread : ''}`}
                                    onClick={() => handleSelectMessage(msg)}
                                >
                                    <div className={styles.senderName}>
                                        <span>{msg.sender_name === 'Me' ? `À: ${msg.recipient_name}` : msg.sender_name}</span>
                                        <span className={styles.messageDate}>{formatDate(msg.created_at)}</span>
                                    </div>
                                    <div className={styles.subjectLine}>{msg.subject}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className={styles.contentArea}>
                    {selectedMessage ? (
                        <div className={styles.messageDetail}>
                            <div className={styles.detailHeader}>
                                <h2 className={styles.detailSubject}>{selectedMessage.subject}</h2>
                                <div className={styles.detailMeta}>
                                    <span>De: <strong>{selectedMessage.sender_name}</strong> À: <strong>{selectedMessage.recipient_name}</strong></span>
                                    <span>{formatDate(selectedMessage.created_at)}</span>
                                </div>
                            </div>
                            <div className={styles.detailBody}>
                                {selectedMessage.body}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            Sélectionnez un message pour le lire
                        </div>
                    )}
                </div>
            </div>

            {/* Compose Modal */}
            {showCompose && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>Nouveau Message</h2>
                        <form onSubmit={handleSend}>
                            <div className={styles.formGroup}>
                                <label>Destinataire (Médecin)</label>
                                <select
                                    className={styles.select}
                                    value={composeData.recipient}
                                    onChange={(e) => setComposeData({ ...composeData, recipient: e.target.value })}
                                    required
                                >
                                    <option value="">Sélectionner un médecin</option>
                                    {doctors.map(doc => (
                                        <option key={doc.user.id} value={doc.user.id}>
                                            Dr. {doc.first_name} {doc.last_name} ({doc.specialty})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Sujet</label>
                                <Input
                                    value={composeData.subject}
                                    onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                                    required
                                    placeholder="Objet du message"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Message</label>
                                <textarea
                                    className={styles.textarea}
                                    value={composeData.body}
                                    onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                                    required
                                    placeholder="Votre message..."
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <Button type="button" onClick={() => setShowCompose(false)} variant="secondary" style={{ background: '#e2e8f0', color: '#333' }}>Annuler</Button>
                                <Button type="submit" disabled={sending}>
                                    {sending ? 'Envoi...' : 'Envoyer'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
