import React from 'react';
import styles from './badge.module.css';
import { categories, getCategoryByName } from '../categories/categories.jsx';
import { activityTaskAlarm, getItemByName } from '../activitytaskalarm/activitytaskalarm.jsx';

/**
 * Function untuk membuat badge berdasarkan nama
 * Secara otomatis mencari data dari categories atau activityTaskAlarm
 * @param {string} name - Nama badge (akan dicari di categories atau activityTaskAlarm)
 * @param {string} size - Ukuran badge ('small', 'medium', 'large')
 * @param {function} onClick - Handler ketika badge diklik
 * @param {string} className - Class CSS tambahan
 * @returns {JSX.Element} Komponen badge
 */
export const buildBadge = ({
  name,
  size = 'medium',
  onClick,
  className = '',
  ...props
}) => {
  // Cari data di categories terlebih dahulu
  let badgeData = getCategoryByName(name);
  
  // Jika tidak ditemukan di categories, cari di activityTaskAlarm
  if (!badgeData) {
    badgeData = getItemByName(name);
  }
  
  // Jika masih tidak ditemukan, gunakan default
  if (!badgeData) {
    badgeData = {
      name: name,
      label: name.charAt(0).toUpperCase() + name.slice(1),
      foreground: "#FFFFFF",
      background: "#6B7280",
      iconPath: null
    };
  }

  const badgeStyle = {
    backgroundColor: badgeData.background,
    color: badgeData.foreground,
  };

  const handleClick = () => {
    if (onClick) {
      onClick(badgeData.name, badgeData.label);
    }
  };

  return (
    <div
      className={`${styles.badge} ${styles[size]} ${className}`}
      style={badgeStyle}
      onClick={handleClick}
      data-name={badgeData.name}
      {...props}
    >
      {badgeData.iconPath && (
        <img
          src={badgeData.iconPath}
          alt={badgeData.label}
          className={styles.badgeIcon}
        />
      )}
      {badgeData.label && (
        <span className={styles.badgeLabel}>{badgeData.label}</span>
      )}
    </div>
  );
};

/**
 * Komponen Badge yang dapat digunakan langsung dengan props
 */
const Badge = ({
  name,
  size = 'medium',
  onClick,
  className = '',
  ...props
}) => {
  return buildBadge({
    name,
    size,
    onClick,
    className,
    ...props
  });
};

export default Badge; 