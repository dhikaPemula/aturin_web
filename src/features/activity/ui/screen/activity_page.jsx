"use client"

import { useState, useEffect, useCallback } from "react"
import styles from "./activity_page.module.css"
import SearchWidget from "../widget/search_widget/search_widget"
import FilterWidget from "../widget/filter_widget/filter_widget"
import PrimaryButton from "../widget/primary_button/primary_button"
import TimelineSection from "../widget/timeline_section/timeline_section"
import ActivityCrudPage from "../../../crudactivity/screen/activity-crud-page"
import Alert from "../../../../core/widgets/alert/alert"
import Toast from "../../../../core/widgets/toast/toast"
import plusIcon from "../../../../assets/activity/icons/plus.svg"
import infoIcon from "../../../../assets/activity/icons/info.svg"
// import calendarIcon from "../../../../assets/activity/icons/calendar.svg" // Calendar icon missing
import calendarIcon from "../../../../assets/activity/icons/clock.svg" // Using clock icon as fallback
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../../../../core/services/api/activity_api_service"

const ActivityPage = () => {
  const today = new Date().toISOString().split("T")[0]

  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDate, setSelectedDate] = useState(today)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)

  // Alert state
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    activityToDelete: null,
  })

  // Toast state
  const [toastConfig, setToastConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    duration: 3000,
  })

  // Toast functions
  const showToast = useCallback((title, message, type = "success", duration = 3000) => {
    setToastConfig({
      isOpen: true,
      title,
      message,
      type,
      duration,
    })
  }, [])

  const hideToast = useCallback(() => {
    setToastConfig((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }, [])

  const loadActivities = async () => {
    try {
      setLoading(true)
      const fetchedActivities = await getActivities()
      setActivities(fetchedActivities)
    } catch (error) {
      console.error("Error loading activities:", error)
      showToast("Error", "Gagal memuat aktivitas", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [activities, searchTerm, selectedCategory, selectedDate])

  // Helper: konversi string tanggal ke YYYY-MM-DD lokal
  const getLocalDateString = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    // Ambil tanggal lokal user
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const applyFilters = useCallback(() => {
    if (!Array.isArray(activities)) {
      setFilteredActivities([])
      return
    }

    let filtered = [...activities]

    // Filter by search term
    if (searchTerm && searchTerm.trim()) {
      filtered = filtered.filter(
        (activity) => activity?.judul && activity.judul.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory && selectedCategory.trim()) {
      filtered = filtered.filter((activity) => {
        if (!activity?.kategori) return false
        const activityCategory = activity.kategori.toLowerCase()
        const filterCategory = selectedCategory.toLowerCase()
        return activityCategory === filterCategory
      })
    }

    // Filter by date - only apply if explicitly set
    if (selectedDate) {
      filtered = filtered.filter((activity) => {
        if (!activity?.tanggal) return false
        // Bandingkan tanggal lokal
        const activityDate = getLocalDateString(activity.tanggal)
        return activityDate === selectedDate
      })
    }

    setFilteredActivities(filtered)
  }, [activities, searchTerm, selectedCategory, selectedDate])

  // Alert functions
  const showDeleteAlert = (activity) => {
    setAlertConfig({
      isOpen: true,
      title: "Hapus Aktivitas",
      message: `Apakah Anda yakin ingin menghapus aktivitas "${activity.judul}"? Tindakan ini tidak dapat dibatalkan.`,
      activityToDelete: activity,
      onConfirm: () => confirmDeleteActivity(activity),
    })
  }

  const hideAlert = () => {
    setAlertConfig({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
      activityToDelete: null,
    })
  }

  const confirmDeleteActivity = async (activity) => {
    if (!activity) {
      console.error("No activity provided for deletion")
      hideAlert()
      showToast("Error", "Aktivitas tidak ditemukan", "error")
      return
    }

    try {
      setLoading(true)
      const slug = activity.slug || activity.id
      if (!slug) {
        throw new Error("Activity ID or slug not found")
      }
      
      await deleteActivity(slug)
      await loadActivities()
      hideAlert()
      showToast("Berhasil", "Aktivitas berhasil dihapus")
    } catch (error) {
      console.error("Error deleting activity:", error)
      hideAlert()
      showToast("Error", error.message || "Gagal menghapus aktivitas", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleAddActivity = () => {
    setEditingActivity(null)
    setIsModalOpen(true)
  }

  const handleEditActivity = (activity) => {
    setEditingActivity(activity)
    setIsModalOpen(true)
  }

  const handleDeleteActivity = (activity) => {
    showDeleteAlert(activity)
  }

  const handleSaveActivity = async (activityData) => {
    if (!activityData) {
      showToast("Error", "Data aktivitas tidak valid", "error")
      return
    }

    try {
      setLoading(true)

      if (editingActivity) {
        const slug = editingActivity.slug || editingActivity.id
        if (!slug) {
          throw new Error("Activity ID or slug not found for update")
        }
        await updateActivity(slug, activityData)
        showToast("Berhasil", "Aktivitas berhasil diperbarui")
      } else {
        await createActivity(activityData)
        showToast("Berhasil", "Aktivitas berhasil ditambahkan")
      }

      setIsModalOpen(false)
      setEditingActivity(null)
      await loadActivities()
    } catch (error) {
      console.error("Error saving activity:", error)
      const action = editingActivity ? "memperbarui" : "menambahkan"
      showToast("Error", error.message || `Gagal ${action} aktivitas`, "error")
    } finally {
      setLoading(false)
    }
  }

  // Format tanggal untuk display
  const formatSelectedDate = useCallback((dateString) => {
    if (!dateString) return "Pilih tanggal"

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return dateString
      }
      
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <h1 className={styles.title}>Aktivitas</h1>
              <p className={styles.subtitle}>
                <img src={infoIcon || "/placeholder.svg"} alt="Info" className={styles.infoIcon} />
                Tekan tanggal pada kalender untuk melihat jadwal selengkapnya.
              </p>
            </div>
            <PrimaryButton onClick={handleAddActivity} icon={plusIcon} disabled={loading}>
              Tambah Aktivitas
            </PrimaryButton>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filterSection}>
          <SearchWidget value={searchTerm} onChange={setSearchTerm} placeholder="Cari aktivitas..." />
          <FilterWidget type="date" value={selectedDate} onChange={setSelectedDate} placeholder="Pilih tanggal" />
          <FilterWidget
            type="category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="Semua kategori"
          />
        </div>

        {/* Date and Activity Count Display */}
        <div className={styles.selectedDate}>
          <div className={styles.dateActivityCard}>
            <div className={styles.dateSection}>
              <div className={styles.calendarIconWrapper}>
                <img src={calendarIcon || "/placeholder.svg"} alt="Calendar" className={styles.calendarIcon} />
              </div>
              <div className={styles.dateInfo}>
                <span className={styles.dateText}>{formatSelectedDate(selectedDate)}</span>
              </div>
            </div>
            <div className={styles.activityCountBadge}>{filteredActivities?.length || 0}</div>
          </div>
        </div>

        {/* Timeline */}
        <div className={styles.timelineSection}>
          <TimelineSection
            activities={filteredActivities || []}
            loading={loading}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
          />
        </div>
      </div>

      {/* Add/Edit Popup */}
      <ActivityCrudPage
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingActivity(null)
        }}
        onSave={handleSaveActivity}
        activity={editingActivity}
        defaultDate={selectedDate}
      />

      {/* Delete Confirmation Alert */}
      <Alert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        cancelText="Batal"
        submitLabel="Hapus"
        onCancel={hideAlert}
        onSubmit={alertConfig.onConfirm}
      />

      {/* Success/Error Toast */}
      <Toast
        isOpen={toastConfig.isOpen}
        title={toastConfig.title}
        message={toastConfig.message}
        type={toastConfig.type}
        duration={toastConfig.duration}
        onClose={hideToast}
      />
    </div>
  )
}

export default ActivityPage
