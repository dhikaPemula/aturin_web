import React, { useEffect, useState } from 'react';
import styles from './list.module.css';
import SubList from '../sublist/sublist.jsx';
import noDataIcon from '../../../../../assets/home/nodata.svg';

function List({ 
  tasks = [],
  loading = false,
  error = null,
  searchQuery = "", 
  currentStatus = "", 
  currentCategory = "",
  onEditTask,
  onDeleteTask,
  onDeleteSuccess,
  onDropTask
}) {
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Filter tasks based on search query and current filters
  useEffect(() => {
    let filtered = [...tasks];

    // Filter by search query
    if (searchQuery && searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task => 
        task.task_title?.toLowerCase().includes(lowerQuery) ||
        task.task_description?.toLowerCase().includes(lowerQuery) ||
        task.task_category?.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by category
    if (currentCategory && currentCategory !== '') {
      filtered = filtered.filter(task => 
        task.task_category?.toLowerCase() === currentCategory.toLowerCase()
      );
    }

    // Convert API data to component format, but keep original API fields for editing
    const convertedTasks = filtered.map(task => ({
      // Original API fields (needed for editing)
      ...task,
      // Component-friendly fields (for display)
      id: task.id,
      title: task.task_title || 'Tugas Tanpa Judul',
      description: task.task_description || '',
      categories: task.task_category ? [task.task_category] : [],
      deadline: task.task_deadline,
      estimation: task.task_estimation || '',
      estimated_task_duration: task.estimated_task_duration || '',
      task_status: task.task_status || 'belum_selesai',
      alarm_id: task.alarm_id,
      slug: task.slug
    }));

    setFilteredTasks(convertedTasks);
  }, [tasks, searchQuery, currentStatus, currentCategory]);

  // Get unique statuses to display
  const getStatusesToDisplay = () => {
    if (currentStatus && currentStatus !== '') {
      // Show only the selected status
      return [currentStatus];
    } else {
      // Show all statuses when "Semua status" is selected
      return ['terlambat', 'belum_selesai', 'selesai'];
    }
  };

  // Get tasks for a specific status
  const getTasksForStatus = (status) => {
    return filteredTasks.filter(task => task.task_status === status);
  };

  // Check if there are any tasks to display
  const hasTasksToDisplay = () => {
    const statusesToShow = getStatusesToDisplay();
    return statusesToShow.some(status => getTasksForStatus(status).length > 0);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Memuat data tugas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>{error}</div>
        <div className={styles.errorSubtext}>
          Silakan refresh halaman untuk mencoba lagi
        </div>
      </div>
    );
  }

  // Show empty state only when there's no tasks at all AND no filter is applied
  if (!hasTasksToDisplay() && !searchQuery && !currentCategory && !currentStatus) {
    return (
      <div className={styles.noDataContainer}>
        <img src={noDataIcon} alt="Tidak ada data" className={styles.noDataIcon} />
        <p className={styles.noDataText}>
          'Belum ada tugas yang tersedia'
        </p>
      </div>
    );
  }

  const statusesToDisplay = getStatusesToDisplay();

  return (
    <div className={styles.listContainer}>
      {statusesToDisplay.map((status) => {
        const tasksForStatus = getTasksForStatus(status);
        
        return (
          <SubList
            key={status}
            task_status={status}
            tasks={tasksForStatus}
            currentCategory={currentCategory}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onDeleteSuccess={onDeleteSuccess}
            onDropTask={onDropTask}
          />
        );
      })}
    </div>
  );
}

export default List;
