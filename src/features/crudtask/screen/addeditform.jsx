import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './addeditform.module.css';
import { useGlobalTaskRefresh } from '../../../core/hooks/useGlobalTaskRefresh';

// Import category icons
import akademikIcon from '../../../assets/home/categories/akademik.svg';
import pekerjaanIcon from '../../../assets/home/categories/pekerjaan.svg';
import pribadiIcon from '../../../assets/home/categories/pribadi.svg';
import olahragaIcon from '../../../assets/home/categories/olahraga.svg';
import hiburanIcon from '../../../assets/home/categories/hiburan.svg';
import sosialIcon from '../../../assets/home/categories/sosial.svg';
import spiritualIcon from '../../../assets/home/categories/spiritual.svg';
import istirahatIcon from '../../../assets/home/categories/istirahat.svg';

// Utility functions for timezone handling
const formatLocalDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const parseDeadlineString = (deadlineString) => {
  if (!deadlineString) return null;
  
  // If it's already a date object
  if (deadlineString instanceof Date) {
    return deadlineString;
  }
  
  // Parse string - handle different formats
  if (deadlineString.includes('T')) {
    // ISO format with T separator
    return new Date(deadlineString);
  } else if (deadlineString.includes(' ')) {
    // Local format with space separator (YYYY-MM-DD HH:MM:SS)
    return new Date(deadlineString.replace(' ', 'T'));
  } else {
    return new Date(deadlineString);
  }
};

