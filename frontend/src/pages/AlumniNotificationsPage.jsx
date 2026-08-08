import React, { useState } from 'react';
import { Tag, Button, message, Tabs } from 'antd';
import { FiBell, FiUsers, FiCalendar, FiCheckCircle, FiCheck, FiShield } from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';

export const AlumniNotificationsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      category: 'Mentorship',
      title: 'New Mentorship Request from John Mathew',
      desc: 'John Mathew requested a 1-on-1 session on "System Design & Scalable Frontend Architecture".',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      category: 'Mentorship',
      title: 'Mentorship Session Reminder',
      desc: 'Upcoming session with Karthik Raja scheduled for Tomorrow at 05:00 PM IST.',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      category: 'Events',
      title: 'Invitation: Global Alumni Meetup 2026',
      desc: 'You are invited as a Keynote Speaker for Global Alumni Meetup on September 15, 2026.',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      category: 'System',
      title: 'Donation Receipt Generated',
      desc: 'Tax exemption certificate for your contribution of ₹15,000 to AI Innovation Lab is ready.',
      time: '2 days ago',
      read: true
    },
    {
      id: 5,
      category: 'Events',
      title: 'New Workshop Published: ML Transformer Pipeline',
      desc: 'Arun Kumar published a new technical workshop for computer science mentees.',
      time: '3 days ago',
      read: true
    }
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    message.success('Marked as read');
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    message.success('All notifications marked as read');
  };

  const filteredNotifs = notifications.filter(n => activeCategory === 'All' || n.category === activeCategory);

  return (
    <AlumniLayout>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f1e36', margin: '0 0 4px 0' }}>Notifications & Alerts</h1>
          <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
            Stay updated with mentorship requests, event invites, and institutional announcements.
          </p>
        </div>

        <Button
          icon={<FiCheck />}
          style={{ borderRadius: 8, fontWeight: 600 }}
          onClick={handleMarkAllRead}
        >
          Mark All as Read
        </Button>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['All', 'Mentorship', 'Events', 'System'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: activeCategory === cat ? '1px solid #1b62d4' : '1px solid #e2e8f0',
              backgroundColor: activeCategory === cat ? '#1b62d4' : '#ffffff',
              color: activeCategory === cat ? '#ffffff' : '#0f1e36',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 13.5
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredNotifs.map(notif => (
            <div
              key={notif.id}
              style={{
                padding: 16,
                backgroundColor: notif.read ? '#f8fafc' : '#e0edff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: notif.category === 'Mentorship' ? '#1b62d4' : notif.category === 'Events' ? '#16a34a' : '#7c3aed',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0
                }}>
                  {notif.category === 'Mentorship' ? <FiUsers /> : notif.category === 'Events' ? <FiCalendar /> : <FiShield />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <strong style={{ fontSize: 15, color: '#0f1e36' }}>{notif.title}</strong>
                    {!notif.read && <Tag color="blue" style={{ fontWeight: 700 }}>NEW</Tag>}
                  </div>
                  <p style={{ margin: '0 0 4px 0', fontSize: 13, color: '#475569' }}>{notif.desc}</p>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{notif.time}</span>
                </div>
              </div>

              {!notif.read && (
                <Button
                  size="small"
                  type="text"
                  icon={<FiCheck />}
                  style={{ color: '#1b62d4', fontWeight: 600 }}
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  Mark Read
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </AlumniLayout>
  );
};
