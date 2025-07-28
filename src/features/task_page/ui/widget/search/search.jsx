import React, { useState } from 'react';
import styles from './search.module.css';
import searchIcon from '/assets/task/search.svg';

function Search({ onSearchChange, placeholder = "Mencari Tugas..." }) {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <img 
          src={searchIcon} 
          alt="Search" 
          className={styles.searchIcon}
        />
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={styles.searchInput}
        />
        {searchValue && (
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
  );
}

export default Search;
