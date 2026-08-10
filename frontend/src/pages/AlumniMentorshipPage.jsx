import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tag, Button, message, Modal } from 'antd';
import { FiUsers, FiCheck, FiX, FiEye, FiClock, FiStar, FiBookOpen, FiCalendar } from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';

export const AlumniMentorshipPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { alumniRequests: requests, refreshData } = useAppContext();

  // Set active tab based on React Router navigation state, default to 'Pending'
  const [activeTab, setActiveTab] = useState('Pending');

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const handleAccept = async (req) => {
    try {
      const getRes = await api.get(`/mentorship/get/${req.id}`);
      const requestObj = getRes.data;
      requestObj.status = 'ACCEPTED';
      await api.put('/mentorship/update', requestObj);
      message.success(`Mentorship request from ${req.studentName} accepted!`);
      refreshData();
    } catch (err) {
      console.error("Error accepting request:", err);
      message.error("Failed to accept mentorship request.");
    }
  };

  const handleDecline = (req) => {
    Modal.confirm({
      title: `Decline Mentorship Request from "${req.studentName}"?`,
      content: 'The student will be notified that you are currently unavailable for this session.',
      okText: 'Decline Request',
      okType: 'danger',
      async onOk() {
        try {
          const getRes = await api.get(`/mentorship/get/${req.id}`);
          const requestObj = getRes.data;
          requestObj.status = 'DECLINED';
          await api.put('/mentorship/update', requestObj);
          message.info(`Request from ${req.studentName} declined.`);
          refreshData();
        } catch (err) {
          console.error("Error declining request:", err);
          message.error("Failed to decline mentorship request.");
        }
      }
    });
  };

  const handleComplete = async (req) => {
    try {
      const getRes = await api.get(`/mentorship/get/${req.id}`);
      const requestObj = getRes.data;
      requestObj.status = 'COMPLETED';
      await api.put('/mentorship/update', requestObj);
      message.success(`Mentorship session with ${req.studentName} marked as Completed!`);
      refreshData();
    } catch (err) {
      console.error("Error completing session:", err);
      message.error("Failed to mark mentorship request as completed.");
    }
  };

  // Get records filtered by active tab
  const getFilteredRequests = () => {
    if (activeTab === 'Pending') {
      return requests.filter(r => r.status === 'Pending');
    } else if (activeTab === 'Accepted') {
      return requests.filter(r => r.status === 'Accepted');
    } else {
      return requests.filter(r => r.status === 'Completed');
    }
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
          { id: 'Pending', label: 'Pending Requests', count: requests.filter(r => r.status === 'Pending').length },
          { id: 'Accepted', label: 'Accepted / Active Mentorships', count: requests.filter(r => r.status === 'Accepted').length },
          { id: 'History', label: 'Past History', count: requests.filter(r => r.status === 'Completed').length }
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
          <p style={{ fontSize: 13.5, margin: 0 }}>There are currently no items under the {activeTab === 'Pending' ? 'Pending Requests' : activeTab === 'Accepted' ? 'Accepted / Active Mentorships' : 'Past History'} section.</p>
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
                  <Tag color={req.status === 'Accepted' ? 'success' : req.status === 'Pending' ? 'warning' : 'default'} style={{ fontWeight: 700 }}>
                    {req.status === 'Completed' ? 'COMPLETED' : req.status.toUpperCase()}
                  </Tag>
                </div>

                {/* Student Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: 'var(--ac-bg-input)',
                    border: '1px solid var(--ac-border)',
                    color: 'var(--ac-text-primary)',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16
                  }}>
                    {req.studentName.split(' ').map(n => n[0]).join('')}
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

                {req.status === 'Pending' && (
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

                {req.status === 'Accepted' && (
                  <Button
                    type="primary"
                    icon={<FiCheck />}
                    style={{ backgroundColor: 'var(--ac-brand)', borderColor: 'var(--ac-brand)', fontWeight: 600, height: 38 }}
                    onClick={() => handleComplete(req)}
                  >
                    Complete Session
                  </Button>
                )}

                {req.status === 'Completed' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ac-text-secondary)' }}>
                    <FiCalendar /> <span>Completed: {req.completionDate}</span>
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
