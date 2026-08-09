import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import {
  FiUsers,
  FiCalendar,
  FiZap,
  FiHeart,
  FiBriefcase,
  FiTrendingUp,
  FiTrendingDown,
  FiDownload
} from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AddStudentModal } from '../components/admin/AddStudentModal';
import { CreateEventModal } from '../components/admin/CreateEventModal';
import { downloadCsv } from '../utils/exportCsv';
import { authService } from '../services/authService';
import styles from './AdminDashboard.module.css';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  // Export system data helper
  const handleExportData = () => {
    const headers = ['Category', 'Total Count', 'Growth Rate', 'Status'];
    const rows = [
      ['Students', '8432', '+12%', 'Active'],
      ['Alumni', '24109', '+5%', 'Verified'],
      ['Mentorships', '1245', '+18%', 'Active'],
      ['Events', '48', '-2%', 'Published'],
      ['Donations', '3000000', '+24%', 'Received'],
      ['Placement Rate', '94.2%', '+4%', 'Target Met']
    ];
    downloadCsv('AlumniConnect_System_Report.csv', rows, headers);
    message.success('System report CSV exported successfully!');
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

  return (
    <AdminLayout>
      {/* Welcome Banner */}
      <div className={styles.welcomeBar}>
        <div>
          <h1 className={styles.welcomeTitle}>Admin Dashboard</h1>
          <p className={styles.welcomeSubtitle}>
            Monitor students, alumni, mentorships, events, placements, and system activities from one centralized dashboard.
          </p>
        </div>

        <div className={styles.welcomeActions}>
          <button className={styles.exportBtn} onClick={handleExportData}>
            <FiDownload size={15} />
            Export Data
          </button>
        </div>
      </div>

      {/* 6 Statistics Cards */}
      <div className={styles.statsRow}>
        {/* 1. Total Students */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIconBadge} ${styles.blueIconBg}`}>
              <FiUsers />
            </div>
            <span className={styles.trendPill}>
              <FiTrendingUp style={{ marginRight: 2 }} /> +12%
            </span>
          </div>
          <div className={styles.statLabel}>TOTAL STUDENTS</div>
          <div className={styles.statValue}>8,432</div>
          <button
            className={styles.cardActionBtn}
            onClick={() => setIsAddStudentOpen(true)}
            style={{ marginTop: 10, width: '100%', padding: '6px 12px', fontSize: 12, borderRadius: 6, border: '1px solid #1b62d4', backgroundColor: '#e0edff', color: 'var(--ac-brand)', fontWeight: 600, cursor: 'pointer' }}
          >
            + Add Student
          </button>
        </div>

        {/* 2. Total Alumni */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIconBadge} ${styles.purpleIconBg}`}>
              <FiUsers />
            </div>
            <span className={styles.trendPill}>
              <FiTrendingUp style={{ marginRight: 2 }} /> +5%
            </span>
          </div>
          <div className={styles.statLabel}>TOTAL ALUMNI</div>
          <div className={styles.statValue}>24,109</div>
          <button
            className={styles.cardActionBtn}
            onClick={() => navigate('/admin/alumni')}
            style={{ marginTop: 10, width: '100%', padding: '6px 12px', fontSize: 12, borderRadius: 6, border: '1px solid #8b5cf6', backgroundColor: '#f3e8ff', color: '#7c3aed', fontWeight: 600, cursor: 'pointer' }}
          >
            Verify Alumni
          </button>
        </div>

        {/* 3. Mentorships */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIconBadge} ${styles.blueIconBg}`}>
              <FiZap />
            </div>
            <span className={styles.trendPill}>
              <FiTrendingUp style={{ marginRight: 2 }} /> +18%
            </span>
          </div>
          <div className={styles.statLabel}>MENTORSHIPS</div>
          <div className={styles.statValue}>1,245</div>
          <button
            className={styles.cardActionBtn}
            onClick={() => setIsCreateEventOpen(true)}
            style={{ marginTop: 10, width: '100%', padding: '6px 12px', fontSize: 12, borderRadius: 6, border: '1px solid #0284c7', backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: 600, cursor: 'pointer' }}
          >
            Create Event
          </button>
        </div>

        {/* 4. Total Events */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIconBadge} ${styles.orangeIconBg}`}>
              <FiCalendar />
            </div>
            <span className={`${styles.trendPill} ${styles.trendDownPill}`}>
              <FiTrendingDown style={{ marginRight: 2 }} /> -2%
            </span>
          </div>
          <div className={styles.statLabel}>TOTAL EVENTS</div>
          <div className={styles.statValue}>48</div>
          <button
            className={styles.cardActionBtn}
            onClick={() => navigate('/admin/reports')}
            style={{ marginTop: 10, width: '100%', padding: '6px 12px', fontSize: 12, borderRadius: 6, border: '1px solid #d97706', backgroundColor: '#fef3c7', color: '#b45309', fontWeight: 600, cursor: 'pointer' }}
          >
            View Reports
          </button>
        </div>

        {/* 5. Donations */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIconBadge} ${styles.pinkIconBg}`}>
              <FiHeart />
            </div>
            <span className={styles.trendPill}>
              <FiTrendingUp style={{ marginRight: 2 }} /> +24%
            </span>
          </div>
          <div className={styles.statLabel}>DONATIONS</div>
          <div className={styles.statValue}>₹3M</div>
          <button
            className={styles.cardActionBtn}
            onClick={handleExportData}
            style={{ marginTop: 10, width: '100%', padding: '6px 12px', fontSize: 12, borderRadius: 6, border: '1px solid #db2777', backgroundColor: '#fce7f3', color: '#be185d', fontWeight: 600, cursor: 'pointer' }}
          >
            Export Data
          </button>
        </div>

        {/* 6. Placement Rate */}
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statIconBadge} ${styles.greenIconBg}`}>
              <FiBriefcase />
            </div>
            <span className={styles.trendPill}>
              <FiTrendingUp style={{ marginRight: 2 }} /> +4%
            </span>
          </div>
          <div className={styles.statLabel}>PLACEMENT RATE</div>
          <div className={styles.statValue}>94.2%</div>
          <button
            className={styles.cardActionBtn}
            onClick={() => navigate('/admin/reports')}
            style={{ marginTop: 10, width: '100%', padding: '6px 12px', fontSize: 12, borderRadius: 6, border: '1px solid #16a34a', backgroundColor: '#dcfce7', color: '#15803d', fontWeight: 600, cursor: 'pointer' }}
          >
            Placement Insights
          </button>
        </div>
      </div>

      {/* Student Demographics & Alumni Distribution Row */}
      <div className={styles.innerStatsGrid}>
        {/* Student Demographics */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>
              <FiTrendingUp className={styles.panelHeaderIcon} /> Student Demographics
            </h3>
          </div>

          <div className={styles.demoList}>
            {[
              { dept: 'CSE', pct: '28%' },
              { dept: 'IT', pct: '20%' },
              { dept: 'ECE', pct: '18%' },
              { dept: 'EEE', pct: '14%' },
              { dept: 'Mechanical', pct: '12%' },
              { dept: 'Civil', pct: '8%' }
            ].map((item) => (
              <div key={item.dept} className={styles.demoRow}>
                <div className={styles.demoLabelRow}>
                  <span>{item.dept}</span>
                  <span>{item.pct}</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: item.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alumni Distribution */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>
              <FiUsers className={styles.panelHeaderIcon} /> Alumni Distribution
            </h3>
          </div>

          <div className={styles.distList}>
            {[
              { label: 'IT Companies', val: '3250' },
              { label: 'Core Companies', val: '1420' },
              { label: 'Higher Studies', val: '860' },
              { label: 'Entrepreneurs', val: '310' },
              { label: 'Government Jobs', val: '190' },
              { label: 'Overseas Alumni', val: '540' }
            ].map((item) => (
              <div key={item.label} className={styles.distRow}>
                <span className={styles.distLabel}>
                  <span className={styles.bullet} /> {item.label}
                </span>
                <span className={styles.distValue}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        visible={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={(newStudent) => {
          message.success(`Student ${newStudent.fullName} added!`);
        }}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        visible={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onAddEvent={(newEvent) => {
          message.success(`Event ${newEvent.title} created!`);
        }}
      />
    </AdminLayout>
  );
};
