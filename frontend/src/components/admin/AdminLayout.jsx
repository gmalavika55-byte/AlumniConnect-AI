import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message, Modal } from 'antd';
import {
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiBell,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { authService } from '../../services/authService';
import { useTranslation, useAppContext } from '../../context/AppContext';
import styles from './AdminLayout.module.css';

export const AdminLayout = ({ children, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { theme, setTheme } = useAppContext();

  const handleLogout = () => {
    Modal.confirm({
      title: 'Confirm Admin Logout',
      content: 'Are you sure you want to log out of the Admin Management System?',
      okText: 'Logout',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        authService.logout();
        message.info('Admin logged out successfully');
        navigate('/login');
      }
    });
  };

  const navItems = [
    { labelKey: 'dashboard', path: '/admin/dashboard', icon: FiGrid },
    { labelKey: 'userManagement', path: '/admin/users', icon: FiUsers },
    { labelKey: 'studentManagement', path: '/admin/students', icon: FiUsers },
    { labelKey: 'alumniManagement', path: '/admin/alumni', icon: FiUserCheck },
    { labelKey: 'eventManagement', path: '/admin/events', icon: FiCalendar },
    { labelKey: 'reportsAnalytics', path: '/admin/reports', icon: FiFileText },
    { labelKey: 'settingsRoles', path: '/admin/settings', icon: FiSettings }
  ];

  return (
    <div className={styles.dashboardLayout}>
      {/* 1. Fixed Left Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarLogoRow} onClick={() => navigate('/admin/dashboard')}>
            <FaGraduationCap className={styles.sidebarLogoIcon} />
            <span className={styles.sidebarLogoText}>AlumniConnect</span>
          </div>
          <span className={styles.sidebarSubtitle}>ADMINISTRATION NETWORK</span>

          <nav className={styles.sidebarNav}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
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
              placeholder="Search system activities, users, or records..."
              className={styles.searchInput}
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
          </div>

          <div className={styles.headerRight}>
            <button
              className={styles.bellBtn}
              title="Urgent System Notifications"
              onClick={() => Modal.info({
                title: '🔔 Admin System Notifications (4 New)',
                content: (
                  <div>
                    <p><strong>Security Alert:</strong> Multiple failed login attempts from IP 192.168.1.45</p>
                    <p><strong>Alumni Verification:</strong> 24 pending graduation certificate verifications</p>
                    <p><strong>Report Generated:</strong> Monthly Employment Rate & Placement Insight report ready</p>
                  </div>
                )
              })}
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

            <div className={styles.userInfoBox} onClick={() => navigate('/admin/settings')}>
              <div style={{ textAlign: 'right' }}>
                <div className={styles.userName}>Dr. Sarah Jenkins</div>
                <div className={styles.userBadge}>System Administrator</div>
              </div>
              <div className={styles.userAvatar}>SJ</div>
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
