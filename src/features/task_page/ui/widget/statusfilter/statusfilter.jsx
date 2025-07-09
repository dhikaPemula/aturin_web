import React, { useState } from 'react';
import styles from './statusfilter.module.css';

function StatusFilter({ onStatusChange, placeholder = "Semua status" }) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = [
    { value: '', label: 'Semua status' },
    { value: 'belum_selesai', label: 'Belum Selesai' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'terlambat', label: 'Terlambat' }
  ];

  const handleStatusSelect = (status) => {
    setSelectedStatus(status.value);
    setIsOpen(false);
    if (onStatusChange) {
      onStatusChange(status.value);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectedLabel = statusOptions.find(option => option.value === selectedStatus)?.label || placeholder;

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterWrapper}>
        <button
          onClick={toggleDropdown}
          className={styles.filterButton}
          type="button"
        >
          <span className={styles.filterText}>
            {selectedLabel}
          </span>
          <svg 
            className={`${styles.dropdownIcon} ${isOpen ? styles.dropdownIconOpen : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className={styles.dropdownMenu}>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusSelect(option)}
                className={`${styles.dropdownItem} ${selectedStatus === option.value ? styles.dropdownItemActive : ''}`}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatusFilter;
