"use client"
import styles from "./search_widget.module.css"
import searchIcon from "/assets/home/search.svg"

const SearchWidget = ({ value, onChange, placeholder = "Mencari..." }) => {
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (onChange) {
      onChange(inputValue);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <img 
          src={searchIcon || "/placeholder.svg"} 
          alt="Search" 
          className={styles.searchIcon}
        />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={styles.searchInput}
        />
        {value && (
          <button
            onClick={handleClear}
            className={styles.clearButton}
            type="button"
          >
            <svg className={styles.clearIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchWidget