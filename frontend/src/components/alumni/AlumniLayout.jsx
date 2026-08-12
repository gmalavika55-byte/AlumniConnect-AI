import React, { useState, useEffect, useRef } from 'react';
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

// Helper: derive initials from a name string
const getInitials = (name) =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AL';

export const AlumniLayout = ({ children, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { theme, setTheme, searchQuery, setSearchQuery, alumniNotifications, setAlumniNotifications, alumniRequests, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();
  const alumni = authService.getCurrentUser();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifContainerRef = useRef(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  // Clear search query whenever pathname changes
  useEffect(() => {
    setSearchQuery('');
    setShowSearchDropdown(false);
  }, [location.pathname, setSearchQuery]);

  // Close notifications dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifContainerRef.current && !notifContainerRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleSearchClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleSearchClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleSearchClickOutside);
    };
  }, []);

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
    { labelKey: 'settings', path: '/alumni/settings', icon: FiSettings }
  ];

  const unreadCount = alumniNotifications.filter(n => !n.read).length;

  // ── Alumni Global Search Filters ──
  const query = (searchQuery || '').trim().toLowerCase();

  // Search mentorship students (from shared context)
  const matchedStudents = query
    ? alumniRequests.filter(r =>
        r.studentName.toLowerCase().includes(query) ||
        r.dept.toLowerCase().includes(query) ||
        r.topic.toLowerCase().includes(query) ||
        r.skills.some(s => s.toLowerCase().includes(query))
      )
    : [];

  // Search events — inline alumni event list (titles, categories, locations)
  const alumniEventList = [
    { id: 1, title: 'Global Alumni Meetup 2026',        category: 'Reunion & Keynote',   location: 'Grand Ballroom & Zoom' },
    { id: 2, title: 'Machine Learning & LLM Masterclass', category: 'Technical Workshop', location: 'CS Lab 3 & Meet' },
    { id: 3, title: 'Cloud Architecture & DevOps Webinar', category: 'Webinar',           location: 'Zoom Virtual Hall' }
  ];

  const matchedEvents = query
    ? alumniEventList.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query)
      )
    : [];

  const hasMatches = matchedStudents.length > 0 || matchedEvents.length > 0;

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
          <div className={styles.headerSearchContainer} ref={searchContainerRef}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search students, events, mentorships, fundraising..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
            />

            {showSearchDropdown && (searchQuery || '').trim() !== '' && (
              <div className={styles.searchDropdown}>
                {hasMatches ? (
                  <>
                    {matchedStudents.length > 0 && (
                      <div className={styles.searchGroup}>
                        <div className={styles.searchGroupTitle}>Mentorship Students</div>
                        {matchedStudents.map(r => (
                          <div
                            key={r.id}
                            className={styles.searchItem}
                            onClick={() => {
                              navigate('/alumni/mentorship');
                              setSearchQuery('');
                              setShowSearchDropdown(false);
                            }}
                          >
                            <div className={styles.searchItemTitle}>{r.studentName}</div>
                            <div className={styles.searchItemSub}>{r.dept} • {r.topic}</div>
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
                              navigate('/alumni/events');
                              setSearchQuery('');
                              setShowSearchDropdown(false);
                            }}
                          >
                            <div className={styles.searchItemTitle}>{e.title}</div>
                            <div className={styles.searchItemSub}>{e.category} • {e.location}</div>
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
                          await markAllNotificationsAsRead(alumniNotifications);
                          message.success('All notifications marked as read');
                        }}
                      >
                        Mark all read
                      </span>
                    )}
                  </div>
                  <div className={styles.notifList}>
                    {alumniNotifications.length > 0 ? (
                      alumniNotifications.map(notif => (
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

            <div className={styles.userInfoBox} onClick={() => navigate('/alumni/profile')}>
              <div style={{ textAlign: 'right' }}>
                <div className={styles.userName}>{alumni?.name || 'Alumni'}</div>
                <div className={styles.userBadge}>ALUMNI{alumni?.batch ? `, CLASS OF ${alumni.batch}` : ''}</div>
              </div>
              <div className={styles.userAvatar}>{getInitials(alumni?.name)}</div>
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
