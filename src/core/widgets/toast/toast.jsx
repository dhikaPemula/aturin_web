import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './toast.module.css';
import checkCircleIcon from '/assets/task/check-circle.svg';

function Toast({ 
  isOpen = false,
  title = '',
  message = '',
  duration = 3000,
  onClose
}) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const durationRef = useRef(duration);

  // Update refs when props change
  useEffect(() => {
    onCloseRef.current = onClose;
    durationRef.current = duration;
  });

  useEffect(() => {
    console.log('Toast: useEffect triggered with isOpen =', isOpen);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (isOpen) {
      console.log('Toast: Opening with duration', durationRef.current);
      
      // Show immediately
      setIsVisible(true);
      
      // Set timeout to auto-close
      timeoutRef.current = setTimeout(() => {
        console.log('Toast: Auto-closing after', durationRef.current, 'ms');
        setIsVisible(false);
        
        // Wait for CSS animation, then call onClose
        setTimeout(() => {
          console.log('Toast: Animation done, calling onClose');
          if (onCloseRef.current) {
            onCloseRef.current();
          }
        }, 300);
      }, durationRef.current);
      
    } else {
      console.log('Toast: isOpen is false, hiding');
      setIsVisible(false);
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isOpen]); // Only depend on isOpen

  // Don't render if not open
  if (!isOpen) {
    console.log('Toast: Not rendering because isOpen is false');
    return null;
  }

  console.log('Toast: Rendering with isVisible =', isVisible);

  return createPortal(
    <div className={`${styles.toastContainer} ${isVisible ? styles.toastVisible : ''}`}>
      <div className={styles.toast}>
        <div className={styles.toastLeftIndicator}></div>
        <div className={styles.toastIcon}>
          <img 
            src={checkCircleIcon} 
            alt="Success" 
            className={styles.icon}
          />
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
