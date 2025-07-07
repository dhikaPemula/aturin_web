import React, { useState } from 'react';
import styles from './sublist.module.css';
import TaskCard from '../taskcard/taskcard.jsx';
import { getStatusByName } from './status.jsx';

// Import icons
import noDataIcon from '../../../../../assets/home/nodata.svg';

function SubList({ 
  task_status = "belum_selesai", 
  tasks = [], 
  title, 
  currentCategory = "",
  onEditTask, 
  onDeleteTask,
  onDeleteSuccess,
  onDropTask
}) {
  const [isDragOver, setIsDragOver] = useState(false);
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

  // Handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const draggedTaskData = JSON.parse(e.dataTransfer.getData('task'));
      
      // Only handle drop if it's a different status
      if (draggedTaskData.task_status !== task_status && onDropTask) {
        onDropTask(draggedTaskData, task_status);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return (
    <div 
      className={`${styles.subListContainer} ${isDragOver ? styles.dragOver : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
            <TaskCard
              key={task.id}
              task={task}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onDeleteSuccess={onDeleteSuccess}
              isDraggable={true}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default SubList;
