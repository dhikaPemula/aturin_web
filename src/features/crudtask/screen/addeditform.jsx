import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './addeditform.module.css';

function AddEditForm({ 
  isOpen, 
  onClose, 
  task = null, 
  onSave 
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline_date: '',
    deadline_time: '',
    estimated_duration: '',
    category: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories for dropdown
  const categories = [
    { value: '', label: 'Select category' },
    { value: 'akademik', label: 'Akademik' },
    { value: 'pekerjaan', label: 'Pekerjaan' },
    { value: 'pribadi', label: 'Pribadi' },
    { value: 'olahraga', label: 'Olahraga' },
    { value: 'hiburan', label: 'Hiburan' }
  ];

  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      // Restore body scroll
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting]);

  // Populate form when task prop changes (for edit mode)
  useEffect(() => {
    if (task) {
      // Parse deadline if exists
      let deadlineDate = '';
      let deadlineTime = '';
      
      if (task.task_deadline || task.deadline) {
        const deadline = new Date(task.task_deadline || task.deadline);
        deadlineDate = deadline.toISOString().split('T')[0]; // YYYY-MM-DD
        deadlineTime = deadline.toTimeString().slice(0, 5); // HH:MM
      }

      setFormData({
        title: task.task_title || task.title || '',
        description: task.task_description || task.description || '',
        deadline_date: deadlineDate,
        deadline_time: deadlineTime,
        estimated_duration: task.estimated_task_duration || task.estimated_duration || '',
        category: task.task_category || task.categories?.[0] || ''
      });
    } else {
      // Reset form for add mode
      setFormData({
        title: '',
        description: '',
        deadline_date: '',
        deadline_time: '',
        estimated_duration: '',
        category: ''
      });
    }
    setErrors({});
  }, [task, isOpen]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Judul tugas wajib diisi';
    }
    
    if (!formData.deadline_date) {
      newErrors.deadline_date = 'Tanggal deadline wajib diisi';
    }
    
    if (!formData.deadline_time) {
      newErrors.deadline_time = 'Waktu deadline wajib diisi';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Combine date and time for deadline
      const deadline = `${formData.deadline_date}T${formData.deadline_time}:00.000Z`;
      
      const taskData = {
        task_title: formData.title,
        task_description: formData.description,
        task_deadline: deadline,
        estimated_task_duration: formData.estimated_duration,
        task_category: formData.category,
        task_status: task ? task.task_status : 'belum_selesai'
      };

      if (task) {
        taskData.id = task.id;
      }

      await onSave(taskData);
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {task ? 'Edit Tugas' : 'Tambah Tugas'}
          </h2>
          <button 
            onClick={handleClose}
            className={styles.closeButton}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Judul */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Judul</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Masukan judul tugas"
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              disabled={isSubmitting}
            />
            <div className={styles.charCount}>
              {formData.title.length}/20 karakter
            </div>
            {errors.title && <div className={styles.errorText}>{errors.title}</div>}
          </div>

          {/* Deskripsi */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Masukan deskripsi tugas"
              className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              rows="4"
              disabled={isSubmitting}
            />
            <div className={styles.charCount}>
              {formData.description.length}/50 karakter
            </div>
            {errors.description && <div className={styles.errorText}>{errors.description}</div>}
          </div>

          {/* Batas waktu */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Batas waktu</label>
            <div className={styles.dateTimeGroup}>
              <input
                type="date"
                name="deadline_date"
                value={formData.deadline_date}
                onChange={handleChange}
                className={`${styles.input} ${styles.dateInput} ${errors.deadline_date ? styles.inputError : ''}`}
                disabled={isSubmitting}
              />
              <input
                type="time"
                name="deadline_time"
                value={formData.deadline_time}
                onChange={handleChange}
                className={`${styles.input} ${styles.timeInput} ${errors.deadline_time ? styles.inputError : ''}`}
                disabled={isSubmitting}
              />
            </div>
            {(errors.deadline_date || errors.deadline_time) && (
              <div className={styles.errorText}>
                {errors.deadline_date || errors.deadline_time}
              </div>
            )}
          </div>

          {/* Estimasi Durasi */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Estimasi Durasi (opsional)</label>
            <input
              type="time"
              name="estimated_duration"
              value={formData.estimated_duration}
              onChange={handleChange}
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>

          {/* Kategori */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Kategori</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
              disabled={isSubmitting}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && <div className={styles.errorText}>{errors.category}</div>}
          </div>

          {/* Buttons */}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : (task ? 'Update' : 'Tambah')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default AddEditForm;
