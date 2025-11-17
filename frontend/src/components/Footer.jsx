import React from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.copyright}>
            &copy; 2025 MedFlow. Tous droits réservés.
          </p>
          <div className={styles.links}>
            <a href="#privacy">Politique de confidentialité</a>
            <a href="#terms">Conditions d'utilisation</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
