import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiUsers,
  FiCalendar,
  FiHeart,
  FiClock,
  FiArrowRight,
  FiBriefcase,
  FiMapPin
} from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import { useAppContext } from '../context/AppContext';
import { authService } from '../services/authService';
import styles from './AlumniDashboard.module.css';

export const AlumniDashboard = () => {
  const navigate = useNavigate();
  const { alumniRequests = [], alumniDonations = 0 } = useAppContext();
  const user = authService.getCurrentUser();

  // Dynamically calculate states based on shared global context
  const activeCount = alumniRequests.filter(r => r?.status?.toUpperCase() === 'ACCEPTED').length;
  const pendingCount = alumniRequests.filter(r => r?.status?.toUpperCase() === 'PENDING').length;

  return (
    <AlumniLayout>
      {/* Welcome Hero Bar */}
      <div
        className={styles.welcomeBar}
        style={{
          backgroundColor: 'var(--ac-bg-card)',
          borderRadius: 16,
          border: '1px solid var(--ac-border)',
          padding: 24,
          marginBottom: 24
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 6px 0' }}>
              Welcome back, {user?.name || 'Alumni'}
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
              {user?.designation || 'Alumni Member'}
              {user?.currentCompany ? (
                <> at <strong>{user.currentCompany}</strong></>
              ) : null}
              {user?.batch || user?.department ? (
                <> &bull; {user.batch ? `Class of ${user.batch}` : ''} {user.department ? `(${user.department})` : ''}</>
              ) : null}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Profile Card */}
      <div
        style={{
          backgroundColor: 'var(--ac-bg-card)',
          borderRadius: 16,
          border: '1px solid var(--ac-border)',
          padding: 24,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20
        }}
      >
        {/* Left: Avatar + Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1, minWidth: 0 }}>
          {/* Avatar circle */}
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: 'var(--ac-brand-bg)',
            color: 'var(--ac-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            flexShrink: 0
          }}>
            <FiUser />
          </div>

          {/* Profile text details */}
          <div style={{ minWidth: 0 }}>
            <h4 style={{ margin: '0 0 3px 0', fontSize: 15, fontWeight: 700, color: 'var(--ac-text-primary)' }}>
              Your Professional Profile
            </h4>

            {/* Department • Batch */}
            {(user?.department || user?.batch) && (
              <p style={{ margin: '0 0 4px 0', fontSize: 13, color: 'var(--ac-text-secondary)', display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                <FiBriefcase size={12} style={{ color: 'var(--ac-brand)', flexShrink: 0 }} />
                {[user?.department, user?.batch ? `Batch ${user.batch}` : null].filter(Boolean).join(' • ')}
              </p>
            )}

            {/* Designation at Company */}
            {(user?.designation || user?.currentCompany) && (
              <p style={{ margin: '0 0 4px 0', fontSize: 13, color: 'var(--ac-text-secondary)', display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                <FiBriefcase size={12} style={{ color: '#10b981', flexShrink: 0 }} />
                {[user?.designation, user?.currentCompany].filter(Boolean).join(' at ')}
              </p>
            )}

            {/* Location */}
            {user?.location && (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--ac-text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <FiMapPin size={12} style={{ color: '#ef4444', flexShrink: 0 }} />
                {user.location}
              </p>
            )}

            <p style={{ margin: '8px 0 0 0', fontSize: 12.5, color: 'var(--ac-text-secondary)' }}>
              Keep your professional profile up to date so students and alumni can learn more about your experience.
            </p>
          </div>
        </div>

        {/* Right: Update Profile button */}
        <button
          onClick={() => navigate('/alumni/profile')}
          style={{
            padding: '9px 18px',
            backgroundColor: 'var(--ac-brand)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13.5,
            flexShrink: 0,
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--ac-brand)')}
        >
          Update Profile <FiArrowRight />
        </button>
      </div>

      {/* Mentorship & Fundraising Statistics Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Mentorship Mentees Stats */}
        <div
          style={{
            backgroundColor: 'var(--ac-bg-card)',
            borderRadius: 16,
            border: '1px solid var(--ac-border)',
            padding: 20,
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => navigate('/alumni/mentorship', { state: { tab: 'ACCEPTED' } })}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'var(--ac-brand-bg)', color: 'var(--ac-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <FiUsers />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: 12 }}>Active</span>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>STUDENTS MENTORED</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '2px 0 0 0' }}>{activeCount} Mentees</div>
        </div>

        {/* Mentorship Pending Requests Stats */}
        <div
          style={{
            backgroundColor: 'var(--ac-bg-card)',
            borderRadius: 16,
            border: '1px solid var(--ac-border)',
            padding: 20,
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => navigate('/alumni/mentorship', { state: { tab: 'PENDING' } })}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <FiClock />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#d97706', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: 12 }}>Action Req.</span>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>PENDING REQUESTS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '2px 0 0 0' }}>{pendingCount} Requests</div>
        </div>

        {/* Fundraising Summary Stats */}
        <div
          style={{
            backgroundColor: 'var(--ac-bg-card)',
            borderRadius: 16,
            border: '1px solid var(--ac-border)',
            padding: 20,
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => navigate('/alumni/fundraising')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'var(--ac-brand-bg)', color: 'var(--ac-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <FiHeart />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-brand)', backgroundColor: 'var(--ac-brand-bg)', padding: '2px 8px', borderRadius: 12 }}>Donor</span>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>TOTAL DONATIONS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '2px 0 0 0' }}>₹{(alumniDonations || 0).toLocaleString()}</div>
        </div>
      </div>

      {/* 2-Column Dashboard Grid containing only Upcoming Events now */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
        {/* Upcoming Events Section Card */}
        <div
          style={{
            backgroundColor: 'var(--ac-bg-card)',
            borderRadius: 16,
            border: '1px solid var(--ac-border)',
            padding: 24,
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => navigate('/alumni/events')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ac-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiCalendar color="var(--ac-brand)" /> Upcoming Events
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/alumni/events');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ac-brand)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 13
              }}
            >
              View All Events →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 14, backgroundColor: 'var(--ac-bg-input)', border: '1px solid var(--ac-border)', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong style={{ fontSize: 15, color: 'var(--ac-text-primary)' }}>Global Alumni Meetup 2026</strong>
                <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: 'var(--ac-brand-bg)', color: 'var(--ac-brand)', padding: '2px 8px', borderRadius: 10 }}>Keynote Speaker</span>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, color: 'var(--ac-text-secondary)' }}>
                <FiClock style={{ marginRight: 4 }} /> Sept 15, 2026 • 06:00 PM IST | Auditorium & Zoom
              </p>
            </div>

            <div style={{ padding: 14, backgroundColor: 'var(--ac-bg-input)', border: '1px solid var(--ac-border)', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong style={{ fontSize: 15, color: 'var(--ac-text-primary)' }}>AI & System Design Workshop</strong>
                <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: 10 }}>Registered</span>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, color: 'var(--ac-text-secondary)' }}>
                <FiClock style={{ marginRight: 4 }} /> Aug 28, 2026 • 04:00 PM IST | Online Webinar
              </p>
            </div>
          </div>
        </div>
      </div>
    </AlumniLayout>
  );
};
