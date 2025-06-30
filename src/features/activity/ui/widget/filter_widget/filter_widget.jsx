"use client"

import { useState } from "react"
import styles from "./filter_widget.module.css"
import chevronDownIcon from "../../../../../assets/icons/chevron-down.svg"
// Import ikon kategori
import akademikIcon from "../../../../../assets/icons/akademik.svg"
import hiburanIcon from "../../../../../assets/icons/hiburan.svg"
import pekerjaanIcon from "../../../../../assets/icons/pekerjaan.svg"
import olahragaIcon from "../../../../../assets/icons/olahraga.svg"
import sosialIcon from "../../../../../assets/icons/sosial.svg"
import spiritualIcon from "../../../../../assets/icons/spiritual.svg"
import pribadiIcon from "../../../../../assets/icons/pribadi.svg"
import istirahatIcon from "../../../../../assets/icons/istirahat.svg"

const FilterWidget = ({ type, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)

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

  if (type === "date") {
    return (
      <div className={styles.container}>
        <input type="date" value={value} onChange={(e) => onChange(e.target.value)} className={styles.dateInput} />
      </div>
    )
  }

  if (type === "category") {
    const selectedCategory = categories.find((cat) => cat.name === value)

    return (
      <div className={styles.container}>
        <button onClick={() => setIsOpen(!isOpen)} className={styles.categoryButton}>
          <div className={styles.categoryButtonContent}>
            {selectedCategory ? (
              <>
                <img
                  src={selectedCategory.icon || "/placeholder.svg"}
                  alt={selectedCategory.name}
                  className={styles.categoryIconImg}
                />
                <span className={styles.categoryButtonTextSelected}>{selectedCategory.name}</span>
              </>
            ) : (
              <span className={styles.categoryButtonTextPlaceholder}>{placeholder}</span>
            )}
          </div>
          <img
            src={chevronDownIcon || "/placeholder.svg"}
            alt="Chevron"
            className={`${styles.chevronIcon} ${isOpen ? styles.chevronIconRotated : ""}`}
          />
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            <button
              onClick={() => {
                onChange("")
                setIsOpen(false)
              }}
              className={styles.dropdownItem}
            >
              <span>Semua kategori</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  onChange(category.name)
                  setIsOpen(false)
                }}
                className={styles.dropdownItem}
              >
                <img src={category.icon || "/placeholder.svg"} alt={category.name} className={styles.categoryIconImg} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        )}

        {isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}
      </div>
    )
  }

  return null
}

export default FilterWidget
