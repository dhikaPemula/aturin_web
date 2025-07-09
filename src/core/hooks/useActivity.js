"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getActivities,
  createActivity as createActivityAPI,
  updateActivity as updateActivityAPI,
  deleteActivity as deleteActivityAPI,
} from "../services/api/activity_api_service"

const useActivity = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch activities from API
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedActivities = await getActivities()
      setActivities(fetchedActivities || [])
    } catch (err) {
      console.error("Error fetching activities:", err)
      setError("Gagal memuat aktivitas. Silakan coba lagi.")
      setActivities([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Create new activity
  const createActivity = useCallback(
    async (activityData) => {
      try {
        setLoading(true)
        setError(null)

        const result = await createActivityAPI(activityData)

        if (result) {
          // Refresh activities list
          await fetchActivities()
          return { success: true, data: result }
        }

        return { success: false, error: "Gagal membuat aktivitas" }
      } catch (err) {
        console.error("Error creating activity:", err)
        const errorMessage = err.message || "Gagal membuat aktivitas. Silakan coba lagi."
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [fetchActivities],
  )

  // Update existing activity
  const updateActivity = useCallback(
    async (slug, activityData) => {
      try {
        setLoading(true)
        setError(null)

        const result = await updateActivityAPI(slug, activityData)

        if (result) {
          // Refresh activities list
          await fetchActivities()
          return { success: true, data: result }
        }

        return { success: false, error: "Gagal mengupdate aktivitas" }
      } catch (err) {
        console.error("Error updating activity:", err)
        const errorMessage = err.message || "Gagal mengupdate aktivitas. Silakan coba lagi."
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [fetchActivities],
  )

  // Delete activity
  const deleteActivity = useCallback(
    async (slug) => {
      try {
        setLoading(true)
        setError(null)

        const result = await deleteActivityAPI(slug)

        if (result) {
          // Refresh activities list
          await fetchActivities()
          return { success: true, data: result }
        }

        return { success: false, error: "Gagal menghapus aktivitas" }
      } catch (err) {
        console.error("Error deleting activity:", err)
        const errorMessage = err.message || "Gagal menghapus aktivitas. Silakan coba lagi."
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setLoading(false)
      }
    },
    [fetchActivities],
  )

  // Helper function to extract date from timestamp
  const extractDateFromTimestamp = useCallback((dateString) => {
    if (!dateString) return ""

    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }

    // Handle ISO timestamp (2024-01-15T10:30:00.000Z)
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

    // Handle datetime format (2024-01-15 10:30:00)
    if (dateString.includes(" ")) {
      return dateString.split(" ")[0]
    }

    // Try to parse as Date object
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
      }
    } catch (error) {
      console.error("Error parsing date:", error)
    }

    return dateString
  }, [])

  // Filter activities by search term
  const filterActivitiesBySearch = useCallback(
    (searchTerm) => {
      if (!searchTerm.trim()) return activities

      return activities.filter(
        (activity) => activity.judul && activity.judul.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    },
    [activities],
  )

  // Get single activity by slug or id
  const getActivityBySlug = useCallback(
    (slug) => {
      return activities.find((activity) => activity.slug === slug || activity.id === slug)
    },
    [activities],
  )

  // Get activities by date
  const getActivitiesByDate = useCallback(
    (date) => {
      return activities.filter((activity) => {
        const activityDate = extractDateFromTimestamp(activity.tanggal)
        return activityDate === date
      })
    },
    [activities, extractDateFromTimestamp],
  )

  // Get activities by category
  const getActivitiesByCategory = useCallback(
    (category) => {
      return activities.filter((activity) => {
        if (!activity.kategori) return false
        return activity.kategori.toLowerCase() === category.toLowerCase()
      })
    },
    [activities],
  )

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Auto-fetch activities on mount
  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  return {
    activities,
    loading,
    error,
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    extractDateFromTimestamp,
    filterActivitiesBySearch,
    getActivityBySlug,
    getActivitiesByDate,
    getActivitiesByCategory,
    clearError,
  }
}

export default useActivity
