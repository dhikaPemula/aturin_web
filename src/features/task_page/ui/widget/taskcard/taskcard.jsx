import React from 'react';
import styles from './taskcard.module.css';
import Badge from '../../../../../core/widgets/badge/buildbadge/badge.jsx';

// Import icons
import clockIcon from '../../../../../assets/home/clock.svg';
import jadwalIcon from '../../../../../assets/home/jadwal.svg';
import editIcon from '../../../../../assets/task/edit.svg';
import deleteIcon from '../../../../../assets/task/delete.svg';

function TaskCard({ 
  task,
  onEditTask, 
  onDeleteTask 
}) {
  // Format deadline
  const formatDeadline = (deadlineStr) => {
    if (!deadlineStr) return 'Tidak ada deadline';
    
    try {
      const date = new Date(deadlineStr);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) + ', ' + date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return deadlineStr;
    }
  };

  // Format estimation
  const formatEstimation = (estimation) => {
    if (!estimation) return 'Tidak ada estimasi';
    return `Estimasi: ${estimation}`;
  };

  // Format estimated task duration
  const formatEstimatedDuration = (duration) => {
    if (!duration) return 'Tidak ada durasi estimasi';
    
    // Handle HH:MM:SS format
    if (duration.includes(':')) {
      const [hours, minutes, seconds] = duration.split(':');
      const h = parseInt(hours);
      const m = parseInt(minutes);
      
      if (h > 0 && m > 0) {
        return `Durasi: ${h} jam ${m} menit`;
      } else if (h > 0) {
        return `Durasi: ${h} jam`;
      } else if (m > 0) {
        return `Durasi: ${m} menit`;
      }
    }
    
    return `Durasi: ${duration}`;
  };

  if (!task) {
    return null;
  }

  return (
    <div className={styles.taskCard}>
      {/* Task Header with Category Badge */}
      <div className={styles.taskHeader}>
        {task.categories && task.categories.length > 0 && (
          <div className={styles.categoryBadges}>
            {task.categories
              .filter(category => 
                category.toLowerCase() !== 'tugas' && 
                category.toLowerCase() !== 'task'
              )
              .map((category, index) => (
                <Badge
                  key={`category-${task.id}-${index}`}
                  name={category.toLowerCase()}
                  size="small"
                />
              ))}
          </div>
        )}
      </div>

      {/* Task Content */}
      <div className={styles.taskContent}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        {task.description && (
          <p className={styles.taskDescription}>{task.description}</p>
        )}
      </div>

      {/* Task Details */}
      <div className={styles.taskDetails}>
        {/* Estimation */}
        {task.estimation && (
          <div className={styles.detailItem}>
            <img src={clockIcon} alt="Estimasi" className={styles.detailIcon} />
            <span className={styles.detailText}>
              {formatEstimation(task.estimation)}
            </span>
          </div>
        )}

        {/* Estimated Task Duration */}
        {task.estimated_task_duration && (
          <div className={styles.detailItem}>
            <img src={clockIcon} alt="Durasi Estimasi" className={`${styles.detailIcon} ${styles.durationIcon}`} />
            <span className={styles.detailText}>
              {formatEstimatedDuration(task.estimated_task_duration)}
            </span>
          </div>
        )}

        {/* Deadline */}
        <div className={styles.detailItem}>
          <img src={jadwalIcon} alt="Deadline" className={`${styles.detailIcon} ${styles.deadlineIcon}`} />
          <span className={styles.detailText}>
            {formatDeadline(task.deadline)}
          </span>
          
          {/* Action Buttons - inline with deadline */}
          <div className={styles.inlineActionButtons}>
            {onEditTask && (
              <button 
                onClick={() => onEditTask(task)}
                className={styles.editButton}
                type="button"
                title="Edit Tugas"
              >
                <img src={editIcon} alt="Edit" className={styles.actionIcon} />
              </button>
            )}
            {onDeleteTask && (
              <button 
                onClick={() => onDeleteTask(task)}
                className={styles.deleteButton}
                type="button"
                title="Hapus Tugas"
              >
                <img src={deleteIcon} alt="Delete" className={styles.actionIcon} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
