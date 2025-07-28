import React, { useRef, useEffect } from 'react';
import useProfile from '../../hooks/useProfile';
import { avatarMap, defaultAvatar } from '../avatars/avatars';
import settingsIcon from '/assets/home/settings.svg';
import logoutIcon from '/assets/home/log-out.svg';
import styles from './menu.module.css';

function Menu({ open, onClose, anchorRef, onLogout }) {
  const { profile, loading, error } = useProfile();
  const popupRef = useRef(null);

  useEffect(() => {
    if (open && anchorRef?.current && popupRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const popup = popupRef.current;
      popup.style.position = 'fixed';
      popup.style.top = `${anchorRect.bottom + 8}px`;
      popup.style.right = `${window.innerWidth - anchorRect.right}px`;
    }
  }, [open, anchorRef]);

  if (!open) return null;

  // Tentukan avatar dari avatarMap jika tersedia, fallback ke defaultAvatar
  let avatarUrl = defaultAvatar;
  if (profile && profile.avatar) {
    const avatarFile = profile.avatar.split('/').pop();
    avatarUrl = avatarMap[avatarFile] || defaultAvatar;
  }

  return (
    <div className={styles.menuOverlay} onClick={onClose}>
      <div
        className={styles.menuPopup}
        ref={popupRef}
        onClick={e => e.stopPropagation()}
      >
        {loading && <div className={styles.menuLoading}>Loading profile...</div>}
        {error && <div className={styles.menuError}>Error loading profile</div>}
        {profile && (
          <div className={styles.profileInfo}>
            <img
              src={avatarUrl}
              alt="avatar"
            />
            <div className={styles.profileDetail}>
              <div className={styles.profileName}>{profile.name}</div>
              <div className={styles.profileEmail}>{profile.email}</div>
            </div>
          </div>
        )}
        <div className={styles.menuDivider} />
        <div className={styles.menuAction} tabIndex={0} role="button">
          <img src={settingsIcon} alt="settings" className={styles.menuActionIcon} />
          <span className={styles.menuActionTextSettings}>Pengaturan</span>
        </div>
        <div 
          className={styles.menuAction} 
          tabIndex={0} 
          role="button"
          onClick={() => {
            onClose();
            onLogout && onLogout();
          }}
        >
          <img src={logoutIcon} alt="logout" className={styles.menuActionIcon} />
          <span className={styles.menuActionTextOut}>Keluar</span>
        </div>
      </div>
    </div>
  );
}
export default Menu;