import React, { useState } from 'react';
import { Tag, Button, Modal, message, Space } from 'antd';
import { FiPlus, FiCalendar, FiClock, FiMapPin, FiUsers, FiEye, FiCheckCircle } from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import { CreateEventModal } from '../components/admin/CreateEventModal';

export const AlumniEventsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Global Alumni Meetup 2026',
      category: 'Reunion & Keynote',
      date: 'September 15, 2026',
      time: '06:00 PM - 09:00 PM IST',
      location: 'Grand Ballroom & Zoom Virtual Hall',
      speaker: 'Rahul Kumar (Sr. SWE, Google India)',
      attendees: 142,
      status: 'Upcoming',
      description: 'Annual global networking meetup bringing together alumni across big tech, startups, and research to mentor graduating students.'
    },
    {
      id: 2,
      title: 'Machine Learning & LLM Masterclass',
      category: 'Technical Workshop',
      date: 'August 28, 2026',
      time: '04:00 PM - 06:00 PM IST',
      location: 'Computer Science Lab 3 & Meet',
      speaker: 'Arun Kumar (Staff ML Scientist, AWS)',
      attendees: 88,
      status: 'Upcoming',
      description: 'Hands-on practical session covering PyTorch transformer fine-tuning and deploying ML microservices.'
    },
    {
      id: 3,
      title: 'Cloud Architecture & DevOps Webinar',
      category: 'Webinar',
      date: 'July 20, 2026',
      time: '05:00 PM - 07:00 PM IST',
      location: 'Zoom Virtual Hall',
      speaker: 'Divya Rajan (Lead Architect, Flipkart)',
      attendees: 115,
      status: 'Completed',
      description: 'Deep dive into Kubernetes cluster management and CI/CD automation pipelines.'
    }
  ]);

  const handleAddEvent = (newEvent) => {
    setEvents([newEvent, ...events]);
  };

  return (
    <AlumniLayout>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f1e36', margin: '0 0 4px 0' }}>My Events & Keynotes</h1>
          <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
            Browse upcoming campus reunions, register as guest speakers, or publish new tech webinars.
          </p>
        </div>

        <Button
          type="primary"
          icon={<FiPlus />}
          style={{ backgroundColor: '#1b62d4', height: 42, borderRadius: 8, fontWeight: 600 }}
          onClick={() => setIsCreateOpen(true)}
        >
          Create New Event
        </Button>
      </div>

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
        {events.map(eventItem => (
          <div key={eventItem.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Tag color="blue" style={{ fontWeight: 700 }}>{eventItem.category}</Tag>
                <Tag color={eventItem.status === 'Upcoming' ? 'success' : 'default'} style={{ fontWeight: 600 }}>{eventItem.status}</Tag>
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f1e36', margin: '0 0 10px 0', lineHeight: 1.3 }}>
                {eventItem.title}
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                {eventItem.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#334155', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiCalendar color="#1b62d4" /> <strong>{eventItem.date}</strong> ({eventItem.time})
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiMapPin color="#1b62d4" /> {eventItem.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiUsers color="#1b62d4" /> <strong style={{ color: '#16a34a' }}>{eventItem.attendees} Registered Mentees</strong>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                type="primary"
                icon={<FiEye />}
                style={{ backgroundColor: '#1b62d4', borderRadius: 8, fontWeight: 600, width: '100%' }}
                onClick={() => setSelectedEvent(eventItem)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

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
              <Tag color="success">{selectedEvent.status}</Tag>
            </div>
            <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>{selectedEvent.description}</p>
            <div style={{ padding: 14, backgroundColor: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div><strong>Date & Time:</strong> {selectedEvent.date} ({selectedEvent.time})</div>
              <div><strong>Venue:</strong> {selectedEvent.location}</div>
              <div><strong>Speaker:</strong> {selectedEvent.speaker}</div>
              <div><strong>Total Registrations:</strong> {selectedEvent.attendees} Students & Alumni</div>
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
