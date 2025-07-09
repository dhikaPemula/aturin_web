import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './timepicker_popup.module.css';

function TimePickerPopup({ 
  value = '', 
  onChange, 
  onClose,
  disabled = false,
  error = false,
  targetElement = null
}) {
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const popupRef = useRef(null);
  const hourColumnRef = useRef(null);
  const minuteColumnRef = useRef(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      // Parse time in HH:MM format (24-hour)
      const [hours, minutes] = value.split(':').map(Number);
      
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        setSelectedHour(hours);
        setSelectedMinute(minutes);
      }
    } else {
      // Default to current time
      const now = new Date();
      setSelectedHour(now.getHours());
      setSelectedMinute(now.getMinutes());
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

  // Handle time selection
  const handleTimeSelect = () => {
    // Format as HH:MM (24-hour format)
    const formattedTime = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    
    console.log('TimePicker: Selected time:', formattedTime);
    onChange(formattedTime);
    onClose();
  };

  // Generate hour options (multiple cycles for infinite scroll)
  const hourCycles = 5; // Number of complete cycles
  const hourOptions = [];
  for (let cycle = 0; cycle < hourCycles; cycle++) {
    for (let hour = 0; hour < 24; hour++) {
      hourOptions.push({ value: hour, displayValue: String(hour).padStart(2, '0') });
    }
  }
  
  // Generate minute options (multiple cycles for infinite scroll)
  const minuteCycles = 5; // Number of complete cycles
  const minuteOptions = [];
  for (let cycle = 0; cycle < minuteCycles; cycle++) {
    for (let minute = 0; minute < 60; minute++) {
      minuteOptions.push({ value: minute, displayValue: String(minute).padStart(2, '0') });
    }
  }

  // Calculate middle cycle indices
  const middleHourCycleStart = Math.floor(hourCycles / 2) * 24;
  const middleMinuteCycleStart = Math.floor(minuteCycles / 2) * 60;

  // Handle scroll to select time
  const handleHourScroll = (hour) => {
    setSelectedHour(hour);
    // Scroll to center the selected item in middle cycle
    if (hourColumnRef.current) {
      const itemHeight = 40;
      const containerHeight = 150;
      const paddingItems = 3;
      const middleIndex = middleHourCycleStart + hour;
      const scrollTop = (middleIndex + paddingItems) * itemHeight - (containerHeight / 2) + (itemHeight / 2);
      hourColumnRef.current.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  };

  const handleMinuteScroll = (minute) => {
    setSelectedMinute(minute);
    // Scroll to center the selected item in middle cycle
    if (minuteColumnRef.current) {
      const itemHeight = 40;
      const containerHeight = 150;
      const paddingItems = 3;
      const middleIndex = middleMinuteCycleStart + minute;
      const scrollTop = (middleIndex + paddingItems) * itemHeight - (containerHeight / 2) + (itemHeight / 2);
      minuteColumnRef.current.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  };

  // Scroll state tracking
  const scrollTimeoutRef = useRef(null);
  const isScrollingRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  // Handle manual scroll to detect center item with infinite wrapping
  const handleHourScrollEvent = () => {
    if (hourColumnRef.current && !isScrollingRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      
      scrollTimeoutRef.current = setTimeout(() => {
        const scrollTop = hourColumnRef.current.scrollTop;
        const itemHeight = 40;
        const containerHeight = 150;
        const paddingItems = 3;
        
        // Calculate which item should be centered
        const exactIndex = (scrollTop + containerHeight / 2 - itemHeight / 2) / itemHeight - paddingItems;
        const centerIndex = Math.round(exactIndex);
        
        // Only proceed if we have a valid center index
        if (centerIndex >= 0 && centerIndex < hourOptions.length) {
          const hour = hourOptions[centerIndex].value;
          
          // Snap to exact center position
          isScrollingRef.current = true;
          const exactScrollTop = (centerIndex + paddingItems) * itemHeight - (containerHeight / 2) + (itemHeight / 2);
          
          hourColumnRef.current.scrollTo({
            top: exactScrollTop,
            behavior: 'smooth'
          });
          
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 200);
          
          if (hour !== selectedHour) {
            setSelectedHour(hour);
          }
          
          // Handle infinite scroll effect
          const totalItems = hourOptions.length;
          const firstCycleEnd = 24;
          const lastCycleStart = totalItems - 24;
          
          if (centerIndex < firstCycleEnd) {
            // Near the beginning, jump to middle cycle
            setTimeout(() => {
              const newIndex = middleHourCycleStart + hour;
              const newScrollTop = (newIndex + paddingItems) * itemHeight - (containerHeight / 2) + (itemHeight / 2);
              hourColumnRef.current.scrollTop = newScrollTop;
            }, 250);
          } else if (centerIndex > lastCycleStart) {
            // Near the end, jump to middle cycle
            setTimeout(() => {
              const newIndex = middleHourCycleStart + hour;
              const newScrollTop = (newIndex + paddingItems) * itemHeight - (containerHeight / 2) + (itemHeight / 2);
              hourColumnRef.current.scrollTop = newScrollTop;
            }, 250);
          }
        }
      }, 100);
    }
  };

  const handleMinuteScrollEvent = () => {
    if (minuteColumnRef.current && !isScrollingRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      
      scrollTimeoutRef.current = setTimeout(() => {
        const scrollTop = minuteColumnRef.current.scrollTop;
        const itemHeight = 40;
        const containerHeight = 150;
        const paddingItems = 3;
        
        // Calculate which item should be centered
        const exactIndex = (scrollTop + containerHeight / 2 - itemHeight / 2) / itemHeight - paddingItems;
        const centerIndex = Math.round(exactIndex);
        
        // Only proceed if we have a valid center index
        if (centerIndex >= 0 && centerIndex < minuteOptions.length) {
          const minute = minuteOptions[centerIndex].value;
          
          // Snap to exact center position
          isScrollingRef.current = true;
          const exactScrollTop = (centerIndex + paddingItems) * itemHeight - (containerHeight / 2) + (itemHeight / 2);
          
          minuteColumnRef.current.scrollTo({
            top: exactScrollTop,
            behavior: 'smooth'
          });
          
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 200);
          
          if (minute !== selectedMinute) {
            setSelectedMinute(minute);
          }
          
          // Handle infinite scroll effect
          const totalItems = minuteOptions.length;
          const firstCycleEnd = 60;
          const lastCycleStart = totalItems - 60;
          
          if (centerIndex < firstCycleEnd) {
            // Near the beginning, jump to middle cycle
            setTimeout(() => {
              const newIndex = middleMinuteCycleStart + minute;
              const newScrollTop = (newIndex + paddingItems) * itemHeight - (containerHeight / 2) + (itemHeight / 2);
              minuteColumnRef.current.scrollTop = newScrollTop;
            }, 250);
          } else if (centerIndex > lastCycleStart) {
            // Near the end, jump to middle cycle
            setTimeout(() => {
              const newIndex = middleMinuteCycleStart + minute;
              const newScrollTop = (newIndex + paddingItems) * itemHeight - (containerHeight / 2) + (itemHeight / 2);
              minuteColumnRef.current.scrollTop = newScrollTop;
            }, 250);
          }
        }
      }, 100);
    }
  };

  // Initialize scroll position to center selected items in middle cycle
  useEffect(() => {
    if (hourColumnRef.current && minuteColumnRef.current) {
      const itemHeight = 40;
      const containerHeight = 150;
      const paddingItems = 3;
      
      // Set initial positions
      const hourIndex = middleHourCycleStart + selectedHour;
      const minuteIndex = middleMinuteCycleStart + selectedMinute;
      
      const hourScrollTop = (hourIndex + paddingItems) * itemHeight - (containerHeight / 2) + (itemHeight / 2);
      const minuteScrollTop = (minuteIndex + paddingItems) * itemHeight - (containerHeight / 2) + (itemHeight / 2);
      
      hourColumnRef.current.scrollTop = hourScrollTop;
      minuteColumnRef.current.scrollTop = minuteScrollTop;
      
      // Add event listeners for better scroll handling
      const hourElement = hourColumnRef.current;
      const minuteElement = minuteColumnRef.current;
      
      // Add wheel event listeners for smoother scrolling
      const handleHourWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 1 : -1;
        const newHour = (selectedHour + delta + 24) % 24;
        handleHourScroll(newHour);
      };
      
      const handleMinuteWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 1 : -1;
        const newMinute = (selectedMinute + delta + 60) % 60;
        handleMinuteScroll(newMinute);
      };
      
      hourElement.addEventListener('wheel', handleHourWheel, { passive: false });
      minuteElement.addEventListener('wheel', handleMinuteWheel, { passive: false });
      
      return () => {
        hourElement.removeEventListener('wheel', handleHourWheel);
        minuteElement.removeEventListener('wheel', handleMinuteWheel);
      };
    }
  }, [selectedHour, selectedMinute]);

  // Scroll to selected items when values change (use middle cycle)
  useEffect(() => {
    if (hourColumnRef.current) {
      const itemHeight = 40;
      const containerHeight = 150;
      const paddingItems = 3;
      const middleIndex = middleHourCycleStart + selectedHour;
      const scrollTop = (middleIndex + paddingItems) * itemHeight - (containerHeight / 2) + (itemHeight / 2);
      hourColumnRef.current.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, [selectedHour]);

  useEffect(() => {
    if (minuteColumnRef.current) {
      const itemHeight = 40;
      const containerHeight = 150;
      const paddingItems = 3;
      const middleIndex = middleMinuteCycleStart + selectedMinute;
      const scrollTop = (middleIndex + paddingItems) * itemHeight - (containerHeight / 2) + (itemHeight / 2);
      minuteColumnRef.current.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, [selectedMinute]);

  return createPortal(
    <div ref={popupRef} className={styles.popup}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Atur Waktu</h3>
      </div>

      {/* Time selectors */}
      <div className={styles.selectors}>
        {/* Hour and Minute columns side by side */}
        <div className={styles.selectorRow}>
          {/* Hour selector */}
          <div className={styles.selectorColumn}>
            <div 
              className={styles.scrollColumn} 
              ref={hourColumnRef}
              onScroll={handleHourScrollEvent}
            >
              {/* Padding items for proper centering */}
              <div className={styles.scrollItem}></div>
              <div className={styles.scrollItem}></div>
              <div className={styles.scrollItem}></div>
              
              {hourOptions.map((hourItem, index) => (
                <div
                  key={index}
                  className={`${styles.scrollItem} ${selectedHour === hourItem.value ? styles.selected : ''}`}
                  onClick={() => handleHourScroll(hourItem.value)}
                >
                  {hourItem.displayValue}
                </div>
              ))}
              
              {/* Padding items for proper centering */}
              <div className={styles.scrollItem}></div>
              <div className={styles.scrollItem}></div>
              <div className={styles.scrollItem}></div>
            </div>
          </div>

          {/* Minute selector */}
          <div className={styles.selectorColumn}>
            <div 
              className={styles.scrollColumn} 
              ref={minuteColumnRef}
              onScroll={handleMinuteScrollEvent}
            >
              {/* Padding items for proper centering */}
              <div className={styles.scrollItem}></div>
              <div className={styles.scrollItem}></div>
              <div className={styles.scrollItem}></div>
              
              {minuteOptions.map((minuteItem, index) => (
                <div
                  key={index}
                  className={`${styles.scrollItem} ${selectedMinute === minuteItem.value ? styles.selected : ''}`}
                  onClick={() => handleMinuteScroll(minuteItem.value)}
                >
                  {minuteItem.displayValue}
                </div>
              ))}
              
              {/* Padding items for proper centering */}
              <div className={styles.scrollItem}></div>
              <div className={styles.scrollItem}></div>
              <div className={styles.scrollItem}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onClose}
        >
          Batal
        </button>
        <button
          type="button"
          className={styles.selectButton}
          onClick={handleTimeSelect}
        >
          Pilih
        </button>
      </div>
    </div>,
    document.body
  );
}

export default TimePickerPopup;
