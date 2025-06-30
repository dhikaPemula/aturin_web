import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './header.module.css';
import logoAturin from '../../../assets/icons/logo-aturin.svg';
import homeIcon from '../../../assets/icons/home.svg';
import taskIcon from '../../../assets/icons/task-list.svg';
import activityIcon from '../../../assets/icons/activity.svg';
import bellIcon from '../../../assets/icons/bell.svg';
import arrowDownIcon from '../../../assets/icons/arrow-down.svg';
import menuIcon from '../../../assets/icons/menu.svg';
import logoutIcon from '../../../assets/icons/log-out.svg';
import useBannerProfile from '../../hooks/useBannerProfile';
import { avatarMap, defaultAvatar } from '../avatars/avatars';
import Menu from '../menu/menu';
import NotificationList from '../notificationlist/notification_list';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { banner } = useBannerProfile(token);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1280);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const arrowRef = useRef();
  const bellRef = useRef();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1280);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Tentukan avatar dan nama dari banner jika ada
  let bannerAvatar = defaultAvatar;
  let bannerName = '';
  let todayTasks = null;
  let todayActivities = null;
  if (banner && banner.data && banner.data.user) {
    // Ambil nama file avatar dari path (misal: 'assets/avatars/profile1.jpg' => 'profile1.jpg')
    const avatarFile = banner.data.user.avatar.split('/').pop();
    bannerAvatar = avatarMap[avatarFile] || defaultAvatar;
    bannerName = banner.data.user.name;
    todayTasks = banner.data.today_tasks;
    todayActivities = banner.data.today_activities;
  }

  if (isMobile) {
    // Ukuran dinamis berdasarkan lebar layar
    const vw = Math.max(window.innerWidth, 320);
    const iconSize = Math.max(30, Math.min(36, vw * 0.08)); // 8vw, min 30, max 36
    const logoHeight = Math.max(64, Math.min(32, vw * 0.09)); // 9vw
    const fontSize = Math.max(24, Math.min(36, vw * 0.045)); // min 20px, max 36px, 4.5vw
    const avatarSize = Math.max(48, Math.min(16, vw * 0.10)); // 10vw
    const iconMargin = Math.max(20, Math.min(40, vw * 0.6)); // min 40px, max 2560px, 8vw
    return (
      <header
        className={styles.headerContainer}
        style={{
          width: '96vw',
          maxWidth: 1200,
          padding: '10px 20px',
          borderRadius: 9999, // sangat membulat, seperti lingkaran/pill
          margin: '8px auto',
          boxSizing: 'border-box',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4vw' }}>
          <img
            src={menuIcon}
            alt="Menu"
            className={styles.menuIcon}
            style={{ width: iconSize, height: iconSize, cursor: 'pointer' }}
            onClick={() => setShowMobileNav((v) => !v)}
          />
          <img src={logoAturin} alt="logo aturin" className={styles.logoAturin} style={{ width: '12.5vw', height: '12.5vw', minWidth: 24, minHeight: 24, maxWidth: 64, maxHeight: 64 }} />
          <span className={styles.aturinText} style={{ fontSize, }}>
            Aturin
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4vw' }}>
          <img
            ref={bellRef}
            src={bellIcon}
            alt="Notifikasi"
            className={styles.bellIcon}
            style={{ width: iconSize, height: iconSize, cursor: 'pointer'}}
            onClick={() => setNotifOpen(true)}
          />
          <NotificationList open={notifOpen} onClose={() => setNotifOpen(false)} anchorRef={bellRef} />
          <span className={styles.avatar} style={{ width: avatarSize, height: avatarSize, marginLeft: 0 }}>
            <img
              src={bannerAvatar}
              alt="avatar"
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
            />
          </span>
        </div>
        {showMobileNav && (
          <div style={{ position: 'absolute', left: 0, top: '100%', width: '100%', background: '#fff', border: '2px solid #5263F3', borderRadius: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '16px 0', zIndex: 1000 }}>
            <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
              <button style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 24px', fontSize: 18, fontWeight: 500, color: currentIndex === 0 ? '#5263F3' : '#222', display: 'flex', alignItems: 'center', gap: 12 }} onClick={() => { setCurrentIndex(0); setShowMobileNav(false); navigate('/home'); }}>
                <img src={homeIcon} alt="Home" style={{ width: 22, height: 22, marginRight: 8, filter: currentIndex === 0 ? 'invert(32%) sepia(92%) saturate(749%) hue-rotate(210deg) brightness(97%) contrast(101%)' : 'none' }} />
                Beranda
              </button>
              <button style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 24px', fontSize: 18, fontWeight: 500, color: currentIndex === 1 ? '#5263F3' : '#222', display: 'flex', alignItems: 'center', gap: 12 }} onClick={() => { setCurrentIndex(1); setShowMobileNav(false); navigate('/task'); }}>
                <img src={taskIcon} alt="Task" style={{ width: 22, height: 22, marginRight: 8, filter: currentIndex === 1 ? 'invert(32%) sepia(92%) saturate(749%) hue-rotate(210deg) brightness(97%) contrast(101%)' : 'none' }} />
                Tugas
              </button>
              <button style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 24px', fontSize: 18, fontWeight: 500, color: currentIndex === 2 ? '#5263F3' : '#222', display: 'flex', alignItems: 'center', gap: 12 }} onClick={() => { setCurrentIndex(2); setShowMobileNav(false); navigate('/activity'); }}>
                <img src={activityIcon} alt="Activity" style={{ width: 22, height: 22, marginRight: 8, filter: currentIndex === 2 ? 'invert(32%) sepia(92%) saturate(749%) hue-rotate(210deg) brightness(97%) contrast(101%)' : 'none' }} />
                Aktivitas
              </button>
              <button style={{ background: '#fff', color: '#D93E39', border: '2px solid #D93E39', borderRadius: 12, padding: '12px 24px', fontSize: 18, fontWeight: 500, marginTop: 12, marginLeft: 16, marginRight: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={logoutIcon} alt="Keluar" style={{ width: 22, height: 22}} />
                Keluar
              </button>
            </nav>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className={`${styles.headerContainer}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#fff',
        width: '92vw',
        boxSizing: 'border-box',
      }}
    >
      <div className={`${styles.leftSection}`}>
        <img src={logoAturin} alt="logo aturin" className={`${styles.logoAturin}`} />
        <span className={`${styles.aturinText}`}>Aturin</span>
      </div>
      <nav className={`${styles.menuNav}`}>
        <ul className={`${styles.menuList}`}>
          <li
            className={`${
              currentIndex === 0
                ? `${styles.menuItem} ${styles.menuItemActive}`
                : `${styles.menuItem}`
            }`}
            onClick={() => {
              setCurrentIndex(0);
              navigate('/home');
            }}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={homeIcon}
              alt="Home"
              className={`${styles.iconNav} ${currentIndex === 0 ? styles.iconActive : ''}`}
            />{' '}
            Beranda
          </li>
          <li
            className={`${
              currentIndex === 1
                ? `${styles.menuItem} ${styles.menuItemActive}`
                : `${styles.menuItem}`
            }`}
            onClick={() => {
              setCurrentIndex(1);
              navigate('/task');
            }}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={taskIcon}
              alt="Task"
              className={`${styles.iconNav} ${currentIndex === 1 ? styles.iconActive : ''}`}
            />{' '}
            Tugas
          </li>
          <li
            className={`${
              currentIndex === 2
                ? `${styles.menuItem} ${styles.menuItemActive}`
                : `${styles.menuItem}`
            }`}
            onClick={() => {
              setCurrentIndex(2);
              navigate('/activity');
            }}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={activityIcon}
              alt="Activity"
              className={`${styles.iconNav} ${currentIndex === 2 ? styles.iconActive : ''}`}
            />{' '}
            Aktivitas
          </li>
        </ul>
      </nav>
      <div className={styles.rightSection}>
        <img
          ref={bellRef}
          src={bellIcon}
          alt="Notifikasi"
          className={styles.bellIcon}
          style={{ cursor: 'pointer' }}
          onClick={() => setNotifOpen(true)}
        />
        <NotificationList open={notifOpen} onClose={() => setNotifOpen(false)} anchorRef={bellRef} />
        <span className={styles.avatar}>
          <img src={bannerAvatar} alt="avatar" />
        </span>
        <span className={styles.name}>{bannerName || 'Rakha Sigma'}</span>
        <img
          ref={arrowRef}
          src={arrowDownIcon}
          alt="arrow down"
          className={styles.arrowIcon}
          style={{ cursor: 'pointer' }}
          onClick={() => setMenuOpen(true)}
        />
        <Menu open={menuOpen} onClose={() => setMenuOpen(false)} anchorRef={arrowRef} />
      </div>
    </header>
  );
}
export default Header;