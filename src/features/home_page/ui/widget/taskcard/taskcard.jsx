import React from 'react';
import styles from './taskcard.module.css';

function TaskCard({ 
  title, 
  categories = [], 
  deadline, 
  status = 'belum_dikerjakan', 
  onClick,
  onToggleStatus 
}) {
  const isCompleted = status === 'selesai';
  
  // Format deadline
  const formatDeadline = (deadlineStr) => {
    if (!deadlineStr) return 'Tidak ada deadline';
    
    try {
      const date = new Date(deadlineStr);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      }) + ', ' + date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return deadlineStr;
    }
  };

  // Tentukan class badge berdasarkan kategori
  const getBadgeClass = (category) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('akademik')) return styles.badgeAkademik;
    if (categoryLower.includes('tugas')) return styles.badgeTugas;
    if (categoryLower.includes('aktivitas')) return styles.badgeAktivitas;
    return styles.badgeDefault;
  };

  // Tentukan class status
  const getStatusClass = () => {
    switch (status) {
      case 'selesai':
        return styles.statusSelesai;
      case 'belum_dikerjakan':
        return styles.statusBelumDikerjakan;
      case 'terlambat':
        return styles.statusTerlambat;
      default:
        return styles.statusBelumDikerjakan;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'selesai':
        return 'Selesai';
      case 'belum_dikerjakan':
        return 'Belum Dikerjakan';
      case 'terlambat':
        return 'Terlambat';
      default:
        return 'Belum Dikerjakan';
    }
  };

  return (
    <div 
      className={`${styles.taskCard} ${isCompleted ? styles.completed : ''}`}
      onClick={onClick}
    >
      {/* Header dengan badges */}
      <div className={styles.taskHeader}>
        <div className={styles.badges}>
          {categories.map((category, index) => (
            <span 
              key={index}
              className={`${styles.badge} ${getBadgeClass(category)}`}
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Title */}
      <h3 className={`${styles.taskTitle} ${isCompleted ? styles.completedText : ''}`}>
        {title}
      </h3>

      {/* Footer dengan deadline dan status */}
      <div className={styles.taskFooter}>
        <div className={styles.deadline}>
          <span className={styles.dateIcon}>📅</span>
          <span className={styles.dateText}>
            {formatDeadline(deadline)}
          </span>
        </div>
        
        <div className={styles.statusContainer}>
          <span 
            className={`${styles.status} ${getStatusClass()}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleStatus) onToggleStatus();
            }}
          >
            {getStatusText()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
