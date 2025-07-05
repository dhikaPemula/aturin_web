import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './addeditform.module.css';
import DatePickerPopup from '../../../core/widgets/datepicker/datepicker_popup.jsx';
import TimePickerPopup from '../../../core/widgets/timepicker/timepicker_popup.jsx';
import DurationPickerPopup from '../../../core/widgets/durationpicker/durationpicker_popup.jsx';

// Import category icons
import akademikIcon from '../../../assets/home/categories/akademik.svg';
import pekerjaanIcon from '../../../assets/home/categories/pekerjaan.svg';
import pribadiIcon from '../../../assets/home/categories/pribadi.svg';
import olahragaIcon from '../../../assets/home/categories/olahraga.svg';
import hiburanIcon from '../../../assets/home/categories/hiburan.svg';
import sosialIcon from '../../../assets/home/categories/sosial.svg';
import spiritualIcon from '../../../assets/home/categories/spiritual.svg';
import istirahatIcon from '../../../assets/home/categories/istirahat.svg';
import jadwalIcon from '../../../assets/home/jadwal-black.svg';
import clockIcon from '../../../assets/home/clock.svg';

function AddEditForm({ 
  isOpen, 
  onClose, 
  task = null, 
  onSave,
  onSuccess,
  onError
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const durationInputRef = useRef(null);

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
        } else if (showDatePicker) {
          setShowDatePicker(false);
        } else if (showTimePicker) {
          setShowTimePicker(false);
        } else if (showDurationPicker) {
          setShowDurationPicker(false);
        } else {
          handleClose();
        }
      }
    };

    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(`.${styles.customSelectContainer}`)) {
        setIsDropdownOpen(false);
      }
      // Remove dateInputContainer check since DatePickerPopup handles its own outside clicks
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isSubmitting, isDropdownOpen, showDatePicker, showTimePicker, showDurationPicker]);

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
        const deadline = new Date(task.task_deadline || task.deadline);
        // Use local date methods to avoid timezone issues
        const year = deadline.getFullYear();
        const month = String(deadline.getMonth() + 1).padStart(2, '0');
        const day = String(deadline.getDate()).padStart(2, '0');
        deadlineDate = `${year}-${month}-${day}`;
        deadlineTime = deadline.toTimeString().slice(0, 5); // HH:MM
      }

      setFormData({
        title: task.task_title || task.title || '',
        description: task.task_description || task.description || '',
        deadline_date: deadlineDate,
        deadline_time: deadlineTime,
        estimated_duration: task.estimated_task_duration ? 
          (() => {
            // Convert from "05:30:00" or "5:30:00" format to "H:i" format
            const duration = task.estimated_task_duration;
            if (duration.includes(':')) {
              const parts = duration.split(':');
              const hours = parseInt(parts[0], 10); // Remove leading zero
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

  // Convert time format to H:i format for backend
  const convertToBackendTimeFormat = (timeString) => {
    if (!timeString) return '';
    
    try {
      const parts = timeString.split(':');
      if (!parts[0] || !parts[1]) return timeString;
      
      // Convert "05:30:00" or "05:30" to "5:30" (remove leading zero from hour and seconds)
      const hourNum = parseInt(parts[0], 10);
      const minutes = parts[1];
      return `${hourNum}:${minutes}`;
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
    
    if (formData.description && formData.description.length > 50) {
      newErrors.description = 'Deskripsi maksimal 50 karakter';
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

    // Validate estimated_duration format if provided
    if (formData.estimated_duration && formData.estimated_duration.trim()) {
      // Accept both H:i and HH:MM formats (e.g., "5:30" or "05:30")
      const timePattern = /^([0-9]|[01][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timePattern.test(formData.estimated_duration)) {
        newErrors.estimated_duration = 'Format durasi harus HH:MM (contoh: 02:30)';
      }
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
      // Combine date and time for deadline - use ISO format
      const deadlineDate = new Date(`${formData.deadline_date}T${formData.deadline_time}`);
      const deadline = deadlineDate.toISOString().slice(0, 19); // Remove milliseconds and Z
      
      const taskData = {
        task_title: formData.title,
        task_description: formData.description,
        task_deadline: deadline,
        task_category: formData.category,
        task_status: task ? task.task_status : 'belum_selesai'
      };

      // Only include estimated_task_duration if it's provided and valid
      if (formData.estimated_duration && formData.estimated_duration.trim()) {
        // Convert to H:i format (remove leading zeros from hours and seconds) for backend
        const convertedDuration = convertToBackendTimeFormat(formData.estimated_duration);
        console.log('Duration conversion - Original:', formData.estimated_duration, 'Converted:', convertedDuration);
        taskData.estimated_task_duration = convertedDuration;
      }

      if (task) {
        taskData.id = task.id;
      }

      console.log('Form submitting task data:', taskData);
      await onSave(taskData);
      
      // Call success callback
      if (onSuccess) {
        onSuccess({
          type: 'success',
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
          type: 'error',
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
            <label className={styles.label}>Deskripsi</label>
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
            <label className={styles.label}>Batas waktu</label>
            <div className={styles.dateTimeGroup}>
              <div className={styles.dateInputContainer}>
                <div className={styles.dateInputWrapper}>
                  <img 
                    src={jadwalIcon} 
                    alt="Calendar"
                    className={styles.dateIcon}
                  />
                  <input
                    ref={dateInputRef}
                    type="text"
                    name="deadline_date"
                    value={formData.deadline_date ? (() => {
                      // Parse date safely without timezone issues
                      const dateParts = formData.deadline_date.split('-');
                      if (dateParts.length === 3) {
                        const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                        return localDate.toLocaleDateString('id-ID', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric' 
                        });
                      }
                      return '';
                    })() : ''}
                    readOnly
                    placeholder="DD/MM/YYYY"
                    onFocus={() => setShowDatePicker(true)}
                    onClick={() => setShowDatePicker(true)}
                    className={`${styles.input} ${styles.dateInput} ${errors.deadline_date ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {showDatePicker && (
                  <DatePickerPopup
                    value={formData.deadline_date}
                    onChange={(date) => {
                      setFormData(prev => ({ ...prev, deadline_date: date }));
                      if (errors.deadline_date) {
                        setErrors(prev => ({ ...prev, deadline_date: '' }));
                      }
                    }}
                    onClose={() => setShowDatePicker(false)}
                    targetElement={dateInputRef.current}
                    disabled={isSubmitting}
                    error={!!errors.deadline_date}
                  />
                )}
              </div>
              <div className={styles.timeInputContainer}>
                <div className={styles.timeInputWrapper}>
                  <img 
                    src={clockIcon} 
                    alt="Clock"
                    className={styles.timeIcon}
                  />
                  <input
                    ref={timeInputRef}
                    type="text"
                    name="deadline_time"
                    value={formData.deadline_time ? (() => {
                      // Format time for display (24-hour format)
                      try {
                        const [hours, minutes] = formData.deadline_time.split(':');
                        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                      } catch (e) {
                        return formData.deadline_time;
                      }
                    })() : ''}
                    readOnly
                    placeholder="HH:MM"
                    onFocus={() => setShowTimePicker(true)}
                    onClick={() => setShowTimePicker(true)}
                    className={`${styles.input} ${styles.timeInput} ${errors.deadline_time ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {showTimePicker && (
                  <TimePickerPopup
                    value={formData.deadline_time}
                    onChange={(time) => {
                      setFormData(prev => ({ ...prev, deadline_time: time }));
                      if (errors.deadline_time) {
                        setErrors(prev => ({ ...prev, deadline_time: '' }));
                      }
                    }}
                    onClose={() => setShowTimePicker(false)}
                    targetElement={timeInputRef.current}
                    disabled={isSubmitting}
                    error={!!errors.deadline_time}
                  />
                )}
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
            <label className={styles.label}>Estimasi Durasi</label>
            <div className={styles.timeInputContainer}>
              <div className={styles.timeInputWrapper}>
                <img 
                  src={clockIcon} 
                  alt="Clock"
                  className={styles.timeIcon}
                />
                <input
                  ref={durationInputRef}
                  type="text"
                  name="estimated_duration"
                  value={formData.estimated_duration ? (() => {
                    // Format duration for display - show HH:MM but store H:i
                    try {
                      const [hours, minutes] = formData.estimated_duration.split(':');
                      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                    } catch (e) {
                      return formData.estimated_duration;
                    }
                  })() : ''}
                  readOnly
                  placeholder="HH:MM"
                  onFocus={() => setShowDurationPicker(true)}
                  onClick={() => setShowDurationPicker(true)}
                  className={`${styles.input} ${styles.timeInput} ${errors.estimated_duration ? styles.inputError : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {showDurationPicker && (
                <DurationPickerPopup
                  value={formData.estimated_duration}
                  onChange={(duration) => {
                    setFormData(prev => ({ ...prev, estimated_duration: duration }));
                    if (errors.estimated_duration) {
                      setErrors(prev => ({ ...prev, estimated_duration: '' }));
                    }
                  }}
                  onClose={() => setShowDurationPicker(false)}
                  targetElement={durationInputRef.current}
                  disabled={isSubmitting}
                  error={!!errors.estimated_duration}
                />
              )}
            </div>
            <div className={styles.helpText}>
              Format: HH:MM (contoh: 02:30 untuk 2 jam 30 menit)
            </div>
            {errors.estimated_duration && <div className={styles.errorText}>{errors.estimated_duration}</div>}
          </div>

          {/* Kategori */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Kategori</label>
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
