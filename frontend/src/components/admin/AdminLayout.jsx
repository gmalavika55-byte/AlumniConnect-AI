import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message, Modal, Badge, Button, Empty, Tag } from 'antd';
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
  FiMoon,
  FiHeart,
  FiCheckCircle,
  FiInfo,
  FiBarChart2
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { authService } from '../../services/authService';
import { notificationService } from '../../services/notificationService';
import { useTranslation, useAppContext } from '../../context/AppContext';
import { handleNotificationNavigation } from '../../utils/notificationNavigation';
import styles from './AdminLayout.module.css';

export const AdminLayout = ({ children, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { theme, setTheme } = useAppContext();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const currentUser = authService.getCurrentUser();
  const adminName = currentUser?.name || 'Dr. Sarah Jenkins';
  const adminBadge = currentUser?.designation || currentUser?.role || 'System Administrator';

  const loadNotificationData = async () => {
    try {
      const count = await notificationService.getAdminUnreadCount();
      setUnreadCount(count);
    } catch (e) {
      console.error('Failed to fetch unread count:', e);
    }
  };

  const fetchFullNotifications = async () => {
    setLoadingNotifs(true);
    try {
      const data = await notificationService.getAdminNotifications();
      setNotifications(data || []);
      const count = await notificationService.getAdminUnreadCount();
      setUnreadCount(count);
    } catch (e) {
      console.error('Failed to fetch admin notifications:', e);
      message.error('Failed to load notifications');
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    loadNotificationData();
    const interval = setInterval(loadNotificationData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenNotifModal = () => {
    fetchFullNotifications();
    setIsNotifModalOpen(true);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === id ? { ...n, status: 'READ' } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      message.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'READ' })));
      setUnreadCount(0);
      message.success('All notifications marked as read');
    } catch (e) {
      message.error('Failed to mark all as read');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'SA';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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
    { labelKey: 'studentManagement', path: '/admin/students', icon: FiUsers },
    { labelKey: 'alumniManagement', path: '/admin/alumni', icon: FiUserCheck },
    { labelKey: 'mentorshipManagement', path: '/admin/mentorship', icon: FiUsers },
    { labelKey: 'eventManagement', path: '/admin/events', icon: FiCalendar },
    { labelKey: 'fundraisingManagement', path: '/admin/fundraising', icon: FiHeart },
    { labelKey: 'reportsAnalytics', path: '/admin/reports', icon: FiFileText },
    { labelKey: 'settingsRoles', path: '/admin/settings', icon: FiSettings }
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* 1. Fixed Left Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarLogoRow} onClick={() => navigate('/admin/dashboard')} style={{ cursor: 'pointer' }}>
            <FaGraduationCap className={styles.sidebarLogoIcon} />
            <span className={styles.sidebarLogoText}>AlumniConnect</span>
          </div>
          <span className={styles.sidebarSubtitle}>ADMINISTRATION NETWORK</span>

          <nav className={styles.sidebarNav}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/admin/reports' && location.pathname === '/admin/analytics') || (item.path !== '/admin/dashboard' && item.path !== '/admin/reports' && location.pathname.startsWith(item.path));
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
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                className={styles.bellBtn}
                title="System Notifications"
                onClick={handleOpenNotifModal}
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      borderRadius: '10px',
                      padding: '2px 5px',
                      minWidth: '16px',
                      textAlign: 'center',
                      lineHeight: 1
                    }}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            </div>

            <button
              className={styles.bellBtn}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>

            <div className={styles.userInfoBox} onClick={() => navigate('/admin/settings')} style={{ cursor: 'pointer' }}>
              <div style={{ textAlign: 'right' }}>
                <div className={styles.userName}>{adminName}</div>
                <div className={styles.userBadge}>{adminBadge}</div>
              </div>
              <div className={styles.userAvatar}>{getInitials(adminName)}</div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Container */}
        <main className={styles.contentContainer}>
          {children}
        </main>
      </div>

      {/* Real Backend Admin Notifications Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '24px' }}>
            <span style={{ fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiBell style={{ color: '#1677ff' }} /> Admin Notifications ({notifications.length})
            </span>
            {notifications.some((n) => n.status === 'UNREAD') && (
              <Button type="link" size="small" onClick={handleMarkAllAsRead} style={{ fontSize: '12px', padding: 0 }}>
                Mark all as read
              </Button>
            )}
          </div>
        }
        open={isNotifModalOpen}
        onCancel={() => setIsNotifModalOpen(false)}
        footer={null}
        width={540}
        loading={loadingNotifs}
      >
        <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <Empty description="No new notifications" />
            </div>
          ) : (
            notifications.map((item) => {
              const isUnread = item.status === 'UNREAD';
              return (
                <div
                  key={item.notificationId}
                  onClick={async () => {
                    setIsNotifModalOpen(false);
                    await handleNotificationNavigation(item, 'admin', navigate, handleMarkAsRead);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: isUnread ? (theme === 'dark' ? '#1e293b' : '#f0f7ff') : (theme === 'dark' ? '#0f172a' : '#ffffff'),
                    border: `1px solid ${isUnread ? '#bfdbfe' : (theme === 'dark' ? '#334155' : '#e2e8f0')}`,
                    marginBottom: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isUnread ? (
                        <Tag color="processing" style={{ margin: 0, fontSize: '11px' }}>UNREAD</Tag>
                      ) : (
                        <Tag color="default" style={{ margin: 0, fontSize: '11px' }}>READ</Tag>
                      )}
                      <strong style={{ fontSize: '14px', color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}>
                        {item.title}
                      </strong>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {formatDate(item.notificationDate)}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '13px', color: theme === 'dark' ? '#94a3b8' : '#475569', lineHeight: 1.4 }}>
                    {item.message}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </Modal>
    </div>
  );
};
