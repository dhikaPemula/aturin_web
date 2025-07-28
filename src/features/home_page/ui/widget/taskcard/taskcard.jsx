import React from "react";
import styles from "./taskcard.module.css";
import Badge from "../../../../../core/widgets/badge/buildbadge/badge.jsx";
import StatusBadge from "../../../../../core/widgets/status/statusbadge.jsx";
import jadwal from "/assets/home/jadwal.svg";

function TaskCard({
  title,
  categories = [],
  deadline,
  status = "belum_dikerjakan",
  alarm_id = null,
  onClick,
  onToggleStatus,
}) {
  const isCompleted = status === "selesai";

  // Debug: Log alarm_id untuk melihat nilainya
  console.log("TaskCard alarm_id:", alarm_id, "type:", typeof alarm_id);

  // Format deadline
  const formatDeadline = (deadlineStr) => {
    if (!deadlineStr) return "Tidak ada deadline";

    try {
      const date = new Date(deadlineStr);
      return (
        date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +
        ", " +
        date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (e) {
      return deadlineStr;
    }
  };

  return (
    <div
      className={`${styles.taskCard} ${isCompleted ? styles.completed : ""}`}
      onClick={onClick}
    >
      <div className={styles.taskContainer}>
        <div className={styles.taskContent}>
          {/* Header dengan badges */}
          <div className={styles.taskHeader}>
            <div className={styles.badges}>
              {/* Badge untuk categories */}
              {categories
                .filter(
                  (category) =>
                    category.toLowerCase() !== "tugas" &&
                    category.toLowerCase() !== "task"
                )
                .map((category, index) => (
                  <Badge
                    key={`category-${index}`}
                    name={category.toLowerCase()}
                    size="small"
                  />
                ))}

              {/* Badge untuk task */}
              <Badge name="task" size="small" />

              {/* Badge untuk alarm (hanya jika alarm_id tidak null dan bukan 0) */}
              {alarm_id && alarm_id !== null && alarm_id !== 0 && (
                <Badge name="alarm" size="small" />
              )}
            </div>
          </div>

          {/* Title */}
          <h3
            className={`${styles.taskTitle} ${
              isCompleted ? styles.completedText : ""
            }`}
          >
            {title}
          </h3>

          {/* Footer dengan deadline dan status */}
          <div className={styles.taskFooter}>
            <div className={styles.deadline}>
              <img
                src={jadwal}
                alt="Jadwal"
                className={styles.dateIcon}
              />
              <span className={styles.dateText}>
                {formatDeadline(deadline)}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.statusSection}>
          <div className={styles.statusContainer}>
            <StatusBadge
              name={status}
              size="medium"
              onClick={(name, label) => {
                if (onToggleStatus) onToggleStatus();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
