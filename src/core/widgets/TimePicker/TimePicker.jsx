import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './TimePicker.module.css'

const TimePicker = ({ 
  value, 
  onChange, 
  onFocus, 
  onBlur, 
  disabled = false,
  minTime,
  selectedDate, // Tambah prop untuk tanggal yang dipilih
  placeholder = "-- : --",
  error = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [focusedHour, setFocusedHour] = useState(false)
  const [focusedMinute, setFocusedMinute] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  // Parse value menjadi jam dan menit
  const [hours, minutes] = value ? value.split(':') : ['', '']

  // Generate options untuk jam (00-23)
  const generateHours = () => {
    const options = []
    for (let i = 0; i < 24; i++) {
      const hour = String(i).padStart(2, '0')
      options.push(hour)
    }
    return options
  }

  // Generate options untuk menit (00-59)
  const generateMinutes = () => {
    const options = []
    for (let i = 0; i < 60; i++) {
      const minute = String(i).padStart(2, '0')
      options.push(minute)
    }
    return options
  }

  // Check if time is disabled
  const isTimeDisabled = (hour, minute) => {
    if (!selectedDate) return false
    
    // Cek apakah tanggal yang dipilih adalah hari ini
    const today = new Date()
    const selectedDateObj = new Date(selectedDate)
    const isToday = selectedDateObj.toDateString() === today.toDateString()
    
    if (isToday) {
      // Jika hari ini, disable waktu yang sudah lewat
      const currentTime = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`
      const timeString = `${hour}:${minute}`
      return timeString < currentTime
    }
    
    // Jika ada minTime, gunakan itu juga
    if (minTime) {
      const timeString = `${hour}:${minute}`
      return timeString < minTime
    }
    
    return false
  }

  // Handle manual input
  const handleInputChange = (event) => {
    const inputValue = event.target.value
    
    // HTML time input handles validation automatically
    // Just pass the value through
    onChange(inputValue)
  }

  // Handle input focus
  const handleInputFocus = () => {
    setIsFocused(true)
    if (onFocus) onFocus()
  }

  // Handle input blur
  const handleInputBlur = () => {
    setIsFocused(false)
    if (onBlur) onBlur()
  }

  // Handle hour selection
  const handleHourSelect = (hour) => {
    const newTime = `${hour}:${minutes || '00'}`
    onChange(newTime)
    setFocusedHour(false)
    // Don't close dropdown, let user choose minutes and use save button
  }

  // Handle minute selection
  const handleMinuteSelect = (minute) => {
    const newTime = `${hours || '00'}:${minute}`
    onChange(newTime)
    setFocusedMinute(false)
    // Don't close dropdown, let user use save button
  }

  // Handle save button
  const handleSave = () => {
    setIsOpen(false)
    if (onBlur) onBlur()
  }

  // Handle cancel button  
  const handleCancel = () => {
    setIsOpen(false)
    if (onBlur) onBlur()
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        // Check if click is inside the dropdown portal
        const dropdownPortal = document.querySelector('[data-timepicker-dropdown]')
        if (dropdownPortal && dropdownPortal.contains(event.target)) {
          return // Don't close if clicking inside dropdown
        }
        
        setIsOpen(false)
        setFocusedHour(false)
        setFocusedMinute(false)
        if (onBlur) onBlur()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onBlur])

  // Calculate dropdown position
  const calculateDropdownPosition = () => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const dropdownHeight = 260 // Height of dropdown + buttons (200 + 60)
    
    // Check if dropdown will overflow bottom
    const willOverflowBottom = rect.bottom + dropdownHeight > viewportHeight
    
    setDropdownPosition({
      top: willOverflowBottom ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width
    })
  }

  // Handle focus/toggle
  const handleToggle = (event) => {
    // Jika click pada input, jangan toggle
    if (event.target === inputRef.current) return
    
    if (!disabled) {
      if (!isOpen) {
        calculateDropdownPosition()
      }
      setIsOpen(!isOpen) // Toggle open/close
      if (!isOpen && onFocus) onFocus()
      if (isOpen && onBlur) onBlur()
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${className} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
    >
      {/* Display */}
      <div 
        className={`${styles.display} ${(isOpen || isFocused) ? styles.focused : ''}`}
        onClick={handleToggle}
      >
        <input
          ref={inputRef}
          type="time"
          value={value || ''}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.timeInput}
        />
        <svg 
          className={styles.icon}
          width="16" 
          height="16" 
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && createPortal(
        <div 
          className={styles.dropdownPortal}
          data-timepicker-dropdown="true"
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 9999
          }}
        >
          <div className={styles.dropdown}>
            <div className={styles.timeColumns}>
              {/* Hour Column */}
              <div className={styles.column}>
                <div className={styles.optionsList}>
                  {generateHours().map((hour) => {
                    const isDisabled = isTimeDisabled(hour, minutes || '00')
                    return (
                      <button
                        key={hour}
                        type="button"
                        className={`${styles.option} ${
                          hours === hour ? styles.selected : ''
                        } ${isDisabled ? styles.optionDisabled : ''}`}
                        onClick={() => !isDisabled && handleHourSelect(hour)}
                        disabled={isDisabled}
                      >
                        {hour}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Minute Column */}
              <div className={styles.column}>
                <div className={styles.optionsList}>
                  {generateMinutes().map((minute) => {
                    const isDisabled = isTimeDisabled(hours || '00', minute)
                    return (
                      <button
                        key={minute}
                        type="button"
                        className={`${styles.option} ${
                          minutes === minute ? styles.selected : ''
                        } ${isDisabled ? styles.optionDisabled : ''}`}
                        onClick={() => !isDisabled && handleMinuteSelect(minute)}
                        disabled={isDisabled}
                      >
                        {minute}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                Batal
              </button>
              <button
                type="button"
                className={styles.saveButton}
                onClick={handleSave}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default TimePicker
