import React from 'react';
import styles from './sublist.module.css';
import TaskCard from '../taskcard/taskcard.jsx';
import { getStatusByName } from './status.jsx';
import { Droppable, Draggable } from '@hello-pangea/dnd';

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
  gap = 0, // default gap 0
  draggingCardId = null, // dari List
  setDraggingCardId // dari List
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

  // Kondisi empty: benar-benar kosong, atau sedang drag-over dan card yang di-drag adalah satu-satunya card
  const isEmpty =
    filteredTasks.length === 0 ||
    (filteredTasks.length === 1 && (filteredTasks[0].id === draggingCardId || filteredTasks[0].slug === draggingCardId));

  return (
    <Droppable
      droppableId={task_status}
      renderClone={(provided, snapshot, rubric) => {
        // Ambil task dari props.tasks, agar clone tetap muncul walau sublist kosong
        const task = tasks[rubric.source.index];
        if (setDraggingCardId && draggingCardId !== (task.id || task.slug)) setDraggingCardId(task.id || task.slug);
        return (
          <TaskCard
            provided={provided}
            task={task}
            isClone={true}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onDeleteSuccess={onDeleteSuccess}
            showCheck={false}
          />
        );
      }}
      onDragEnd={() => setDraggingCardId && setDraggingCardId(null)}
    >
      {(provided, snapshot) => {
        // Empty state hanya jika benar-benar kosong dan tidak sedang drag-over
        const showEmpty =
          filteredTasks.length === 0 && !snapshot.isDraggingOver;
        return (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${styles.subListContainer} ${snapshot.isDraggingOver ? styles.isDraggingOver : ''}`}
          >
            {/* Header with status badge */}
            <div 
              className={styles.headerSection}
              style={{
                backgroundColor: currentStatus.background,
                color: currentStatus.foreground,
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
              {showEmpty ? (
                <div className={styles.emptyState}>
                  <img src={noDataIcon} alt="Tidak ada data" className={styles.emptyStateIcon} />
                  <p className={styles.emptyStateText}>
                    Tidak ada data
                  </p>
                </div>
              ) : (
                filteredTasks.map((task, idx) => (
                  <Draggable key={task.id || task.slug} draggableId={String(task.id || task.slug)} index={idx}>
                    {(provided, snapshot) => (
                      <TaskCard
                        provided={provided}
                        task={task}
                        isClone={false}
                        onEditTask={onEditTask}
                        onDeleteTask={onDeleteTask}
                        onDeleteSuccess={onDeleteSuccess}
                        showCheck={false}
                      />
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          </div>
        );
      }}
    </Droppable>
  );
}

export default SubList;
