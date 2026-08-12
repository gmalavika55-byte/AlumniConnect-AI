import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message, Modal } from 'antd';
import {
  FiGrid, FiUser, FiCalendar,
  FiUsers, FiBell, FiSettings, FiLogOut, FiSearch,
  FiSun, FiMoon
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { authService } from '../../services/authService';
import { useTranslation, useAppContext } from '../../context/AppContext';
import api from '../../services/api';
import styles from './StudentLayout.module.css';

export const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { theme, setTheme, searchQuery, setSearchQuery, mentors, events, studentNotifications, markNotificationAsRead, markAllNotificationsAsRead, refreshData } = useAppContext();
  const student = authService.getCurrentUser();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const searchContainerRef = useRef(null);
  const notifContainerRef = useRef(null);
  const unreadCount = (studentNotifications || []).filter(n => !n.read).length;

  // Clear search query whenever pathname changes
  useEffect(() => {
    setSearchQuery('');
    setShowDropdown(false);
  }, [location.pathname, setSearchQuery]);

  // Close search & notification dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notifContainerRef.current && !notifContainerRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    { labelKey: 'mentorships', path: '/student/mentorship', icon: FiUsers },
    { labelKey: 'settings',    path: '/student/settings',   icon: FiSettings }
  ];

  // ── Global Search Filters ──
  const query = searchQuery.trim().toLowerCase();
  const matchedMentors = query
    ? mentors.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.role.toLowerCase().includes(query) ||
        m.company.toLowerCase().includes(query) ||
        m.skills.some(s => s.toLowerCase().includes(query))
      )
    : [];

  const matchedEvents = query
    ? events.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query) ||
        e.venue.toLowerCase().includes(query)
      )
    : [];

  const hasMatches = matchedMentors.length > 0 || matchedEvents.length > 0;

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
          <div className={styles.headerSearchContainer} ref={searchContainerRef}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search mentorships, alumni, or events..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />

            {showDropdown && searchQuery.trim() !== '' && (
              <div className={styles.searchDropdown}>
                {hasMatches ? (
                  <>
                    {matchedMentors.length > 0 && (
                      <div className={styles.searchGroup}>
                        <div className={styles.searchGroupTitle}>Mentors</div>
                        {matchedMentors.map(m => (
                          <div
                            key={m.id}
                            className={styles.searchItem}
                            onClick={() => {
                              navigate('/student/mentorship');
                              setSearchQuery('');
                              setShowDropdown(false);
                            }}
                          >
                            <div className={styles.searchItemTitle}>{m.name}</div>
                            <div className={styles.searchItemSub}>{m.role} at {m.company}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {matchedEvents.length > 0 && (
                      <div className={styles.searchGroup}>
                        <div className={styles.searchGroupTitle}>Events</div>
                        {matchedEvents.map(e => (
                          <div
                            key={e.id}
                            className={styles.searchItem}
                            onClick={() => {
                              navigate('/student/events');
                              setSearchQuery('');
                              setShowDropdown(false);
                            }}
                          >
                            <div className={styles.searchItemTitle}>{e.title}</div>
                            <div className={styles.searchItemSub}>{e.category} • {e.venue}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.noResults}>No results found</div>
                )}
              </div>
            )}
          </div>

          <div className={styles.headerRight}>
            {/* Notification Bell Dropdown Container */}
            <div className={styles.notifContainer} ref={notifContainerRef}>
              <button
                className={styles.bellBtn}
                title="Notifications"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span className={styles.bellBadge} style={{ position: 'absolute', top: 2, right: 2, background: '#ef4444', color: '#fff', borderRadius: '50%', fontSize: 9, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className={styles.notifDropdown}>
                  <div className={styles.notifDropdownHeader}>
                    <h4>Notifications</h4>
                    {unreadCount > 0 && (
                      <span
                        className={styles.markAllLink}
                        onClick={async () => {
                          await markAllNotificationsAsRead(studentNotifications);
                          message.success('All notifications marked as read');
                        }}
                      >
                        Mark all read
                      </span>
                    )}
                  </div>
                  <div className={styles.notifList}>
                    {studentNotifications && studentNotifications.length > 0 ? (
                      studentNotifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`${styles.notifItem} ${notif.read ? styles.notifRead : styles.notifUnread}`}
                          onClick={async () => {
                            if (!notif.read) {
                              await markNotificationAsRead(notif.id);
                            }
                          }}
                        >
                          <div className={styles.notifItemHeader}>
                            <strong className={styles.notifTitle}>{notif.title}</strong>
                            {!notif.read && <span className={styles.newBadge}>New</span>}
                          </div>
                          <p className={styles.notifDesc}>{notif.desc}</p>
                          <span className={styles.notifTime}>{notif.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className={styles.notifEmpty}>No notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              className={styles.bellBtn}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
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
                {student?.name ? student.name.split(' ').map(n => n[0]).join('') : 'ST'}
              </div>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className={styles.contentContainer}>
          {children}
        </main>
      </div>
    </div>
  );
};
