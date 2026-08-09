import React, { useState } from 'react';
import { Tag, Button, Modal, message } from 'antd';
import { FiPlus, FiCalendar, FiClock, FiMapPin, FiUsers, FiEye, FiCheck, FiX, FiCheckCircle } from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import { CreateEventModal } from '../components/admin/CreateEventModal';

export const AlumniEventsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('ForYou');

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Global Alumni Meetup 2026',
      category: 'Reunion & Keynote',
      date: 'September 15, 2026',
      time: '06:00 PM - 09:00 PM IST',
      location: 'Grand Ballroom & Zoom Virtual Hall',
      speaker: 'Rahul Kumar (Sr. SWE, Google India)',
      creator: 'Rahul Kumar',
      attendees: 142,
      status: 'Upcoming',
      description: 'Annual global networking meetup bringing together alumni across big tech, startups, and research to mentor graduating students.',
      registered: false
    },
    {
      id: 2,
      title: 'Machine Learning & LLM Masterclass',
      category: 'Technical Workshop',
      date: 'August 28, 2026',
      time: '04:00 PM - 06:00 PM IST',
      location: 'Computer Science Lab 3 & Meet',
      speaker: 'Arun Kumar (Staff ML Scientist, AWS)',
      creator: 'Arun Kumar',
      attendees: 88,
      status: 'Upcoming',
      description: 'Hands-on practical session covering PyTorch transformer fine-tuning and deploying ML microservices.',
      registered: false
    },
    {
      id: 3,
      title: 'Cloud Architecture & DevOps Webinar',
      category: 'Webinar',
      date: 'July 20, 2026',
      time: '05:00 PM - 07:00 PM IST',
      location: 'Zoom Virtual Hall',
      speaker: 'Divya Rajan (Lead Architect, Flipkart)',
      creator: 'Divya Rajan',
      attendees: 115,
      status: 'Completed',
      description: 'Deep dive into Kubernetes cluster management and CI/CD automation pipelines.',
      registered: false
    }
  ]);

  const isPast = (e) => {
    if (e.status === 'Completed') return true;
    const eDate = new Date(e.date);
    return eDate < new Date();
  };

  const handleAddEvent = (newEvent) => {
    const eventWithCreator = {
      ...newEvent,
      id: Date.now(),
      creator: 'Rahul Kumar',
      speaker: 'Rahul Kumar (Sr. SWE, Google India)',
      attendees: 0,
      registered: false,
      status: 'Upcoming'
    };
    setEvents([eventWithCreator, ...events]);
    message.success('Event created successfully!');
    setIsCreateOpen(false);
  };

  const handleRegister = (eventId) => {
    setEvents(events.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          registered: true,
          attendees: e.attendees + 1
        };
      }
      return e;
    }));
    message.success('Successfully registered for the event!');
  };

  const handleCancelRegistration = (eventId) => {
    setEvents(events.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          registered: false,
          attendees: Math.max(0, e.attendees - 1)
        };
      }
      return e;
    }));
    message.info('Registration cancelled.');
  };

  // Filtered lists based on active tab
  const getFilteredEvents = () => {
    if (activeTab === 'ForYou') {
      return events.filter(e => e.creator !== 'Rahul Kumar' && !isPast(e));
    } else if (activeTab === 'Created') {
      return events.filter(e => e.creator === 'Rahul Kumar' && !isPast(e));
    } else if (activeTab === 'Registered') {
      return events.filter(e => e.registered === true && !isPast(e));
    } else {
      return events.filter(e => isPast(e));
    }
  };

  const filteredEvents = getFilteredEvents();

  return (
    <AlumniLayout>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Alumni Events & Keynotes</h1>
          <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
            Browse upcoming reunions, register for workshops, or publish your own technical keynotes.
          </p>
        </div>

        <Button
          type="primary"
          icon={<FiPlus />}
          style={{ backgroundColor: 'var(--ac-brand)', borderColor: 'var(--ac-brand)', height: 42, borderRadius: 8, fontWeight: 600 }}
          onClick={() => setIsCreateOpen(true)}
        >
          Create New Event
        </Button>
      </div>

      {/* Tabs Selector Switcher */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--ac-border)', paddingBottom: 12, flexWrap: 'wrap' }}>
        {[
          { id: 'ForYou', label: 'Events For You', count: events.filter(e => e.creator !== 'Rahul Kumar' && !isPast(e)).length },
          { id: 'Created', label: 'Created Events', count: events.filter(e => e.creator === 'Rahul Kumar' && !isPast(e)).length },
          { id: 'Registered', label: 'Registered Events', count: events.filter(e => e.registered === true && !isPast(e)).length },
          { id: 'Past', label: 'Past Events', count: events.filter(e => isPast(e)).length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: activeTab === tab.id ? '1px solid var(--ac-brand)' : '1px solid var(--ac-border)',
              backgroundColor: activeTab === tab.id ? 'var(--ac-brand)' : 'var(--ac-bg-card)',
              color: activeTab === tab.id ? '#ffffff' : 'var(--ac-text-primary)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 13.5,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              backgroundColor: activeTab === tab.id ? 'rgba(255, 255, 255, 0.25)' : 'var(--ac-bg-input)',
              color: activeTab === tab.id ? '#ffffff' : 'var(--ac-text-secondary)',
              padding: '2px 6px',
              borderRadius: 10
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 48, textAlign: 'center', color: 'var(--ac-text-secondary)' }}>
          <FiCalendar size={48} color="var(--ac-text-muted)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 16, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>No events found</h3>
          <p style={{ fontSize: 13.5, margin: 0 }}>There are currently no events under this section.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {filteredEvents.map(eventItem => (
            <div key={eventItem.id} style={{
              backgroundColor: 'var(--ac-bg-card)',
              borderRadius: 16,
              border: '1px solid var(--ac-border)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Tag color="blue" style={{ fontWeight: 700 }}>{eventItem.category}</Tag>
                  <Tag color={isPast(eventItem) ? 'default' : eventItem.status === 'Upcoming' ? 'success' : 'default'} style={{ fontWeight: 600 }}>
                    {isPast(eventItem) ? 'COMPLETED' : eventItem.status.toUpperCase()}
                  </Tag>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 10px 0', lineHeight: 1.3 }}>
                  {eventItem.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ac-text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  {eventItem.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--ac-text-secondary)', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiCalendar color="var(--ac-brand)" /> <strong>{eventItem.date}</strong> ({eventItem.time})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiMapPin color="var(--ac-brand)" /> {eventItem.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiUsers color="var(--ac-brand)" /> <strong style={{ color: '#16a34a' }}>{eventItem.attendees} Registered Attendees</strong>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ac-text-muted)', marginTop: 4 }}>
                    Organizer: <strong>{eventItem.speaker}</strong>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div style={{ paddingTop: 16, borderTop: '1px solid var(--ac-border)', display: 'flex', gap: 10 }}>
                <Button
                  style={{ flex: 1, fontWeight: 600 }}
                  icon={<FiEye />}
                  onClick={() => setSelectedEvent(eventItem)}
                >
                  View Details
                </Button>

                {activeTab === 'ForYou' && !isPast(eventItem) && (
                  eventItem.registered ? (
                    <Button
                      type="default"
                      icon={<FiCheckCircle />}
                      style={{ color: '#16a34a', borderColor: '#16a34a', fontWeight: 600 }}
                      disabled
                    >
                      Registered
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      icon={<FiCheck />}
                      style={{ backgroundColor: 'var(--ac-brand)', borderColor: 'var(--ac-brand)', fontWeight: 600 }}
                      onClick={() => handleRegister(eventItem.id)}
                    >
                      Register
                    </Button>
                  )
                )}

                {activeTab === 'Registered' && !isPast(eventItem) && (
                  <Button
                    type="primary"
                    danger
                    icon={<FiX />}
                    style={{ fontWeight: 600 }}
                    onClick={() => handleCancelRegistration(eventItem.id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Details Modal */}
      <Modal
        title={`Event Details – "${selectedEvent?.title}"`}
        open={!!selectedEvent}
        onCancel={() => setSelectedEvent(null)}
        footer={[
          <Button key="close" type="primary" onClick={() => setSelectedEvent(null)}>
            Close
          </Button>
        ]}
      >
        {selectedEvent && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Tag color="blue">{selectedEvent.category}</Tag>
              <Tag color={isPast(selectedEvent) ? 'default' : 'success'}>
                {isPast(selectedEvent) ? 'COMPLETED' : selectedEvent.status}
              </Tag>
            </div>
            <p style={{ fontSize: 14, color: 'var(--ac-text-secondary)', lineHeight: 1.6 }}>{selectedEvent.description}</p>
            <div style={{ padding: 14, backgroundColor: 'var(--ac-bg-input)', borderRadius: 10, border: '1px solid var(--ac-border)', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div><strong>Date & Time:</strong> {selectedEvent.date} ({selectedEvent.time})</div>
              <div><strong>Venue:</strong> {selectedEvent.location}</div>
              <div><strong>Speaker:</strong> {selectedEvent.speaker}</div>
              <div><strong>Total Registrations:</strong> {selectedEvent.attendees} Attendees</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Event Modal */}
      <CreateEventModal
        visible={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddEvent={handleAddEvent}
      />
    </AlumniLayout>
  );
};
