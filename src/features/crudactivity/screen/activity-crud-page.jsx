"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import styles from "./activity-crud-page.module.css"
import chevronDownIcon from "/assets/activity/icons/chevron-down.svg"
import checkIcon from "/assets/activity/icons/check.svg"

// Import ikon kategori
import akademikIcon from "/assets/activity/categories/akademik.svg"
import hiburanIcon from "/assets/activity/categories/hiburan.svg"
import pekerjaanIcon from "/assets/activity/categories/pekerjaan.svg"
import olahragaIcon from "/assets/activity/categories/olahraga.svg"
import sosialIcon from "/assets/activity/categories/sosial.svg"
import spiritualIcon from "/assets/activity/categories/spiritual.svg"
import pribadiIcon from "/assets/activity/categories/pribadi.svg"
import istirahatIcon from "/assets/activity/categories/istirahat.svg"

// Helper functions untuk validasi tanggal dan waktu
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0]
}

const getCurrentTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

const isToday = (dateString) => {
  return dateString === getTodayDate()
}

const isPastTime = (timeString) => {
  if (!timeString) return false
  const currentTime = getCurrentTime()
  return timeString < currentTime
}

const ActivityCrudPage = ({ isOpen, onClose, onSave, activity, defaultDate }) => {
  // State untuk form data
  const [formData, setFormData] = useState({
    judul: "",
    tanggal: defaultDate || new Date().toISOString().split("T")[0],
    waktuMulai: "",
    waktuSelesai: "",
    kategori: "",
  })

  // State untuk dropdown kategori
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState("")

  // ESC key & backdrop click handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showCategoryDropdown) {
          setShowCategoryDropdown(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showCategoryDropdown, onClose]);

  // Body scroll lock (store original)
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Daftar kategori dengan ikon dan warna
  const categories = [
    { name: "Akademik", icon: akademikIcon, color: "text-white" },
    { name: "Hiburan", icon: hiburanIcon, color: "text-fuchsia-700" },
    { name: "Pekerjaan", icon: pekerjaanIcon, color: "text-stone-500" },
    { name: "Olahraga", icon: olahragaIcon, color: "text-red-500" },
    { name: "Sosial", icon: sosialIcon, color: "text-orange-500" },
    { name: "Spiritual", icon: spiritualIcon, color: "text-green-500" },
    { name: "Pribadi", icon: pribadiIcon, color: "text-yellow-400" },
    { name: "Istirahat", icon: istirahatIcon, color: "text-blue-900" },
  ]

  // Fungsi untuk normalisasi tanggal
  const normalizeDate = (dateString) => {
    if (!dateString) return defaultDate || new Date().toISOString().split("T")[0]
    // format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }
    // Handle ISO timestamp
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
    // Handle datetime format
    if (dateString.includes(" ")) {
      return dateString.split(" ")[0]
    }
    return defaultDate || new Date().toISOString().split("T")[0]
  }

  // Fungsi untuk normalisasi kategori
  const normalizeCategory = (category) => {
    if (!category) return ""
    const normalized = category.toLowerCase()
    return normalized.charAt(0).toUpperCase() + normalized.slice(1)
  }

  // Setup form data saat modal dibuka
  useEffect(() => {
    if (activity && isOpen) {
      // Mode edit - isi form dengan data aktivitas
      const normalizedData = {
        judul: activity.judul || "",
        tanggal: normalizeDate(activity.tanggal),
        waktuMulai: activity.waktuMulai || "",
        waktuSelesai: activity.waktuSelesai || "",
        kategori: normalizeCategory(activity.kategori) || "Akademik", // default Akademik jika kosong
      }
      setFormData(normalizedData)
    } else if (isOpen) {
      // Mode tambah - reset form
      setFormData({
        judul: "",
        tanggal: defaultDate || new Date().toISOString().split("T")[0],
        waktuMulai: "",
        waktuSelesai: "",
        kategori: "Akademik", // default Akademik
      })
    }
    // Reset state lainnya
    setErrors({})
    setFocusedField("")
    setShowCategoryDropdown(false)
  }, [activity, isOpen, defaultDate])

  // Validasi form
  const validateForm = () => {
    const newErrors = {}
    if (!formData.judul.trim()) {
      newErrors.judul = "Judul aktivitas harus diisi"
    } else if (formData.judul.length > 20) {
      newErrors.judul = "Judul tidak boleh lebih dari 20 karakter"
    }

    if (!formData.tanggal) {
      newErrors.tanggal = "Tanggal aktivitas harus diisi"
    }

    if (!formData.waktuMulai) {
      newErrors.waktuMulai = "Waktu mulai harus diisi"
    }

    if (!formData.waktuSelesai) {
      newErrors.waktuSelesai = "Waktu selesai harus diisi"
    }

    // Validasi waktu selesai > waktu mulai
    if (formData.waktuMulai && formData.waktuSelesai) {
      const startTime = new Date(`2000-01-01 ${formData.waktuMulai}`)
      const endTime = new Date(`2000-01-01 ${formData.waktuSelesai}`)
      if (startTime >= endTime) {
        newErrors.waktuSelesai = "Waktu selesai harus lebih besar dari waktu mulai"
      }
    }

    // Validasi tanggal dan waktu berdasarkan mode (tambah/edit)
    const today = getTodayDate()
    const currentTime = getCurrentTime()

    if (!activity) {
      // Mode TAMBAH: tidak boleh tanggal/waktu lampau
      if (formData.tanggal < today) {
        newErrors.tanggal = "Tidak dapat membuat aktivitas di masa lampau"
      } else if (formData.tanggal === today) {
        if (formData.waktuMulai && formData.waktuMulai < currentTime) {
          newErrors.waktuMulai = "Tidak dapat membuat aktivitas di waktu yang sudah lewat"
        }
        if (formData.waktuSelesai && formData.waktuSelesai < currentTime) {
          newErrors.waktuSelesai = "Tidak dapat membuat aktivitas di waktu yang sudah lewat"
        }
      }
    } else {
      // Mode EDIT: bisa edit dari tanggal aktivitas ke depan, tidak bisa ke belakang
      const originalDate = normalizeDate(activity.tanggal)
      if (formData.tanggal < originalDate) {
        newErrors.tanggal = "Tidak dapat mengubah tanggal ke masa lampau dari tanggal aktivitas asli"
      }
      // Jika tanggal sama dengan hari ini dan waktu sudah lewat
      if (formData.tanggal === today) {
        if (formData.waktuMulai && formData.waktuMulai < currentTime) {
          newErrors.waktuMulai = "Tidak dapat mengubah waktu ke waktu yang sudah lewat"
        }
        if (formData.waktuSelesai && formData.waktuSelesai < currentTime) {
          newErrors.waktuSelesai = "Tidak dapat mengubah waktu ke waktu yang sudah lewat"
        }
      }
    }

    if (!formData.kategori) {
      newErrors.kategori = "Kategori aktivitas harus dipilih"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle perubahan input
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error saat user mulai mengetik
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const dataForBackend = {
        ...formData,
        kategori: formData.kategori.toLowerCase(),
      }
      onSave(dataForBackend)
    }
  }

  const handleFocus = (field) => setFocusedField(field)
  const handleBlur = () => setFocusedField("")

  // Cari kategori yang dipilih
  const selectedCategory = categories.find((cat) => cat.name === formData.kategori)

  // Backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (showCategoryDropdown) {
        setShowCategoryDropdown(false);
      } else {
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  // Modal content (scrollable form)
  const modalContent = (
    <div className={styles.backdrop}>
      <div className={styles.overlay} onClick={handleBackdropClick}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          {/* Header Modal */}
          <div className={styles.header}>
            <h2 className={styles.title}>{activity ? "Ubah Aktivitas" : "Tambah Aktivitas"}</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Field Judul */}
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
                className={`${styles.input} ${
                  focusedField === "judul" ? styles.inputFocused : ""
                } ${errors.judul ? styles.inputError : ""}`}
              />
              <div className={styles.characterCount}>{formData.judul.length}/20 karakter</div>
              {errors.judul && <span className={styles.errorText}>{errors.judul}</span>}
            </div>

            {/* Field Tanggal */}
            <div className={styles.field}>
              <label className={styles.label}>Tanggal</label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => handleInputChange("tanggal", e.target.value)}
                onFocus={() => handleFocus("tanggal")}
                onBlur={handleBlur}
                min={activity ? normalizeDate(activity.tanggal) : getTodayDate()} // Edit: dari tanggal asli, Tambah: dari hari ini
                className={`${styles.dateInput} ${
                  focusedField === "tanggal" ? styles.inputFocused : ""
                } ${errors.tanggal ? styles.inputError : ""}`}
              />
              {errors.tanggal && <span className={styles.errorText}>{errors.tanggal}</span>}
            </div>

            {/* Field Waktu - Sejajar di Mobile */}
            <div className={styles.timeFields}>
              <div className={styles.field}>
                <label className={styles.label}>Waktu mulai</label>
                <input
                  type="time"
                  value={formData.waktuMulai}
                  onChange={(e) => handleInputChange("waktuMulai", e.target.value)}
                  onFocus={() => handleFocus("waktuMulai")}
                  onBlur={handleBlur}
                  min={isToday(formData.tanggal) ? getCurrentTime() : undefined} // Disable waktu masa lampau jika hari ini
                  className={`${styles.timeInput} ${
                    focusedField === "waktuMulai" ? styles.inputFocused : ""
                  } ${errors.waktuMulai ? styles.inputError : ""}`}
                />
                {errors.waktuMulai && <span className={styles.errorText}>{errors.waktuMulai}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Waktu selesai</label>
                <input
                  type="time"
                  value={formData.waktuSelesai}
                  onChange={(e) => handleInputChange("waktuSelesai", e.target.value)}
                  onFocus={() => handleFocus("waktuSelesai")}
                  onBlur={handleBlur}
                  min={
                    isToday(formData.tanggal)
                      ? formData.waktuMulai && formData.waktuMulai >= getCurrentTime()
                        ? formData.waktuMulai
                        : getCurrentTime()
                      : formData.waktuMulai || undefined
                  } // Disable waktu selesai yang tidak valid
                  className={`${styles.timeInput} ${
                    focusedField === "waktuSelesai" ? styles.inputFocused : ""
                  } ${errors.waktuSelesai ? styles.inputError : ""}`}
                />
                {errors.waktuSelesai && <span className={styles.errorText}>{errors.waktuSelesai}</span>}
              </div>
            </div>

            {/* Field Kategori */}
            <div className={styles.field}>
              <label className={styles.label}>Kategori</label>
              <div className={styles.categoryWrapper}>
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  onFocus={() => handleFocus("kategori")}
                  onBlur={handleBlur}
                  className={`${styles.categoryButton} ${
                    focusedField === "kategori" ? styles.inputFocused : ""
                  } ${errors.kategori ? styles.inputError : ""}`}
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
                  <svg 
                    className={`${styles.dropdownArrow} ${showCategoryDropdown ? styles.dropdownArrowOpen : ''}`}
                    width="20" 
                    height="20" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {errors.kategori && <span className={styles.errorText}>{errors.kategori}</span>}

                {/* Dropdown Kategori */}
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

            {/* Tombol Aksi */}
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
        {/* Backdrop untuk menutup dropdown */}
        {showCategoryDropdown && <div className={styles.backdrop} onClick={() => setShowCategoryDropdown(false)} />}
      </div>
    </div>
  );

  // Portal membungkus backdrop+modal
  return createPortal(modalContent, document.body);
}

export default ActivityCrudPage
