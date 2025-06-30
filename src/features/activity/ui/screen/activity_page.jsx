"use client"

import { useState, useEffect } from "react"
import styles from "./activity_page.module.css"
import SearchWidget from "../widget/search_widget/search_widget"
import FilterWidget from "../widget/filter_widget/filter_widget"
import PrimaryButton from "../widget/primary_button/primary_button"
import TimelineSection from "../widget/timeline_section/timeline_section"
import ActivityModal from "../widget/activity_modal/activity_modal"
// Remove DeleteConfirmationModal import
import plusIcon from "../../../../assets/icons/plus.svg"
import infoIcon from "../../../../assets/icons/info.svg"
import calendarIcon from "../../../../assets/icons/calendar.svg"
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
  // Remove deleteModal state

  const loadActivities = async () => {
    try {
      setLoading(true)
      const fetchedActivities = await getActivities()
      setActivities(fetchedActivities)
    } catch (error) {
      console.error("Error loading activities:", error)
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

  const extractDateFromTimestamp = (dateString) => {
    if (!dateString) return ""

    // Jika sudah format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }

    // 🔧 PERBAIKAN: Handle ISO timestamp dengan timezone
    if (dateString.includes("T")) {
      try {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
      } catch (error) {
        return dateString.split("T")[0]
      }
    }

    // Jika ada spasi (format datetime: 2024-01-15 10:30:00)
    if (dateString.includes(" ")) {
      return dateString.split(" ")[0]
    }

    // Coba parse sebagai Date object
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
      }
    } catch (error) {
      console.error("❌ Error parsing as Date:", error)
    }

    return dateString
  }

  const applyFilters = () => {
    let filtered = [...activities]

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (activity) => activity.judul && activity.judul.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((activity) => {
        if (!activity.kategori) return false
        const activityCategory = activity.kategori.toLowerCase()
        const filterCategory = selectedCategory.toLowerCase()
        return activityCategory === filterCategory
      })
    }

    // Filter by date - 🔧 SELALU AKTIF karena default ke hari ini
    if (selectedDate) {
      filtered = filtered.filter((activity) => {
        const activityDate = extractDateFromTimestamp(activity.tanggal)
        return activityDate === selectedDate
      })
    }

    setFilteredActivities(filtered)
  }

  const handleAddActivity = () => {
    setEditingActivity(null)
    setIsModalOpen(true)
  }

  const handleEditActivity = (activity) => {
    setEditingActivity(activity)
    setIsModalOpen(true)
  }

  // 🔧 UPDATED: Direct delete without confirmation modal
  const handleDeleteActivity = async (activity) => {
    try {
      setLoading(true)
      const slug = activity.slug || activity.id
      await deleteActivity(slug)
      await loadActivities() // Reload activities after delete
    } catch (error) {
      console.error("Error deleting activity:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveActivity = async (activityData) => {
    try {
      setLoading(true)

      if (editingActivity) {
        const slug = editingActivity.slug || editingActivity.id
        await updateActivity(slug, activityData)
      } else {
        await createActivity(activityData)
      }

      setIsModalOpen(false)
      setEditingActivity(null)
      await loadActivities() // Direct reload without delay
    } catch (error) {
      console.error("Error saving activity:", error)
    } finally {
      setLoading(false)
    }
  }

  // Format tanggal untuk display
  const formatSelectedDate = (dateString) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch (error) {
      return dateString
    }
  }

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
                Kelola aktivitas harian Anda dengan mudah
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
            <div className={styles.activityCountBadge}>{filteredActivities.length}</div>
          </div>
        </div>

        {/* Timeline */}
        <TimelineSection
          activities={filteredActivities}
          loading={loading}
          onEdit={handleEditActivity}
          onDelete={handleDeleteActivity}
        />
      </div>

      {/* Add/Edit Modal */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingActivity(null)
        }}
        onSave={handleSaveActivity}
        activity={editingActivity}
        defaultDate={selectedDate}
      />

      {/* Remove DeleteConfirmationModal completely */}
    </div>
  )
}

export default ActivityPage
