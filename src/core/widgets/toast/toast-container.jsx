import React from 'react';
import { createPortal } from 'react-dom';
import Toast from './toast';
import styles from './toast-container.module.css';

function ToastContainer({ toasts = [], onClose }) {
  if (!toasts.length) return null;

  return createPortal(
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          isOpen={true}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
}

export default ToastContainer;
