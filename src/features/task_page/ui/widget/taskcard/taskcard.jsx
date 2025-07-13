import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
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
  isDraggable = false,
  className = ""
}) {
  // State for delete confirmation alert
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // DndKit draggable setup
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: `task-${task?.id || task?.slug}`,
    disabled: !isDraggable,
    data: {
      task: task
    }
  });

  // Transform style for drag feedback
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1, // Slightly more visible when dragging
    cursor: isDraggable ? 'grab' : 'default',
    zIndex: isDragging ? 1000 : 'auto',
    transition: 'opacity 0.1s ease' // Quick transition for opacity
  };

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Ensure alert is closed when component unmounts
      setShowDeleteAlert(false);
    };
  }, []);

  // Handle delete button click
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent drag event
    e.preventDefault(); // Prevent default behavior
    setShowDeleteAlert(true);
  };

  // Handle edit button click
  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent drag event
    e.preventDefault(); // Prevent default behavior
    if (onEditTask) {
      onEditTask(task);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
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
  const handleDeleteCancel = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowDeleteAlert(false);
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

  // Handler untuk menghilangkan ghost drag image
  const handleDragStart = (e) => {
    // Buat gambar transparan 1x1px
    const img = document.createElement("img");
    img.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=";
    e.dataTransfer.setDragImage(img, 0, 0);
    // DndKit listeners tetap berjalan
    if (listeners && listeners.onDragStart) listeners.onDragStart(e);
  };

  if (!task) {
    return null;
  }

  return (
    <>
    <div 
      ref={setNodeRef}
      className={`${styles.taskCard} ${isDragging ? styles.dragging : ''} ${className ? styles[className] : ''}`}
      style={style}
      {...(isDraggable ? { ...listeners, ...attributes, onDragStart: handleDragStart } : {})}
    >
      {/* Task Header with Category Badge */}
      <div className={styles.taskHeader}>
        {((task.categories && task.categories.length > 0) || task.task_category) && (
          <div className={styles.categoryBadges}>
            {(task.categories && task.categories.length > 0 
              ? task.categories 
              : (task.task_category ? [task.task_category] : [])
            )
              .filter(category => 
                category.toLowerCase() !== 'tugas' && 
                category.toLowerCase() !== 'task'
              )
              .map((category, index) => (
                <Badge
                  key={`category-${task.id || task.slug}-${index}`}
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
          <div 
            className={styles.inlineActionButtons}
            data-no-drag="true" // Attribute to identify non-draggable area
          >
            {onEditTask && (
              <button 
                onClick={handleEditClick}
                onPointerDown={(e) => e.stopPropagation()} // Prevent drag on pointer down
                onMouseDown={(e) => e.stopPropagation()} // Prevent drag on mouse down
                onTouchStart={(e) => e.stopPropagation()} // Prevent drag on touch start
                className={styles.editButton}
                type="button"
                title="Edit Tugas"
                data-no-drag="true"
              >
                <img src={editIcon} alt="Edit" className={styles.actionIcon} />
              </button>
            )}
            {onDeleteTask && (
              <button 
                onClick={handleDeleteClick}
                onPointerDown={(e) => e.stopPropagation()} // Prevent drag on pointer down
                onMouseDown={(e) => e.stopPropagation()} // Prevent drag on mouse down
                onTouchStart={(e) => e.stopPropagation()} // Prevent drag on touch start
                className={styles.deleteButton}
                type="button"
                title="Hapus Tugas"
                data-no-drag="true"
              >
                <img src={deleteIcon} alt="Delete" className={styles.actionIcon} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Delete Confirmation Alert - Outside draggable area */}
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
    </>
  );
}

export default TaskCard;
