import React, { useState, useEffect } from 'react';
import styles from './taskcard.module.css';
import Badge from '../../../../../core/widgets/badge/buildbadge/badge.jsx';
import Alert from '../../../../../core/widgets/alert/alert.jsx';

// Import icons
import clockIcon from '../../../../../assets/home/clock.svg';
import jadwalIcon from '../../../../../assets/home/jadwal.svg';
import editIcon from '../../../../../assets/task/edit.svg';
import deleteIcon from '../../../../../assets/task/delete.svg';

function TaskCard({ 
  task,
  onEditTask, 
  onDeleteTask,
  onDeleteSuccess,
  isDraggable = false
}) {
  // State for delete confirmation alert
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Ensure alert is closed when component unmounts
      setShowDeleteAlert(false);
    };
  }, []);

  // Handle delete button click
  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (onDeleteTask) {
      try {
        await onDeleteTask(task);
        
        // Call success callback untuk menampilkan toast
        if (onDeleteSuccess) {
          onDeleteSuccess({
            type: 'success',
            title: 'Berhasil Menghapus Tugas',
            message: `Tugas "${task?.title}" berhasil dihapus`
          });
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        
        // Call error callback jika ada
        if (onDeleteSuccess) {
          onDeleteSuccess({
            type: 'error',
            title: 'Gagal Menghapus Tugas',
            message: 'Terjadi kesalahan saat menghapus tugas'
          });
        }
      }
    }
    // Close alert after action
    setShowDeleteAlert(false);
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setShowDeleteAlert(false);
  };

  // Handle drag start
  const handleDragStart = (e) => {
    if (!isDraggable) return;
    
    // Set drag data
    e.dataTransfer.setData('task', JSON.stringify(task));
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image to prevent default transparency
    const dragImage = e.target.cloneNode(true);
    dragImage.style.opacity = '1';
    dragImage.style.transform = 'rotate(2deg)';
    dragImage.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)';
    
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-1000px';
    container.style.left = '-1000px';
    container.style.width = e.target.offsetWidth + 'px';
    container.style.height = e.target.offsetHeight + 'px';
    container.appendChild(dragImage);
    
    document.body.appendChild(container);
    
    // Set cursor position to center of the card
    const centerX = e.target.offsetWidth / 2;
    const centerY = e.target.offsetHeight / 2;
    
    // Set the custom drag image with center positioning
    e.dataTransfer.setDragImage(dragImage, centerX, centerY);
    
    // Clean up after a short delay
    setTimeout(() => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }, 0);
  };

  // Handle drag end
  const handleDragEnd = (e) => {
    if (!isDraggable) return;
    
    // No need to reset opacity since we don't change it
  };
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
        return `Estimasi: ${h} jam ${m} menit`;
      } else if (h > 0) {
        return `Estimasi: ${h} jam`;
      } else if (m > 0) {
        return `Estimasi: ${m} menit`;
      }
    }
    
    return `Estimasi: ${duration}`;
  };

  if (!task) {
    return null;
  }

  return (
    <div 
      className={styles.taskCard}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ cursor: isDraggable ? 'move' : 'default' }}
    >
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
                onClick={handleDeleteClick}
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

      {/* Delete Confirmation Alert */}
      {showDeleteAlert && (
        <Alert
          isOpen={showDeleteAlert}
          title="Hapus Tugas"
          message={`Apakah Anda yakin ingin menghapus tugas "${task?.title}"? Perubahan ini bersifat permanen.`}
          cancelText="Batal"
          submitLabel="Hapus"
          onCancel={handleDeleteCancel}
          onSubmit={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

export default TaskCard;
