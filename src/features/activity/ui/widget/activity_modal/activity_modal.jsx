"use client"

import { useState, useEffect } from "react"
import styles from "./activity_modal.module.css"
import chevronDownIcon from "../../../../../assets/icons/chevron-down.svg"
import checkIcon from "../../../../../assets/icons/check.svg"
// Import ikon kategori
import akademikIcon from "../../../../../assets/icons/akademik.svg"
import hiburanIcon from "../../../../../assets/icons/hiburan.svg"
import pekerjaanIcon from "../../../../../assets/icons/pekerjaan.svg"
import olahragaIcon from "../../../../../assets/icons/olahraga.svg"
import sosialIcon from "../../../../../assets/icons/sosial.svg"
import spiritualIcon from "../../../../../assets/icons/spiritual.svg"
import pribadiIcon from "../../../../../assets/icons/pribadi.svg"
import istirahatIcon from "../../../../../assets/icons/istirahat.svg"

const ActivityModal = ({ isOpen, onClose, onSave, activity, defaultDate }) => {
  const [formData, setFormData] = useState({
    judul: "",
    tanggal: defaultDate || new Date().toISOString().split("T")[0],
    waktuMulai: "",
    waktuSelesai: "",
    kategori: "",
  })
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState("")

  const categories = [
    { name: "Akademik", icon: akademikIcon, color: "text-blue-500" },
    { name: "Hiburan", icon: hiburanIcon, color: "text-fuchsia-700" },
    { name: "Pekerjaan", icon: pekerjaanIcon, color: "text-stone-500" },
    { name: "Olahraga", icon: olahragaIcon, color: "text-red-500" },
    { name: "Sosial", icon: sosialIcon, color: "text-orange-500" },
    { name: "Spiritual", icon: spiritualIcon, color: "text-green-500" },
    { name: "Pribadi", icon: pribadiIcon, color: "text-yellow-400" },
    { name: "Istirahat", icon: istirahatIcon, color: "text-blue-900" },
  ]

  // 🔧 PERBAIKAN: Fungsi normalisasi tanggal yang konsisten dengan parent
  const normalizeDate = (dateString) => {
    if (!dateString) return defaultDate || new Date().toISOString().split("T")[0]

    console.log("🔍 Modal normalizing date:", dateString)

    // Jika sudah format YYYY-MM-DD, gunakan langsung
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      console.log("✅ Modal: Already in YYYY-MM-DD format:", dateString)
      return dateString
    }

    // 🔧 PERBAIKAN: Handle ISO timestamp dengan timezone yang sama seperti parent
    if (dateString.includes("T")) {
      try {
        // Parse sebagai Date object untuk menangani timezone dengan benar
        const date = new Date(dateString)

        // 🔧 PENTING: Gunakan local date, bukan UTC (sama seperti parent)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")

        const localDate = `${year}-${month}-${day}`
        console.log("✅ Modal: Extracted local date from ISO:", localDate)
        return localDate
      } catch (error) {
        console.error("❌ Modal: Error parsing ISO timestamp:", error)
        // Fallback ke split T
        const extracted = dateString.split("T")[0]
        console.log("⚠️ Modal: Fallback extracted:", extracted)
        return extracted
      }
    }

    // Jika ada spasi (format datetime)
    if (dateString.includes(" ")) {
      const extracted = dateString.split(" ")[0]
      console.log("✅ Modal: Extracted from datetime:", extracted)
      return extracted
    }

    // Coba parse sebagai Date object
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        // 🔧 PERBAIKAN: Gunakan local date
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")

        const localDate = `${year}-${month}-${day}`
        console.log("✅ Modal: Parsed as local Date object:", localDate)
        return localDate
      }
    } catch (error) {
      console.error("❌ Modal: Error parsing as Date:", error)
    }

    console.log("⚠️ Modal: Could not normalize date, using default:", defaultDate)
    return defaultDate || new Date().toISOString().split("T")[0]
  }

  const normalizeCategory = (category) => {
    if (!category) return ""

    const normalized = category.toLowerCase()
    return normalized.charAt(0).toUpperCase() + normalized.slice(1)
  }

  useEffect(() => {
    if (activity && isOpen) {
      console.log("🔍 Modal: Setting up edit mode with activity:", activity)

      const normalizedData = {
        judul: activity.judul || "",
        tanggal: normalizeDate(activity.tanggal), // 🔧 Menggunakan fungsi yang sudah diperbaiki
        waktuMulai: activity.waktuMulai || "",
        waktuSelesai: activity.waktuSelesai || "",
        kategori: normalizeCategory(activity.kategori),
      }

      console.log("🔍 Modal: Normalized data for edit:", normalizedData)
      setFormData(normalizedData)
    } else if (isOpen) {
      // 🔧 PERBAIKAN: Gunakan defaultDate untuk aktivitas baru
      console.log("🔍 Modal: Setting up create mode with defaultDate:", defaultDate)

      setFormData({
        judul: "",
        tanggal: defaultDate || new Date().toISOString().split("T")[0],
        waktuMulai: "",
        waktuSelesai: "",
        kategori: "",
      })
    }

    setErrors({})
    setFocusedField("")
    setShowCategoryDropdown(false)
  }, [activity, isOpen, defaultDate])

  const validateForm = () => {
    const newErrors = {}

    // Validasi judul
    if (!formData.judul.trim()) {
      newErrors.judul = "Judul aktivitas harus diisi"
    } else if (formData.judul.length > 20) {
      newErrors.judul = "Judul tidak boleh lebih dari 20 karakter"
    }

    // Validasi tanggal
    if (!formData.tanggal) {
      newErrors.tanggal = "Tanggal aktivitas harus diisi"
    }

    // Validasi waktu mulai
    if (!formData.waktuMulai) {
      newErrors.waktuMulai = "Waktu mulai harus diisi"
    }

    // Validasi waktu selesai
    if (!formData.waktuSelesai) {
      newErrors.waktuSelesai = "Waktu selesai harus diisi"
    }

    // Validasi waktu - hanya cek waktu selesai > waktu mulai
    if (formData.waktuMulai && formData.waktuSelesai) {
      const startTime = new Date(`2000-01-01 ${formData.waktuMulai}`)
      const endTime = new Date(`2000-01-01 ${formData.waktuSelesai}`)

      if (startTime >= endTime) {
        newErrors.waktuSelesai = "Waktu selesai harus lebih besar dari waktu mulai"
      }
    }

    // Validasi kategori
    if (!formData.kategori) {
      newErrors.kategori = "Kategori aktivitas harus dipilih"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    console.log(`🔍 Modal: Input changed - ${field}:`, value)
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log("🔍 Modal: Submitting form data:", formData)

    if (validateForm()) {
      const dataForBackend = {
        ...formData,
        kategori: formData.kategori.toLowerCase(),
      }
      console.log("🔍 Modal: Data for backend:", dataForBackend)
      onSave(dataForBackend)
    }
  }

  const handleFocus = (field) => {
    setFocusedField(field)
  }

  const handleBlur = () => {
    setFocusedField("")
  }

  const selectedCategory = categories.find((cat) => cat.name === formData.kategori)

  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{activity ? "Ubah Aktivitas" : "Tambah Aktivitas"}</h2>
          <button type="button" onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Judul */}
          <div className={styles.field}>
            <label className={styles.label}>Judul</label>
            <input
              type="text"
              value={formData.judul}
              onChange={(e) => handleInputChange("judul", e.target.value)}
              onFocus={() => handleFocus("judul")}
              onBlur={handleBlur}
              placeholder="Masukkan judul aktivitas"
              maxLength={20}
              className={`${styles.input} ${focusedField === "judul" ? styles.inputFocused : ""} ${errors.judul ? styles.inputError : ""}`}
            />
            <div className={styles.characterCount}>{formData.judul.length}/20 karakter</div>
            {errors.judul && <span className={styles.errorText}>{errors.judul}</span>}
          </div>

          {/* Tanggal */}
          <div className={styles.field}>
            <label className={styles.label}>Tanggal</label>
            <div className={styles.dateInputWrapper}>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => handleInputChange("tanggal", e.target.value)}
                onFocus={() => handleFocus("tanggal")}
                onBlur={handleBlur}
                className={`${styles.dateInput} ${focusedField === "tanggal" ? styles.inputFocused : ""} ${errors.tanggal ? styles.inputError : ""}`}
              />
            </div>
            {errors.tanggal && <span className={styles.errorText}>{errors.tanggal}</span>}
          </div>

          {/* Waktu */}
          <div className={styles.timeFields}>
            <div className={styles.field}>
              <label className={styles.label}>Waktu mulai</label>
              <div className={styles.timeInputWrapper}>
                <input
                  type="time"
                  value={formData.waktuMulai}
                  onChange={(e) => handleInputChange("waktuMulai", e.target.value)}
                  onFocus={() => handleFocus("waktuMulai")}
                  onBlur={handleBlur}
                  className={`${styles.timeInput} ${focusedField === "waktuMulai" ? styles.inputFocused : ""} ${errors.waktuMulai ? styles.inputError : ""}`}
                />
              </div>
              {errors.waktuMulai && <span className={styles.errorText}>{errors.waktuMulai}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Waktu selesai</label>
              <div className={styles.timeInputWrapper}>
                <input
                  type="time"
                  value={formData.waktuSelesai}
                  onChange={(e) => handleInputChange("waktuSelesai", e.target.value)}
                  onFocus={() => handleFocus("waktuSelesai")}
                  onBlur={handleBlur}
                  className={`${styles.timeInput} ${focusedField === "waktuSelesai" ? styles.inputFocused : ""} ${errors.waktuSelesai ? styles.inputError : ""}`}
                />
              </div>
              {errors.waktuSelesai && <span className={styles.errorText}>{errors.waktuSelesai}</span>}
            </div>
          </div>

          {/* Kategori */}
          <div className={styles.field}>
            <label className={styles.label}>Kategori</label>
            <div className={styles.categoryWrapper}>
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                onFocus={() => handleFocus("kategori")}
                onBlur={handleBlur}
                className={`${styles.categoryButton} ${focusedField === "kategori" ? styles.inputFocused : ""} ${errors.kategori ? styles.inputError : ""}`}
              >
                {selectedCategory ? (
                  <div className={styles.categoryButtonContent}>
                    <img
                      src={selectedCategory.icon || "/placeholder.svg"}
                      alt={selectedCategory.name}
                      className={styles.categoryIconImg}
                    />
                    <span className={styles.categoryButtonText}>{selectedCategory.name}</span>
                  </div>
                ) : (
                  <span className={styles.categoryButtonPlaceholder}>Pilih kategori</span>
                )}
                <img
                  src={chevronDownIcon || "/placeholder.svg"}
                  alt="Chevron"
                  className={`${styles.categoryChevron} ${showCategoryDropdown ? styles.categoryChevronRotated : ""}`}
                />
              </button>
              {errors.kategori && <span className={styles.errorText}>{errors.kategori}</span>}

              {showCategoryDropdown && (
                <div className={styles.categoryDropdown}>
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => {
                        handleInputChange("kategori", category.name)
                        setShowCategoryDropdown(false)
                      }}
                      className={styles.categoryDropdownItem}
                    >
                      <div className={styles.categoryDropdownItemContent}>
                        <img
                          src={category.icon || "/placeholder.svg"}
                          alt={category.name}
                          className={styles.categoryIconImg}
                        />
                        <span className={styles.categoryDropdownItemText}>{category.name}</span>
                      </div>
                      {formData.kategori === category.name && (
                        <img src={checkIcon || "/placeholder.svg"} alt="Check" className={styles.categoryCheck} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className={styles.buttons}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Batal
            </button>
            <button type="submit" className={styles.submitButton}>
              {activity ? "Simpan" : "Tambah"}
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop for category dropdown */}
      {showCategoryDropdown && <div className={styles.backdrop} onClick={() => setShowCategoryDropdown(false)} />}
    </div>
  )
}

export default ActivityModal
