import React from 'react';
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
  FiArrowRight
} from 'react-icons/fi';
import { authService } from '../services/authService';
import { StudentLayout } from '../components/student/StudentLayout';
import { useAppContext } from '../context/AppContext';
import styles from './StudentDashboard.module.css';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const student = authService.getCurrentUser();
  const { searchQuery, mentors, events, setEvents, requests, setRequests } = useAppContext();

  const handleRequestMentorship = (mentorName) => {
    const mentor = mentors.find(m => m.name === mentorName);
    if (!mentor) return;

    const alreadyRequested = requests.some(r => r.mentorId === mentor.id);
    if (alreadyRequested) {
      const req = requests.find(r => r.mentorId === mentor.id);
      message.info(`Request status for ${mentorName} is already: ${req.status}`);
      return;
    }

    const newRequest = {
      id: Date.now(),
      mentorId: mentor.id,
      mentorName: mentor.name,
      role: mentor.role,
      company: mentor.company,
      date: 'Today',
      status: 'Pending'
    };
    setRequests([...requests, newRequest]);
    message.success(`Mentorship request sent to ${mentorName}`);
  };

  const handleRegisterEvent = (eventId, eventTitle) => {
    const eventItem = events.find(e => e.id === eventId);
    if (!eventItem || eventItem.registered) return;

    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registered: true } : e));
    message.success(`RSVP confirmed for ${eventTitle}`);
  };

  // ── Search Filtering ──
  const filteredMentors = mentors.filter(m => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q) ||
      m.skills.some(s => s.toLowerCase().includes(q))
    );
  });

  const filteredEvents = events.filter(e => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q)
    );
  });

  return (
    <StudentLayout>
      {/* Welcome Bar */}
      <div className={styles.welcomeBar}>
        <div>
          <h1 className={styles.welcomeTitle}>Welcome {student?.name || 'Student'} 👋</h1>
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
        {/* Card 1: Recommended Mentors */}
        <div
          className={styles.statCard}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/student/mentorship')}
        >
          <div className={`${styles.statIconWrapper} ${styles.purpleIconBg}`}>
            <FiZap />
          </div>
          <div className={styles.statNumber}>12</div>
          <div className={styles.statTitle}>Recommended Mentors</div>
          <div className={styles.statSubtext}>AI-matched to your profile</div>
        </div>

        {/* Card 2: Mentorship Requests */}
        <div
          className={styles.statCard}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/student/mentorship', { state: { tab: 'Mentorship Requests' } })}
        >
          <div className={`${styles.statIconWrapper} ${styles.orangeIconBg}`}>
            <FiBookOpen />
          </div>
          <div className={styles.statNumber}>{requests.length}</div>
          <div className={styles.statTitle}>Mentorship Requests</div>
          <div className={styles.statSubtext}>
            {requests.filter(r => r.status === 'Pending').length} pending • {requests.filter(r => r.status === 'Accepted').length} accepted
          </div>
        </div>

        {/* Card 3: Registered Events */}
        <div
          className={styles.statCard}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/student/events', { state: { tab: 'Registered Events' } })}
        >
          <div className={`${styles.statIconWrapper} ${styles.greenIconBg}`}>
            <FiCalendar />
          </div>
          <div className={styles.statNumber}>{events.filter(e => e.registered).length}</div>
          <div className={styles.statTitle}>Registered Events</div>
          <div className={styles.statSubtext}>Next on Aug 18, 2026</div>
        </div>
      </div>

      {/* 2-Column Main Dashboard Grid */}
      <div className={styles.dashboardGrid}>
        {/* LEFT COLUMN: AI Mentor Recommendations */}
        <div>
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

            {filteredMentors.length > 0 ? (
              filteredMentors.map((mentor, index) => {
                const request = requests.find(r => r.mentorId === mentor.id);
                const isPending = request?.status === 'Pending';
                const isAccepted = request?.status === 'Accepted';

                return (
                  <div key={index} className={styles.mentorItem}>
                    <div className={styles.mentorItemLeft}>
                      <div className={styles.mentorAvatar}>{mentor.avatar}</div>
                      <div>
                        <div className={styles.mentorNameRow}>
                          <h4 className={styles.mentorName}>{mentor.name}</h4>
                          <span className={styles.matchTag}>{mentor.match}</span>
                        </div>
                        <div className={styles.mentorRoleCompany}>
                          {mentor.role} • <strong>{mentor.company}</strong>
                        </div>
                        <div className={styles.mentorTagsRow}>
                          {mentor.skills.map((s, idx) => (
                            <span key={idx} className={styles.skillTag}>{s}</span>
                          ))}
                        </div>
                        <div className={styles.mentorMetaRow}>
                          <span>Batch {mentor.batch}</span>
                          <span className={styles.starRating}>★ {mentor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className={`${styles.requestBtn} ${request ? styles.disabledBtn : ''}`}
                      disabled={!!request}
                      onClick={() => handleRequestMentorship(mentor.name)}
                    >
                      {isPending ? 'Pending' : isAccepted ? 'Connected' : 'Request'}
                    </button>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--ac-text-secondary)' }}>
                No matching recommended mentors found.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Upcoming Events */}
        <div>
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

            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div key={event.id} className={styles.eventItem}>
                  <div className={styles.eventLeft}>
                    <div className={styles.dateBadgeBox}>
                      <span className={styles.dateNumber}>{event.dayNum}</span>
                      <span className={styles.dateMonth}>{event.monthStr}</span>
                    </div>
                    <div>
                      <div className={styles.eventTitleRow}>
                        <h4 className={styles.eventTitle}>{event.title}</h4>
                        <span className={styles.categoryTag}>{event.category}</span>
                        {event.registered && (
                          <span className={styles.greenTag}>Registered</span>
                        )}
                      </div>
                      <div className={styles.eventMeta}>
                        <span><FiClock style={{ marginRight: 4 }} /> {event.time}</span>
                        <span><FiMapPin style={{ marginRight: 4 }} /> {event.venue}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className={`${styles.requestBtn} ${event.registered ? styles.disabledBtn : ''}`}
                    disabled={event.registered}
                    onClick={() => handleRegisterEvent(event.id, event.title)}
                  >
                    {event.registered ? 'Registered' : 'Register'}
                  </button>
                </div>
              ))
            ) : (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--ac-text-secondary)' }}>
                No matching upcoming events found.
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};
