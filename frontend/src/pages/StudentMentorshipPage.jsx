import React, { useState } from 'react';
import { message, Tag, Modal } from 'antd';
import {
  FiUsers, FiCalendar, FiVideo, FiMessageSquare, FiStar,
  FiClock, FiCheckCircle, FiRefreshCw, FiXCircle, FiCheck, FiArrowRight
} from 'react-icons/fi';
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
  const [requestFilter, setRequestFilter] = useState('ALL');
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

  // ── Current Logged-in Student ──
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
    const mentor = mentors.find(m => String(m.id) === String(reqData.mentorId));
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
      await refreshData();
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
      title: 'Cancel Mentorship Request?',
      content: `Are you sure you want to cancel your pending request to ${mentorName}?`,
      okText: 'Cancel Request',
      okType: 'danger',
      cancelText: 'Keep Request',
      okButtonProps: { style: { backgroundColor: '#ef4444', borderColor: '#ef4444' } },
      async onOk() {
        try {
          await api.put(`/mentorship/cancel/${requestId}?studentId=${currentStudentId}`);
          message.success('Mentorship request cancelled successfully.');
          await refreshData();
        } catch (err) {
          console.error('Error cancelling mentorship request:', err);
          const errData = err.response?.data;
          const errorMsg = typeof errData === 'string' ? errData : 'Unable to cancel mentorship request. Please try again.';
          message.error(errorMsg);
        }
      }
    });
  };

  const handleRequestAgain = (req) => {
    const mentor = mentors.find(m => String(m.id) === String(req.mentorId)) || {
      id: req.mentorId,
      name: req.mentorName,
      role: req.role,
      company: req.company
    };
    handleRequestClick(mentor);
  };

  // ── 1. Available Mentors Filter ──
  // A mentor MUST NOT appear in Available Mentors if the student currently has a PENDING or ACCEPTED/ACTIVE request/relationship with that mentor!
  const availableMentorsList = (mentors || []).filter(m => {
    const mentorReqs = (requests || []).filter(r => String(r.mentorId) === String(m.id));
    const hasPendingOrAccepted = mentorReqs.some(r => {
      const st = (r.status || '').toUpperCase();
      return st === 'PENDING' || st === 'ACCEPTED' || st === 'ACTIVE';
    });
    return !hasPendingOrAccepted;
  }).filter(m => {
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

  // ── 2. Mentorship Requests Filter ──
  const filteredRequests = (requests || []).filter(r => {
    const st = (r.status || '').toUpperCase();
    if (requestFilter === 'PENDING') return st === 'PENDING';
    if (requestFilter === 'ACCEPTED') return st === 'ACCEPTED';
    if (requestFilter === 'DECLINED') return st === 'DECLINED' || st === 'REJECTED';
    if (requestFilter === 'CANCELLED') return st === 'CANCELLED';
    return true; // ALL
  }).filter(r => {
    if (!searchQuery || searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.mentorName || '').toLowerCase().includes(q) ||
      (r.role || '').toLowerCase().includes(q) ||
      (r.company || '').toLowerCase().includes(q) ||
      (r.topic || '').toLowerCase().includes(q)
    );
  });

  // ── 3. Active Mentorships Filter (Only ACCEPTED status) ──
  const filteredActive = (activeMentorships || [])
    .filter(s => (s.status || '').toUpperCase() === 'ACCEPTED')
    .filter(s => {
      if (!searchQuery || searchQuery.trim() === '') return true;
      const q = searchQuery.toLowerCase();
      return (
        (s.mentorName || '').toLowerCase().includes(q) ||
        (s.role || '').toLowerCase().includes(q) ||
        (s.company || '').toLowerCase().includes(q)
      );
    });

  // ── 4. Meeting History Filter (Only COMPLETED status) ──
  const filteredPast = (meetingsHistory || [])
    .filter(s => (s.status || '').toUpperCase() === 'COMPLETED')
    .filter(s => {
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

      {/* Primary Tabs Row */}
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

      {/* ── 1. Available Mentors Tab ── */}
      {activeTab === 'Available Mentors' && (
        <>
          {availableMentorsList.length > 0 ? (
            <div className={styles.mentorGrid}>
              {availableMentorsList.map(mentor => (
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
                    <button
                      className={styles.primaryBtn}
                      onClick={() => handleRequestClick(mentor)}
                    >
                      Request Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FiUsers size={48} className={styles.emptyIcon} />
              <h3>No mentors available</h3>
              <p>{searchQuery ? `No mentors match "${searchQuery}". Try a different keyword!` : 'You have active or pending requests with all currently listed mentors.'}</p>
            </div>
          )}
        </>
      )}

      {/* ── 2. Mentorship Requests Tab ── */}
      {activeTab === 'Mentorship Requests' && (
        <div>
          {/* Requests Status Sub-Filter Bar */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { key: 'ALL', label: 'All Requests' },
              { key: 'PENDING', label: 'Pending' },
              { key: 'ACCEPTED', label: 'Accepted' },
              { key: 'DECLINED', label: 'Declined' },
              { key: 'CANCELLED', label: 'Cancelled' }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setRequestFilter(f.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: 600,
                  border: requestFilter === f.key ? '1px solid #1b62d4' : '1px solid var(--ac-border)',
                  backgroundColor: requestFilter === f.key ? 'var(--ac-brand-bg)' : 'var(--ac-bg-card)',
                  color: requestFilter === f.key ? '#1b62d4' : 'var(--ac-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredRequests.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredRequests.map(req => {
                const statusStr = (req.status || 'PENDING').toUpperCase();
                const statusColor = getStatusColor(statusStr);
                return (
                  <div key={req.id} className={styles.sessionCard}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: 16, color: 'var(--ac-text-primary)', fontWeight: 700 }}>
                        {req.mentorName || 'Alumni Mentor'}
                      </h3>
                      <p style={{ margin: '0 0 6px 0', fontSize: 13, color: 'var(--ac-text-secondary)' }}>
                        {req.role || 'Professional'} • <strong>{req.company || 'Company'}</strong>
                      </p>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--ac-text-muted)', fontWeight: 500 }}>
                        <span><FiClock style={{ marginRight: 4 }} /> Requested: {req.date || 'N/A'}</span>
                        {req.topic && <span><strong>Topic:</strong> {req.topic}</span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Tag color={statusColor} style={{ fontSize: 13, padding: '4px 12px', fontWeight: 700, borderRadius: 6 }}>
                        {statusStr}
                      </Tag>

                      {statusStr === 'PENDING' && (
                        <button
                          className={styles.secondaryBtn}
                          style={{ borderColor: '#ef4444', color: '#ef4444', flex: 'none', padding: '8px 16px', height: 'auto', fontSize: '12px' }}
                          onClick={() => handleRevokeRequestClick(req.id, req.mentorName)}
                        >
                          Cancel Request
                        </button>
                      )}

                      {statusStr === 'ACCEPTED' && (
                        <button
                          className={styles.primaryBtn}
                          style={{ flex: 'none', padding: '8px 16px', height: 'auto', fontSize: '12px' }}
                          onClick={() => setActiveTab('Active Mentorships')}
                        >
                          View Mentorship →
                        </button>
                      )}

                      {(statusStr === 'DECLINED' || statusStr === 'REJECTED' || statusStr === 'CANCELLED') && (
                        <button
                          className={styles.secondaryBtn}
                          style={{ flex: 'none', padding: '8px 16px', height: 'auto', fontSize: '12px', borderColor: '#1b62d4', color: '#1b62d4' }}
                          onClick={() => handleRequestAgain(req)}
                        >
                          Request Again
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
              <h3>No mentorship requests found</h3>
              <p>{requestFilter !== 'ALL' ? `No requests match filter "${requestFilter}".` : 'You have not sent any mentorship requests yet. Go to "Available Mentors" to get started.'}</p>
            </div>
          )}
        </div>
      )}

      {/* ── 3. Active Mentorships Tab ── */}
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
                  <Tag color="green" style={{ fontSize: 12, padding: '4px 12px', fontWeight: 700, borderRadius: 6 }}>
                    ACTIVE
                  </Tag>
                  <button
                    className={styles.primaryBtn}
                    style={{ flex: 'none', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}
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

      {/* ── 4. Meeting History Tab ── */}
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
                    <strong>Session Topic:</strong> {history.topic || 'General Guidance'} • {history.date || 'N/A'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#22c55e', fontWeight: 600, marginTop: 6 }}>
                    <FiCheckCircle /> COMPLETED
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
