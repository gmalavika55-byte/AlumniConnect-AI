import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message, Modal } from 'antd';
import {
  FiGrid, FiUser, FiCalendar, FiBriefcase,
  FiUsers, FiBell, FiSettings, FiLogOut, FiSearch
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { authService } from '../../services/authService';
import { useTranslation } from '../../context/AppContext';
import styles from './StudentLayout.module.css';

export const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
const student = authService.getCurrentUser();
  const handleLogout = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to log out of your student account?',
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
    { labelKey: 'dashboard',   path: '/student/dashboard',  icon: FiGrid },
    { labelKey: 'myProfile',   path: '/student/profile',    icon: FiUser },
    { labelKey: 'events',      path: '/student/events',     icon: FiCalendar },
    { labelKey: 'career',      path: '/student/career',     icon: FiBriefcase },
    { labelKey: 'mentorships', path: '/student/mentorship', icon: FiUsers },
    { labelKey: 'settings',    path: '/student/settings',   icon: FiSettings }
  ];

  return (
    <div className={styles.dashboardLayout}>
      {/* Fixed Left Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarLogoRow} onClick={() => navigate('/')}>
            <FaGraduationCap className={styles.sidebarLogoIcon} />
            <span className={styles.sidebarLogoText}>AlumniConnect</span>
          </div>
          <span className={styles.sidebarSubtitle}>INSTITUTIONAL NETWORK</span>

          <nav className={styles.sidebarNav}>
            {navItems.map((item) => {
              const Icon = item.icon;
              /* Active check: also highlight sidebar when on /student/mentor/:id */
              const isActive =
                location.pathname.startsWith(item.path) ||
                (item.path === '/student/mentorship' && location.pathname.startsWith('/student/mentor'));
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

      {/* Main Workspace */}
      <div className={styles.mainContainer}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.headerSearchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search mentorships, alumni, or events..."
              className={styles.searchInput}
            />
          </div>

          <div className={styles.headerRight}>
            <button
              className={styles.bellBtn}
              title="Notifications"
              onClick={() => message.info('No new unread notifications')}
            >
              <FiBell />
              <span className={styles.bellBadge} />
            </button>

           <div
  className={styles.userInfoBox}
  onClick={() => navigate('/student/profile')}
>
  <div style={{ textAlign: 'right' }}>
    <div className={styles.userName}>
      {student?.name}
    </div>

    <div className={styles.userBadge}>
      STUDENT, YEAR {student?.yearOfStudy}
    </div>
  </div>

  <div className={styles.userAvatar}>
    {student?.name
      ?.split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()}
  </div>
</div>
          </div>
        </header>

        {/* Dynamic Main Content */}
        <main className={styles.contentContainer}>
          {children}
        </main>
      </div>
    </div>
  );
};
