import React, { useState } from 'react';
import { Modal, Button, message, Spin } from 'antd';
import { FiVideo, FiExternalLink, FiUser, FiCheckCircle } from 'react-icons/fi';
import { authService } from '../../services/authService';
import api from '../../services/api';

export const JoinMeetingModal = ({ visible, session, onClose }) => {
  const [joining, setJoining] = useState(false);

  if (!session) return null;

  const currentUser = authService.getCurrentUser();
  const studentId = currentUser?.studentId;

  const handleLaunchMeeting = async () => {
    if (!studentId) {
      message.error('Student session missing. Please log in again.');
      return;
    }
    setJoining(true);
    try {
      const res = await api.get(`/mentorship/join/${session.id}?userId=${studentId}&userType=STUDENT`);
      const link = res.data?.meetingLink || (typeof res.data === 'string' ? res.data : null);
      if (link) {
        message.success('Opening authenticated 8x8 JaaS video session in a new tab...');
        window.open(link, '_blank');
        onClose();
      } else {
        message.error('Video session link is not available.');
      }
    } catch (err) {
      console.error('Error joining mentorship video session:', err);
      const errData = err.response?.data;
      const errorMsg = typeof errData === 'string'
        ? errData
        : (errData?.message || 'You are not authorized to join this mentorship session.');
      message.error(errorMsg);
    } finally {
      setJoining(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiVideo color="var(--ac-brand)" />
          <span>Mentorship Video Session</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={520}
      footer={null}
      centered
    >
      <div style={{ padding: '12px 0 8px 0', textAlign: 'center' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'var(--ac-brand-bg)',
          color: 'var(--ac-brand)',
          fontSize: 24,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          {(session.mentorName || 'M').split(' ').map(n => n[0]).join('')}
        </div>

        <h3 style={{ margin: '0 0 4px 0', fontSize: 18, fontWeight: 700, color: 'var(--ac-text-primary)' }}>
          {session.mentorName}
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: 13.5, color: 'var(--ac-text-secondary)' }}>
          {session.role} • <strong>{session.company}</strong>
        </p>

        <div style={{
          backgroundColor: 'var(--ac-bg-input)',
          border: '1px solid var(--ac-border)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          textAlign: 'left'
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Session Topic
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ac-text-primary)', marginBottom: 10 }}>
            {session.topic || '1-on-1 Career Mentorship'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#16a34a', fontWeight: 600 }}>
            <FiCheckCircle /> Active Mentorship Session Verified
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button onClick={onClose} style={{ fontWeight: 600, height: 40 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            icon={joining ? <Spin size="small" /> : <FiExternalLink />}
            disabled={joining}
            onClick={handleLaunchMeeting}
            style={{
              backgroundColor: 'var(--ac-brand)',
              borderColor: 'var(--ac-brand)',
              fontWeight: 600,
              height: 40,
              padding: '0 20px'
            }}
          >
            Launch Video Session in New Tab
          </Button>
        </div>
      </div>
    </Modal>
  );
};