function AddEditForm({ 
  isOpen, 
  onClose, 
  task = null, 
  onSave,
  onSuccess,
  onError,
  onDataChanged // Callback untuk refresh data real-time (deprecated - akan diganti dengan global refresh)
}) {
  // Global task refresh hook
  const { triggerTaskRefresh } = useGlobalTaskRefresh();

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Categories for dropdown (sesuai dengan backend validation)
  const categories = [
    { value: '', label: 'Select category', icon: null },
    { value: 'akademik', label: 'Akademik', icon: akademikIcon },
    { value: 'pekerjaan', label: 'Pekerjaan', icon: pekerjaanIcon },
    { value: 'pribadi', label: 'Pribadi', icon: pribadiIcon },
    { value: 'olahraga', label: 'Olahraga', icon: olahragaIcon },
    { value: 'hiburan', label: 'Hiburan', icon: hiburanIcon },
    { value: 'sosial', label: 'Sosial', icon: sosialIcon },
    { value: 'spiritual', label: 'Spiritual', icon: spiritualIcon },
    { value: 'istirahat', label: 'Istirahat', icon: istirahatIcon }
  ];

  // Handle ESC key press and close dropdown on outside click
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen && !isSubmitting) {
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        } else {
          handleClose();
        }
      }
    };

    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(`.${styles.customSelectContainer}`)) {
        setIsDropdownOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isSubmitting, isDropdownOpen]);

  // Separate effect for body scroll management
  useEffect(() => {
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

  // Populate form when task prop changes (for edit mode)
  useEffect(() => {
    if (task) {
      // Parse deadline if exists
      let deadlineDate = '';
      let deadlineTime = '';
      
      if (task.task_deadline || task.deadline) {
        // Parse deadline string using utility function
        const deadline = parseDeadlineString(task.task_deadline || task.deadline);
        
        if (deadline && !isNaN(deadline.getTime())) {
          // Extract date and time components in local timezone
          const year = deadline.getFullYear();
          const month = String(deadline.getMonth() + 1).padStart(2, '0');
          const day = String(deadline.getDate()).padStart(2, '0');
          const hours = String(deadline.getHours()).padStart(2, '0');
          const minutes = String(deadline.getMinutes()).padStart(2, '0');
          
          deadlineDate = `${year}-${month}-${day}`;
          deadlineTime = `${hours}:${minutes}`;
        }
      }

      setFormData({
        title: task.task_title || task.title || '',
        description: task.task_description || task.description || '',
        deadline_date: deadlineDate,
        deadline_time: deadlineTime,
        estimated_duration: task.estimated_task_duration ? 
          (() => {
            // Keep format as received from backend (no conversion)
            const duration = task.estimated_task_duration;
            if (duration.includes(':')) {
              const parts = duration.split(':');
              const hours = parts[0]; // Keep original format (with leading zero if exists)
              const minutes = parts[1];
              return `${hours}:${minutes}`;
            }
            return duration;
          })() : 
          (task.estimated_duration || ''),
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

  // Convert time format - keep original format (no leading zero removal)
  const convertToBackendTimeFormat = (timeString) => {
    if (!timeString) return '';
    
    try {
      const parts = timeString.split(':');
      if (!parts[0] || !parts[1]) return timeString;
      
      // Keep original format as is (don't remove leading zeros)
      const hours = parts[0]; // Keep as is (05 stays 05, 5 stays 5)
      const minutes = parts[1];
      return `${hours}:${minutes}`;
    } catch (e) {
      console.warn('Error converting time format:', e);
      return timeString;
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryValue) => {
    setFormData(prev => ({
      ...prev,
      category: categoryValue
    }));
    
    // Clear category error
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: ''
      }));
    }
    
    setIsDropdownOpen(false);
  };

  // Get selected category data
  const getSelectedCategory = () => {
    return categories.find(cat => cat.value === formData.category) || categories[0];
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check character limits
    if (name === 'title' && value.length > 20) {
      return; // Prevent input if title exceeds 20 characters
    }
    
    if (name === 'description' && value.length > 50) {
      return; // Prevent input if description exceeds 50 characters
    }
    
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
    } else if (formData.title.length > 20) {
      newErrors.title = 'Judul tugas maksimal 20 karakter';
    }
    
    // Deskripsi tidak wajib diisi, tapi jika diisi tetap validasi panjang
    if (formData.description && formData.description.length > 50) {
      newErrors.description = 'Deskripsi maksimal 50 karakter';
    }
    
    if (!formData.deadline_date) {
      newErrors.deadline_date = 'Tanggal batas wajib diisi';
    }
    
    if (!formData.deadline_time) {
      newErrors.deadline_time = 'Waktu batas wajib diisi';
    }

    // Validate deadline is not in the past
    if (formData.deadline_date && formData.deadline_time) {
      // Create deadline datetime in local timezone
      const deadlineDateTime = new Date(`${formData.deadline_date}T${formData.deadline_time}`);
      const currentDateTime = new Date();
      
      // Add a small buffer (1 minute) to account for processing time
      const minimumDateTime = new Date(currentDateTime.getTime() + 60000); // Add 1 minute
      
      if (deadlineDateTime <= minimumDateTime) {
        newErrors.deadline_date = 'Batas waktu harus minimal 1 menit dari waktu saat ini';
      }
    }

    // Make estimated_duration required
    if (!formData.estimated_duration || !formData.estimated_duration.trim()) {
      newErrors.estimated_duration = 'Estimasi durasi wajib diisi';
    } else {
      // Validate estimated_duration format if provided
      // Accept both H:i and HH:MM formats (e.g., "5:30" or "05:30")
      const timePattern = /^([0-9]|[01][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timePattern.test(formData.estimated_duration)) {
        newErrors.estimated_duration = 'Format durasi harus HH:MM (contoh: 02:30)';
      }
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
      // Combine date and time for deadline - keep in local timezone
      const deadlineDateTime = new Date(`${formData.deadline_date}T${formData.deadline_time}`);
      
      // Format deadline for backend using utility function
      const deadline = formatLocalDateTime(deadlineDateTime);
      
      console.log('Deadline processing:', {
        original_date: formData.deadline_date,
        original_time: formData.deadline_time,
        combined_datetime: deadlineDateTime.toString(),
        formatted_for_backend: deadline,
        timezone_offset: deadlineDateTime.getTimezoneOffset()
      });
      
      const taskData = {
        task_title: formData.title,
        task_description: formData.description,
        task_deadline: deadline,
        task_category: formData.category,
        task_status: task ? task.task_status : 'belum_selesai'
      };

      // Include estimated_task_duration since it's now required
      const convertedDuration = convertToBackendTimeFormat(formData.estimated_duration);
      console.log('Duration - Original:', formData.estimated_duration, 'Sent to backend:', convertedDuration);
      taskData.estimated_task_duration = convertedDuration;

      if (task) {
        taskData.id = task.id;
      }

      console.log('Form submitting task data:', taskData);
      await onSave(taskData);
      
      // Trigger global task refresh untuk real-time update di semua halaman
      triggerTaskRefresh();
      
      // Call deprecated data changed callback untuk backward compatibility
      if (onDataChanged) {
        onDataChanged();
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess({
          title: task ? 'Berhasil Mengubah Tugas' : 'Berhasil Menambahkan Tugas',
          message: task ? 'Tugas berhasil diperbarui' : 'Tugas baru berhasil ditambahkan'
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      console.error('Error response:', error.response?.data);
      
      // Call error callback
      if (onError) {
        onError({
          title: 'Gagal Menyimpan Tugas',
          message: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan tugas'
        });
      }
      
      // Don't close the form if there's an error
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
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Judul */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Judul <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Masukan judul tugas"
              maxLength={20}
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              disabled={isSubmitting}
            />
            <div className={`${styles.charCount} ${formData.title.length >= 18 ? styles.charCountWarning : ''} ${formData.title.length === 20 ? styles.charCountLimit : ''}`}>
              {formData.title.length}/20 karakter
            </div>
            {errors.title && <div className={styles.errorText}>{errors.title}</div>}
          </div>

          {/* Deskripsi */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Masukan deskripsi tugas"
              maxLength={50}
              className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              rows="2"
              disabled={isSubmitting}
            />
            <div className={`${styles.charCount} ${formData.description.length >= 45 ? styles.charCountWarning : ''} ${formData.description.length === 50 ? styles.charCountLimit : ''}`}>
              {formData.description.length}/50 karakter
            </div>
            {errors.description && <div className={styles.errorText}>{errors.description}</div>}
          </div>

          {/* Batas waktu */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Batas waktu <span className={styles.required}>*</span>
            </label>
            <div className={styles.dateTimeGroup}>
              <div className={styles.dateInputContainer}>
                <input
                  type="date"
                  name="deadline_date"
                  value={formData.deadline_date}
                  onChange={(e) => {
                    const { value } = e.target;
                    setFormData(prev => ({ ...prev, deadline_date: value }));
                    
                    // Clear error when user selects a date
                    if (errors.deadline_date) {
                      setErrors(prev => ({ ...prev, deadline_date: '' }));
                    }
                    
                    // Real-time validation for datetime
                    if (value && formData.deadline_time) {
                      const deadlineDateTime = new Date(`${value}T${formData.deadline_time}`);
                      const currentDateTime = new Date();
                      const minimumDateTime = new Date(currentDateTime.getTime() + 60000); // Add 1 minute
                      
                      if (deadlineDateTime <= minimumDateTime) {
                        setErrors(prev => ({ 
                          ...prev, 
                          deadline_date: 'Batas waktu harus minimal 1 menit dari waktu saat ini' 
                        }));
                      } else {
                        // Clear error if datetime is valid
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          if (newErrors.deadline_date === 'Batas waktu harus minimal 1 menit dari waktu saat ini') {
                            delete newErrors.deadline_date;
                          }
                          return newErrors;
                        });
                      }
                    }
                  }}
                  className={`${styles.input} ${styles.dateInput} ${errors.deadline_date ? styles.inputError : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.timeInputContainer}>
                <input
                  type="time"
                  name="deadline_time"
                  value={formData.deadline_time}
                  onChange={(e) => {
                    const { value } = e.target;
                    setFormData(prev => ({ ...prev, deadline_time: value }));
                    
                    // Clear error when user selects a time
                    if (errors.deadline_time) {
                      setErrors(prev => ({ ...prev, deadline_time: '' }));
                    }
                    
                    // Real-time validation for datetime
                    if (formData.deadline_date && value) {
                      const deadlineDateTime = new Date(`${formData.deadline_date}T${value}`);
                      const currentDateTime = new Date();
                      const minimumDateTime = new Date(currentDateTime.getTime() + 60000); // Add 1 minute
                      
                      if (deadlineDateTime <= minimumDateTime) {
                        setErrors(prev => ({ 
                          ...prev, 
                          deadline_date: 'Batas waktu harus minimal 1 menit dari waktu saat ini' 
                        }));
                      } else {
                        // Clear error if datetime is valid
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          if (newErrors.deadline_date === 'Batas waktu harus minimal 1 menit dari waktu saat ini') {
                            delete newErrors.deadline_date;
                          }
                          return newErrors;
                        });
                      }
                    }
                  }}
                  className={`${styles.input} ${styles.timeInput} ${(errors.deadline_time || (errors.deadline_date === 'Batas waktu harus minimal 1 menit dari waktu saat ini')) ? styles.inputError : ''}`}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            {(errors.deadline_date || errors.deadline_time) && (
              <div className={styles.errorText}>
                {errors.deadline_date || errors.deadline_time}
              </div>
            )}
          </div>

          {/* Estimasi Durasi */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Estimasi Durasi Pengerjaan<span className={styles.required}>*</span>
            </label>
            <div className={styles.timeInputContainer}>
              <input
                type="time"
                name="estimated_duration"
                value={formData.estimated_duration ? (() => {
                  // Display as received from backend (no forced formatting)
                  try {
                    const [hours, minutes] = formData.estimated_duration.split(':');
                    return `${hours}:${minutes}`;
                  } catch (e) {
                    return formData.estimated_duration;
                  }
                })() : ''}
                onChange={(e) => {
                  const { value } = e.target;
                  setFormData(prev => ({ ...prev, estimated_duration: value }));
                  
                  // Clear error when user selects a duration
                  if (errors.estimated_duration) {
                    setErrors(prev => ({ ...prev, estimated_duration: '' }));
                  }
                }}
                placeholder="HH:MM"
                className={`${styles.input} ${styles.timeInput} ${errors.estimated_duration ? styles.inputError : ''}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.estimated_duration && <div className={styles.errorText}>{errors.estimated_duration}</div>}
          </div>

          {/* Kategori */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Kategori <span className={styles.required}>*</span>
            </label>
            <div className={styles.customSelectContainer}>
              <button
                type="button"
                className={`${styles.customSelect} ${errors.category ? styles.inputError : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isSubmitting}
              >
                <div className={styles.selectedOption}>
                  {getSelectedCategory().icon && (
                    <img 
                      src={getSelectedCategory().icon} 
                      alt={getSelectedCategory().label}
                      className={styles.categoryIcon}
                    />
                  )}
                  <span>{getSelectedCategory().label}</span>
                </div>
                <svg 
                  className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.dropdownArrowOpen : ''}`}
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className={styles.dropdownOptions}>
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      className={`${styles.dropdownOption} ${cat.value === formData.category ? styles.dropdownOptionSelected : ''}`}
                      onClick={() => handleCategorySelect(cat.value)}
                      disabled={isSubmitting}
                    >
                      {cat.icon && (
                        <img 
                          src={cat.icon} 
                          alt={cat.label}
                          className={styles.categoryIcon}
                        />
                      )}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
              {isSubmitting ? 'Menyimpan...' : (task ? 'Ubah' : 'Tambah')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default AddEditForm;
