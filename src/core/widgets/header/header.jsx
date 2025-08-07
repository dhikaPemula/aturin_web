import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import logoAturin from "/assets/home/logo-aturin.svg";
import homeIcon from "/assets/home/home.svg";
import taskIcon from "/assets/home/task-list.svg";
import activityIcon from "/assets/home/activity.svg";
import bellIcon from "/assets/home/bell.svg";
import arrowDownIcon from "/assets/home/arrow-down.svg";
import menuIcon from "/assets/home/menu.svg";
import logoutIcon from "/assets/home/log-out.svg";
import useBannerProfile from "../../hooks/useBannerProfile";
import { avatarMap, defaultAvatar } from "../avatars/avatars";
import Menu from "../menu/menu";
import NotificationList from "../notificationlist/notification_list";
import Alert from "../alert/alert";
import { logoutUser } from "../../../features/auth/services/authService";

function Header({
  currentIndex: propCurrentIndex,
  setCurrentIndex: propSetCurrentIndex,
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { banner } = useBannerProfile(token);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(propCurrentIndex || 0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1280);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const arrowRef = useRef();
  const bellRef = useRef();
  const menuNavRef = useRef();

  // Sync with prop changes and update underline position
  useEffect(() => {
    console.log("Prop currentIndex changed:", propCurrentIndex);
    if (propCurrentIndex !== undefined) {
      console.log("Setting currentIndex to:", propCurrentIndex);
      setCurrentIndex(propCurrentIndex);
    }
  }, [propCurrentIndex]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1280);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Single effect to handle underline position based on currentIndex
  useLayoutEffect(() => {
    const updateUnderlinePosition = () => {
      if (!isMobile && menuNavRef.current) {
        const menuItems = menuNavRef.current.querySelectorAll("li");
        const activeItem = menuItems[currentIndex];

        console.log("Updating underline position:", {
          currentIndex,
          totalItems: menuItems.length,
          activeItem: activeItem ? "found" : "not found",
        });

        if (activeItem) {
          const { offsetLeft, offsetWidth } = activeItem;
          console.log("Setting underline position:", {
            offsetLeft,
            offsetWidth,
          });
          menuNavRef.current.style.setProperty(
            "--underline-left",
            `${offsetLeft}px`
          );
          menuNavRef.current.style.setProperty(
            "--underline-width",
            `${offsetWidth}px`
          );
        }
      }
    };

    // Update immediately with layoutEffect (after DOM paint)
    updateUnderlinePosition();

    // Also update after small delay for safety
    const timeout = setTimeout(updateUnderlinePosition, 10);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentIndex, isMobile]);

  // Additional effect for backup updates
  useEffect(() => {
    if (!isMobile && menuNavRef.current) {
      const timeout = setTimeout(() => {
        const menuItems = menuNavRef.current.querySelectorAll("li");
        const activeItem = menuItems[currentIndex];

        if (activeItem) {
          const { offsetLeft, offsetWidth } = activeItem;
          console.log("Backup update - Setting underline position:", {
            offsetLeft,
            offsetWidth,
          });
          menuNavRef.current.style.setProperty(
            "--underline-left",
            `${offsetLeft}px`
          );
          menuNavRef.current.style.setProperty(
            "--underline-width",
            `${offsetWidth}px`
          );
        }
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, isMobile]);

  // Handle window resize
  useEffect(() => {
    const handleResizeAndReposition = () => {
      if (!isMobile && menuNavRef.current) {
        const menuItems = menuNavRef.current.querySelectorAll("li");
        const activeItem = menuItems[currentIndex];

        if (activeItem) {
          const { offsetLeft, offsetWidth } = activeItem;
          menuNavRef.current.style.setProperty(
            "--underline-left",
            `${offsetLeft}px`
          );
          menuNavRef.current.style.setProperty(
            "--underline-width",
            `${offsetWidth}px`
          );
        }
      }
    };

    window.addEventListener("resize", handleResizeAndReposition);
    return () =>
      window.removeEventListener("resize", handleResizeAndReposition);
  }, [currentIndex, isMobile]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (e) {
      // Fallback: tetap hapus token dan redirect jika API gagal
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token");
      navigate("/");
    }
  };

  // Tentukan avatar dan nama dari banner jika ada
  let bannerAvatar = defaultAvatar;
  let bannerName = "";
  let todayTasks = null;
  let todayActivities = null;
  if (banner && banner.data && banner.data.user) {
    // Ambil nama file avatar dari path (misal: 'assets/avatars/profile1.jpg' => 'profile1.jpg')
    const avatarFile = banner.data.user.avatar.split("/").pop();
    bannerAvatar = avatarMap[avatarFile] || defaultAvatar;
    bannerName = banner.data.user.name;
    todayTasks = banner.data.today_tasks;
    todayActivities = banner.data.today_activities;
  }

  if (isMobile) {
    // Ukuran dinamis berdasarkan lebar layar
    const vw = Math.max(window.innerWidth, 320);
    const iconSize = Math.max(30, Math.min(36, vw * 0.08)); // 8vw, min 30, max 36
    const iconNotifSize = Math.max(28, Math.min(24, vw * 0.025)); // 8vw, min 16, max 24
    const logoHeight = Math.max(64, Math.min(32, vw * 0.09)); // 9vw
    const fontSize = Math.max(24, Math.min(36, vw * 0.045)); // min 20px, max 36px, 4.5vw
    const avatarSize = Math.max(32, Math.min(48, vw * 0.08)); // 8vw, min 32px, max 48px
    const iconMargin = Math.max(20, Math.min(40, vw * 0.6)); // min 40px, max 2560px, 8vw
    return (
      <header
        className={styles.headerContainer}
        style={{
          width: "92vw",
          borderRadius: 9999, // sangat membulat, seperti lingkaran/pill
          boxSizing: "border-box",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "#fff",
          paddingLeft: "4vw",
          paddingRight: "4vw",
          marginLeft: "4vw",
          marginRight: "4vw",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4vw" }}>
          <img
            src={menuIcon}
            alt="Menu"
            className={styles.menuIcon}
            style={{ width: iconSize, height: iconSize, cursor: "pointer" }}
            onClick={() => setShowMobileNav((v) => !v)}
          />
          <img
            src={logoAturin}
            alt="logo aturin"
            className={styles.logoAturin}
            style={{
              width: "12.5vw",
              height: "12.5vw",
              minWidth: 24,
              minHeight: 24,
              maxWidth: 64,
              maxHeight: 64,
            }}
          />
          <span className={styles.aturinText} style={{ fontSize }}>
            Aturin
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4vw" }}>
          <img
            ref={bellRef}
            src={bellIcon}
            alt="Notifikasi"
            className={styles.bellIcon}
            style={{
              width: iconNotifSize,
              height: iconNotifSize,
              cursor: "pointer",
            }}
            onClick={() => setNotifOpen(true)}
          />
          <NotificationList
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            anchorRef={bellRef}
          />
          <span className={styles.avatar}>
            <img
              src={bannerAvatar}
              alt="avatar"
              className={styles.avatarImage}
            />
          </span>
        </div>
        {showMobileNav && (
          <div className={styles.mobileNavPanel}>
            <nav className={styles.mobileNavContainer}>
              <button
                className={`${styles.mobileNavButton} ${
                  currentIndex === 0 ? styles.mobileNavButtonActive : ""
                }`}
                onClick={() => {
                  const newIndex = 0;
                  setCurrentIndex(newIndex);
                  propSetCurrentIndex && propSetCurrentIndex(newIndex);
                  setShowMobileNav(false);
                  navigate("/home");
                }}
              >
                <img
                  src={homeIcon}
                  alt="Home"
                  className={`${styles.mobileNavIcon} ${
                    currentIndex === 0 ? styles.mobileNavIconActive : ""
                  }`}
                />
                Beranda
              </button>
              <button
                className={`${styles.mobileNavButton} ${
                  currentIndex === 1 ? styles.mobileNavButtonActive : ""
                }`}
                onClick={() => {
                  const newIndex = 1;
                  setCurrentIndex(newIndex);
                  propSetCurrentIndex && propSetCurrentIndex(newIndex);
                  setShowMobileNav(false);
                  navigate("/task");
                }}
              >
                <img
                  src={taskIcon}
                  alt="Task"
                  className={`${styles.mobileNavIcon} ${
                    currentIndex === 1 ? styles.mobileNavIconActive : ""
                  }`}
                />
                Tugas
              </button>
              <button
                className={`${styles.mobileNavButton} ${
                  currentIndex === 2 ? styles.mobileNavButtonActive : ""
                }`}
                onClick={() => {
                  const newIndex = 2;
                  setCurrentIndex(newIndex);
                  propSetCurrentIndex && propSetCurrentIndex(newIndex);
                  setShowMobileNav(false);
                  navigate("/activity");
                }}
              >
                <img
                  src={activityIcon}
                  alt="Activity"
                  className={`${styles.mobileNavIcon} ${
                    currentIndex === 2 ? styles.mobileNavIconActive : ""
                  }`}
                />
                Aktivitas
              </button>
              <button
                className={styles.mobileLogoutButton}
                onClick={() => setShowLogoutAlert(true)}
              >
                <img
                  src={logoutIcon}
                  alt="Keluar"
                  style={{ width: 22, height: 22 }}
                />
                Keluar
              </button>
            </nav>
          </div>
        )}
        <Alert
          isOpen={showLogoutAlert}
          onCancel={() => setShowLogoutAlert(false)}
          onSubmit={handleLogout}
          title="Upaya Keluar"
          message="Yakin, kamu mau keluar dari aturin? Jangan lupa untuk login."
          submitLabel="Keluar"
          cancelText="Batal"
        />
      </header>
    );
  }

  return (
    <header
      className={`${styles.headerContainer}`}
    >
      <div className={`${styles.leftSection}`}>
        <img
          src={logoAturin}
          alt="logo aturin"
          className={`${styles.logoAturin}`}
        />
        <span className={`${styles.aturinText}`}>Aturin</span>
      </div>
      <nav className={`${styles.menuNav}`} ref={menuNavRef}>
        <ul className={`${styles.menuList}`}>
          <li
            className={`${
              currentIndex === 0
                ? `${styles.menuItem} ${styles.menuItemActive}`
                : `${styles.menuItem}`
            }`}
            onClick={() => {
              const newIndex = 0;
              setCurrentIndex(newIndex);
              propSetCurrentIndex && propSetCurrentIndex(newIndex);
              navigate("/home");
            }}
          >
            <img
              src={homeIcon}
              alt="Home"
              className={`${styles.iconNav} ${
                currentIndex === 0 ? styles.iconActive : ""
              }`}
            />{" "}
            Beranda
          </li>
          <li
            className={`${
              currentIndex === 1
                ? `${styles.menuItem} ${styles.menuItemActive}`
                : `${styles.menuItem}`
            }`}
            onClick={() => {
              const newIndex = 1;
              setCurrentIndex(newIndex);
              propSetCurrentIndex && propSetCurrentIndex(newIndex);
              navigate("/task");
            }}
          >
            <img
              src={taskIcon}
              alt="Task"
              className={`${styles.iconNav} ${
                currentIndex === 1 ? styles.iconActive : ""
              }`}
            />{" "}
            Tugas
          </li>
          <li
            className={`${
              currentIndex === 2
                ? `${styles.menuItem} ${styles.menuItemActive}`
                : `${styles.menuItem}`
            }`}
            onClick={() => {
              const newIndex = 2;
              setCurrentIndex(newIndex);
              propSetCurrentIndex && propSetCurrentIndex(newIndex);
              navigate("/activity");
            }}
          >
            <img
              src={activityIcon}
              alt="Activity"
              className={`${styles.iconNav} ${
                currentIndex === 2 ? styles.iconActive : ""
              }`}
            />{" "}
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
          onClick={() => setNotifOpen(true)}
        />
        <NotificationList
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
          anchorRef={bellRef}
        />
        <span className={styles.avatar}>
          <img src={bannerAvatar} alt="avatar" className={styles.avatarImage} />
        </span>
        <span className={styles.name}>{bannerName || "Aturin Jaya"}</span>
        <img
          ref={arrowRef}
          src={arrowDownIcon}
          alt="arrow down"
          className={styles.arrowIcon}
          onClick={() => setMenuOpen(true)}
        />
        <Menu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          anchorRef={arrowRef}
          onLogout={() => setShowLogoutAlert(true)}
        />
      </div>
      <Alert
        isOpen={showLogoutAlert}
        onCancel={() => setShowLogoutAlert(false)}
        onSubmit={handleLogout}
        title="Upaya Keluar"
        message="Yakin, kamu mau keluar dari aturin? Jangan lupa untuk login."
        submitLabel="Keluar"
        cancelText="Batal"
      />
    </header>
  );
}
export default Header;
