import React from 'react';
import styles from './sublist.module.css';
import Badge from '../../../../../core/widgets/badge/buildbadge/badge.jsx';
import { getStatusByName } from './status.jsx';

// Import icons
import clockIcon from '../../../../../assets/home/clock.svg';
import jadwalIcon from '../../../../../assets/home/jadwal.svg';
import noDataIcon from '../../../../../assets/home/nodata.svg';

function SubList({ 
  task_status = "belum_selesai", 
  tasks = [], 
  title, 
  currentCategory = "",
  onEditTask, 
  onDeleteTask 
}) {
  // Filter tasks by status and category
  let filteredTasks = tasks.filter(task => task.task_status === task_status);
  
  // If currentCategory is specified and not empty, filter by category
  if (currentCategory && currentCategory !== '') {
    filteredTasks = filteredTasks.filter(task => 
      task.categories && task.categories.some(category => 
        category.toLowerCase() === currentCategory.toLowerCase()
      )
    );
  }

  // Get status data from status.jsx
  const currentStatus = getStatusByName(task_status) || {
    name: task_status,
    label: task_status.charAt(0).toUpperCase() + task_status.slice(1).replace('_', ' '),
    foreground: "#666666",
    background: "#F3F4F6",
    iconPath: "/src/assets/home/clock.svg"
  };
  const displayTitle = title || currentStatus.label;

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

  return (
    <div className={styles.subListContainer}>
      {/* Header with status badge */}
      <div 
        className={styles.headerSection}
        style={{
          backgroundColor: currentStatus.background,
          color: currentStatus.foreground
        }}
      >
        <div className={styles.headerContent}>
          {currentStatus.iconPath && (
            <img 
              src={currentStatus.iconPath} 
              alt={currentStatus.label}
              className={styles.statusIcon}
            />
          )}
          <p className={styles.statusLabel}>{currentStatus.label}</p>
          <span className={styles.taskCount}>{filteredTasks.length}</span>
        </div>
      </div>

      {/* Task List or Empty State */}
      <div className={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <img src={noDataIcon} alt="Tidak ada data" className={styles.emptyStateIcon} />
            <p className={styles.emptyStateText}>
              Tidak ada data
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
          <div key={task.id} className={styles.taskItem}>
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

              {/* Deadline */}
              <div className={styles.detailItem}>
                <img src={jadwalIcon} alt="Deadline" className={styles.detailIcon} />
                <span className={styles.detailText}>
                  {formatDeadline(task.deadline)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              {onEditTask && (
                <button 
                  onClick={() => onEditTask(task)}
                  className={styles.editButton}
                  type="button"
                >
                  <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onDeleteTask && (
                <button 
                  onClick={() => onDeleteTask(task)}
                  className={styles.deleteButton}
                  type="button"
                >
                  <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}

export default SubList;
