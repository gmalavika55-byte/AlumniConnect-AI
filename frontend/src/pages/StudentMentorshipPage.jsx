import React, { useState } from 'react';
import { message, Tag, Modal } from 'antd';
import { FiUsers, FiCalendar, FiVideo, FiMessageSquare, FiStar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { StudentLayout } from '../components/student/StudentLayout';
import { RequestMentorshipModal } from '../components/student/RequestMentorshipModal';
import { JoinMeetingModal } from '../components/student/JoinMeetingModal';
import { LeaveFeedbackModal } from '../components/student/LeaveFeedbackModal';
import { useAppContext } from '../context/AppContext';
import { authService } from '../services/authService';
import api from '../services/api';
import styles from './StudentMentorshipPage.module.css';

export const StudentMentorshipPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState((location.state && location.state.tab) || 'Available Mentors');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [feedbackSession, setFeedbackSession] = useState(null);

  const {
    searchQuery,
    mentors,
    requests,
    activeMentorships,
    meetingsHistory,
    refreshData
  } = useAppContext();

  // ─── Current logged-in student ───────────────────────────────────────────────
  const currentUser = authService.getCurrentUser();
  const currentStudentId = currentUser ? (currentUser.studentId || null) : null;

  const handleRequestClick = (mentor) => {
    if (!currentStudentId) {
      message.error('You must be logged in as a student to request mentorship.');
      return;
    }
    setSelectedMentor(mentor);
    setIsRequestModalOpen(true);
  };

  const handleRequestSuccess = async (reqData) => {
    const mentor = mentors.find(m => m.id === reqData.mentorId);
    if (!mentor) {
      message.error('Mentor not found.');
      return;
    }
    if (!currentStudentId) {
      message.error('Student ID not found. Please log in again.');
      return;
    }

    try {
      const payload = {
        studentId: currentStudentId,
        alumniId: mentor.id,
        status: 'PENDING',
        remarks: `${reqData.topic || ''}: ${reqData.purpose || ''}`.trim().replace(/^:/, '').trim(),
        requestDate: new Date().toISOString().split('T')[0]
      };
      await api.post('/mentorship/add', payload);
      message.success(`Mentorship request submitted successfully to ${mentor.name}!`);
      refreshData();
    } catch (err) {
      console.error('Error creating mentorship request:', err);
      const errData = err.response?.data;
      const errorMsg = typeof errData === 'string' ? errData : 'Failed to send mentorship request. Please try again.';
      message.error(errorMsg);
    }
  };

  const handleRevokeRequestClick = (requestId, mentorName) => {
    if (!currentStudentId) {
      message.error('You must be logged in as a student.');
      return;
    }
    if (!requestId) {
      message.error('Request ID is missing. Cannot revoke.');
      return;
    }

    Modal.confirm({
      title: 'Revoke Mentorship Request?',
      content: `Are you sure you want to revoke your pending request to ${mentorName}?`,
      okText: 'Revoke Request',
      okType: 'danger',
      cancelText: 'Keep Request',
      okButtonProps: { style: { backgroundColor: '#ef4444', borderColor: '#ef4444' } },
      async onOk() {
        try {
          await api.put(`/mentorship/cancel/${requestId}?studentId=${currentStudentId}`);
          message.success('Mentorship request revoked successfully.');
          refreshData();
        } catch (err) {
          console.error('Error revoking mentorship request:', err);
          const errData = err.response?.data;
          const errorMsg = typeof errData === 'string' ? errData : 'Unable to revoke mentorship request. Please try again.';
          message.error(errorMsg);
        }
      }
    });
  };

  /**
   * Returns the most-relevant request for a given mentor:
   * Priority: PENDING > ACCEPTED > any other (REJECTED, DECLINED, CANCELLED)
   * A CANCELLED or DECLINED request does NOT block a new session.
   */
  const getActiveRequestForMentor = (mentor) => {
    // All requests for this mentor
    const mentorRequests = (requests || []).filter(r =>
      String(r.mentorId) === String(mentor.id)
    );
    if (mentorRequests.length === 0) return null;

    // Priority: return PENDING first, then ACCEPTED
    const pending = mentorRequests.find(r => (r.status || '').toUpperCase() === 'PENDING');
    if (pending) return pending;
    const accepted = mentorRequests.find(r => (r.status || '').toUpperCase() === 'ACCEPTED');
    if (accepted) return accepted;

    // All other statuses (REJECTED, DECLINED, CANCELLED) — not blocking
    return null;
  };

  const renderMentorActionButton = (mentor) => {
    const activeRequest = getActiveRequestForMentor(mentor);

    if (!activeRequest) {
      // No blocking request — show Request Session
      return (
        <button
          className={styles.primaryBtn}
          onClick={() => handleRequestClick(mentor)}
        >
          Request Session
        </button>
      );
    }

    const status = (activeRequest.status || '').toUpperCase();

    if (status === 'PENDING') {
      return (
        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
          <button
            className={`${styles.primaryBtn} ${styles.disabledBtn}`}
            disabled
            style={{ padding: '9px 4px', fontSize: '11.5px' }}
          >
            Pending
          </button>
          <button
            className={styles.secondaryBtn}
            style={{ borderColor: '#ef4444', color: '#ef4444', padding: '9px 4px', fontSize: '11.5px' }}
            onClick={() => handleRevokeRequestClick(activeRequest.id, mentor.name)}
          >
            Revoke Request
          </button>
        </div>
      );
    }

    if (status === 'ACCEPTED') {
      return (
        <button
          className={`${styles.primaryBtn} ${styles.disabledBtn}`}
          disabled
          style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
        >
          Accepted ✓
        </button>
      );
    }

    // REJECTED, DECLINED, CANCELLED, or unknown — allow fresh request
    return (
      <button
        className={styles.primaryBtn}
        onClick={() => handleRequestClick(mentor)}
      >
        Request Session
      </button>
    );
  };

  // ── Filters based on Global Search Query ──
  const filteredMentors = (mentors || []).filter(m => {
    if (!searchQuery || searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.name || '').toLowerCase().includes(q) ||
      (m.role || '').toLowerCase().includes(q) ||
      (m.company || '').toLowerCase().includes(q) ||
      (m.bio || '').toLowerCase().includes(q) ||
      (m.skills || []).some(s => (s || '').toLowerCase().includes(q))
    );
  });

  const filteredRequests = (requests || []).filter(r => {
    if (!searchQuery || searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.mentorName || '').toLowerCase().includes(q) ||
      (r.role || '').toLowerCase().includes(q) ||
      (r.company || '').toLowerCase().includes(q)
    );
  });

  const filteredActive = (activeMentorships || []).filter(s => {
    if (!searchQuery || searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.mentorName || '').toLowerCase().includes(q) ||
      (s.role || '').toLowerCase().includes(q) ||
      (s.company || '').toLowerCase().includes(q)
    );
  });

  const filteredPast = (meetingsHistory || []).filter(s => {
    if (!searchQuery || searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      (s.mentorName || '').toLowerCase().includes(q) ||
      (s.topic || '').toLowerCase().includes(q) ||
      (s.status || '').toLowerCase().includes(q)
    );
  });

  const getStatusColor = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'ACCEPTED') return 'green';
    if (s === 'REJECTED' || s === 'DECLINED') return 'red';
    if (s === 'CANCELLED') return 'default';
    return 'gold'; // PENDING
  };

  return (
    <StudentLayout>
      <div className={styles.headerBar}>
        <div>
          <h1 className={styles.pageTitle}>Alumni Mentorship Network</h1>
          <p className={styles.pageSub}>Connect 1-on-1 with verified alumni mentors for career guidance and technical prep.</p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className={styles.tabRow}>
        {['Available Mentors', 'Mentorship Requests', 'Active Mentorships', 'Meeting History'].map(tab => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTabBtn : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 1. Available Mentors Tab */}
      {activeTab === 'Available Mentors' && (
        <>
          {filteredMentors.length > 0 ? (
            <div className={styles.mentorGrid}>
              {filteredMentors.map(mentor => {
                return (
                  <div key={mentor.id} className={styles.mentorCard}>
                    <div className={styles.mentorHeader}>
                        <div className={styles.avatarCircle}>
                          {(mentor.name || 'M').split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <h3 className={styles.mentorName}>{mentor.name}</h3>
                            <span className={styles.matchPill}>{mentor.match}</span>
                          </div>
                          <p className={styles.mentorRole}>{mentor.role} at <strong>{mentor.company}</strong></p>
                          <div style={{ fontSize: 12, color: '#eab308', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <FiStar /> {mentor.rating} / 5.0
                          </div>
                        </div>
                      </div>

                    <p className={styles.mentorBio}>{mentor.bio}</p>

                    <div className={styles.skillsRow}>
                      {(mentor.skills || []).map((s, idx) => (
                        <span key={idx} className={styles.skillTag}>{s}</span>
                      ))}
                    </div>

                    <div className={styles.cardFooter}>
                      <button
                        className={styles.secondaryBtn}
                        onClick={() => navigate(`/student/mentor/${mentor.id}`, { state: { mentor } })}
                      >
                        View Profile
                      </button>
                      {renderMentorActionButton(mentor)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FiUsers size={48} className={styles.emptyIcon} />
              <h3>No mentors found</h3>
              <p>{searchQuery ? `No mentors match "${searchQuery}". Try a different keyword!` : 'No alumni mentors are currently available.'}</p>
            </div>
          )}
        </>
      )}

      {/* 2. Mentorship Requests Tab */}
      {activeTab === 'Mentorship Requests' && (
        <div>
          {filteredRequests.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredRequests.map(req => {
                const statusColor = getStatusColor(req.status);
                return (
                  <div key={req.id} className={styles.sessionCard}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: 16, color: 'var(--ac-text-primary)', fontWeight: 700 }}>
                        {req.mentorName || 'Alumni Mentor'}
                      </h3>
                      <p style={{ margin: '0 0 6px 0', fontSize: 13, color: 'var(--ac-text-secondary)' }}>
                        {req.role || 'Professional'} • <strong>{req.company || 'Company'}</strong>
                      </p>
                      <span style={{ fontSize: 12, color: 'var(--ac-text-muted)', fontWeight: 500 }}>
                        <FiClock style={{ marginRight: 4 }} /> Requested {req.date || 'N/A'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <Tag color={statusColor} style={{ fontSize: 13, padding: '4px 12px', fontWeight: 600, borderRadius: 6 }}>
                        {req.status || 'PENDING'}
                      </Tag>
                      {(req.status || '').toUpperCase() === 'PENDING' && (
                        <button
                          className={styles.secondaryBtn}
                          style={{ borderColor: '#ef4444', color: '#ef4444', flex: 'none', padding: '6px 12px', height: 'auto', fontSize: '12px' }}
                          onClick={() => handleRevokeRequestClick(req.id, req.mentorName)}
                        >
                          Revoke Request
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FiCalendar size={48} className={styles.emptyIcon} />
              <h3>No requests found</h3>
              <p>You have not sent any mentorship requests yet. Go to "Available Mentors" to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* 3. Active Mentorships Tab */}
      {activeTab === 'Active Mentorships' && (
        <div>
          {filteredActive.length > 0 ? (
            filteredActive.map(session => (
              <div key={session.id} className={styles.sessionCard}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: 16, color: 'var(--ac-text-primary)', fontWeight: 700 }}>
                    {session.mentorName}
                  </h3>
                  <p style={{ margin: '0 0 6px 0', fontSize: 13, color: 'var(--ac-text-secondary)' }}>
                    {session.role} • <strong>{session.company}</strong>
                  </p>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: 'var(--ac-text-muted)', marginTop: 8 }}>
                    <span><strong>Start Date:</strong> {session.startDate || session.date || 'N/A'}</span>
                    {session.nextMeeting && (
                      <span style={{ color: 'var(--ac-brand)', fontWeight: 600 }}>
                        <strong>Next Meeting:</strong> {session.nextMeeting}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Tag color="blue" style={{ fontSize: 12, padding: '3px 10px', fontWeight: 600, borderRadius: 4 }}>
                    Active
                  </Tag>
                  <button
                    className={styles.primaryBtn}
                    style={{ flex: 'none', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8 }}
                    onClick={() => {
                      setActiveSession(session);
                      setIsMeetingOpen(true);
                    }}
                  >
                    <FiVideo /> Join Live Call
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <FiCalendar size={48} className={styles.emptyIcon} />
              <h3>No active mentorships found</h3>
              <p>Connect with a mentor by sending a request and waiting for their acceptance.</p>
            </div>
          )}
        </div>
      )}

      {/* 4. Meeting History Tab */}
      {activeTab === 'Meeting History' && (
        <div>
          {filteredPast.length > 0 ? (
            filteredPast.map(history => (
              <div key={history.id} className={styles.sessionCard}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: 16, color: 'var(--ac-text-primary)', fontWeight: 700 }}>
                    {history.mentorName}
                  </h3>
                  <p style={{ margin: '0 0 4px 0', fontSize: 13, color: 'var(--ac-text-secondary)' }}>
                    <strong>Session Topic:</strong> {history.topic || 'General'} • {history.date || 'N/A'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#22c55e', fontWeight: 600, marginTop: 6 }}>
                    <FiCheckCircle /> {history.status || 'Completed'}
                  </div>
                </div>

                <button
                  className={styles.secondaryBtn}
                  style={{ flex: 'none', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => setFeedbackSession(history)}
                >
                  <FiMessageSquare /> Leave Feedback
                </button>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <FiCalendar size={48} className={styles.emptyIcon} />
              <h3>No session history found</h3>
              <p>Completed mentorship sessions will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* Request Mentorship Modal */}
      <RequestMentorshipModal
        visible={isRequestModalOpen}
        mentor={selectedMentor}
        onClose={() => setIsRequestModalOpen(false)}
        onRequestSuccess={handleRequestSuccess}
      />

      {/* Live Video Meeting Modal */}
      <JoinMeetingModal
        visible={isMeetingOpen}
        session={activeSession}
        onClose={() => setIsMeetingOpen(false)}
        onFinishSession={(session) => {
          setFeedbackSession(session);
        }}
      />

      {/* Post Session Feedback Modal */}
      <LeaveFeedbackModal
        visible={!!feedbackSession}
        session={feedbackSession}
        onClose={() => setFeedbackSession(null)}
      />
    </StudentLayout>
  );
};
