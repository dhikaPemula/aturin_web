"use client"
import styles from "./search_widget.module.css"
import searchIcon from "../../../../../assets/icons/search.svg"

const SearchWidget = ({ value, onChange, placeholder = "Mencari..." }) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <img src={searchIcon || "/placeholder.svg"} alt="Search" className={styles.icon} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  )
}

export default SearchWidget
