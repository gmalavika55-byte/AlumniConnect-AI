import React, { useState } from 'react';
import { message, Modal, Rate, Tag } from 'antd';
import { FiUsers, FiCalendar, FiVideo, FiMessageSquare, FiStar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { StudentLayout } from '../components/student/StudentLayout';
import { RequestMentorshipModal } from '../components/student/RequestMentorshipModal';
import { JoinMeetingModal } from '../components/student/JoinMeetingModal';
import { LeaveFeedbackModal } from '../components/student/LeaveFeedbackModal';
import styles from './StudentMentorshipPage.module.css';

export const StudentMentorshipPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Available Mentors');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [feedbackSession, setFeedbackSession] = useState(null);

  const mentors = [
    {
      id: 1,
      name: 'Priya Sankar',
      role: 'Senior Software Engineer',
      company: 'Google India',
      match: '98% MATCH',
      rating: 4.9,
      bio: 'Ex-KCE alumni (Class of 2019). Specialized in Distributed Systems, React architecture, and big tech interview strategies.',
      skills: ['React', 'System Design', 'Cloud', 'Algorithms']
    },
    {
      id: 2,
      name: 'Arun Kumar',
      role: 'Staff ML Scientist',
      company: 'Amazon AWS',
      match: '92% MATCH',
      rating: 4.8,
      bio: 'Alumni Class of 2018. Passionate about guiding students in Natural Language Processing, Machine Learning, and Python optimization.',
      skills: ['Python', 'Deep Learning', 'NLP', 'PyTorch']
    },
    {
      id: 3,
      name: 'Divya Rajan',
      role: 'Lead Cloud Architect',
      company: 'Flipkart',
      match: '87% MATCH',
      rating: 4.7,
      bio: 'Alumni Class of 2020. Helps mentees master AWS microservices, DevOps automation, and scalable backend design.',
      skills: ['AWS', 'Kubernetes', 'Go', 'DevOps']
    }
  ];

  const [activeMentorships, setActiveMentorships] = useState([
    {
      id: 101,
      mentorName: 'Priya Sankar',
      topic: 'System Design & Scalable Frontend Architecture',
      date: 'Today',
      time: '05:00 PM - 06:00 PM',
      status: 'Ready to Join'
    }
  ]);

  const [pastHistory, setPastHistory] = useState([
    {
      id: 201,
      mentorName: 'Arun Kumar',
      topic: 'Resume Review & ML Career Guidance',
      date: 'July 24, 2026',
      rating: 5,
      feedback: 'Incredible session! Arun reviewed my resume line-by-line and shared invaluable Machine Learning project ideas.'
    }
  ]);

  const handleRequestClick = (mentor) => {
    setSelectedMentor(mentor);
    setIsRequestModalOpen(true);
  };

  const handleRequestSuccess = (newReq) => {
    message.success('Request recorded in your Mentorship dashboard.');
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
        {['Available Mentors', 'Active Mentorships', 'Meeting History'].map(tab => (
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
        <div className={styles.mentorGrid}>
          {mentors.map(mentor => (
            <div key={mentor.id} className={styles.mentorCard}>
              <div className={styles.mentorHeader}>
                <div className={styles.avatarCircle}>
                  {mentor.name.split(' ').map(n => n[0]).join('')}
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
                {mentor.skills.map((s, idx) => (
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
      )}

      {/* 2. Active Mentorships Tab */}
      {activeTab === 'Active Mentorships' && (
        <div>
          {activeMentorships.map(session => (
            <div key={session.id} className={styles.sessionCard}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 16, color: '#0f1e36' }}>
                  Session with {session.mentorName}
                </h3>
                <p style={{ margin: '0 0 6px 0', fontSize: 13, color: '#64748b' }}>
                  <strong>Topic:</strong> {session.topic}
                </p>
                <span style={{ fontSize: 12, color: '#1b62d4', fontWeight: 600 }}>
                  <FiClock style={{ marginRight: 4 }} /> {session.date} ({session.time})
                </span>
              </div>

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
          ))}
        </div>
      )}

      {/* 3. Meeting History Tab */}
      {activeTab === 'Meeting History' && (
        <div>
          {pastHistory.map(history => (
            <div key={history.id} className={styles.sessionCard}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: 16, color: '#0f1e36' }}>
                  Completed Session with {history.mentorName}
                </h3>
                <p style={{ margin: '0 0 4px 0', fontSize: 13, color: '#64748b' }}>
                  <strong>Topic:</strong> {history.topic} • {history.date}
                </p>
                <div style={{ fontSize: 13, color: '#334155', fontStyle: 'italic', marginTop: 8 }}>
                  "{history.feedback}"
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
          ))}
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
