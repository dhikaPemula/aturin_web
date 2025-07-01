import React from 'react';
import styles from '../badge/buildbadge/badge.module.css';
import { getStatusByName } from './status.jsx';

/**
 * Komponen StatusBadge untuk menampilkan badge status
 * Menerima parameter name dan otomatis mengambil data dari status.jsx
 * 
 * @param {string} name - Nama status (akan dicari di array statuses)
 *                        Options: 'selesai', 'belum_dikerjakan', 'terlambat', 'hari_ini', 'besok', 'lusa'
 * @param {string} size - Ukuran badge ('small', 'medium', 'large')
 * @param {function} onClick - Handler ketika badge diklik
 * @param {string} className - Class CSS tambahan
 * @returns {JSX.Element} Komponen status badge
 * 
 * @example
 * // Basic usage
 * <StatusBadge name="selesai" />
 * 
 * @example
 * // With different sizes
 * <StatusBadge name="belum_dikerjakan" size="small" />
 * <StatusBadge name="terlambat" size="large" />
 * 
 * @example
 * // With click handler
 * <StatusBadge 
 *   name="hari_ini" 
 *   onClick={(name, label) => console.log(`Clicked: ${name} - ${label}`)} 
 * />
 */
export const StatusBadge = ({
  name,
  size = 'medium',
  onClick,
  className = '',
  ...props
}) => {
  // Ambil data status berdasarkan name
  const statusData = getStatusByName(name);
  
  // Jika status tidak ditemukan, gunakan default
  if (!statusData) {
    return (
      <span 
        className={`${styles.badge} ${styles[size]} ${className}`}
        style={{
          backgroundColor: "#E4E4E7",
          color: "#999999"
        }}
        {...props}
      >
        {name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Unknown'}
      </span>
    );
  }

  const badgeStyle = {
    backgroundColor: statusData.background,
    color: statusData.foreground,
  };

  const handleClick = () => {
    if (onClick) {
      onClick(statusData.name, statusData.label);
    }
  };

  return (
    <span 
      className={`${styles.badge} ${styles[size]} ${className}`}
      style={badgeStyle}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {statusData.label}
    </span>
  );
};

export default StatusBadge;
