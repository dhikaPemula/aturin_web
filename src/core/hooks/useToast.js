import { useState, useCallback } from 'react';

function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((config) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      type: config.type || 'info',
      title: config.title || '',
      message: config.message || '',
      duration: config.duration || 3000,
      ...config
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration + 300); // Add extra time for animation

    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showSuccess = useCallback((title, message, options = {}) => {
    return showToast({ type: 'success', title, message, ...options });
  }, [showToast]);

  const showError = useCallback((title, message, options = {}) => {
    return showToast({ type: 'error', title, message, ...options });
  }, [showToast]);

  const showWarning = useCallback((title, message, options = {}) => {
    return showToast({ type: 'warning', title, message, ...options });
  }, [showToast]);

  const showInfo = useCallback((title, message, options = {}) => {
    return showToast({ type: 'info', title, message, ...options });
  }, [showToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll
  };
}

export default useToast;
