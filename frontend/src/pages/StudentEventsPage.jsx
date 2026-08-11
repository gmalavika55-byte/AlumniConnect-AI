import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { message, Modal } from 'antd';
import { FiCalendar, FiClock, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { StudentLayout } from '../components/student/StudentLayout';
import { EventRegisterModal } from '../components/student/EventRegisterModal';
import { useAppContext } from '../context/AppContext';
import { authService } from '../services/authService';
import api from '../services/api';
import styles from './StudentEventsPage.module.css';

export const StudentEventsPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState((location.state && location.state.tab) || 'Upcoming Events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [detailsEvent, setDetailsEvent] = useState(null);

  const { searchQuery, events, refreshData } = useAppContext();

  const handleRegisterClick = (eventItem) => {
    setSelectedEvent(eventItem);
    setIsRegisterOpen(true);
  };

  const handleRegisterSuccess = async (eventId) => {
    const student = authService.getCurrentUser();
    if (!student) return;

    try {
      const payload = {
        eventId: eventId,
        studentId: student.studentId,
        alumniId: null,
        registrationDate: new Date().toISOString()
      };
      await api.post('/event/register', payload);
      message.success('Registration successful!');
      refreshData();
    } catch (err) {
      console.error("Error registering for event:", err);
      const errorMsg = err.response?.data || "Failed to register for event.";
      message.error(errorMsg);
    }
  };

  const handleCancelClick = (eventItem) => {
    const student = authService.getCurrentUser();
    if (!student) return;

    Modal.confirm({
      title: "Cancel Event Registration?",
      content: `Are you sure you want to cancel your registration for "${eventItem.title}"?`,
      okText: "Yes, Cancel",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await api.delete(`/event/registrations/cancel/${eventItem.id}/student/${student.studentId}`);
          message.success("Registration cancelled successfully.");
          refreshData();
        } catch (err) {
          console.error("Error cancelling registration:", err);
          const errorMsg = err.response?.data || "Failed to cancel registration.";
          message.error(errorMsg);
        }
      }
    });
  };

  // ── Search & Tab Filtering ──
  const isPast = (e) => e.eventDate && new Date(e.eventDate) < new Date();

  const filteredEvents = events.filter(e => {
    // 1. Tab Filter
    if (activeTab === 'Registered Events' && !e.registered) return false;
    if (activeTab === 'Past Events' && !isPast(e)) return false;
    if (activeTab === 'Upcoming Events' && isPast(e)) return false;

    // 2. Search Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        e.title?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        e.speaker?.toLowerCase().includes(q) ||
        e.venue?.toLowerCase().includes(q)
      );
    }
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
      {filteredEvents.length > 0 ? (
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
                {event.maxParticipants ? (
                  <div className={styles.metaRow}>
                    <FiCheckCircle style={{ color: '#1b62d4' }} /> Registered: {event.registeredCount || 0} / {event.maxParticipants}
                  </div>
                ) : null}
              </div>

              <div className={styles.cardFooter}>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => setDetailsEvent(event)}
                >
                  View Details
                </button>

                {event.registered ? (
                  <button
                    className={styles.cancelBtn}
                    onClick={() => handleCancelClick(event)}
                  >
                    Cancel RSVP
                  </button>
                ) : (event.maxParticipants && (event.registeredCount || 0) >= event.maxParticipants) ? (
                  <button className={styles.registeredBtn} style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }} disabled>
                    Event Full
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
      ) : (
        <div className={styles.emptyState}>
          <FiCalendar size={48} className={styles.emptyIcon} />
          <h3>No events found</h3>
          <p>We couldn't find any events matching "{searchQuery}". Try a different keyword!</p>
        </div>
      )}

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
            detailsEvent.registered ? (
              <button
                key="cancel"
                className={styles.cancelBtn}
                onClick={() => {
                  setDetailsEvent(null);
                  handleCancelClick(detailsEvent);
                }}
              >
                Cancel RSVP
              </button>
            ) : (detailsEvent.maxParticipants && (detailsEvent.registeredCount || 0) >= detailsEvent.maxParticipants) ? (
              <button key="full" className={styles.registeredBtn} style={{ backgroundColor: '#fee2e2', color: '#b91c1c', cursor: 'not-allowed' }} disabled>
                Event Full
              </button>
            ) : (
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
