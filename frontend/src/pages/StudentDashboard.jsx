import React from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Spin, Modal } from 'antd';
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
import api from '../services/api';
import styles from './StudentDashboard.module.css';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const student = authService.getCurrentUser();
  const { searchQuery, mentors, events, requests, loading, refreshData } = useAppContext();

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Spin size="large" tip="Loading Dashboard..." />
        </div>
      </StudentLayout>
    );
  }

  // ── Mentorship quick-action: navigate to Mentorship page
  // Real request is submitted from StudentMentorshipPage (POST /mentorship/add lives there)
  const handleRequestMentorship = () => {
    navigate('/student/mentorship');
  };


  const handleRevokeMentorship = (requestId, mentorName) => {
    if (!student) return;
    if (!requestId) {
      message.error('Request ID is missing. Cannot revoke.');
      return;
    }

    Modal.confirm({
      title: 'Revoke Mentorship Request?',
      content: 'Are you sure you want to revoke this mentorship request?',
      okText: 'Revoke',
      okType: 'danger',
      cancelText: 'Cancel',
      okButtonProps: { style: { backgroundColor: '#ef4444', borderColor: '#ef4444' } },
      async onOk() {
        try {
          await api.put(`/mentorship/cancel/${requestId}?studentId=${student.studentId}`);
          message.success('Mentorship request revoked successfully.');
          refreshData();
        } catch (err) {
          console.error('Error revoking request:', err);
          const errData = err.response?.data;
          const errorMsg = typeof errData === 'string' ? errData : 'Failed to revoke request. Please try again.';
          message.error(errorMsg);
        }
      }
    });
  };

  // ── Event quick-action: navigate to Events page
  // Real registration is submitted from StudentEventsPage (POST /event/register lives there)
  const handleRegisterEvent = () => {
    navigate('/student/events');
  };


  // ── Search Filtering ──
  const filteredMentors = mentors.filter(m => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.role?.toLowerCase().includes(q) ||
      m.company?.toLowerCase().includes(q) ||
      m.skills?.some(s => s.toLowerCase().includes(q))
    );
  });

  const parseTimeString = (timeStr) => {
    if (!timeStr) return null;
    const str = timeStr.trim().toUpperCase();
    const isPM = str.includes('PM');
    const isAM = str.includes('AM');
    const cleanStr = str.replace(/(AM|PM)/g, '').trim();
    const parts = cleanStr.split(':');
    if (parts.length < 2) return null;
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) return null;
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const isEventPast = (e) => {
    if (!e || !e.eventDate) return false;
    const now = new Date();
    const eventDateObj = new Date(e.eventDate);
    if (isNaN(eventDateObj.getTime())) return false;

    const eventDateOnly = new Date(eventDateObj.getFullYear(), eventDateObj.getMonth(), eventDateObj.getDate());
    const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (eventDateOnly < todayOnly) return true;
    if (eventDateOnly > todayOnly) return false;

    const timeStr = e.endTime || (e.time && e.time.includes('-') ? e.time.split('-')[1]?.trim() : null);
    if (timeStr) {
      const parsed = parseTimeString(timeStr);
      if (parsed) {
        const endDateTime = new Date(eventDateObj.getFullYear(), eventDateObj.getMonth(), eventDateObj.getDate(), parsed.hours, parsed.minutes);
        return now > endDateTime;
      }
    }
    return false;
  };

  const filteredEvents = events.filter(e => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q)
    );
  });

  // ── Stats derived from real data ──
  const availableMentorsCount = mentors.filter(m => m.availableForMentorship && m.availableForMentorship.toLowerCase() === 'yes').length;
  const registeredEventsCount = events.filter(e => e.registered).length;
  const pendingCount = requests.filter(r => r.status?.toUpperCase() === 'PENDING').length;
  const acceptedCount = requests.filter(r => r.status?.toUpperCase() === 'ACCEPTED').length;
  const activeRequestsCount = requests.filter(r => {
    const s = r.status?.toUpperCase();
    return s === 'PENDING' || s === 'ACCEPTED';
  }).length;

  // Upcoming registered event date text
  const upcomingRegistered = events
    .filter(e => e.registered && e.eventDate)
    .filter(e => {
      const d = new Date(e.eventDate);
      return !isNaN(d.getTime()) && d >= new Date();
    })
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

  let nextEventText = 'No upcoming registered events';
  if (upcomingRegistered.length > 0) {
    const nextDate = new Date(upcomingRegistered[0].eventDate);
    if (!isNaN(nextDate.getTime())) {
      nextEventText = `Next on ${nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  }

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
        {/* Card 1: Available Mentors */}
        <div
          className={styles.statCard}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/student/mentorship')}
        >
          <div className={`${styles.statIconWrapper} ${styles.purpleIconBg}`}>
            <FiZap />
          </div>
          <div className={styles.statNumber}>{availableMentorsCount}</div>
          <div className={styles.statTitle}>Available Mentors</div>
          <div className={styles.statSubtext}>Connect with verified alumni</div>
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
          <div className={styles.statNumber}>{activeRequestsCount}</div>
          <div className={styles.statTitle}>Mentorship Requests</div>
          <div className={styles.statSubtext}>
            {pendingCount} pending • {acceptedCount} accepted
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
          <div className={styles.statNumber}>{registeredEventsCount}</div>
          <div className={styles.statTitle}>Registered Events</div>
          <div className={styles.statSubtext}>{nextEventText}</div>
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

            {filteredMentors.filter(m => m.availableForMentorship && m.availableForMentorship.toLowerCase() === 'yes').length > 0 ? (
              filteredMentors
                .filter(m => m.availableForMentorship && m.availableForMentorship.toLowerCase() === 'yes')
                .map((mentor, index) => {
                  const request = requests.find(r => {
                    const s = r.status?.toUpperCase();
                    return String(r.mentorId) === String(mentor.id) && (s === 'PENDING' || s === 'ACCEPTED');
                  });
                  const status = request?.status?.toUpperCase();
                  const isPending = status === 'PENDING';
                  const isAccepted = status === 'ACCEPTED';
                  const isRejected = status === 'REJECTED' || status === 'DECLINED';

                  return (
                    <div key={mentor.id || index} className={styles.mentorItem}>
                      <div className={styles.mentorItemLeft}>
                        <div className={styles.mentorAvatar}>{mentor.avatar}</div>
                        <div>
                          <div className={styles.mentorNameRow}>
                            <h4 className={styles.mentorName}>{mentor.name}</h4>
                          </div>
                          <div className={styles.mentorRoleCompany}>
                            {mentor.role} • <strong>{mentor.company}</strong>
                          </div>
                          <div className={styles.mentorTagsRow}>
                            {(mentor.skills || []).map((s, idx) => (
                              <span key={idx} className={styles.skillTag}>{s}</span>
                            ))}
                          </div>
                          <div className={styles.mentorMetaRow}>
                            <span>Batch {mentor.batch}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {isPending ? (
                          <>
                            <button className={`${styles.requestBtn} ${styles.disabledBtn}`} disabled>
                              Pending
                            </button>
                            <button
                              className={styles.requestBtn}
                              style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', color: '#fff' }}
                              onClick={() => handleRevokeMentorship(request.id, mentor.name)}
                            >
                              Revoke
                            </button>
                          </>
                        ) : isAccepted ? (
                          <button className={`${styles.requestBtn} ${styles.disabledBtn}`} disabled>
                            Connected
                          </button>
                        ) : isRejected ? (
                          <button className={`${styles.requestBtn} ${styles.disabledBtn}`} disabled>
                            Rejected
                          </button>
                        ) : (
                          <button
                            className={styles.requestBtn}
                            onClick={() => handleRequestMentorship(mentor.id, mentor.name)}
                          >
                            Request
                          </button>
                        )}
                      </div>
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
                  {(() => {
                    const ended = isEventPast(event);
                    if (event.registered) {
                      return (
                        <button className={`${styles.requestBtn} ${styles.disabledBtn}`} disabled>
                          Registered
                        </button>
                      );
                    }
                    if (ended) {
                      return (
                        <button className={`${styles.requestBtn} ${styles.disabledBtn}`} style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} disabled>
                          Event Ended
                        </button>
                      );
                    }
                    return (
                      <button
                        className={styles.requestBtn}
                        onClick={() => handleRegisterEvent(event.id, event.title)}
                      >
                        Register
                      </button>
                    );
                  })()}
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
