import React from "react";
import styles from "./activitycard.module.css";
import Badge from "../../../../../core/widgets/badge/buildbadge/badge.jsx";
import clock from '/assets/home/clock.svg'

/**
 * ActivityCard - Card untuk menampilkan aktivitas di homepage.
 * Menggunakan style sendiri (activitycard.module.css) dan Tailwind.
 * Props:
 *   - title: string
 *   - category: string
 *   - startTime: string (ISO)
 *   - endTime: string (ISO)
 *   - description: string (optional)
 *   - onClick: function (optional)
 *   - rawDate: string (ISO, optional)
 */
function ActivityCard({
  title,
  category = "activity",
  startTime,
  endTime,
  description,
  onClick,
  rawDate, // tambahkan rawDate jika ada
}) {
  // Log untuk debug props
  console.log("[ActivityCard] startTime:", startTime, "endTime:", endTime, "rawDate:", rawDate);

  // Fungsi untuk memformat waktu dari rawDate jika startTime dan endTime kosong
  function getDisplayTime() {
    if (startTime && endTime) return `${startTime} - ${endTime}`;
    if (startTime) return startTime;
    if (endTime) return endTime;
    if (rawDate) {
      try {
        const date = new Date(rawDate);
        if (!isNaN(date.getTime())) {
          // Format ke HH:mm
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        }
      } catch (e) {}
    }
    return "";
  }

  return (
    <div className={styles.activityCard} onClick={onClick}>
      <div className={styles.activityContainer}>
        <div className={styles.activityContent}>
          {/* Header dengan badges */}
          <div className={styles.activityHeader}>
            <div className={styles.badges}>
              <Badge
                name={category?.toLowerCase?.() || "akademik"}
                size="small"
              />
              <Badge name="activity" size="small" />
            </div>
          </div>
          {/* Judul aktivitas */}
          <h3 className={styles.activityTitle}>{title}</h3>
          {/* Footer dengan waktu */}
          <div className={styles.activityFooter}>
            <div className={styles.timeRange}>
              <img
                src={clock}
                alt="Waktu"
                className={styles.timeIcon}
              />
              <span className={styles.timeText}>
                {getDisplayTime()}
              </span>
            </div>
          </div>
          {/* Deskripsi jika ada */}
          {description && (
            <div className="mt-2 text-xs text-gray-500 line-clamp-2">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;
