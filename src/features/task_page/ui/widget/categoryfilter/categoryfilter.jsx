import React, { useState } from 'react';
import styles from './categoryfilter.module.css';
import { categories } from '../../../../../core/widgets/badge/categories/categories.jsx';

function CategoryFilter({ onCategoryChange, placeholder = "Semua kategori" }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const categoryOptions = [
    { value: '', label: 'Semua kategori', iconPath: null },
    ...categories.map(category => ({
      value: category.name,
      label: category.label,
      iconPath: category.iconPath
    }))
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.value);
    setIsOpen(false);
    if (onCategoryChange) {
      onCategoryChange(category.value);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectedLabel = categoryOptions.find(option => option.value === selectedCategory)?.label || placeholder;
  const selectedIcon = categoryOptions.find(option => option.value === selectedCategory)?.iconPath;

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterWrapper}>
        <button
          onClick={toggleDropdown}
          className={styles.filterButton}
          type="button"
        >
          <div className={styles.filterContent}>
            {selectedIcon && (
              <img 
                src={selectedIcon} 
                alt={selectedLabel}
                className={styles.categoryIcon}
              />
            )}
            <span className={styles.filterText}>
              {selectedLabel}
            </span>
          </div>
          <svg 
            className={`${styles.dropdownIcon} ${isOpen ? styles.dropdownIconOpen : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className={styles.dropdownMenu}>
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleCategorySelect(option)}
                className={`${styles.dropdownItem} ${selectedCategory === option.value ? styles.dropdownItemActive : ''}`}
                type="button"
              >
                <div className={styles.dropdownItemContent}>
                  {option.iconPath && (
                    <img 
                      src={option.iconPath} 
                      alt={option.label}
                      className={styles.categoryIcon}
                    />
                  )}
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryFilter;
