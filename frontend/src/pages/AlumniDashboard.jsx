import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Modal } from 'antd';
import {
  FiUser,
  FiUsers,
  FiCalendar,
  FiHeart,
  FiBell,
  FiEdit2,
  FiPlus,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiArrowRight,
  FiAward
} from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import { CreateEventModal } from '../components/admin/CreateEventModal';
import styles from './AlumniDashboard.module.css';

export const AlumniDashboard = () => {
  const navigate = useNavigate();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  return (
    <AlumniLayout>
      {/* Welcome & Profile Completion Hero Bar */}
      <div className={styles.welcomeBar} style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f1e36', margin: '0 0 6px 0' }}>
              Welcome back, Rahul Kumar
            </h1>
            <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
              Senior Software Engineer at <strong>Google India</strong> • Class of 2018 (CSE)
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className={styles.secondaryBtn}
              style={{ padding: '10px 18px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={() => navigate('/alumni/profile')}
            >
              <FiEdit2 /> Update Profile
            </button>
            <button
              className={styles.primaryBtn}
              style={{ padding: '10px 18px', backgroundColor: '#1b62d4', color: '#ffffff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={() => setIsCreateEventOpen(true)}
            >
              <FiPlus /> Create Event
            </button>
          </div>
        </div>

        {/* Profile Completion Card Progress Bar */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#0f1e36', marginBottom: 6 }}>
            <span>Professional Profile Completion</span>
            <span style={{ color: '#1b62d4' }}>85% Complete</span>
          </div>
          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '85%', background: 'linear-gradient(90deg, #071330, #1b62d4)', borderRadius: 4 }} />
          </div>
        </div>
      </div>

      {/* Mentorship & Fundraising Statistics Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Mentorship Stats */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#e0edff', color: '#1b62d4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <FiUsers />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: 12 }}>Active</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>STUDENTS MENTORING</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0f1e36', margin: '2px 0 0 0' }}>12 Mentees</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <FiClock />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#d97706', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: 12 }}>Action Req.</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>PENDING REQUESTS</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0f1e36', margin: '2px 0 0 0' }}>4 Requests</div>
        </div>

        {/* Fundraising Summary */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <FiHeart />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#db2777', backgroundColor: '#fce7f3', padding: '2px 8px', borderRadius: 12 }}>Donor</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>TOTAL DONATIONS</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0f1e36', margin: '2px 0 0 0' }}>₹45,000</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <FiAward />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', backgroundColor: '#f3e8ff', padding: '2px 8px', borderRadius: 12 }}>Volunteer</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>VOLUNTEERING HOURS</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0f1e36', margin: '2px 0 0 0' }}>28 Hours</div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f1e36', margin: '0 0 16px 0' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <button
            onClick={() => navigate('/alumni/profile')}
            style={{ padding: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontWeight: 600, color: '#0f1e36', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <FiUser color="#1b62d4" size={18} /> Update Profile
          </button>

          <button
            onClick={() => navigate('/alumni/mentorship')}
            style={{ padding: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontWeight: 600, color: '#0f1e36', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <FiUsers color="#1b62d4" size={18} /> View Mentorship Requests
          </button>

          <button
            onClick={() => setIsCreateEventOpen(true)}
            style={{ padding: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontWeight: 600, color: '#0f1e36', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <FiCalendar color="#1b62d4" size={18} /> Create Event
          </button>

          <button
            onClick={() => navigate('/alumni/fundraising')}
            style={{ padding: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontWeight: 600, color: '#0f1e36', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <FiHeart color="#1b62d4" size={18} /> Support Fundraising
          </button>

          <button
            onClick={() => navigate('/alumni/notifications')}
            style={{ padding: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontWeight: 600, color: '#0f1e36', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <FiBell color="#1b62d4" size={18} /> Notifications
          </button>
        </div>
      </div>

      {/* 2-Column Dashboard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
        {/* Upcoming Events Section */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f1e36', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiCalendar color="#1b62d4" /> Upcoming Events
            </h3>
            <button onClick={() => navigate('/alumni/events')} style={{ background: 'none', border: 'none', color: '#1b62d4', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
              View All Events →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 14, backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong style={{ fontSize: 15, color: '#0f1e36' }}>Global Alumni Meetup 2026</strong>
                <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#e0edff', color: '#1b62d4', padding: '2px 8px', borderRadius: 10 }}>Keynote Speaker</span>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#64748b' }}>
                <FiClock style={{ marginRight: 4 }} /> Sept 15, 2026 • 06:00 PM IST | Auditorium & Zoom
              </p>
            </div>

            <div style={{ padding: 14, backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong style={{ fontSize: 15, color: '#0f1e36' }}>AI & System Design Workshop</strong>
                <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: 10 }}>Registered</span>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#64748b' }}>
                <FiClock style={{ marginRight: 4 }} /> Aug 28, 2026 • 04:00 PM IST | Online Webinar
              </p>
            </div>
          </div>
        </div>

        {/* Recent Notifications Section */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f1e36', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiBell color="#1b62d4" /> Recent Notifications
            </h3>
            <button onClick={() => navigate('/alumni/notifications')} style={{ background: 'none', border: 'none', color: '#1b62d4', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
              All Notifications →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 14, backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#e0edff', color: '#1b62d4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiUsers />
              </div>
              <div>
                <strong style={{ fontSize: 14, color: '#0f1e36', display: 'block' }}>New Mentorship Request from John Mathew</strong>
                <span style={{ fontSize: 12, color: '#64748b' }}>Topic: System Design & React Architecture • 2 hours ago</span>
              </div>
            </div>

            <div style={{ padding: 14, backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiHeart />
              </div>
              <div>
                <strong style={{ fontSize: 14, color: '#0f1e36', display: 'block' }}>Donation Receipt Issued</strong>
                <span style={{ fontSize: 12, color: '#64748b' }}>Contribution of ₹15,000 for Campus Tech Lab received • 1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        visible={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onAddEvent={(newEvent) => {
          message.success(`Event "${newEvent.title}" published!`);
        }}
      />
    </AlumniLayout>
  );
};
