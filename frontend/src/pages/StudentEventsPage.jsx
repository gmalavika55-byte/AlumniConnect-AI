import React, { useState } from 'react';
import { message, Modal } from 'antd';
import { FiCalendar, FiClock, FiMapPin, FiCheckCircle, FiAward, FiInfo } from 'react-icons/fi';
import { StudentLayout } from '../components/student/StudentLayout';
import { EventRegisterModal } from '../components/student/EventRegisterModal';
import styles from './StudentEventsPage.module.css';

export const StudentEventsPage = () => {
  const [activeTab, setActiveTab] = useState('Upcoming Events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [detailsEvent, setDetailsEvent] = useState(null);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Tech Careers Panel 2026',
      category: 'Career',
      date: 'Aug 10, 2026',
      dayNum: '10',
      monthStr: 'AUG',
      time: '04:00 PM - 06:00 PM',
      venue: 'Main Auditorium & Zoom',
      registered: false,
      speaker: 'Priya Sankar (Google), Arun Kumar (Amazon)',
      description: 'Interact with industry leaders sharing strategies for tech campus placement, system design interviews, and AI careers.'
    },
    {
      id: 2,
      title: 'Alumni Networking Night',
      category: 'Networking',
      date: 'Aug 18, 2026',
      dayNum: '18',
      monthStr: 'AUG',
      time: '05:30 PM - 08:00 PM',
      venue: 'Campus Lawn & Alumni Hall',
      registered: true,
      speaker: 'Various Alumni Mentors',
      description: 'Exclusive informal networking event connecting current 3rd and 4th year engineering students with distinguished alumni.'
    },
    {
      id: 3,
      title: 'Build for India Hackathon 2026',
      category: 'Hackathon',
      date: 'Aug 25, 2026',
      dayNum: '25',
      monthStr: 'AUG',
      time: '09:00 AM - 06:00 PM',
      venue: 'Innovation Lab, Block C',
      registered: false,
      speaker: 'KCE Innovation Council',
      description: '24-hour hackathon building scalable technology solutions for Indian urban logistics, healthcare, and education.'
    },
    {
      id: 4,
      title: 'Cloud Architecture & DevOps Masterclass',
      category: 'Workshop',
      date: 'Sep 05, 2026',
      dayNum: '05',
      monthStr: 'SEP',
      time: '10:00 AM - 01:00 PM',
      venue: 'Lab 4 & Online',
      registered: false,
      speaker: 'Divya Rajan (Flipkart)',
      description: 'Hands-on workshop covering Docker containers, Kubernetes clusters, and AWS deployment pipelines.'
    }
  ]);

  const handleRegisterClick = (eventItem) => {
    setSelectedEvent(eventItem);
    setIsRegisterOpen(true);
  };

  const handleRegisterSuccess = (eventId) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registered: true } : e));
  };

  const filteredEvents = events.filter(e => {
    if (activeTab === 'Registered Events') return e.registered;
    if (activeTab === 'Past Events') return false; // Simulated past list
    return true;
  });

  return (
    <StudentLayout>
      <div className={styles.headerBar}>
        <div>
          <h1 className={styles.pageTitle}>Campus & Alumni Events</h1>
          <p className={styles.pageSub}>Explore workshops, hackathons, webinars, and networking meetups.</p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className={styles.eventsTabRow}>
        {['Upcoming Events', 'Registered Events', 'Past Events'].map(tab => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTabBtn : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className={styles.eventsGrid}>
        {filteredEvents.map(event => (
          <div key={event.id} className={styles.eventCard}>
            <div className={styles.eventBadgeRow}>
              <div className={styles.dateBox}>
                <span className={styles.dateNum}>{event.dayNum}</span>
                <span className={styles.dateMonth}>{event.monthStr}</span>
              </div>
              <span className={styles.categoryTag}>{event.category}</span>
            </div>

            <h3 className={styles.eventTitle}>{event.title}</h3>

            <div className={styles.eventMeta}>
              <div className={styles.metaRow}>
                <FiClock style={{ color: '#1b62d4' }} /> {event.time}
              </div>
              <div className={styles.metaRow}>
                <FiMapPin style={{ color: '#1b62d4' }} /> {event.venue}
              </div>
            </div>

            <div className={styles.cardFooter}>
              <button
                className={styles.secondaryBtn}
                onClick={() => setDetailsEvent(event)}
              >
                View Details
              </button>

              {event.registered ? (
                <button className={styles.registeredBtn} disabled>
                  <FiCheckCircle style={{ marginRight: 4 }} /> Registered
                </button>
              ) : (
                <button
                  className={styles.primaryBtn}
                  onClick={() => handleRegisterClick(event)}
                >
                  Register Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {detailsEvent && (
        <Modal
          title={detailsEvent.title}
          open={!!detailsEvent}
          onCancel={() => setDetailsEvent(null)}
          footer={[
            <button key="close" className={styles.secondaryBtn} onClick={() => setDetailsEvent(null)}>
              Close
            </button>,
            !detailsEvent.registered && (
              <button
                key="reg"
                className={styles.primaryBtn}
                onClick={() => {
                  setDetailsEvent(null);
                  handleRegisterClick(detailsEvent);
                }}
              >
                Register Now
              </button>
            )
          ]}
        >
          <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>{detailsEvent.description}</p>
          <p style={{ fontSize: 13, color: '#64748b' }}><strong>Speakers:</strong> {detailsEvent.speaker}</p>
          <p style={{ fontSize: 13, color: '#64748b' }}><strong>Venue:</strong> {detailsEvent.venue}</p>
          <p style={{ fontSize: 13, color: '#64748b' }}><strong>Date & Time:</strong> {detailsEvent.date} ({detailsEvent.time})</p>
        </Modal>
      )}

      {/* Event Register Form Modal */}
      <EventRegisterModal
        visible={isRegisterOpen}
        event={selectedEvent}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />
    </StudentLayout>
  );
};
