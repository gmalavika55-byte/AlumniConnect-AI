import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Button, message, Space, Modal } from 'antd';
import { FiUsers, FiCheck, FiX, FiEye, FiClock, FiStar, FiBookOpen } from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';

export const AlumniMentorshipPage = () => {
  const navigate = useNavigate();

  // Requests state
  const [requests, setRequests] = useState([
    {
      id: 101,
      studentName: 'John Mathew',
      registerNumber: '21CS085',
      dept: 'Computer Science & Engineering',
      semester: 'Semester 5',
      cgpa: '8.85',
      matchPct: '98% MATCH',
      topic: 'System Design & Scalable Frontend Architecture',
      careerGoal: 'Aspiring Full Stack Engineer aiming for Big Tech interviews.',
      skills: ['React.js', 'System Design', 'Algorithms', 'Node.js'],
      status: 'Pending',
      requestDate: 'Today, 02:30 PM'
    },
    {
      id: 102,
      studentName: 'Ananya Sharma',
      registerNumber: '21CS099',
      dept: 'Information Technology',
      semester: 'Semester 5',
      cgpa: '9.12',
      matchPct: '95% MATCH',
      topic: 'Machine Learning Pipeline Optimization & PyTorch',
      careerGoal: 'Seeking guidance for AI/ML research internships and projects.',
      skills: ['Python', 'Machine Learning', 'PyTorch', 'Data Structures'],
      status: 'Pending',
      requestDate: 'Yesterday, 05:15 PM'
    },
    {
      id: 103,
      studentName: 'Karthik Raja',
      registerNumber: '22EC042',
      dept: 'Electronics & Communication',
      semester: 'Semester 3',
      cgpa: '8.40',
      matchPct: '88% MATCH',
      topic: 'Embedded Systems & Cloud IoT Integration',
      careerGoal: 'Building smart hardware IoT prototypes with cloud backends.',
      skills: ['C++', 'Embedded C', 'AWS IoT', 'Microcontrollers'],
      status: 'Accepted',
      requestDate: 'July 28, 2026'
    },
    {
      id: 104,
      studentName: 'Devendra Patel',
      registerNumber: '23ME015',
      dept: 'Mechanical Engineering',
      semester: 'Semester 1',
      cgpa: '7.85',
      matchPct: '82% MATCH',
      topic: 'CAD Design & Manufacturing Automation',
      careerGoal: 'Preparing for Core Mechanical design roles.',
      skills: ['SolidWorks', 'CAD', 'Python Basics'],
      status: 'Declined',
      requestDate: 'July 25, 2026'
    }
  ]);

  const handleAccept = (req) => {
    setRequests(requests.map(r => r.id === req.id ? { ...r, status: 'Accepted' } : r));
    message.success(`Mentorship request from ${req.studentName} accepted!`);
  };

  const handleDecline = (req) => {
    Modal.confirm({
      title: `Decline Mentorship Request from "${req.studentName}"?`,
      content: 'The student will be notified that you are currently unavailable for this session.',
      okText: 'Decline Request',
      okType: 'danger',
      onOk() {
        setRequests(requests.map(r => r.id === req.id ? { ...r, status: 'Declined' } : r));
        message.info(`Request from ${req.studentName} declined.`);
      }
    });
  };

  return (
    <AlumniLayout>
      {/* Title Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f1e36', margin: '0 0 4px 0' }}>Mentorship Requests</h1>
        <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
          Review and respond to 1-on-1 mentorship session requests submitted by current students.
        </p>
      </div>

      {/* Requests Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
        {requests.map(req => (
          <div key={req.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
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
                <Tag color={req.status === 'Accepted' ? 'success' : req.status === 'Pending' ? 'warning' : 'error'} style={{ fontWeight: 700 }}>
                  {req.status.toUpperCase()}
                </Tag>
              </div>

              {/* Student Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#071330',
                  color: '#ffffff',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16
                }}>
                  {req.studentName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f1e36', margin: 0 }}>{req.studentName}</h3>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{req.registerNumber} • {req.dept} ({req.semester})</div>
                </div>
              </div>

              {/* Requested Topic */}
              <div style={{ padding: 12, backgroundColor: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9', marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Requested Topic</span>
                <p style={{ margin: '2px 0 0 0', fontSize: 13.5, fontWeight: 700, color: '#0f1e36' }}>{req.topic}</p>
              </div>

              {/* Career Goal */}
              <p style={{ fontSize: 13, color: '#475569', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                <strong>Career Goal:</strong> {req.careerGoal}
              </p>

              {/* Skill Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {req.skills.map((s, idx) => (
                  <span key={idx} style={{ fontSize: 11, fontWeight: 600, backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#0f1e36', padding: '3px 8px', borderRadius: 6 }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {/* View Profile MUST navigate to complete student profile page! */}
              <Button
                type="default"
                icon={<FiEye />}
                style={{ flex: 1, fontWeight: 600 }}
                onClick={() => navigate(`/alumni/student/${req.id}`, { state: { student: req } })}
              >
                View Profile
              </Button>

              {req.status === 'Pending' && (
                <>
                  <Button
                    type="primary"
                    icon={<FiCheck />}
                    style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', fontWeight: 600 }}
                    onClick={() => handleAccept(req)}
                  >
                    Accept
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<FiX />}
                    style={{ fontWeight: 600 }}
                    onClick={() => handleDecline(req)}
                  >
                    Decline
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </AlumniLayout>
  );
};
