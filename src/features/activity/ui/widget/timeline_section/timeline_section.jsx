"use client"
import LabelKategori from "../label_kategori/label_kategori"
import styles from "./timeline_section.module.css"
import sunIcon from "/assets/activity/icons/sun.svg"
import sunriseIcon from "/assets/activity/icons/sunrise.svg"
import sunsetIcon from "/assets/activity/icons/sunset.svg"
import moonIcon from "/assets/activity/icons/moon.svg"
import editIcon from "/assets/activity/icons/edit.svg"
import trashIcon from "/assets/activity/icons/trash.svg"
import nodataIcon from "/assets/activity/icons/nodata.svg"
import clockIcon from "/assets/activity/icons/clock.svg"

const TimelineSection = ({ activities, loading, onEdit, onDelete }) => {
  console.log("🎯 TimelineSection received:", {
    activitiesCount: activities?.length,
    onEditExists: !!onEdit,
    onDeleteExists: !!onDelete,
  })

  const handleEdit = (activity) => {
    console.log("🔥 Edit clicked for:", activity.judul, "ID:", activity.id)
    if (onEdit && typeof onEdit === "function") {
      onEdit(activity)
    } else {
      console.error("❌ onEdit function not available")
    }
  }

  const handleDelete = (activity) => {
    console.log("🔥 Delete clicked for:", activity.judul, "ID:", activity.id)
    if (onDelete && typeof onDelete === "function") {
      onDelete(activity)
    } else {
      console.error("❌ onDelete function not available")
    }
  }

  const groupActivitiesByTimeSlot = (activities) => {
    const groups = {
      pagi: {
        activities: [],
        icon: sunIcon,
        bgColor: "#FFF9C4",
        label: "Pagi",
        range: "05:00 - 10:00",
      },
      siang: {
        activities: [],
        icon: sunriseIcon,
        bgColor: "#FFEB3B",
        label: "Siang",
        range: "11:00 - 14:00",
      },
      sore: {
        activities: [],
        icon: sunsetIcon,
        bgColor: "#FF9800",
        label: "Sore",
        range: "15:00 - 18:00",
      },
      malam: {
        activities: [],
        icon: moonIcon,
        bgColor: "#1A237E",
        label: "Malam",
        range: "19:00 - 04:00",
      },
    }

    activities.forEach((activity) => {
      if (!activity.waktuMulai) return

      try {
        const hour = Number.parseInt(activity.waktuMulai.split(":")[0])

        if (hour >= 5 && hour < 11) {
          groups.pagi.activities.push(activity)
        } else if (hour >= 11 && hour < 15) {
          groups.siang.activities.push(activity)
        } else if (hour >= 15 && hour < 19) {
          groups.sore.activities.push(activity)
        } else {
          groups.malam.activities.push(activity)
        }
      } catch (error) {
        console.error("❌ Error parsing time for activity:", activity, error)
      }
    })

    Object.keys(groups).forEach((timeSlot) => {
      groups[timeSlot].activities.sort((a, b) => {
        if (!a.waktuMulai || !b.waktuMulai) return 0
        return a.waktuMulai.localeCompare(b.waktuMulai)
      })
    })

    return groups
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>
          <img src={nodataIcon || "/placeholder.svg"} alt="No Data" className={styles.emptyIconSvg} />
        </div>
        <p className={styles.emptyText}>Tidak ada aktivitas</p>
      </div>
    )
  }

  const groupedActivities = groupActivitiesByTimeSlot(activities)

  return (
    <div className={styles.container}>
      <div className={styles.timeline}>
        <div className={styles.timelineLine}></div>

        {Object.entries(groupedActivities).map(([timeSlot, group]) => {
          if (group.activities.length === 0) return null

          return (
            <div key={timeSlot} className={styles.timeSlot}>
              <div className={styles.timeSlotHeader}>
                <div className={styles.timeSlotIcon} style={{ backgroundColor: group.bgColor }}>
                  <img src={group.icon || "/placeholder.svg"} alt={group.label} className={styles.timeSlotIconImg} />
                </div>
                <div className={styles.timeSlotInfo}>
                  <div className={styles.timeSlotLabel}>{group.label}</div>
                  <div className={styles.timeSlotRange}>{group.range}</div>
                </div>
              </div>

              <div className={styles.activitiesContainer}>
                {group.activities.map((activity, activityIndex) => (
                  <div key={`${activity.id}-${activityIndex}`} className={styles.activityWrapper}>
                    <div className={styles.activityDot}></div>

                    <div className={styles.activityCard}>
                      <div className={styles.activityCardContent}>
                        <div className={styles.activityCardTop}>
                          <LabelKategori kategori={activity.kategori} />
                        </div>

                        <div className={styles.activityTitle}>{activity.judul}</div>

                        <div className={styles.activityCardBottom}>
                          <div className={styles.activityTime}>
                            <img src={clockIcon || "/placeholder.svg"} alt="Clock" className={styles.clockIcon} />
                            <span className={styles.activityTimeText}>
                              {activity.waktuMulai} - {activity.waktuSelesai}
                            </span>
                          </div>

                          <div className={styles.activityCardActions}>
                            {/* 🔧 PERBAIKAN: Simplified button handlers */}
                            <button type="button" onClick={() => handleEdit(activity)} className={styles.editButton}>
                              <img src={editIcon || "/placeholder.svg"} alt="Edit" className={styles.actionIcon} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(activity)}
                              className={styles.deleteButton}
                            >
                              <img src={trashIcon || "/placeholder.svg"} alt="Delete" className={styles.actionIcon} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TimelineSection
