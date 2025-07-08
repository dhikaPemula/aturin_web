import React, { useEffect, useState } from "react";
import styles from "./list.module.css";
import useTaskDashboard from "../../../../../core/hooks/useTaskDashboard";
import { getAllTasks } from "../../../../../core/services/api/task_api_service";
import { getActivities } from "../../../../../core/services/api/activity_api_service";
import { useTaskAutoRefresh } from "../../../../../core/hooks/useGlobalTaskRefresh";
import TaskCard from "../taskcard/taskcard.jsx";
import ActivityCard from "../activitycard/activitycard.jsx";
import noDataIcon from "../../../../../assets/home/nodata.svg";
import jadwalIcon from "../../../../../assets/home/list/jadwal.svg";
import taskIcon from "../../../../../assets/home/list/task.svg";
import activityIcon from "../../../../../assets/home/list/activity.svg";
import Activity from "../../../../../core/models/activity";

function List({ currentIndex, searchQuery = "", selectedDate, refreshTrigger }) {
  const {
    dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
  } = useTaskDashboard();
  const [allTasks, setAllTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);
  const [allActivities, setAllActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState(null);

  // Function untuk fetch tasks
  const fetchAllTasks = async () => {
    try {
      setTasksLoading(true);
      setTasksError(null);
      const tasks = await getAllTasks();
      console.log("Raw tasks from API:", tasks);
      console.log(
        "Sample task deadlines:",
        tasks.slice(0, 5).map((task) => ({
          title: task.task_title,
          deadline: task.task_deadline,
          type: typeof task.task_deadline,
        }))
      );
      setAllTasks(tasks);
    } catch (error) {
      setTasksError("Gagal mengambil data tugas");
      console.error("Error fetching tasks:", error);
    } finally {
      setTasksLoading(false);
    }
  };

  // Function untuk fetch activities
  const fetchAllActivities = async () => {
    try {
      setActivitiesLoading(true);
      setActivitiesError(null);
      const activities = await getActivities();
      setAllActivities(activities);
    } catch (error) {
      setActivitiesError(error.message || "Gagal mengambil data aktivitas");
      console.error("Error fetching activities:", error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Auto-refresh menggunakan global trigger
  useTaskAutoRefresh(fetchAllTasks);

  // Fetch all tasks when component mounts or when refreshTrigger changes (backward compatibility)
  useEffect(() => {
    fetchAllTasks();
  }, [refreshTrigger]); // Tambahkan refreshTrigger sebagai dependency

  // Auto-refresh activities jika currentIndex 2
  useEffect(() => {
    if (currentIndex === 2) {
      fetchAllActivities();
    }
  }, [currentIndex, refreshTrigger]);

  // Fungsi untuk mengkonversi data API ke format yang diharapkan komponen
  const convertApiDataToListFormat = (apiData) => {
    return apiData.map((task) => ({
      type: "tugas",
      kategori: [task.task_category || "Umum", "Tugas"],
      title: task.task_title || "Tugas Tanpa Judul",
      deadline: task.task_deadline,
      status: task.task_status,
      done: task.task_status === "selesai",
      slug: task.slug,
      alarm_id: task.alarm_id, // Tambahkan alarm_id
    }));
  };

  // Utility function untuk membandingkan tanggal tanpa timezone issues
  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    
    // Pastikan kedua tanggal dalam timezone yang sama (WIB)
    const d1 = new Date(date1.getTime());
    const d2 = new Date(date2.getTime());
    
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Utility function untuk parsing tanggal dari berbagai format dengan timezone handling
  const parseDeadlineDate = (deadline) => {
    if (!deadline) return null;

    if (deadline instanceof Date) {
      return deadline;
    }

    if (typeof deadline === "string") {
      // Handle DD/MM/YYYY format (Indonesian format)
      if (deadline.includes("/")) {
        const parts = deadline.trim().split("/");
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
          const year = parseInt(parts[2], 10);

          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            // Buat date dengan timezone lokal (Indonesia) - jam 00:00:00
            return new Date(year, month, day, 0, 0, 0, 0);
          }
        }
      }

      // Handle YYYY-MM-DD format dengan ISO string parsing (lebih akurat)
      if (deadline.includes("-")) {
        // Gunakan Date constructor untuk ISO strings, sudah handle timezone dengan benar
        const parsed = new Date(deadline);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
        
        // Fallback manual parsing jika Date constructor gagal
        const parts = deadline.split("T"); // Split date and time
        const datePart = parts[0]; // YYYY-MM-DD
        const timePart = parts[1]; // HH:MM:SS atau undefined
        
        const dateComponents = datePart.split("-");
        if (dateComponents.length === 3) {
          const year = parseInt(dateComponents[0], 10);
          const month = parseInt(dateComponents[1], 10) - 1; // Month is 0-indexed
          const day = parseInt(dateComponents[2], 10);

          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            if (timePart) {
              // Jika ada time component, parse jam:menit:detik
              const timeComponents = timePart.replace('Z', '').split(':');
              const hour = parseInt(timeComponents[0], 10) || 0;
              const minute = parseInt(timeComponents[1], 10) || 0;
              const second = parseInt(timeComponents[2], 10) || 0;
              
              if (deadline.endsWith('Z')) {
                // UTC time - buat date dalam UTC kemudian konversi otomatis ke local timezone
                return new Date(Date.UTC(year, month, day, hour, minute, second));
              } else {
                // Local time
                return new Date(year, month, day, hour, minute, second);
              }
            } else {
              // Tanpa time component, gunakan jam 00:00:00 local time
              return new Date(year, month, day, 0, 0, 0, 0);
            }
          }
        }
      }

      // Try parsing as ISO string
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

    console.log(
      `Filtering for target date: ${targetDate.toLocaleDateString(
        "id-ID"
      )} (${targetDate.getFullYear()}-${
        targetDate.getMonth() + 1
      }-${targetDate.getDate()})`
    );

    return items.filter((item) => {
      if (!item.deadline) {
        console.log(`Item "${item.title}" has no deadline`);
        return false;
      }

      const itemDate = parseDeadlineDate(item.deadline);

      if (!itemDate) {
        console.log(
          `Item "${item.title}" has invalid deadline: "${item.deadline}"`
        );
        return false;
      }

      const matches = isSameDate(itemDate, targetDate);

      console.log(
        `Item: "${item.title}"\n` +
        `  Original deadline: "${item.deadline}"\n` +
        `  Parsed date: ${itemDate.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} (${itemDate.getFullYear()}-${itemDate.getMonth() + 1}-${itemDate.getDate()})\n` +
        `  Target date: ${targetDate.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} (${targetDate.getFullYear()}-${targetDate.getMonth() + 1}-${targetDate.getDate()})\n` +
        `  Item date in UTC: ${itemDate.toISOString()}\n` +
        `  Target date in UTC: ${targetDate.toISOString()}\n` +
        `  Timezone offset: ${itemDate.getTimezoneOffset()} minutes\n` +
        `  Matches: ${matches}`
      );

      return matches;
    });
  };

  // Fungsi untuk memfilter data berdasarkan search query
  const filterItemsBySearch = (items, query) => {
    if (!query || query.trim() === "") return items;

    const lowerQuery = query.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.kategori &&
          item.kategori.some((cat) => cat.toLowerCase().includes(lowerQuery)))
    );
  };

  // Tentukan data yang akan ditampilkan berdasarkan currentIndex
  let items = [];
  let loading = dashboardLoading || tasksLoading;
  let error = dashboardError || tasksError;
  if (currentIndex === 2) {
    loading = activitiesLoading;
    error = activitiesError;
    let activities = allActivities.map((act) => {
      const activityObj = Activity.fromApiResponse(act);
      const display = activityObj.toDisplayFormat();
      // activityObj.tanggal bisa ISO string (misal 2025-06-22T17:00:00.000000Z)
      return {
        slug: act.slug,
        title: display.judul,
        kategori: [display.kategori],
        startTime: display.waktuMulai,
        endTime: display.waktuSelesai,
        description: display.deskripsi,
        tanggal: display.tanggal,
        status: display.status,
        durasi: display.durasi,
        timeSlot: display.timeSlot,
        rawDate: act.activity_date || act.tanggal, // gunakan activity_date asli dari API
      };
    });
    // Filter berdasarkan selectedDate
    if (selectedDate) {
      activities = activities.filter((item) => {
        // item.rawDate bisa ISO string (2025-06-22T17:00:00.000000Z)
        if (!item.rawDate) return false;
        // Ambil tanggal lokal dari ISO string
        const itemDate = new Date(item.rawDate);
        return isSameDate(itemDate, selectedDate);
      });
    }
    items = activities;
  } else {
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
        console.log(
          "All tasks before date filter:",
          items.map((item) => ({
            title: item.title,
            deadline: item.deadline,
            type: typeof item.deadline,
          }))
        );

        items = filterItemsByDate(items, selectedDate);
        console.log(
          `Date filter: ${beforeFilter} -> ${
            items.length
          } items for date ${selectedDate.toLocaleDateString("id-ID")}`
        );
        console.log(
          "Tasks after date filter:",
          items.map((item) => ({
            title: item.title,
            deadline: item.deadline,
          }))
        );
      }

      // Filter berdasarkan search query
      if (searchQuery && searchQuery.trim() !== "") {
        const beforeFilter = items.length;
        items = filterItemsBySearch(items, searchQuery);
        console.log(
          `Search filter: ${beforeFilter} -> ${items.length} items for query "${searchQuery}"`
        );
      }
    }
  }

  // Fungsi untuk mendapatkan pesan empty state berdasarkan currentIndex dan search query
  const getEmptyMessage = () => {
    if (searchQuery && searchQuery.trim() !== "") {
      return `Tidak ditemukan hasil untuk "${searchQuery}"`;
    }

    // Format tanggal untuk pesan
    const isToday =
      selectedDate && selectedDate.toDateString() === new Date().toDateString();
    const dateStr = selectedDate
      ? isToday
        ? "Hari Ini"
        : selectedDate.toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
      : "hari ini";

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
  const isToday =
    selectedDate && selectedDate.toDateString() === new Date().toDateString();
  const dateStr = selectedDate
    ? isToday
      ? "Hari Ini"
      : selectedDate.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
    : "Hari Ini";

  if (currentIndex === 0) title = `Jadwal ${dateStr}`;
  else if (currentIndex === 1) title = `Tugas ${dateStr}`;
  else if (currentIndex === 2) title = `Aktivitas ${dateStr}`;

  // Handle task click
  const handleTaskClick = (task) => {
    console.log("Task clicked:", task);
    // TODO: Navigate to task detail or open modal
  };

  // Handle status toggle
  const handleToggleStatus = (task) => {
    console.log("Toggle status for:", task);
    // TODO: Implement status toggle functionality
  };

  // Get icon based on currentIndex
  const getHeaderIcon = () => {
    switch (currentIndex) {
      case 0:
        return jadwalIcon; // Jadwal icon
      case 1:
        return taskIcon; // Task icon
      case 2:
        return activityIcon; // Activity icon
      default:
        return jadwalIcon;
    }
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
            <span className={styles.loadingText}>Loading...</span>
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
            <img src={noDataIcon} alt="Error" className={styles.errorIcon} />
            <span className={styles.errorText}>Gagal memuat data: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.listWrapper}>
      <div className={styles.header}>
        <img src={getHeaderIcon()} alt="Icon" className={styles.headerIcon} />
        <span className={styles.headerTitle}>{title}</span>
        {items.length > 0 && (
          <span className={styles.count}>{items.length}</span>
        )}
      </div>
      <div className={styles.listContainer}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <img src={noDataIcon} alt="No data" className={styles.emptyIcon} />
            <span className={styles.emptyText}>{getEmptyMessage()}</span>
          </div>
        ) : (
          items.map((item, idx) => (
            currentIndex === 2 ? (
              <ActivityCard
                key={item.slug || idx}
                title={item.title}
                category={item.kategori?.[0] || "Aktivitas"}
                startTime={item.startTime || item.start_time || item.start || item.deadline}
                endTime={item.endTime || item.end_time || item.end || item.deadline}
                description={item.description || item.deskripsi || ""}
                onClick={() => handleTaskClick(item)}
              />
            ) : (
              <TaskCard
                key={item.slug || idx}
                title={item.title}
                categories={item.kategori}
                deadline={item.deadline || item.time}
                status={
                  item.status || (item.done ? "selesai" : "belum_dikerjakan")
                }
                alarm_id={item.alarm_id}
                onClick={() => handleTaskClick(item)}
                onToggleStatus={() => handleToggleStatus(item)}
              />
            )
          ))
        )}
      </div>
    </div>
  );
}

export default List;
