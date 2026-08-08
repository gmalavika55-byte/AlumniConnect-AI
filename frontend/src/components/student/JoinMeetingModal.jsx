import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { FiVideo, FiMic, FiMicOff, FiVideoOff, FiPhoneOff, FiMessageSquare } from 'react-icons/fi';

export const JoinMeetingModal = ({ visible, session, onClose, onFinishSession }) => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  if (!session) return null;

  return (
    <Modal
      title={`Live Mentorship Call with ${session.mentorName}`}
      open={visible}
      onCancel={onClose}
      width={720}
      footer={null}
    >
      <div style={{
        backgroundColor: '#071330',
        borderRadius: 12,
        height: 360,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        position: 'relative',
        marginBottom: 16
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: '#1b62d4',
          fontSize: 28,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12
        }}>
          {session.mentorName.split(' ').map(n => n[0]).join('')}
        </div>
        <h3 style={{ color: '#fff', margin: 0 }}>{session.mentorName}</h3>
        <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>Topic: {session.topic}</p>
        <span style={{ backgroundColor: 'rgba(22, 163, 74, 0.2)', color: '#4ade80', fontSize: 12, padding: '4px 12px', borderRadius: 12, marginTop: 8 }}>
          ● LIVE SESSION CONNECTED
        </span>

        {/* Video Control Bar */}
        <div style={{
          position: 'absolute',
          bottom: 16,
          display: 'flex',
          gap: 16
        }}>
          <Button
            shape="circle"
            size="large"
            type={micOn ? 'default' : 'primary'}
            danger={!micOn}
            onClick={() => setMicOn(!micOn)}
            icon={micOn ? <FiMic /> : <FiMicOff />}
          />
          <Button
            shape="circle"
            size="large"
            type={videoOn ? 'default' : 'primary'}
            danger={!videoOn}
            onClick={() => setVideoOn(!videoOn)}
            icon={videoOn ? <FiVideo /> : <FiVideoOff />}
          />
          <Button
            shape="circle"
            size="large"
            type="primary"
            danger
            onClick={() => {
              message.info('Session ended.');
              onClose();
              onFinishSession(session);
            }}
            icon={<FiPhoneOff />}
          />
        </div>
      </div>
    </Modal>
  );
};
