import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import {
  FiGrid,
  FiUser,
  FiCalendar,
  FiBriefcase,
  FiUsers,
  FiBell,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiZap,
  FiBookOpen,
  FiArrowRight,
  FiExternalLink,
  FiStar,
  FiClock,
  FiMapPin
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { authService } from '../services/authService';
import styles from './StudentDashboard.module.css';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
const student = authService.getCurrentUser();
  const handleLogout = () => {
    authService.logout();
    message.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* 1. Fixed Left Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarLogoRow} onClick={() => navigate('/')}>
            <FaGraduationCap className={styles.sidebarLogoIcon} />
            <span className={styles.sidebarLogoText}>AlumniConnect</span>
          </div>
          <span className={styles.sidebarSubtitle}>INSTITUTIONAL NETWORK</span>

          <nav className={styles.sidebarNav}>
            <div
              className={`${styles.navItem} ${activeTab === 'Dashboard' ? styles.activeNavItem : ''}`}
              onClick={() => navigate('/student/dashboard')}
            >
              <FiGrid size={18} />
              <span className={styles.navItemText}>Dashboard</span>
            </div>

            <div
              className={`${styles.navItem} ${activeTab === 'My Profile' ? styles.activeNavItem : ''}`}
              onClick={() => navigate('/student/profile')}
            >
              <FiUser size={18} />
              <span className={styles.navItemText}>My Profile</span>
            </div>

            <div
              className={`${styles.navItem} ${activeTab === 'Events' ? styles.activeNavItem : ''}`}
              onClick={() => navigate('/student/events')}
            >
              <FiCalendar size={18} />
              <span className={styles.navItemText}>Events</span>
            </div>

            <div
              className={`${styles.navItem} ${activeTab === 'Career' ? styles.activeNavItem : ''}`}
              onClick={() => navigate('/student/career')}
            >
              <FiBriefcase size={18} />
              <span className={styles.navItemText}>Career</span>
            </div>

            <div
              className={`${styles.navItem} ${activeTab === 'Mentorships' ? styles.activeNavItem : ''}`}
              onClick={() => navigate('/student/mentorship')}
            >
              <FiUsers size={18} />
              <span className={styles.navItemText}>Mentorships</span>
            </div>

            <div
              className={`${styles.navItem} ${activeTab === 'Settings' ? styles.activeNavItem : ''}`}
              onClick={() => navigate('/student/settings')}
            >
              <FiSettings size={18} />
              <span className={styles.navItemText}>Settings</span>
            </div>
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut size={18} />
            <span className={styles.navItemText}>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Workspace (Header + Content) */}
      <div className={styles.mainContainer}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.headerSearchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Hinted search text"
              className={styles.searchInput}
            />
          </div>

          <div className={styles.headerRight}>
            <button className={styles.bellBtn} title="Notifications">
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

        {/* Main Content */}
        <main className={styles.contentContainer}>
          {/* Welcome Bar */}
          <div className={styles.welcomeBar}>
            <div>
              <h1 className={styles.welcomeTitle}>
    Welcome {student?.name} 👋
