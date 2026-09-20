import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Button, Spin, message as antMessage } from 'antd';
import { FiSend, FiMessageSquare, FiUser, FiClock } from 'react-icons/fi';
import api from '../../services/api';

export const MentorshipChatModal = ({
  visible,
  onClose,
  mentorship,
  currentUser // { userId, userType } ('STUDENT' or 'ALUMNI')
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  const mentorshipId = mentorship ? (mentorship.id || mentorship.requestId) : null;
  const userId = currentUser ? (currentUser.userId || currentUser.id || currentUser.studentId || currentUser.alumniId) : null;
  const userType = currentUser ? (currentUser.userType || currentUser.role || '').toUpperCase() : '';

  const counterpartName = mentorship
    ? (userType === 'STUDENT' ? (mentorship.mentorName || 'Alumni Mentor') : (mentorship.studentName || 'Student'))
    : 'Mentor';

  const fetchMessages = async (silent = false) => {
    if (!mentorshipId || !userId || !userType) return;
    if (!silent) setLoading(true);

    try {
      const res = await api.get(`/mentorship/chat/${mentorshipId}`, {
        params: { userId, userType }
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error fetching chat messages:', err);
      if (!silent) {
        antMessage.error('Unable to load chat conversation. Please try again.');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && mentorshipId && userId && userType) {
      fetchMessages(false);

      // Set up light polling every 3.5 seconds while chat modal is open
      pollingRef.current = setInterval(() => {
        fetchMessages(true);
      }, 3500);
    } else {
      setMessages([]);
      setInputText('');
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [visible, mentorshipId, userId, userType]);

  useEffect(() => {
    if (visible) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, visible]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) {
      antMessage.warning('Please enter a message.');
      return;
    }
    if (!mentorshipId || !userId || !userType) {
      antMessage.error('Missing required authorization parameters.');
      return;
    }

    setSending(true);
    try {
      const payload = {
        mentorshipId: Number(mentorshipId),
        senderId: Number(userId),
        senderType: userType,
        messageText: text
      };

      const res = await api.post('/mentorship/chat/message', payload);
      const newMsg = res.data;
      setMessages(prev => [...prev, newMsg]);
      setInputText('');
      antMessage.success('Message sent');
    } catch (err) {
      console.error('Error sending message:', err);
      const errMsg = err.response?.data?.message || 'Failed to send message. Please try again.';
      antMessage.error(errMsg);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeStr;
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
      styles={{ body: { padding: '0 0 16px 0' } }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FiMessageSquare style={{ color: '#1b62d4', fontSize: 20 }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ac-text-primary, #0f172a)' }}>
              Chat with {counterpartName}
            </div>
            <div style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>
              Topic: {mentorship?.topic || mentorship?.remarks || 'Mentorship Guidance'}
            </div>
          </div>
        </div>
      }
    >
      <div style={{
        height: 380,
        overflowY: 'auto',
        padding: '16px 20px',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin tip="Loading conversation..." />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', margin: 'auto', color: '#94a3b8' }}>
            <FiMessageSquare size={36} style={{ marginBottom: 8, opacity: 0.6 }} />
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500 }}>No messages yet.</p>
            <p style={{ margin: '4px 0 0 0', fontSize: 12 }}>
              Send a message to start the conversation with your mentor!
            </p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = String(msg.senderId) === String(userId) && msg.senderType === userType;
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  alignSelf: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#64748b',
                  marginBottom: 3,
                  paddingLeft: isMe ? 0 : 4,
                  paddingRight: isMe ? 4 : 0
                }}>
                  {isMe ? 'You' : counterpartName}
                </div>
                <div style={{
                  backgroundColor: isMe ? '#1b62d4' : '#ffffff',
                  color: isMe ? '#ffffff' : '#0f172a',
                  padding: '10px 14px',
                  borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  border: isMe ? 'none' : '1px solid #e2e8f0',
                  fontSize: 13.5,
                  lineHeight: 1.45,
                  wordBreak: 'break-word'
                }}>
                  {msg.messageText}
                </div>
                <div style={{
                  fontSize: 10.5,
                  color: '#94a3b8',
                  marginTop: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  paddingLeft: isMe ? 0 : 4,
                  paddingRight: isMe ? 4 : 0
                }}>
                  <FiClock style={{ fontSize: 10 }} />
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '16px 20px 0 20px', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <Input.TextArea
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={`Write a message to ${counterpartName}...`}
          maxLength={2000}
          style={{ borderRadius: 8, resize: 'none' }}
        />
        <Button
          type="primary"
          icon={<FiSend />}
          onClick={handleSend}
          loading={sending}
          style={{
            backgroundColor: '#1b62d4',
            borderColor: '#1b62d4',
            height: 52,
            padding: '0 20px',
            borderRadius: 8,
            fontWeight: 600
          }}
        >
          Send
        </Button>
      </div>
    </Modal>
  );
};
