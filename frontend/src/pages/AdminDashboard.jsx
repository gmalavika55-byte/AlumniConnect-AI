import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Modal } from 'antd';
import {
  FiUsers,
  FiUserCheck,
  FiUserPlus,
  FiCalendar,
  FiFileText,
  FiZap,
  FiHeart,
  FiBriefcase,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertTriangle,
  FiCpu,
  FiDownloadCloud,
  FiActivity,
  FiDownload,
  FiPlus,
  FiLogOut
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
  const [notifModalData, setNotifModalData] = useState(null);

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
          <button className={styles.newEntryBtn} onClick={() => setIsAddStudentOpen(true)}>
            <FiPlus size={16} />
            Add Student
          </button>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className={styles.quickActionsRow}>
        <div className={styles.quickActionCard} onClick={() => setIsAddStudentOpen(true)}>
          <div className={styles.quickActionIconWrapper}>
            <FiUserPlus />
          </div>
          <span className={styles.quickActionLabel}>Add Student</span>
        </div>

        <div className={styles.quickActionCard} onClick={() => navigate('/admin/alumni')}>
          <div className={styles.quickActionIconWrapper}>
            <FiUserCheck />
          </div>
          <span className={styles.quickActionLabel}>Verify Alumni</span>
        </div>

        <div className={styles.quickActionCard} onClick={() => setIsCreateEventOpen(true)}>
          <div className={styles.quickActionIconWrapper}>
            <FiCalendar />
          </div>
          <span className={styles.quickActionLabel}>Create Event</span>
        </div>

        <div className={styles.quickActionCard} onClick={() => navigate('/admin/reports')}>
          <div className={styles.quickActionIconWrapper}>
            <FiFileText />
          </div>
          <span className={styles.quickActionLabel}>View Reports</span>
        </div>

        <div className={styles.quickActionCard} onClick={handleExportData}>
          <div className={styles.quickActionIconWrapper}>
            <FiDownload />
          </div>
          <span className={styles.quickActionLabel}>Export Data</span>
        </div>

        <div className={styles.quickActionCard} onClick={handleLogout}>
          <div className={styles.quickActionIconWrapper} style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
            <FiLogOut />
          </div>
          <span className={styles.quickActionLabel}>Logout</span>
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
            style={{ marginTop: 10, width: '100%', padding: '6px 12px', fontSize: 12, borderRadius: 6, border: '1px solid #1b62d4', backgroundColor: '#e0edff', color: '#1b62d4', fontWeight: 600, cursor: 'pointer' }}
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

      {/* 2-Column Main Dashboard Content */}
      <div className={styles.dashboardGrid}>
        {/* LEFT COLUMN */}
        <div>
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

          {/* Placement Overview Section */}
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Placement Overview</h3>
              <span className={styles.placementTag}>Status: IN PROGRESS</span>
            </div>

            <div className={styles.placementSummaryGrid}>
              <div>
                <div className={styles.summaryVal}>124</div>
                <div className={styles.summaryLabel}>Companies Visiting</div>
                <div className={styles.summarySub}>Target: 150+ Drives</div>
              </div>
              <div>
                <div className={styles.summaryVal}>856</div>
                <div className={styles.summaryLabel}>Students Placed</div>
                <div className={styles.summarySubTarget}>Target: 1200</div>
              </div>
              <div>
                <div className={styles.summaryVal}>42</div>
                <div className={styles.summaryLabel}>Students Hired</div>
                <div className={styles.summarySubTarget}>Upcoming: Google Cloud</div>
              </div>
            </div>

            <div style={{ overflowX: 'auto', marginTop: 16 }}>
              <table className={styles.companiesTable}>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role / Domain</th>
                    <th>Students Hired</th>
                    <th>Avg Package</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.companyName}>Amazon AWS</td>
                    <td className={styles.companyDomain}>Software Development</td>
                    <td>42</td>
                    <td>₹112,000</td>
                  </tr>
                  <tr>
                    <td className={styles.companyName}>Wipro Digital</td>
                    <td className={styles.companyDomain}>Cloud Applications</td>
                    <td>15</td>
                    <td>₹135,000</td>
                  </tr>
                  <tr>
                    <td className={styles.companyName}>Infosys Systems</td>
                    <td className={styles.companyDomain}>Cybersecurity & IT</td>
                    <td>28</td>
                    <td>₹128,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent System Activities Section */}
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Recent System Activities</h3>
              <button className={styles.logBtn} onClick={handleExportData}>
                Download Activity Log
              </button>
            </div>

            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityLeft}>
                  <div className={`${styles.activityIconBox} ${styles.activityGreenBg}`}>
                    <FiUserCheck />
                  </div>
                  <div className={styles.activityTextCol}>
                    <span className={styles.activityDesc}>
                      <strong>Marco Rossi (Alumni '18)</strong> registered for Alumni-Student Mentorship Program.
                    </span>
                    <span className={`${styles.activityPill} ${styles.pillGreen}`}>VERIFIED</span>
                  </div>
                </div>
                <span className={styles.activityTime}>2 mins ago</span>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityLeft}>
                  <div className={`${styles.activityIconBox} ${styles.activityBlueBg}`}>
                    <FiCpu />
                  </div>
                  <div className={styles.activityTextCol}>
                    <span className={styles.activityDesc}>
                      System automatically verified 14 new student profiles from ERP sync.
                    </span>
                    <span className={`${styles.activityPill} ${styles.pillBlue}`}>AUTO-SYNC</span>
                  </div>
                </div>
                <span className={styles.activityTime}>45 mins ago</span>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityLeft}>
                  <div className={`${styles.activityIconBox} ${styles.activityOrangeBg}`}>
                    <FiCalendar />
                  </div>
                  <div className={styles.activityTextCol}>
                    <span className={styles.activityDesc}>
                      Admin Panel published new global event: <strong>"Global Alumni Meetup 2024"</strong>.
                    </span>
                    <span className={`${styles.activityPill} ${styles.pillOrange}`}>ANNOUNCED</span>
                  </div>
                </div>
                <span className={styles.activityTime}>2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Urgent Notifications Panel */}
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Urgent Notifications</h3>
              <span className={styles.notifBadge}>3 New</span>
            </div>

            {/* Notification 1 */}
            <div
              className={styles.urgentNotifCard}
              style={{ cursor: 'pointer' }}
              onClick={() => setNotifModalData({
                title: 'Security Alert',
                desc: 'Multiple failed login attempts detected from IP address 192.168.1.45. Automated firewall rules have temporarily rate-limited suspicious requests.',
                action: 'IP Address 192.168.1.45 has been flagged for audit.'
              })}
            >
              <div className={styles.urgentHeader}>
                <FiAlertTriangle className={styles.redAlertIcon} /> Security Alert
              </div>
              <p className={styles.urgentDesc}>
                Multiple failed login attempts from IP 192.168.1.45
              </p>
              <span className={styles.redActionPill}>IMMEDIATE ACTION REQUIRED</span>
            </div>

            {/* Notification 2 */}
            <div
              className={styles.urgentNotifCard}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/admin/alumni')}
            >
              <div className={styles.urgentHeader}>
                <FiUserCheck className={styles.blueAlertIcon} /> Alumni Verification
              </div>
              <p className={styles.urgentDesc}>
                24 pending graduation certificate verifications
              </p>
              <button
                className={styles.actionLink}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/admin/alumni');
                }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Review All →
              </button>
            </div>

            {/* Notification 3 */}
            <div
              className={styles.urgentNotifCard}
              style={{ cursor: 'pointer' }}
              onClick={() => setNotifModalData({
                title: 'Report Generated',
                desc: 'Monthly Employment Rate & Placement Insight report for Class of 2026 is generated and ready.',
                action: 'Downloading full report...'
              })}
            >
              <div className={styles.urgentHeader}>
                <FiDownloadCloud className={styles.orangeAlertIcon} /> Report Generated
              </div>
              <p className={styles.urgentDesc}>
                Monthly Employment Rate & Placement Insight report ready
              </p>
              <button
                className={styles.actionLink}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExportData();
                }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Download PDF ↓
              </button>
            </div>
          </div>

          {/* Admin Insights */}
          <div className={styles.panelCard}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Admin Insights</h3>
            </div>

            <div className={styles.insightItem}>
              <div className={styles.insightIconBox}>
                <FiActivity />
              </div>
              <div>
                <div className={styles.insightLabel}>Most Active Department</div>
                <div className={styles.insightVal}>Career Services Office</div>
              </div>
            </div>

            <div className={styles.insightItem}>
              <div className={styles.insightIconBox}>
                <FiTrendingUp />
              </div>
              <div>
                <div className={styles.insightLabel}>Network Growth</div>
                <div className={styles.insightVal}>+245 Connections/day</div>
              </div>
            </div>
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

      {/* Notification Detail Modal */}
      <Modal
        title={notifModalData?.title || 'Notification Details'}
        open={!!notifModalData}
        onCancel={() => setNotifModalData(null)}
        footer={null}
      >
        <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>{notifModalData?.desc}</p>
        <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f1f5f9', borderRadius: 8, fontSize: 13, color: '#0f1e36' }}>
          <strong>System Action:</strong> {notifModalData?.action}
        </div>
      </Modal>
    </AdminLayout>
  );
};