</h1>
              <p className={styles.welcomeSubtitle}>
                Here's a summary of your alumni network activity today.
              </p>
            </div>

            <div className={styles.welcomeActions}>
              <button
                className={styles.updateProfileBtn}
                onClick={() => message.info('Update profile dialog opened')}
              >
                <FiUser size={15} />
                Update Profile
              </button>
              <button
                className={styles.findMentorBtn}
                onClick={() => message.info('Find a Mentor search triggered')}
              >
                <FiSearch size={15} />
                Find a Mentor
              </button>
            </div>
          </div>

          {/* 3 Top Statistics Cards */}
          <div className={styles.statsRow}>
            {/* Card 1 */}
            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.purpleIconBg}`}>
                <FiZap />
              </div>
              <div className={styles.statNumber}>12</div>
              <div className={styles.statTitle}>Recommended Mentors</div>
              <div className={styles.statSubtext}>AI-matched to your profile</div>
            </div>

            {/* Card 2 */}
            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.orangeIconBg}`}>
                <FiBookOpen />
              </div>
              <div className={styles.statNumber}>3</div>
              <div className={styles.statTitle}>Mentorship Requests</div>
              <div className={styles.statSubtext}>2 pending • 1 accepted</div>
            </div>

            {/* Card 3 */}
            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.greenIconBg}`}>
                <FiCalendar />
              </div>
              <div className={styles.statNumber}>2</div>
              <div className={styles.statTitle}>Registered Events</div>
              <div className={styles.statSubtext}>Next on Aug 18, 2026</div>
            </div>
          </div>

          {/* 2-Column Main Dashboard Grid */}
          <div className={styles.dashboardGrid}>
            {/* LEFT COLUMN */}
            <div>
              {/* AI Mentor Recommendations Panel */}
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <h3 className={styles.panelTitle}>AI Mentor Recommendations</h3>
                    <div className={styles.panelSubtitleRow}>
                      <span className={styles.blueDot} />
                      <span>Matched based on your skills, department, and career interests</span>
                    </div>
                  </div>
                  <a
                    href="#mentor-matching"
                    onClick={(e) => {
                      e.preventDefault();
                      message.info('Opening AI Mentor Matching');
                    }}
                    className={styles.headerActionLink}
                  >
                    Open AI Mentor Matching <FiArrowRight size={14} />
                  </a>
                </div>

                {/* Mentor 1 */}
                <div className={styles.mentorItem}>
                  <div className={styles.mentorItemLeft}>
                    <div className={styles.mentorAvatar}>PS</div>
                    <div>
                      <div className={styles.mentorNameRow}>
                        <h4 className={styles.mentorName}>Priya Sankar</h4>
                        <span className={styles.matchTag}>98% match</span>
                      </div>
                      <div className={styles.mentorRoleCompany}>
                        Software Engineer • <strong>Google India</strong>
                      </div>
                      <div className={styles.mentorTagsRow}>
                        <span className={styles.skillTag}>React</span>
                        <span className={styles.skillTag}>System Design</span>
                        <span className={styles.skillTag}>Cloud</span>
                        <span className={styles.skillTag}>Bangalore</span>
                      </div>
                      <div className={styles.mentorMetaRow}>
                        <span>Batch 2015</span>
                        <span className={styles.starRating}>★ 4.9</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className={styles.requestBtn}
                    onClick={() => message.success('Mentorship request sent to Priya Sankar')}
                  >
                    Request
                  </button>
                </div>

                {/* Mentor 2 */}
                <div className={styles.mentorItem}>
                  <div className={styles.mentorItemLeft}>
                    <div className={styles.mentorAvatar}>AK</div>
                    <div>
                      <div className={styles.mentorNameRow}>
                        <h4 className={styles.mentorName}>Arun Kumar</h4>
                        <span className={styles.matchTag}>92% match</span>
                      </div>
                      <div className={styles.mentorRoleCompany}>
                        Arun Kumar • <strong>Amazon</strong>
                      </div>
                      <div className={styles.mentorTagsRow}>
                        <span className={styles.skillTag}>Python</span>
                        <span className={styles.skillTag}>Deep Learning</span>
                        <span className={styles.skillTag}>NLP</span>
                        <span className={styles.skillTag}>Chennai</span>
                      </div>
                      <div className={styles.mentorMetaRow}>
                        <span>Batch 2017</span>
                        <span className={styles.starRating}>★ 4.5</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className={styles.requestBtn}
                    onClick={() => message.success('Mentorship request sent to Arun Kumar')}
                  >
                    Request
                  </button>
                </div>

                {/* Mentor 3 */}
                <div className={styles.mentorItem}>
                  <div className={styles.mentorItemLeft}>
                    <div className={styles.mentorAvatar}>DR</div>
                    <div>
                      <div className={styles.mentorNameRow}>
                        <h4 className={styles.mentorName}>Divya Rajan</h4>
                        <span className={styles.matchTag}>87% match</span>
                      </div>
                      <div className={styles.mentorRoleCompany}>
                        Divya Rajan • <strong>Flipkart</strong>
                      </div>
                      <div className={styles.mentorTagsRow}>
                        <span className={styles.skillTag}>Product</span>
                        <span className={styles.skillTag}>Analytics</span>
                        <span className={styles.skillTag}>Agile</span>
                        <span className={styles.skillTag}>Hyderabad</span>
                      </div>
                      <div className={styles.mentorMetaRow}>
                        <span>Batch 2018</span>
                        <span className={styles.starRating}>★ 4.7</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className={styles.requestBtn}
                    onClick={() => message.success('Mentorship request sent to Divya Rajan')}
                  >
                    Request
                  </button>
                </div>
              </div>

              {/* Upcoming Events Panel */}
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <h3 className={styles.panelTitle}>Upcoming Events</h3>
                  <a
                    href="#all-events"
                    onClick={(e) => {
                      e.preventDefault();
                      message.info('View all events');
                    }}
                    className={styles.headerActionLink}
                  >
                    View all ›
                  </a>
                </div>

                {/* Event 1 */}
                <div className={styles.eventItem}>
                  <div className={styles.eventLeft}>
                    <div className={styles.dateBadgeBox}>
                      <span className={styles.dateNumber}>10</span>
                      <span className={styles.dateMonth}>AUG</span>
                    </div>
                    <div>
                      <div className={styles.eventTitleRow}>
                        <h4 className={styles.eventTitle}>Tech Careers Panel 2026</h4>
                        <span className={styles.categoryTag}>Career</span>
                      </div>
                      <div className={styles.eventMeta}>
                        <span><FiClock style={{ marginRight: 4 }} /> 10:00 AM</span>
                        <span><FiMapPin style={{ marginRight: 4 }} /> Main Auditorium, KCE</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className={styles.requestBtn}
                    onClick={() => message.success('RSVP confirmed for Tech Careers Panel 2026')}
                  >
                    Register
                  </button>
                </div>

                {/* Event 2 */}
                <div className={styles.eventItem}>
                  <div className={styles.eventLeft}>
                    <div className={styles.dateBadgeBox}>
                      <span className={styles.dateNumber}>18</span>
                      <span className={styles.dateMonth}>AUG</span>
                    </div>
                    <div>
                      <div className={styles.eventTitleRow}>
                        <h4 className={styles.eventTitle}>Alumni Networking Night</h4>
                        <span className={styles.greenTag}>Networking</span>
                        <span className={styles.greenTag}>Registered</span>
                      </div>
                      <div className={styles.eventMeta}>
                        <span><FiClock style={{ marginRight: 4 }} /> 5:30 PM</span>
                        <span><FiMapPin style={{ marginRight: 4 }} /> Campus Grounds</span>
                      </div>
                    </div>
                  </div>
                  <button className={`${styles.requestBtn} ${styles.disabledBtn}`} disabled>
                    Registered
                  </button>
                </div>

                {/* Event 3 */}
                <div className={styles.eventItem}>
                  <div className={styles.eventLeft}>
                    <div className={styles.dateBadgeBox}>
                      <span className={styles.dateNumber}>25</span>
                      <span className={styles.dateMonth}>AUG</span>
                    </div>
                    <div>
                      <div className={styles.eventTitleRow}>
                        <h4 className={styles.eventTitle}>Build for India Hackathon</h4>
                        <span className={styles.orangeTag}>Hackathon</span>
                      </div>
                      <div className={styles.eventMeta}>
                        <span><FiClock style={{ marginRight: 4 }} /> 9:00 AM</span>
                        <span><FiMapPin style={{ marginRight: 4 }} /> Innovation Lab, Block C</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className={styles.requestBtn}
                    onClick={() => message.success('Registration confirmed for Build for India Hackathon')}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              {/* Career Matches Panel */}
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <h3 className={styles.panelTitle}>Career Matches</h3>
                  <a
                    href="#all-jobs"
                    onClick={(e) => {
                      e.preventDefault();
                      message.info('View all career matches');
                    }}
                    className={styles.headerActionLink}
                  >
                    View all ›
                  </a>
                </div>

                {/* Job 1 */}
                <div className={styles.jobItem}>
                  <div className={styles.jobItemTop}>
                    <div className={styles.jobIconBadge}>
                      <FiBriefcase />
                    </div>
                    <span className={styles.jobMatchScore}>94% MATCH</span>
                  </div>
                  <h4 className={styles.jobTitle}>Software Developer</h4>
                  <div className={styles.jobCompany}>TCS Digital</div>
                  <span className={styles.jobTypePill}>Full-time</span>
                </div>

                {/* Job 2 */}
                <div className={styles.jobItem}>
                  <div className={styles.jobItemTop}>
                    <div className={styles.jobIconBadge}>
                      <FiBriefcase />
                    </div>
                    <span className={styles.jobMatchScore}>88% MATCH</span>
                  </div>
                  <h4 className={styles.jobTitle}>ML Intern</h4>
                  <div className={styles.jobCompany}>Zoho Corp</div>
                  <span className={`${styles.jobTypePill} ${styles.jobTypeOrange}`}>Internship</span>
                </div>

                {/* Job 3 */}
                <div className={styles.jobItem}>
                  <div className={styles.jobItemTop}>
                    <div className={styles.jobIconBadge}>
                      <FiBriefcase />
                    </div>
                    <span className={styles.jobMatchScore}>82% MATCH</span>
                  </div>
                  <h4 className={styles.jobTitle}>Backend Engineer</h4>
                  <div className={styles.jobCompany}>Freshworks</div>
                  <span className={styles.jobTypePill}>Full-time</span>
                </div>

                <button
                  className={styles.browseJobsBtn}
                  onClick={() => message.info('Opening job board...')}
                >
                  Browse all jobs <FiExternalLink size={14} />
                </button>
              </div>

              {/* Notifications Panel */}
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <h3 className={styles.panelTitle}>Notifications</h3>
                  <span className={styles.notifBadge}>2 new</span>
                </div>

                <div className={styles.notifItem}>
                  <div className={styles.notifTextRow}>
                    <span className={styles.notifBullet} />
                    <span><strong>Priya Shankar</strong> accepted your mentorship request.</span>
                  </div>
                  <div className={styles.notifTime}>2h ago</div>
                </div>

                <div className={styles.notifItem}>
                  <div className={styles.notifTextRow}>
                    <span className={styles.notifBullet} />
                    <span><strong>Tech Careers Panel 2025</strong> is now open for registration.</span>
                  </div>
                  <div className={styles.notifTime}>5h ago</div>
                </div>

                <div className={styles.notifItem}>
                  <div className={styles.notifTextRow}>
                    <span className={styles.notifBullet} style={{ backgroundColor: 'transparent' }} />
                    <span>Your AI mentor match score has been updated to 96%.</span>
                  </div>
                  <div className={styles.notifTime}>Yesterday</div>
                </div>

                <div className={styles.notifItem}>
                  <div className={styles.notifTextRow}>
                    <span className={styles.notifBullet} style={{ backgroundColor: 'transparent' }} />
                    <span><strong>Arun Kumar</strong> shared a new career resource with you.</span>
                  </div>
                  <div className={styles.notifTime}>2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
