import React, { useState, useEffect } from "react";
import styles from "./taskcard.module.css";
import Badge from "../../../../../core/widgets/badge/buildbadge/badge.jsx";
import Alert from "../../../../../core/widgets/alert/alert.jsx";
import { updateTask } from "../../../../../core/services/api/task_api_service";

// Import icons
import clockIcon from "../../../../../assets/home/clock.svg";
import jadwalIcon from "../../../../../assets/home/jadwal.svg";
import editIcon from "../../../../../assets/task/edit.svg";
import deleteIcon from "../../../../../assets/task/delete.svg";

function TaskCard({
  provided, // dari Draggable atau renderClone
  task,
  isClone = false,
  onEditTask,
  onDeleteTask,
  onDeleteSuccess,
  className = "",
  showCheck = false, // Tambah prop showCheck
  onToggleStatus, // Tambah prop untuk toggle status
}) {
  // State for delete confirmation alert
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  // State untuk hover
  const [isHovered, setIsHovered] = useState(false);

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Ensure alert is closed when component unmounts
      setShowDeleteAlert(false);
    };
  }, []);

  // Handle delete button click
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent drag event
    e.preventDefault(); // Prevent default behavior
    setShowDeleteAlert(true);
  };

  // Handle edit button click
  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent drag event
    e.preventDefault(); // Prevent default behavior
    if (onEditTask) {
      onEditTask(task);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (onDeleteTask) {
      try {
        await onDeleteTask(task);

        // Call success callback untuk menampilkan toast
        if (onDeleteSuccess) {
          onDeleteSuccess({
            type: "success",
            title: "Berhasil Menghapus Tugas",
            message: `Tugas "${task?.title}" berhasil dihapus`,
          });
        }
      } catch (error) {
        console.error("Error deleting task:", error);

        // Call error callback jika ada
        if (onDeleteSuccess) {
          onDeleteSuccess({
            type: "error",
            title: "Gagal Menghapus Tugas",
            message: "Terjadi kesalahan saat menghapus tugas",
          });
        }
      }
    }
    // Close alert after action
    setShowDeleteAlert(false);
  };

  // Handle delete cancellation
  const handleDeleteCancel = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowDeleteAlert(false);
  };
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

  // Format estimation
  const formatEstimation = (estimation) => {
    if (!estimation) return "Tidak ada estimasi";
    return `Estimasi: ${estimation}`;
  };

  // Format estimated task duration
  const formatEstimatedDuration = (duration) => {
    if (!duration) return "Tidak ada durasi estimasi";

    // Handle HH:MM:SS format
    if (duration.includes(":")) {
      const [hours, minutes, seconds] = duration.split(":");
      const h = parseInt(hours);
      const m = parseInt(minutes);

      if (h > 0 && m > 0) {
        return `Estimasi: ${h} jam ${m} menit`;
      } else if (h > 0) {
        return `Estimasi: ${h} jam`;
      } else if (m > 0) {
        return `Estimasi: ${m} menit`;
      }
    }

    return `Estimasi: ${duration}`;
  };

  // Handler untuk toggle status tugas
  const handleToggleStatus = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!task || !task.slug) return;
    const currentStatus = task.status || task.task_status;
    let newStatus = currentStatus;
    if (["belum_selesai", "terlambat"].includes(currentStatus)) {
      newStatus = "selesai";
    } else if (currentStatus === "selesai") {
      // Cek deadline
      let deadline = task.deadline || task.task_deadline;
      let isLate = false;
      if (deadline) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        isLate = deadlineDate < today;
      }
      newStatus = isLate ? "terlambat" : "belum_selesai";
    }
    try {
      await updateTask(task.slug, { status: newStatus });
      // Update local state agar langsung re-render
      if (task.status !== undefined) task.status = newStatus;
      if (task.task_status !== undefined) task.task_status = newStatus;
      setLocalStatus(newStatus);
      if (onToggleStatus) {
        onToggleStatus({ ...task, status: newStatus, task_status: newStatus });
      }
      if (onDeleteSuccess) {
        onDeleteSuccess({
          type: "success",
          title: "Status Tugas Diperbarui",
          message: `Status tugas \"${
            task.title || task.task_title
          }\" berhasil diubah menjadi ${newStatus.replace("_", " ")}`,
        });
      }
    } catch (err) {
      if (onDeleteSuccess) {
        onDeleteSuccess({
          type: "error",
          title: "Gagal Update Status",
          message: "Terjadi kesalahan saat mengubah status tugas.",
        });
      }
    }
  };

  // State untuk status lokal agar re-render langsung
  const [localStatus, setLocalStatus] = useState(
    task.status || task.task_status
  );
  useEffect(() => {
    setLocalStatus(task.status || task.task_status);
  }, [task.status, task.task_status]);

  // Cek apakah layar besar (lg) atau tidak
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!task) {
    return null;
  }

  return (
    <>
      <div
        ref={provided ? provided.innerRef : undefined}
        {...(provided ? provided.draggableProps : {})}
        {...(provided ? provided.dragHandleProps : {})}
        className={`${styles.taskCard} ${className ? styles[className] : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Task Header with Category Badge */}
        <div className={styles.taskHeader}>
          {((task.categories && task.categories.length > 0) ||
            task.task_category) && (
            <div className={styles.categoryBadges}>
              {(task.categories && task.categories.length > 0
                ? task.categories
                : task.task_category
                ? [task.task_category]
                : []
              )
                .filter(
                  (category) =>
                    category.toLowerCase() !== "tugas" &&
                    category.toLowerCase() !== "task"
                )
                .map((category, index) => (
                  <Badge
                    key={`category-${task.id || task.slug}-${index}`}
                    name={category.toLowerCase()}
                    size="small"
                  />
                ))}
            </div>
          )}
        </div>

        {/* Task Content */}
        <div className={styles.taskContent}>
          <h3
            className={styles.taskTitle}
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* Kotak check di kiri title, hanya muncul saat hover */}
            {showCheck &&
              ["belum_selesai", "terlambat", "selesai"].includes(
                localStatus
              ) && (
                <span
                  className={styles.checkBoxWrapper}
                  style={{
                    marginRight: 12,
                    display: isLargeScreen
                      ? isHovered
                        ? "inline-flex"
                        : "none"
                      : "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    className={
                      `${styles.checkBox} ` +
                      (["belum_selesai", "terlambat"].includes(localStatus)
                        ? styles.checkBoxEmpty
                        : styles.checkBoxChecked)
                    }
                    onClick={handleToggleStatus}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                    }}
                    title={
                      ["belum_selesai", "terlambat"].includes(localStatus)
                        ? "Tandai selesai"
                        : "Tugas selesai"
                    }
                    style={{
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    {["belum_selesai", "terlambat"].includes(localStatus) ? (
                      // Kotak kosong: putih, border ungu
                      <span
                        style={{
                          display: "inline-block",
                          width: 18,
                          height: 18,
                          border: "2px solid #5263F3",
                          borderRadius: 4,
                          background: "#fff",
                        }}
                      ></span>
                    ) : (
                      // Kotak dengan icon check
                      <span
                        style={{
                          display: "inline-block",
                          width: 18,
                          height: 18,
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="18" height="18" rx="4" fill="#5263F3" />
                          <path
                            d="M5 9.5L8 12L13 7"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    )}
                  </span>
                </span>
              )}
            {/* Jika tidak showCheck, title menempel ke kiri */}
            {!showCheck && <span style={{ marginRight: 0 }}></span>}
            {task.title}
          </h3>
          {task.description && (
            <p className={styles.taskDescription}>{task.description}</p>
          )}
        </div>

        {/* Task Details */}
        <div className={styles.taskDetails}>
          {/* Estimation */}
          {task.estimation && (
            <div className={styles.detailItem}>
              <img
                src={clockIcon}
                alt="Estimasi"
                className={styles.detailIcon}
              />
              <span className={styles.detailText}>
                {formatEstimation(task.estimation)}
              </span>
            </div>
          )}

          {/* Estimated Task Duration */}
          {task.estimated_task_duration && (
            <div className={styles.detailItem}>
              <img
                src={clockIcon}
                alt="Durasi Estimasi"
                className={`${styles.detailIcon} ${styles.durationIcon}`}
              />
              <span className={styles.detailText}>
                {formatEstimatedDuration(task.estimated_task_duration)}
              </span>
            </div>
          )}

          {/* Deadline */}
          <div className={styles.detail}>
            <div className={styles.deadline}>
              <img
                src={jadwalIcon}
                alt="Deadline"
                className={`${styles.detailIcon} ${styles.deadlineIcon}`}
              />
              <span className={styles.detailText}>
                {formatDeadline(task.deadline)}
              </span>
            </div>

            {/* Action Buttons - inline with deadline */}
            <div
              className={styles.inlineActionButtons}
              data-no-drag="true" // Attribute to identify non-draggable area
            >
              {onEditTask && (
                <button
                  onClick={handleEditClick}
                  onPointerDown={(e) => e.stopPropagation()} // Prevent drag on pointer down
                  onMouseDown={(e) => e.stopPropagation()} // Prevent drag on mouse down
                  onTouchStart={(e) => e.stopPropagation()} // Prevent drag on touch start
                  className={styles.editButton}
                  type="button"
                  title="Edit Tugas"
                  data-no-drag="true"
                >
                  <img
                    src={editIcon}
                    alt="Edit"
                    className={styles.actionIcon}
                  />
                </button>
              )}
              {onDeleteTask && (
                <button
                  onClick={handleDeleteClick}
                  onPointerDown={(e) => e.stopPropagation()} // Prevent drag on pointer down
                  onMouseDown={(e) => e.stopPropagation()} // Prevent drag on mouse down
                  onTouchStart={(e) => e.stopPropagation()} // Prevent drag on touch start
                  className={styles.deleteButton}
                  type="button"
                  title="Hapus Tugas"
                  data-no-drag="true"
                >
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className={styles.actionIcon}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert - Outside draggable area */}
      {showDeleteAlert && (
        <Alert
          isOpen={showDeleteAlert}
          title="Hapus Tugas"
          message={`Apakah Anda yakin ingin menghapus tugas "${task?.title}"? Perubahan ini bersifat permanen.`}
          cancelText="Batal"
          submitLabel="Hapus"
          onCancel={handleDeleteCancel}
          onSubmit={handleDeleteConfirm}
        />
      )}
    </>
  );
}

export default TaskCard;
