import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import {
  FiUser,
  FiSearch,
  FiZap,
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiArrowRight,
  FiBriefcase,
  FiExternalLink
} from 'react-icons/fi';
import { authService } from '../services/authService';
import { StudentLayout } from '../components/student/StudentLayout';
import styles from './StudentDashboard.module.css';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const student = authService.getCurrentUser();

  // Local state for interactive mentorship requests and event registrations
  const [requestedMentors, setRequestedMentors] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([2]); // Event 2 is registered by default

  const handleRequestMentorship = (mentorName) => {
    if (requestedMentors.includes(mentorName)) return;
    setRequestedMentors([...requestedMentors, mentorName]);
    message.success(`Mentorship request sent to ${mentorName}`);
  };

  const handleRegisterEvent = (eventId, eventTitle) => {
    if (registeredEvents.includes(eventId)) return;
    setRegisteredEvents([...registeredEvents, eventId]);
    message.success(`RSVP confirmed for ${eventTitle}`);
  };

  return (
    <StudentLayout>
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
            onClick={() => navigate('/student/profile')}
          >
            <FiUser size={15} />
            Update Profile
          </button>
          <button
            className={styles.findMentorBtn}
            onClick={() => navigate('/student/mentorship')}
          >
            <FiSearch size={15} />
            Find a Mentor
          </button>
        </div>
      </div>

      {/* 3 Top Statistics Cards */}
      <div className={styles.statsRow}>
        {/* Card 1 */}
        <div className={styles.statCard} onClick={() => navigate('/student/mentorship')} style={{ cursor: 'pointer' }}>
          <div className={`${styles.statIconWrapper} ${styles.purpleIconBg}`}>
            <FiZap />
          </div>
          <div className={styles.statNumber}>12</div>
          <h4 className={styles.statTitle}>Recommended Mentors</h4>
          <div className={styles.statSubtext}>AI-matched to your profile</div>
        </div>

        {/* Card 2 */}
        <div className={styles.statCard} onClick={() => navigate('/student/mentorship')} style={{ cursor: 'pointer' }}>
          <div className={`${styles.statIconWrapper} ${styles.orangeIconBg}`}>
            <FiBookOpen />
          </div>
          <div className={styles.statNumber}>3</div>
          <h4 className={styles.statTitle}>Mentorship Requests</h4>
          <div className={styles.statSubtext}>2 pending • 1 accepted</div>
        </div>

        {/* Card 3 */}
        <div className={styles.statCard} onClick={() => navigate('/student/events')} style={{ cursor: 'pointer' }}>
          <div className={`${styles.statIconWrapper} ${styles.greenIconBg}`}>
            <FiCalendar />
          </div>
          <div className={styles.statNumber}>2</div>
          <h4 className={styles.statTitle}>Registered Events</h4>
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
                  navigate('/student/mentorship');
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
                className={`${styles.requestBtn} ${requestedMentors.includes('Priya Sankar') ? styles.disabledBtn : ''}`}
                disabled={requestedMentors.includes('Priya Sankar')}
                onClick={() => handleRequestMentorship('Priya Sankar')}
              >
                {requestedMentors.includes('Priya Sankar') ? 'Pending' : 'Request'}
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
                    Software Architect • <strong>Amazon</strong>
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
                className={`${styles.requestBtn} ${requestedMentors.includes('Arun Kumar') ? styles.disabledBtn : ''}`}
                disabled={requestedMentors.includes('Arun Kumar')}
                onClick={() => handleRequestMentorship('Arun Kumar')}
              >
                {requestedMentors.includes('Arun Kumar') ? 'Pending' : 'Request'}
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
                    Product Manager • <strong>Flipkart</strong>
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
                className={`${styles.requestBtn} ${requestedMentors.includes('Divya Rajan') ? styles.disabledBtn : ''}`}
                disabled={requestedMentors.includes('Divya Rajan')}
                onClick={() => handleRequestMentorship('Divya Rajan')}
              >
                {requestedMentors.includes('Divya Rajan') ? 'Pending' : 'Request'}
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
                  navigate('/student/events');
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
                className={`${styles.requestBtn} ${registeredEvents.includes(1) ? styles.disabledBtn : ''}`}
                disabled={registeredEvents.includes(1)}
                onClick={() => handleRegisterEvent(1, 'Tech Careers Panel 2026')}
              >
                {registeredEvents.includes(1) ? 'Registered' : 'Register'}
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
              <button
                className={`${styles.requestBtn} ${registeredEvents.includes(2) ? styles.disabledBtn : ''}`}
                disabled={registeredEvents.includes(2)}
                onClick={() => handleRegisterEvent(2, 'Alumni Networking Night')}
              >
                {registeredEvents.includes(2) ? 'Registered' : 'Register'}
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
                className={`${styles.requestBtn} ${registeredEvents.includes(3) ? styles.disabledBtn : ''}`}
                disabled={registeredEvents.includes(3)}
                onClick={() => handleRegisterEvent(3, 'Build for India Hackathon')}
              >
                {registeredEvents.includes(3) ? 'Registered' : 'Register'}
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
                  navigate('/student/career');
                }}
                className={styles.headerActionLink}
              >
                View all ›
              </a>
            </div>

            {/* Job 1 */}
            <div className={styles.jobItem} onClick={() => navigate('/student/career')} style={{ cursor: 'pointer' }}>
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
            <div className={styles.jobItem} onClick={() => navigate('/student/career')} style={{ cursor: 'pointer' }}>
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
            <div className={styles.jobItem} onClick={() => navigate('/student/career')} style={{ cursor: 'pointer' }}>
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
              onClick={() => navigate('/student/career')}
            >
              Browse all jobs <FiExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};
