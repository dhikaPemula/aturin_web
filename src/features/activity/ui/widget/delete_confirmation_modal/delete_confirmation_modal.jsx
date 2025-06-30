"use client"

import styles from "./delete_confirmation_modal.module.css"

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, activityTitle }) => {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Konfirmasi Hapus</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>
            Apakah Anda yakin ingin menghapus aktivitas <strong>"{activityTitle}"</strong>?
          </p>
          <p className={styles.warning}>Tindakan ini tidak dapat dibatalkan.</p>
        </div>

        <div className={styles.buttons}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Batal
          </button>
          <button type="button" onClick={onConfirm} className={styles.deleteButton}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
