import { useState, useEffect } from 'react';
import styles from './search.module.css';
import searchIcon from '/assets/home/search.svg';

function Search({ onSearchChange, value, placeholder = "Cari Tugas atau Aktivitas..." }) {
  const [searchValue, setSearchValue] = useState(value || '');

  // Sync internal state with external value prop
  useEffect(() => {
    setSearchValue(value || '');
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    
    // Call the callback function if provided
    if (onSearchChange && typeof onSearchChange === 'function') {
      onSearchChange(newValue);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    if (onSearchChange && typeof onSearchChange === 'function') {
      onSearchChange('');
    }
  };

  return (
    <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
            <img src={searchIcon} alt="Search Icon" className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder={placeholder}
              className={styles.searchInput}
              value={searchValue}
              onChange={handleInputChange}
            />
            {searchValue && (
              <button 
                type="button"
                className={styles.clearButton}
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
        </div>   
    </div>
  );
}
export default Search;