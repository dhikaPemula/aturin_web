import React from 'react';
import { createPortal } from 'react-dom';
import styles from './alert.module.css';

function Alert({ 
  isOpen = false,
  title = "Konfirmasi",
  message = "Apakah Anda yakin?",
  cancelText = "Batal",
  submitLabel = "Konfirmasi",
  onCancel,
  onSubmit
}) {
  // Handle ESC key press
  React.useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onCancel?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onCancel]);

  // Separate effect for body scroll management
  React.useEffect(() => {
    if (isOpen) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore original overflow value
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel?.();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.alertContainer}>
        {/* Red accent bar */}
        <div className={styles.redAccent}></div>
        
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className={styles.submitButton}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Alert;
