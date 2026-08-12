import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { message, Modal, Tag } from 'antd';
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

  const [cancelledEventIds, setCancelledEventIds] = useState(() => {
    try {
      const saved = localStorage.getItem('cancelled_event_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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
      await refreshData();
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
      okText: "Yes, Cancel Registration",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await api.delete(`/event/registrations/cancel/${eventItem.id}/student/${student.studentId}`);
          message.success("Registration cancelled successfully.");
          const updatedCancelled = [...new Set([...cancelledEventIds, eventItem.id])];
          setCancelledEventIds(updatedCancelled);
          localStorage.setItem('cancelled_event_ids', JSON.stringify(updatedCancelled));
          await refreshData();
        } catch (err) {
          console.error("Error cancelling registration:", err);
          const errorMsg = err.response?.data || "Failed to cancel registration.";
          message.error(errorMsg);
        }
      }
    });
  };

  // ── Date/Time Parsing & Helper Functions ──
  const parseTimeString = (timeStr) => {
    if (!timeStr) return null;
    const str = timeStr.trim().toUpperCase();
    const isPM = str.includes('PM');
    const isAM = str.includes('AM');
    const cleanStr = str.replace(/(AM|PM)/g, '').trim();
    const parts = cleanStr.split(':');
    if (parts.length < 2) return null;
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) return null;
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const isPast = (e) => {
    if (!e || !e.eventDate) return false;
    const now = new Date();
    const eventDateObj = new Date(e.eventDate);
    if (isNaN(eventDateObj.getTime())) return false;

    const eventDateOnly = new Date(eventDateObj.getFullYear(), eventDateObj.getMonth(), eventDateObj.getDate());
    const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (eventDateOnly < todayOnly) return true;
    if (eventDateOnly > todayOnly) return false;

    // Event is TODAY — check end time if available
    const timeStr = e.endTime || (e.time && e.time.includes('-') ? e.time.split('-')[1]?.trim() : null);
    if (timeStr) {
      const parsed = parseTimeString(timeStr);
      if (parsed) {
        const endDateTime = new Date(eventDateObj.getFullYear(), eventDateObj.getMonth(), eventDateObj.getDate(), parsed.hours, parsed.minutes);
        return now > endDateTime;
      }
    }
    return false;
  };

  // ── Mutually Exclusive Tab Assignment Logic ──
  const isStudentEligible = (e) => {
    if (!e.audience) return true;
    const aud = e.audience.toUpperCase();
    return aud.includes('STUDENT') || aud === 'BOTH' || aud === 'EVERYONE';
  };

  const getTabForEvent = (e) => {
    if (isPast(e)) return 'Past Events';
    if (e.registered) return 'Registered Events';
    if (isStudentEligible(e)) return 'Upcoming Events';
    return null;
  };

  // ── Search & Mutually Exclusive Tab Filtering ──
  const filteredEvents = events.filter(e => {
    // 1. Mutually Exclusive Tab Filter
    const targetTab = getTabForEvent(e);
    if (targetTab !== activeTab) return false;

    // 2. Search Filter
    if ((searchQuery || '').trim() !== '') {
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
          {filteredEvents.map(event => {
            const eventEnded = isPast(event);

            return (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventBadgeRow}>
                  <div className={styles.dateBox}>
                    <span className={styles.dateNum}>{event.dayNum}</span>
                    <span className={styles.dateMonth}>{event.monthStr}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className={styles.categoryTag}>{event.category}</span>
                    {event.audience === 'STUDENTS' && (
                      <Tag color="purple" style={{ fontWeight: 600 }}>Students Only</Tag>
                    )}
                    {event.audience === 'ALUMNI' && (
                      <Tag color="orange" style={{ fontWeight: 600 }}>Alumni Only</Tag>
                    )}
                  </div>
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

                  {eventEnded ? (
                    event.registered ? (
                      <button className={styles.registeredBtn} disabled style={{ backgroundColor: '#e0edff', color: '#1b62d4', cursor: 'default' }}>
                        Completed ✓
                      </button>
                    ) : cancelledEventIds.includes(event.id) ? (
                      <button className={styles.registeredBtn} disabled style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'default' }}>
                        Cancelled
                      </button>
                    ) : (
                      <button className={styles.registeredBtn} style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'default' }} disabled>
                        Event Ended
                      </button>
                    )
                  ) : event.registered ? (
                    <button
                      className={styles.cancelBtn}
                      onClick={() => handleCancelClick(event)}
                    >
                      Cancel Registration
                    </button>
                  ) : (event.maxParticipants && (event.registeredCount || 0) >= event.maxParticipants) ? (
                    <button className={styles.registeredBtn} style={{ backgroundColor: '#fee2e2', color: '#b91c1c', cursor: 'not-allowed' }} disabled>
                      Registration Closed
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
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <FiCalendar size={48} className={styles.emptyIcon} />
          <h3>No events found</h3>
          <p>{searchQuery ? `We couldn't find any events matching "${searchQuery}". Try a different keyword!` : `No events currently in ${activeTab}.`}</p>
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
            isPast(detailsEvent) ? (
              detailsEvent.registered ? (
                <button key="completed" className={styles.registeredBtn} style={{ backgroundColor: '#e0edff', color: '#1b62d4', cursor: 'default' }} disabled>
                  Completed ✓
                </button>
              ) : cancelledEventIds.includes(detailsEvent.id) ? (
                <button key="cancelled" className={styles.registeredBtn} style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'default' }} disabled>
                  Cancelled
                </button>
              ) : (
                <button key="ended" className={styles.registeredBtn} style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }} disabled>
                  Event Ended
                </button>
              )
            ) : detailsEvent.registered ? (
              <button
                key="cancel"
                className={styles.cancelBtn}
                onClick={() => {
                  setDetailsEvent(null);
                  handleCancelClick(detailsEvent);
                }}
              >
                Cancel Registration
              </button>
            ) : (detailsEvent.maxParticipants && (detailsEvent.registeredCount || 0) >= detailsEvent.maxParticipants) ? (
              <button key="full" className={styles.registeredBtn} style={{ backgroundColor: '#fee2e2', color: '#b91c1c', cursor: 'not-allowed' }} disabled>
                Registration Closed
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
          <p style={{ fontSize: 13, color: '#64748b' }}><strong>Date & Time:</strong> {detailsEvent.eventDate ? new Date(detailsEvent.eventDate).toLocaleDateString() : 'N/A'} ({detailsEvent.time})</p>
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
