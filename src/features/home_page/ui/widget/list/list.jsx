import React, { useEffect, useState } from "react";
import styles from "./list.module.css";
import useTaskDashboard from "../../../../../core/hooks/useTaskDashboard";
import { getAllTasks } from "../../../../../core/services/api/task_api_service";
import TaskCard from "../taskcard/taskcard.jsx";
import noDataIcon from "../../../../../assets/home/nodata.svg";

function List({ currentIndex, searchQuery = '', selectedDate }) {
  const { dashboardData, loading: dashboardLoading, error: dashboardError } = useTaskDashboard();
  const [allTasks, setAllTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);

  // Fetch all tasks when component mounts
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        setTasksLoading(true);
        setTasksError(null);
        const tasks = await getAllTasks();
        console.log('Raw tasks from API:', tasks);
        console.log('Sample task deadlines:', tasks.slice(0, 5).map(task => ({
          title: task.task_title,
          deadline: task.task_deadline,
          type: typeof task.task_deadline
        })));
        setAllTasks(tasks);
      } catch (error) {
        setTasksError('Gagal mengambil data tugas');
        console.error('Error fetching all tasks:', error);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchAllTasks();
  }, []);

  // Fungsi untuk mengkonversi data API ke format yang diharapkan komponen
  const convertApiDataToListFormat = (apiData) => {
    return apiData.map(task => ({
      type: "tugas",
      kategori: [task.task_category || "Umum", "Tugas"],
      title: task.task_title || "Tugas Tanpa Judul",
      deadline: task.task_deadline,
      status: task.task_status,
      done: task.task_status === 'selesai',
      slug: task.slug,
      alarm_id: task.alarm_id  // Tambahkan alarm_id
    }));
  };

  // Utility function untuk membandingkan tanggal tanpa timezone issues
  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // Utility function untuk parsing tanggal dari berbagai format
  const parseDeadlineDate = (deadline) => {
    if (!deadline) return null;
    
    if (deadline instanceof Date) {
      return deadline;
    }
    
    if (typeof deadline === 'string') {
      // Handle DD/MM/YYYY format (Indonesian format)
      if (deadline.includes('/')) {
        const parts = deadline.trim().split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
          const year = parseInt(parts[2], 10);
          
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month, day);
          }
        }
      }
      
      // Handle YYYY-MM-DD format
      if (deadline.includes('-')) {
        const dateOnly = deadline.split('T')[0]; // Remove time part if exists
        const parts = dateOnly.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
          const day = parseInt(parts[2], 10);
          
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month, day);
          }
        }
      }
      
      // Try parsing as ISO string (fallback)
      const parsed = new Date(deadline);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    
    return null;
  };

  // Fungsi untuk memfilter data berdasarkan tanggal yang dipilih
  const filterItemsByDate = (items, targetDate) => {
    if (!targetDate) return items;
    
    console.log(`Filtering for target date: ${targetDate.toLocaleDateString('id-ID')} (${targetDate.getFullYear()}-${targetDate.getMonth() + 1}-${targetDate.getDate()})`);
    
    return items.filter(item => {
      if (!item.deadline) {
        console.log(`Item "${item.title}" has no deadline`);
        return false;
      }
      
      const itemDate = parseDeadlineDate(item.deadline);
      
      if (!itemDate) {
        console.log(`Item "${item.title}" has invalid deadline: "${item.deadline}"`);
        return false;
      }
      
      const matches = isSameDate(itemDate, targetDate);
      
      console.log(`Item: "${item.title}", Original deadline: "${item.deadline}", Parsed date: ${itemDate.toLocaleDateString('id-ID')} (${itemDate.getFullYear()}-${itemDate.getMonth() + 1}-${itemDate.getDate()}), Matches: ${matches}`);
      
      return matches;
    });
  };

  // Fungsi untuk memfilter data berdasarkan search query
  const filterItemsBySearch = (items, query) => {
    if (!query || query.trim() === '') return items;
    
    const lowerQuery = query.toLowerCase().trim();
    return items.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      (item.kategori && item.kategori.some(cat => cat.toLowerCase().includes(lowerQuery)))
    );
  };

  // Tentukan data yang akan ditampilkan berdasarkan currentIndex
  const loading = dashboardLoading || tasksLoading;
  const error = dashboardError || tasksError;
  
  let items = [];
  if (loading) {
    items = [];
  } else if (error) {
    items = [];
  } else {
    switch (currentIndex) {
      case 0: // Semua (jadwal + tugas untuk tanggal yang dipilih)
        // Gunakan semua task yang tersedia
        items = convertApiDataToListFormat(allTasks);
        break;
      case 1: // Tugas untuk tanggal yang dipilih
        // Gunakan semua task yang tersedia
        items = convertApiDataToListFormat(allTasks);
        break;
      case 2: // Aktivitas untuk tanggal yang dipilih (belum ada API)
        items = [];
        break;
      default:
        items = [];
    }
    
    // Filter berdasarkan tanggal yang dipilih
    if (selectedDate) {
      const beforeFilter = items.length;
      console.log('All tasks before date filter:', items.map(item => ({
        title: item.title,
        deadline: item.deadline,
        type: typeof item.deadline
      })));
      
      items = filterItemsByDate(items, selectedDate);
      console.log(`Date filter: ${beforeFilter} -> ${items.length} items for date ${selectedDate.toLocaleDateString('id-ID')}`);
      console.log('Tasks after date filter:', items.map(item => ({
        title: item.title,
        deadline: item.deadline
      })));
    }
    
    // Filter berdasarkan search query
    if (searchQuery && searchQuery.trim() !== '') {
      const beforeFilter = items.length;
      items = filterItemsBySearch(items, searchQuery);
      console.log(`Search filter: ${beforeFilter} -> ${items.length} items for query "${searchQuery}"`);
    }
  }

  // Fungsi untuk mendapatkan pesan empty state berdasarkan currentIndex dan search query
  const getEmptyMessage = () => {
    if (searchQuery && searchQuery.trim() !== '') {
      return `Tidak ditemukan hasil untuk "${searchQuery}"`;
    }
    
    // Format tanggal untuk pesan
    const isToday = selectedDate && selectedDate.toDateString() === new Date().toDateString();
    const dateStr = selectedDate 
      ? (isToday ? 'hari ini' : selectedDate.toLocaleDateString('id-ID'))
      : 'hari ini';
    
    switch (currentIndex) {
      case 0:
        return `Tidak ada data tugas dan aktivitas untuk ${dateStr}`;
      case 1:
        return `Tidak ada data tugas untuk ${dateStr}`;
      case 2:
        return `Tidak ada data aktivitas untuk ${dateStr}`;
      default:
        return "Tidak ada data untuk ditampilkan";
    }
  };

  // Judul sesuai index dan tanggal
  let title = "";
  const isToday = selectedDate && selectedDate.toDateString() === new Date().toDateString();
  const dateStr = selectedDate 
    ? (isToday ? 'Hari Ini' : selectedDate.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
    : 'Hari Ini';
  
  if (currentIndex === 0) title = `Jadwal ${dateStr}`;
  else if (currentIndex === 1) title = `Tugas ${dateStr}`;
  else if (currentIndex === 2) title = `Aktivitas ${dateStr}`;

  // Handle task click
  const handleTaskClick = (task) => {
    console.log('Task clicked:', task);
    // TODO: Navigate to task detail or open modal
  };

  // Handle status toggle
  const handleToggleStatus = (task) => {
    console.log('Toggle status for:', task);
    // TODO: Implement status toggle functionality
  };

  if (loading) {
    return (
      <div className={styles.listWrapper}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>{title}</span>
        </div>
        <div className={styles.listContainer}>
          <div className={styles.loadingState}>
            <img 
              src={noDataIcon} 
              alt="Loading" 
              className={styles.loadingIcon}
            />
            <span className={styles.loadingText}>
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.listWrapper}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>{title}</span>
        </div>
        <div className={styles.listContainer}>
          <div className={styles.errorState}>
            <img 
              src={noDataIcon} 
              alt="Error" 
              className={styles.errorIcon}
            />
            <span className={styles.errorText}>
              Gagal memuat data: {error}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.listWrapper}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>{title}</span>
        {items.length > 0 && (
          <span className={styles.count}>
            {items.length}
          </span>
        )}
      </div>
      <div className={styles.listContainer}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <img 
              src={noDataIcon} 
              alt="No data" 
              className={styles.emptyIcon}
            />
            <span className={styles.emptyText}>
              {getEmptyMessage()}
            </span>
          </div>
        ) : (
          items.map((item, idx) => (
            <TaskCard
              key={item.slug || idx}
              title={item.title}
              categories={item.kategori}
              deadline={item.deadline || item.time}
              status={item.status || (item.done ? 'selesai' : 'belum_dikerjakan')}
              alarm_id={item.alarm_id}
              onClick={() => handleTaskClick(item)}
              onToggleStatus={() => handleToggleStatus(item)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default List;
