import React from 'react'
import styles from './Input.module.css'

export default function Input({ 
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  error = '',
  label = '',
  required = false,
  className = ''
}) {
  return (
    <div className={`${styles.inputGroup} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
