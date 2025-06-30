/**
 * Activity Model
 * Model untuk mengelola data aktivitas
 */
export class Activity {
  constructor(data = {}) {
    this.id = data.id || null
    this.judul = data.judul || ""
    this.tanggal = data.tanggal || ""
    this.waktuMulai = data.waktuMulai || ""
    this.waktuSelesai = data.waktuSelesai || ""
    this.kategori = data.kategori || ""
    this.deskripsi = data.deskripsi || ""
    this.status = data.status || "pending"
    this.createdAt = data.createdAt || null
    this.updatedAt = data.updatedAt || null
  }

  // 🔧 OPTIMIZED: Validasi yang disederhanakan
  validate() {
    const errors = []

    if (!this.judul || this.judul.trim() === "") {
      errors.push("Judul aktivitas harus diisi")
    }

    if (!this.tanggal) {
      errors.push("Tanggal aktivitas harus diisi")
    }

    if (!this.waktuMulai) {
      errors.push("Waktu mulai harus diisi")
    }

    if (!this.waktuSelesai) {
      errors.push("Waktu selesai harus diisi")
    }

    if (!this.kategori) {
      errors.push("Kategori aktivitas harus dipilih")
    }

    // Validasi format tanggal
    if (this.tanggal && !this.isValidDate(this.tanggal)) {
      errors.push("Format tanggal tidak valid (gunakan YYYY-MM-DD)")
    }

    // Validasi format waktu
    if (this.waktuMulai && !this.isValidTime(this.waktuMulai)) {
      errors.push("Format waktu mulai tidak valid (gunakan HH:MM)")
    }

    if (this.waktuSelesai && !this.isValidTime(this.waktuSelesai)) {
      errors.push("Format waktu selesai tidak valid (gunakan HH:MM)")
    }

    // 🔧 OPTIMIZED: Hanya validasi waktu selesai > waktu mulai
    if (this.waktuMulai && this.waktuSelesai) {
      const startTime = new Date(`2000-01-01 ${this.waktuMulai}`)
      const endTime = new Date(`2000-01-01 ${this.waktuSelesai}`)

      if (startTime >= endTime) {
        errors.push("Waktu mulai harus lebih kecil dari waktu selesai")
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    }
  }

  // Validasi format tanggal
  isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateString)) return false

    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date)
  }

  // Validasi format waktu
  isValidTime(timeString) {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    return regex.test(timeString)
  }

  // Format data untuk dikirim ke API (sesuaikan dengan backend)
  toApiFormat() {
    return {
      activity_title: this.judul,
      activity_date: this.tanggal,
      activity_start_time: this.waktuMulai,
      activity_complete_time: this.waktuSelesai,
      activity_category: this.kategori,
      user_id: 100, // Sesuaikan dengan user_id yang sesuai
      slug: `activity-${this.judul.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
    }
  }

  // Format data untuk ditampilkan
  toDisplayFormat() {
    return {
      id: this.id,
      judul: this.judul,
      tanggal: this.formatDate(this.tanggal),
      waktuMulai: this.waktuMulai,
      waktuSelesai: this.waktuSelesai,
      kategori: this.kategori,
      deskripsi: this.deskripsi,
      status: this.getStatusLabel(),
      durasi: this.getDuration(),
      timeSlot: this.getTimeSlot(),
    }
  }

  // Format tanggal untuk display
  formatDate(dateString) {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return dateString
    }
  }

  // Get status label
  getStatusLabel() {
    const statusLabels = {
      pending: "Menunggu",
      in_progress: "Sedang Berlangsung",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    }
    return statusLabels[this.status] || "Tidak Diketahui"
  }

  // Hitung durasi aktivitas
  getDuration() {
    if (!this.waktuMulai || !this.waktuSelesai) return ""

    try {
      const start = new Date(`2000-01-01 ${this.waktuMulai}`)
      const end = new Date(`2000-01-01 ${this.waktuSelesai}`)
      const diffMs = end - start

      if (diffMs <= 0) return "0 menit"

      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

      if (diffHours > 0) {
        return `${diffHours} jam ${diffMinutes} menit`
      } else {
        return `${diffMinutes} menit`
      }
    } catch (error) {
      return ""
    }
  }

  // Tentukan slot waktu (Pagi, Siang, Sore, Malam)
  getTimeSlot() {
    if (!this.waktuMulai) return ""

    try {
      const hour = Number.parseInt(this.waktuMulai.split(":")[0])

      if (hour >= 5 && hour < 11) return "pagi"
      if (hour >= 11 && hour < 15) return "siang"
      if (hour >= 15 && hour < 19) return "sore"
      return "malam"
    } catch (error) {
      return ""
    }
  }

  // 🔧 OPTIMIZED: Hapus validasi masa lalu
  isActive() {
    if (!this.tanggal || !this.waktuMulai || !this.waktuSelesai) return false

    try {
      const now = new Date()
      const startTime = new Date(`${this.tanggal} ${this.waktuMulai}`)
      const endTime = new Date(`${this.tanggal} ${this.waktuSelesai}`)

      return now >= startTime && now <= endTime
    } catch (error) {
      return false
    }
  }

  // 🔧 OPTIMIZED: Hapus validasi masa lalu
  isCompleted() {
    return this.status === "completed"
  }

  // 🔧 OPTIMIZED: Hapus validasi masa lalu
  isUpcoming() {
    return this.status !== "cancelled" && this.status !== "completed"
  }

  // Clone activity
  clone() {
    return new Activity({
      id: this.id,
      judul: this.judul,
      tanggal: this.tanggal,
      waktuMulai: this.waktuMulai,
      waktuSelesai: this.waktuSelesai,
      kategori: this.kategori,
      deskripsi: this.deskripsi,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    })
  }
}

// Static methods untuk Activity class
Activity.CATEGORIES = ["akademik", "hiburan", "pekerjaan", "olahraga", "sosial", "spiritual", "pribadi", "istirahat"]
Activity.STATUSES = ["pending", "in_progress", "completed", "cancelled"]

Activity.TIME_SLOTS = {
  pagi: { label: "Pagi", range: "05:00 - 10:00", color: "#FFC550" },
  siang: { label: "Siang", range: "11:00 - 14:00", color: "#FF8C00" },
  sore: { label: "Sore", range: "15:00 - 18:00", color: "#FF6B35" },
  malam: { label: "Malam", range: "19:00 - 04:00", color: "#4A5568" },
}

// Factory method untuk membuat Activity dari API response
Activity.fromApiResponse = (apiData) => {
  return new Activity({
    id: apiData.id,
    judul: apiData.activity_title || apiData.judul || apiData.title,
    tanggal: apiData.activity_date || apiData.tanggal || apiData.date,
    waktuMulai: apiData.activity_start_time || apiData.waktu_mulai || apiData.start_time,
    waktuSelesai: apiData.activity_complete_time || apiData.waktu_selesai || apiData.end_time,
    kategori: apiData.activity_category || apiData.kategori || apiData.category,
    deskripsi: apiData.deskripsi || apiData.description || "",
    status: apiData.status || "pending",
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
  })
}

export default Activity
