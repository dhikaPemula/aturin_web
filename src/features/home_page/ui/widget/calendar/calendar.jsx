import React, { useState, useEffect } from 'react';
import styles from './calendar.module.css';
import { getAllTasks } from '../../../../../core/services/api/task_api_service';
import { getActivities } from '../../../../../core/services/api/activity_api_service';
import { useTaskAutoRefresh } from '../../../../../core/hooks/useGlobalTaskRefresh';

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
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks dan activities untuk menentukan hari mana yang ada tugas/aktivitas
  const fetchTasksAndActivities = async () => {
    try {
      setLoading(true);
      const [tasksData, activitiesData] = await Promise.all([
        getAllTasks(),
        getActivities()
      ]);
      setTasks(tasksData);
      setActivities(activitiesData);
      console.log('Calendar: Tasks & Activities loaded for date indicators');
    } catch (error) {
      console.error('Calendar: Error fetching tasks/activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh menggunakan global trigger
  useTaskAutoRefresh(fetchTasksAndActivities);

  useEffect(() => {
    // Sinkronkan tampilan bulan jika currentDate berubah dari parent
    setDate(currentDate || today || new Date());
  }, [currentDate, today]);

  // Initial fetch
  useEffect(() => {
    fetchTasksAndActivities();
  }, []);

  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  // Buat set tanggal yang ada tugas/aktivitas di bulan/tahun yang sedang ditampilkan
  const eventsInCurrentMonth = new Set();
  // Tugas
  tasks.forEach(task => {
    if (task.task_deadline) {
      try {
        const taskDate = new Date(task.task_deadline);
        // Cek apakah task ada di bulan dan tahun yang sama dengan calendar
        if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
          eventsInCurrentMonth.add(taskDate.getDate());
        }
      } catch (error) {
        console.warn('Calendar: Invalid task deadline format:', task.task_deadline);
      }
    }
  });
  // Aktivitas
  activities.forEach(act => {
    const rawDate = act.activity_date || act.tanggal || act.date;
    if (rawDate) {
      try {
        const actDate = new Date(rawDate);
        if (actDate.getFullYear() === year && actDate.getMonth() === month) {
          eventsInCurrentMonth.add(actDate.getDate());
        }
      } catch (error) {
        console.warn('Calendar: Invalid activity date format:', rawDate);
      }
    }
  });

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
        <span className={styles.calendarTitle}>
          Kalender
        </span>
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
          const hasEvents = eventsInCurrentMonth.has(d);
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
              {hasEvents && <span className={styles.jadwalDot} />}
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