import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tag, Button, message, Modal } from 'antd';
import { FiUsers, FiCheck, FiX, FiEye, FiClock, FiCalendar } from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import { useAppContext } from '../context/AppContext';
import { authService } from '../services/authService';
import api from '../services/api';

export const AlumniMentorshipPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { alumniRequests: requests, refreshData } = useAppContext();

  const [activeTab, setActiveTab] = useState('PENDING');

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Helper: post a notification to auth-service
  const createNotification = async (userId, userType, title, msg) => {
    try {
      await api.post('/notification/add', {
        userId,
        userType,
        title,
        message: msg,
        notificationDate: new Date().toISOString(),
        status: 'UNREAD'
      });
    } catch (err) {
      console.warn('Notification creation failed (non-critical):', err);
    }
  };

  const handleAccept = async (req) => {
    const alumni = authService.getCurrentUser();
    if (!alumni) return;
    try {
      await api.put(`/mentorship/accept/${req.id}?alumniId=${alumni.alumniId}`);
      message.success(`Mentorship request from ${req.studentName} accepted!`);
      // Notify the student
      await createNotification(
        req.studentId,
        'STUDENT',
        'Mentorship Request Accepted',
        `Your mentorship request to ${alumni.name || 'an alumni'} was accepted! You can now begin your sessions.`
      );
      refreshData();
    } catch (err) {
      console.error('Error accepting request:', err);
      const errorMsg = err.response?.data || 'Failed to accept mentorship request.';
      message.error(errorMsg);
    }
  };

  const handleDecline = (req) => {
    const alumni = authService.getCurrentUser();
    if (!alumni) return;
    Modal.confirm({
      title: `Decline Mentorship Request from "${req.studentName}"?`,
      content: 'The student will be notified that you are currently unavailable for this session.',
      okText: 'Decline Request',
      okType: 'danger',
      async onOk() {
        try {
          await api.put(`/mentorship/reject/${req.id}?alumniId=${alumni.alumniId}`);
          message.info(`Request from ${req.studentName} declined.`);
          // Notify the student
          await createNotification(
            req.studentId,
            'STUDENT',
            'Mentorship Request Declined',
            `Your mentorship request to ${alumni.name || 'an alumni'} was not accepted at this time.`
          );
          refreshData();
        } catch (err) {
          console.error('Error declining request:', err);
          const errorMsg = err.response?.data || 'Failed to decline mentorship request.';
          message.error(errorMsg);
        }
      }
    });
  };

  const handleComplete = async (req) => {
    const alumni = authService.getCurrentUser();
    if (!alumni) return;
    try {
      const getRes = await api.get(`/mentorship/get/${req.id}`);
      const requestObj = getRes.data;
      requestObj.status = 'COMPLETED';
      await api.put('/mentorship/update', requestObj);
      message.success(`Mentorship session with ${req.studentName} marked as Completed!`);
      refreshData();
    } catch (err) {
      console.error('Error completing session:', err);
      const errorMsg = err.response?.data || 'Failed to mark mentorship request as completed.';
      message.error(errorMsg);
    }
  };

  // All status comparisons use UPPERCASE (data is normalised in AppContext)
  const getFilteredRequests = () => {
    if (activeTab === 'PENDING') return requests.filter(r => r.status === 'PENDING');
    if (activeTab === 'ACCEPTED') return requests.filter(r => r.status === 'ACCEPTED');
    return requests.filter(r => r.status === 'COMPLETED' || r.status === 'REJECTED');
  };

  const filteredRequests = getFilteredRequests();

  return (
    <AlumniLayout>
      {/* Title Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Mentorship Hub</h1>
        <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
          Manage your active student matches, review pending requests, or browse past connections.
        </p>
      </div>

      {/* Tab Switcher Header */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--ac-border)', paddingBottom: 12, flexWrap: 'wrap' }}>
        {[
          { id: 'PENDING', label: 'Pending Requests', count: requests.filter(r => r.status === 'PENDING').length },
          { id: 'ACCEPTED', label: 'Accepted / Active Mentorships', count: requests.filter(r => r.status === 'ACCEPTED').length },
          { id: 'History', label: 'Past History', count: requests.filter(r => r.status === 'COMPLETED' || r.status === 'REJECTED').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: activeTab === tab.id ? '1px solid var(--ac-brand)' : '1px solid var(--ac-border)',
              backgroundColor: activeTab === tab.id ? 'var(--ac-brand)' : 'var(--ac-bg-card)',
              color: activeTab === tab.id ? '#ffffff' : 'var(--ac-text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 13.5,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              backgroundColor: activeTab === tab.id ? 'rgba(255, 255, 255, 0.25)' : 'var(--ac-bg-input)',
              color: activeTab === tab.id ? '#ffffff' : 'var(--ac-text-secondary)',
              padding: '2px 6px',
              borderRadius: 10
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Render Requests Lists / Cards */}
      {filteredRequests.length === 0 ? (
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 48, textAlign: 'center', color: 'var(--ac-text-secondary)' }}>
          <FiUsers size={48} color="var(--ac-text-muted)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 16, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>No records found</h3>
          <p style={{ fontSize: 13.5, margin: 0 }}>
            There are currently no items under the {activeTab === 'PENDING' ? 'Pending Requests' : activeTab === 'ACCEPTED' ? 'Accepted / Active Mentorships' : 'Past History'} section.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
          {filteredRequests.map(req => (
            <div key={req.id} style={{
              backgroundColor: 'var(--ac-bg-card)',
              borderRadius: 16,
              border: '1px solid var(--ac-border)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #1b62d4, #3b82f6)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 20,
                    letterSpacing: 0.5
                  }}>
                    {req.matchPct}
                  </span>
                  {/* Null-safe status display */}
                  <Tag
                    color={
                      req.status === 'ACCEPTED' ? 'success' :
                      req.status === 'PENDING' ? 'warning' :
                      req.status === 'REJECTED' ? 'error' : 'default'
                    }
                    style={{ fontWeight: 700 }}
                  >
                    {req.status || 'PENDING'}
                  </Tag>
                </div>

                {/* Student Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    backgroundColor: 'var(--ac-bg-input)', border: '1px solid var(--ac-border)',
                    color: 'var(--ac-text-primary)', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
                  }}>
                    {(req.studentName || 'S').split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: 0 }}>{req.studentName}</h3>
                    <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)' }}>{req.registerNumber} • {req.dept} ({req.semester})</div>
                  </div>
                </div>

                {/* Requested Topic */}
                <div style={{ padding: 12, backgroundColor: 'var(--ac-bg-input)', borderRadius: 10, border: '1px solid var(--ac-border)', marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Requested Topic</span>
                  <p style={{ margin: '2px 0 0 0', fontSize: 13.5, fontWeight: 700, color: 'var(--ac-text-primary)' }}>{req.topic}</p>
                </div>

                {/* Career Goal */}
                <p style={{ fontSize: 13, color: 'var(--ac-text-secondary)', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                  <strong>Career Goal:</strong> {req.careerGoal}
                </p>

                {/* Skill Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {req.skills.map((s, idx) => (
                    <span key={idx} style={{ fontSize: 11, fontWeight: 600, backgroundColor: 'var(--ac-bg-input)', border: '1px solid var(--ac-border)', color: 'var(--ac-text-primary)', padding: '3px 8px', borderRadius: 6 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ paddingTop: 16, borderTop: '1px solid var(--ac-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <Button
                  type="default"
                  icon={<FiEye />}
                  style={{ fontWeight: 600, height: 38 }}
                  onClick={() => navigate(`/alumni/student/${req.id}`, { state: { student: req } })}
                >
                  View Profile
                </Button>

                {req.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      type="primary"
                      icon={<FiCheck />}
                      style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', fontWeight: 600, height: 38 }}
                      onClick={() => handleAccept(req)}
                    >
                      Accept
                    </Button>
                    <Button
                      type="primary"
                      danger
                      icon={<FiX />}
                      style={{ fontWeight: 600, height: 38 }}
                      onClick={() => handleDecline(req)}
                    >
                      Decline
                    </Button>
                  </div>
                )}

                {req.status === 'ACCEPTED' && (
                  <Button
                    type="primary"
                    icon={<FiCheck />}
                    style={{ backgroundColor: 'var(--ac-brand)', borderColor: 'var(--ac-brand)', fontWeight: 600, height: 38 }}
                    onClick={() => handleComplete(req)}
                  >
                    Complete Session
                  </Button>
                )}

                {(req.status === 'COMPLETED' || req.status === 'REJECTED') && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ac-text-secondary)' }}>
                    <FiCalendar /> <span>{req.status === 'COMPLETED' ? `Completed: ${req.completionDate}` : 'Request Declined'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AlumniLayout>
  );
};
