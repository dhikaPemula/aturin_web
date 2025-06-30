import axios from "axios"

const BASE_URL = "https://aturin-app.com/api/v1/activities"

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F0dXJpbi1hcHAuY29tL2FwaS92MS9sb2dpbiIsImlhdCI6MTc1MDc1OTMyOCwibmJmIjoxNzUwNzU5MzI4LCJqdGkiOiJjTzBSWmFad1lPQWg0eDlIIiwic3ViIjoiOTciLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.Jdvo2d1RtnyeoQ0NxbzFp2IaxP-6eg5QYzYeXnmMF0g"
  )
}

const getHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${getToken()}`,
  "Cache-Control": "no-cache",
})

export async function getActivities() {
  try {
    console.log("🔄 Fetching activities...")
    const response = await axios.get(`${BASE_URL}`, {
      headers: getHeaders(),
    })

    console.log("📥 Raw API Response:", response.data)

    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      const activities = response.data.data.map((item) => {
        const activity = {
          id: item.id,
          slug: item.slug, // 🔧 TAMBAH: Simpan slug untuk update/delete
          judul: item.activity_title,
          tanggal: item.activity_date,
          waktuMulai: item.activity_start_time,
          waktuSelesai: item.activity_complete_time,
          kategori: item.activity_category,
          deskripsi: item.description || "",
          status: item.status || "pending",
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }
        console.log("🔄 Processed activity:", activity)
        return activity
      })

      console.log("✅ Total activities processed:", activities.length)
      return activities
    }

    console.log("⚠️ No activities data found in response")
    return []
  } catch (error) {
    console.error("❌ Error fetching activities:", error)
    throw new Error(`Gagal memuat aktivitas: ${error.response?.data?.message || error.message}`)
  }
}

export async function createActivity(data) {
  try {
    console.log("🔄 Creating activity with data:", data)

    const payload = {
      activity_title: data.judul,
      activity_date: data.tanggal,
      activity_start_time: data.waktuMulai,
      activity_complete_time: data.waktuSelesai,
      activity_category: data.kategori.toLowerCase(),
    }

    console.log("📤 Sending payload:", payload)

    const response = await axios.post(`${BASE_URL}`, payload, {
      headers: getHeaders(),
    })

    console.log("✅ Create response:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error creating activity:", error)
    if (error.response?.status === 422) {
      const validationErrors = error.response?.data?.errors
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat().join(", ")
        throw new Error(`Validasi gagal: ${errorMessages}`)
      }
    }
    throw new Error(`Gagal membuat aktivitas: ${error.response?.data?.message || error.message}`)
  }
}

// 🔧 PERBAIKAN: Update menggunakan SLUG bukan ID
export async function updateActivity(slug, data) {
  try {
    console.log("🔄 Updating activity with slug:", slug, "data:", data)

    const payload = {
      activity_title: data.judul,
      activity_date: data.tanggal,
      activity_start_time: data.waktuMulai,
      activity_complete_time: data.waktuSelesai,
      activity_category: data.kategori.toLowerCase(),
    }

    console.log("📤 PATCH payload:", payload)

    const response = await axios.patch(`${BASE_URL}/${slug}`, payload, {
      headers: getHeaders(),
    })

    console.log("✅ PATCH response:", response.data)

    // 🔧 PERBAIKAN: Handle nested response structure seperti Flutter
    if (response.data && (response.data.status === "success" || response.data.status === "Berhasil")) {
      const activityData = response.data.data?.data || response.data.data
      return { ...response.data, data: activityData }
    }

    return response.data
  } catch (error) {
    console.error("❌ Error updating activity:", error)
    console.error("❌ Error response:", error.response?.data)

    if (error.response?.status === 404) {
      throw new Error(`Aktivitas dengan slug "${slug}" tidak ditemukan di server`)
    }

    if (error.response?.status === 422) {
      const validationErrors = error.response?.data?.errors
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat().join(", ")
        throw new Error(`Validasi gagal: ${errorMessages}`)
      }
    }

    if (error.response?.status === 401) {
      throw new Error("Sesi telah berakhir, silakan login ulang")
    }

    if (error.response?.status === 403) {
      throw new Error("Tidak memiliki izin untuk mengubah aktivitas ini")
    }

    throw new Error(`Gagal mengubah aktivitas: ${error.response?.data?.message || error.message}`)
  }
}

// 🔧 PERBAIKAN: Delete menggunakan SLUG bukan ID
export async function deleteActivity(slug) {
  try {
    console.log("🔄 Deleting activity with slug:", slug)

    const response = await axios.delete(`${BASE_URL}/${slug}`, {
      headers: getHeaders(),
    })

    console.log("✅ DELETE response:", response.data)

    // 🔧 PERBAIKAN: Handle multiple success status codes seperti Flutter
    if (response.status === 200 || response.status === 204 || response.status === 404) {
      return { success: true, message: "Activity deleted successfully" }
    }

    return response.data
  } catch (error) {
    console.error("❌ Error deleting activity:", error)
    console.error("❌ Error response:", error.response?.data)

    // 🔧 PERBAIKAN: Handle 404 as success (activity already deleted)
    if (error.response?.status === 404) {
      return { success: true, message: "Activity deleted (not found)" }
    }

    if (error.response?.status === 401) {
      throw new Error("Sesi telah berakhir, silakan login ulang")
    }

    if (error.response?.status === 403) {
      throw new Error("Tidak memiliki izin untuk menghapus aktivitas ini")
    }

    throw new Error(`Gagal menghapus aktivitas: ${error.response?.data?.message || error.message}`)
  }
}
