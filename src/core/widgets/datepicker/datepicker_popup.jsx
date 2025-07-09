import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './datepicker_popup.module.css';

function DatePickerPopup({ 
  value = '', 
  onChange, 
  onClose,
  disabled = false,
  error = false,
  targetElement = null
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const popupRef = useRef(null);

  // Update selected date when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
      setCurrentDate(new Date(value));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Position popup above target element
  useEffect(() => {
    if (popupRef.current && targetElement) {
      const targetRect = targetElement.getBoundingClientRect();
      const popup = popupRef.current;
      
      // Position above the target element
      popup.style.position = 'fixed';
      popup.style.left = `${targetRect.left}px`;
      popup.style.bottom = `${window.innerHeight - targetRect.top + 8}px`; // 8px gap above input
      popup.style.zIndex = '10001';
    }
  }, [targetElement]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking inside the popup
      if (popupRef.current && popupRef.current.contains(event.target)) {
        return;
      }
      
      // Don't close if clicking on the target input
      if (targetElement && targetElement.contains(event.target)) {
        return;
      }
      
      // Close popup for any other clicks
      onClose();
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Add slight delay to avoid immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose, targetElement]);

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    if (!day) return;

    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    
    // Format date as YYYY-MM-DD without timezone conversion
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const dayFormatted = String(newDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayFormatted}`;
    
    console.log('DatePicker: Selected date:', formattedDate);
    onChange(formattedDate);
    onClose();
  };

  // Navigate months
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Check if date is today
  const isToday = (day) => {
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return today.toDateString() === checkDate.toDateString();
  };

  // Check if date is selected
  const isSelected = (day) => {
    if (!selectedDate || !day) return false;
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return selectedDate.toDateString() === checkDate.toDateString();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return createPortal(
    <div ref={popupRef} className={styles.popup}>
      {/* Header */}
      <div className={styles.header}>
        <button 
          type="button" 
          className={styles.navButton}
          onClick={() => navigateMonth(-1)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
        
        <div className={styles.monthYear}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        
        <button 
          type="button" 
          className={styles.navButton}
          onClick={() => navigateMonth(1)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className={styles.dayNames}>
        {dayNames.map(day => (
          <div key={day} className={styles.dayName}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={styles.calendar}>
        {getDaysInMonth(currentDate).map((day, index) => (
          <button
            key={index}
            type="button"
            className={`
              ${styles.dayButton} 
              ${!day ? styles.dayEmpty : ''}
              ${isToday(day) ? styles.dayToday : ''}
              ${isSelected(day) ? styles.daySelected : ''}
            `}
            onClick={() => handleDateSelect(day)}
            disabled={!day}
          >
            {day}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

export default DatePickerPopup;
