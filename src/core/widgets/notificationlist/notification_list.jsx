import React from 'react';
import styles from './notification_list.module.css';

function NotificationList({ open, onClose, anchorRef }) {
  const popupRef = React.useRef(null);

  React.useEffect(() => {
    if (open && anchorRef?.current && popupRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const popup = popupRef.current;
      popup.style.position = 'fixed';
      popup.style.top = `${anchorRect.bottom + 8}px`;
      popup.style.right = `${window.innerWidth - anchorRect.right}px`;
      popup.style.zIndex = 1100;
    }
  }, [open, anchorRef]);

  if (!open) return null;

  // Responsive style for mobile
  const isMobile = window.innerWidth <= 700;
  const containerStyle = isMobile
    ? {
        width: '72vw',
        minWidth: 0,
        maxWidth: 420,
        left: '50%',
        transform: 'translateX(-50%)',
        top: 70,
      }
    : {};

  const headStyle = isMobile ? { padding: '2vw 20px', textAlign: 'center' } : {};

  return (
    <div className={styles.notificationOverlay} onClick={onClose}>
      <div
        className={styles.notificationListContainer}
        ref={popupRef}
        onClick={e => e.stopPropagation()}
        style={containerStyle}
      >
        <div className={styles.notificationHead} style={headStyle}>
          <h1 className={styles.notificationTitle} style={isMobile ? { fontSize: 20 } : {}}>Notifikasi</h1>
          <p className={styles.notificationSubtitle} style={isMobile ? { fontSize: 14 } : {}}>Anda Tidak Memiliki Notifikasi</p>
        </div>
        <div className={styles.notificationList} style={isMobile ? { fontSize: 14, padding: '4vw' } : {}}> Tidak ada Notifikasi</div>
      </div>
    </div>
  );
}

export default NotificationList;