import React, { useState, useEffect } from 'react';
import styles from './calendar.module.css';

const daysShort = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  let day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

function Calendar({ today, currentDate, onDateChange }) {
  // today dan currentDate dikontrol dari parent
  const [date, setDate] = useState(currentDate || today || new Date());

  useEffect(() => {
    // Sinkronkan tampilan bulan jika currentDate berubah dari parent
    setDate(currentDate || today || new Date());
  }, [currentDate, today]);

  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  // Dummy: tanggal 21 ada jadwal
  const jadwalSet = new Set([21]);

  // Navigasi bulan
  const handlePrev = () => {
    setDate(new Date(year, month - 1, 1));
  };
  const handleNext = () => {
    setDate(new Date(year, month + 1, 1));
  };

  // Generate grid tanggal
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }
  while (days.length % 7 !== 0) {
    days.push(null);
  }

  // Nama bulan Indonesia
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Helper: apakah hari ini
  function isTodayCell(d) {
    return (
      today &&
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  }
  // Helper: apakah currentDate (selected)
  function isCurrentDateCell(d) {
    return (
      currentDate &&
      d === currentDate.getDate() &&
      month === currentDate.getMonth() &&
      year === currentDate.getFullYear()
    );
  }

  // Handle klik tanggal
  function handleSelect(d) {
    if (!d) return;
    const newDate = new Date(year, month, d);
    if (onDateChange) onDateChange(newDate);
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <span className={styles.calendarTitle}>Kalender</span>
        <div className={styles.calendarNav}>
          <button onClick={handlePrev} className={styles.calendarNavBtn}>&lt;</button>
          <span className={styles.calendarMonth}>{monthNames[month]} {year}</span>
          <button onClick={handleNext} className={styles.calendarNavBtn}>&gt;</button>
        </div>
      </div>
      <div className={styles.calendarGrid}>
        {daysShort.map(day => (
          <div key={day} className={styles.calendarDayShort}>{day}</div>
        ))}
        {days.map((d, i) => {
          if (d === null) return <div key={i} className={styles.calendarEmpty}>&nbsp;</div>;
          const isToday = isTodayCell(d);
          const isCurrent = isCurrentDateCell(d);
          const isJadwal = jadwalSet.has(d);
          return (
            <div
              key={i}
              className={
                styles.calendarCell +
                (isCurrent ? ' ' + styles.currentDate : '') +
                (!isCurrent && isToday ? ' ' + styles.today : '')
              }
              onClick={() => handleSelect(d)}
              style={{ cursor: 'pointer' }}
            >
              {d}
              {isJadwal && <span className={styles.jadwalDot} />}
            </div>
          );
        })}
      </div>
      <div className={styles.calendarLegend}>
        <span className={styles.legendItem}>
          <span className={styles.jadwalDotLegend} /> Ada jadwal
        </span>
        <span className={styles.legendItem}>
          <span className={styles.todayDotLegend} /> Hari ini
        </span>
        <span className={styles.legendItem}>
          <span className={styles.currentDateDotLegend} /> Tanggal dipilih
        </span>
      </div>
    </div>
  );
}
export default Calendar;