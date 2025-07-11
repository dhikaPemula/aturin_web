"use client"

import { useState } from "react"
import styles from "./filter_widget.module.css"
import chevronDownIcon from "../../../../../assets/activity/icons/chevron-down.svg"
// Import ikon kategori
import akademikIcon from "../../../../../assets/activity/categories/akademik.svg"
import hiburanIcon from "../../../../../assets/activity/categories/hiburan.svg"
import pekerjaanIcon from "../../../../../assets/activity/categories/pekerjaan.svg"
import olahragaIcon from "../../../../../assets/activity/categories/olahraga.svg"
import sosialIcon from "../../../../../assets/activity/categories/sosial.svg"
import spiritualIcon from "../../../../../assets/activity/categories/spiritual.svg"
import pribadiIcon from "../../../../../assets/activity/categories/pribadi.svg"
import istirahatIcon from "../../../../../assets/activity/categories/istirahat.svg"

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
      <div className={styles.filterContainer}>
        <div className={styles.filterWrapper}>
          <input type="date" value={value} onChange={(e) => onChange(e.target.value)} className={styles.dateInput} />
        </div>
      </div>
    )
  }

  if (type === "category") {
    const selectedCategory = categories.find((cat) => cat.name === value)

    return (
      <div className={styles.filterContainer}>
        <div className={styles.filterWrapper}>
          <button onClick={() => setIsOpen(!isOpen)} className={styles.filterButton} type="button">
            <div className={styles.filterContent}>
              {selectedCategory ? (
                <>
                  <img
                    src={selectedCategory.icon || "/placeholder.svg"}
                    alt={selectedCategory.name}
                    className={styles.categoryIcon}
                  />
                  <span className={styles.filterText}>{selectedCategory.name}</span>
                </>
              ) : (
                <span className={styles.filterText}>{placeholder}</span>
              )}
            </div>
            <img
              src={chevronDownIcon || "/placeholder.svg"}
              alt="Chevron"
              className={`${styles.dropdownIcon} ${isOpen ? styles.dropdownIconOpen : ""}`}
            />
          </button>

          {isOpen && (
            <div className={styles.dropdownMenu}>
              <button
                onClick={() => {
                  onChange("")
                  setIsOpen(false)
                }}
                className={`${styles.dropdownItem} ${value === "" ? styles.dropdownItemActive : ""}`}
                type="button"
              >
                <div className={styles.dropdownItemContent}>
                  <span>Semua kategori</span>
                </div>
              </button>
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => {
                    onChange(category.name)
                    setIsOpen(false)
                  }}
                  className={`${styles.dropdownItem} ${value === category.name ? styles.dropdownItemActive : ""}`}
                  type="button"
                >
                  <div className={styles.dropdownItemContent}>
                    <img src={category.icon || "/placeholder.svg"} alt={category.name} className={styles.categoryIcon} />
                    <span>{category.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default FilterWidget