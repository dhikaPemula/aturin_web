import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './toast.module.css';
import checkCircleIcon from '../../../assets/task/check-circle.svg';

function Toast({ 
  isOpen = false,
  title = '',
  message = '',
  duration = 3000,
  onClose
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Show toast with animation
      setIsVisible(true);
      
      // Auto hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Wait for animation to complete before calling onClose
        setTimeout(() => {
          onClose && onClose();
        }, 300); // Match CSS transition duration
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    return (
      <img 
        src={checkCircleIcon} 
        alt="Success" 
        className={styles.icon}
      />
    );
  };

  return createPortal(
    <div className={`${styles.toastContainer} ${isVisible ? styles.toastVisible : ''}`}>
      <div className={styles.toast}>
        <div className={styles.toastLeftIndicator}></div>
        <div className={styles.toastIcon}>
          {getIcon()}
        </div>
        <div className={styles.toastContent}>
          {title && <div className={styles.toastTitle}>{title}</div>}
          {message && <div className={styles.toastMessage}>{message}</div>}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Toast;
