import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message, Modal } from 'antd';
import {
  FiGrid,
  FiUser,
  FiUsers,
  FiCalendar,
  FiHeart,
  FiBell,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { authService } from '../../services/authService';
import { useTranslation, useAppContext } from '../../context/AppContext';
import styles from './AlumniLayout.module.css';

export const AlumniLayout = ({ children, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { theme, setTheme } = useAppContext();

  const handleLogout = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to log out of your Alumni account?',
      okText: 'Logout',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        authService.logout();
        message.info('Logged out successfully');
        navigate('/login');
      }
    });
  };

  const navItems = [
    { labelKey: 'dashboard', path: '/alumni/dashboard', icon: FiGrid },
    { labelKey: 'myProfile', path: '/alumni/profile', icon: FiUser },
    { labelKey: 'mentorshipRequests', path: '/alumni/mentorship', icon: FiUsers },
    { labelKey: 'myEvents', path: '/alumni/events', icon: FiCalendar },
    { labelKey: 'fundraising', path: '/alumni/fundraising', icon: FiHeart },
    { labelKey: 'notifications', path: '/alumni/notifications', icon: FiBell },
    { labelKey: 'settings', path: '/alumni/settings', icon: FiSettings }
  ];

  return (
    <div className={styles.dashboardLayout}>
      {/* 1. Fixed Left Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarLogoRow} onClick={() => navigate('/alumni/dashboard')}>
            <FaGraduationCap className={styles.sidebarLogoIcon} />
            <span className={styles.sidebarLogoText}>AlumniConnect</span>
          </div>
          <span className={styles.sidebarSubtitle}>ALUMNI NETWORK</span>

          <nav className={styles.sidebarNav}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <div
                  key={item.path}
                  className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon size={18} />
                  <span className={styles.navItemText}>{t(item.labelKey)}</span>
                </div>
              );
            })}
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut size={18} />
            <span className={styles.navItemText}>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Workspace */}
      <div className={styles.mainContainer}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.headerSearchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search mentorships, students, events, or fundraising..."
              className={styles.searchInput}
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
          </div>

          <div className={styles.headerRight}>
            <button
              className={styles.bellBtn}
              title="Notifications"
              onClick={() => navigate('/alumni/notifications')}
            >
              <FiBell />
              <span className={styles.bellBadge} />
            </button>

            <button
              className={styles.bellBtn}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>

            <div className={styles.userInfoBox} onClick={() => navigate('/alumni/profile')}>
              <div style={{ textAlign: 'right' }}>
                <div className={styles.userName}>Rahul Kumar</div>
                <div className={styles.userBadge}>ALUMNI, CLASS OF 2018</div>
              </div>
              <div className={styles.userAvatar}>RK</div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Container */}
        <main className={styles.contentContainer}>
          {children}
        </main>
      </div>
    </div>
  );
};
