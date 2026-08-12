import React, { useState } from 'react';
import { Tag, Button, Modal, Table, Spin, message, Empty } from 'antd';
import { FiPlus, FiCalendar, FiClock, FiMapPin, FiUsers, FiEye, FiCheck, FiX, FiList, FiEdit, FiTrash2 } from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import { CreateEventModal } from '../components/admin/CreateEventModal';
import { EventRegisterModal } from '../components/student/EventRegisterModal';
import { useAppContext } from '../context/AppContext';
import { authService } from '../services/authService';
import api from '../services/api';

export const AlumniEventsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedRegisterEvent, setSelectedRegisterEvent] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Available');

  // Registrations View State for Event Organizers
  const [viewRegistrationsEvent, setViewRegistrationsEvent] = useState(null);
  const [registrationsList, setRegistrationsList] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  const { searchQuery, events, refreshData } = useAppContext();
  const user = authService.getCurrentUser();
  const userName = user?.name || '';

  // ── Helper functions for date/time validation (Reused from Student Events) ──
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

  const isCreatedByCurrentAlumni = (e) => {
    if (!e || !e.organizer || !userName) return false;
    const org = e.organizer.trim().toLowerCase();
    const current = userName.trim().toLowerCase();
    return org === current || org.includes(current) || current.includes(org);
  };

  const isAlumniEligible = (e) => {
    if (!e.audience) return true;
    const aud = e.audience.toUpperCase();
    return aud.includes('ALUMNI') || aud === 'BOTH' || aud === 'EVERYONE';
  };

  const handleAddEvent = async (newEvent) => {
    if (!user) return;
    const payload = {
      title: newEvent.title,
      category: newEvent.category || 'Technical Workshop',
      audience: newEvent.audience || 'BOTH',
      description: newEvent.description,
      eventDate: newEvent.date ? newEvent.date : new Date().toISOString(),
      startTime: newEvent.startTime || '04:00 PM',
      endTime: newEvent.endTime || '06:00 PM',
      venue: newEvent.location || 'Virtual',
      organizer: newEvent.organizer || user.name || 'Alumni Mentor',
      status: 'UPCOMING',
      maxParticipants: newEvent.capacity ? parseInt(newEvent.capacity, 10) : 100
    };

    try {
      await api.post('/event/add', payload);
      message.success('Event created successfully!');
      setIsCreateOpen(false);
      refreshData();
    } catch (err) {
      console.error("Error creating event:", err);
      message.error("Failed to create event.");
    }
  };

  const handleUpdateEvent = async (updatedData) => {
    if (!user) return;
    const payload = {
      eventId: updatedData.id,
      title: updatedData.title,
      category: updatedData.category || 'Technical Workshop',
      audience: updatedData.audience || 'BOTH',
      description: updatedData.description,
      eventDate: updatedData.date ? new Date(updatedData.date).toISOString() : new Date().toISOString(),
      startTime: updatedData.startTime || '04:00 PM',
      endTime: updatedData.endTime || '06:00 PM',
      venue: updatedData.location || 'Virtual',
      organizer: updatedData.organizer || userName,
      status: 'UPCOMING',
      maxParticipants: updatedData.capacity ? parseInt(updatedData.capacity, 10) : 100
    };

    try {
      await api.put(`/event/update?requesterName=${encodeURIComponent(userName)}`, payload);
      message.success('Event updated successfully!');
      setIsCreateOpen(false);
      setEditingEvent(null);
      await refreshData();
    } catch (err) {
      console.error("Error updating event:", err);
      const errorMsg = err.response?.data || "Failed to update event.";
      message.error(errorMsg);
    }
  };

  const handleDeleteEvent = (eventItem) => {
    if (!user) return;

    Modal.confirm({
      title: "Delete Event?",
      content: `Are you sure you want to delete "${eventItem.title}"? This action cannot be undone.`,
      okText: "Yes, Delete Event",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await api.delete(`/event/delete/${eventItem.id}?requesterName=${encodeURIComponent(userName)}`);
          message.success("Event deleted successfully.");
          await refreshData();
        } catch (err) {
          console.error("Error deleting event:", err);
          const errorMsg = err.response?.data || "Failed to delete event.";
          message.error(errorMsg);
        }
      }
    });
  };

  const handleRegisterClick = (eventItem) => {
    setSelectedRegisterEvent(eventItem);
    setIsRegisterOpen(true);
  };

  const handleRegisterSuccess = async (eventId) => {
    if (!user) return;
    try {
      const payload = {
        eventId: eventId,
        alumniId: user.alumniId,
        studentId: null,
        registrationDate: new Date().toISOString()
      };
      await api.post('/event/register', payload);
      message.success('Successfully registered for the event!');
      await refreshData();
    } catch (err) {
      console.error("Error registering for event:", err);
      const errorMsg = err.response?.data || "Failed to register for event.";
      message.error(errorMsg);
    }
  };

  const handleCancelRegistration = (eventItem) => {
    if (!user) return;

    Modal.confirm({
      title: "Cancel Event Registration?",
      content: `Are you sure you want to cancel your registration for "${eventItem.title}"?`,
      okText: "Yes, Cancel Registration",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await api.delete(`/event/registrations/cancel/${eventItem.id}/alumni/${user.alumniId}`);
          message.success("Registration cancelled successfully.");
          await refreshData();
        } catch (err) {
          console.error("Error cancelling registration:", err);
          const errorMsg = err.response?.data || "Failed to cancel registration.";
          message.error(errorMsg);
        }
      }
    });
  };

  const handleViewRegistrations = async (eventItem) => {
    setViewRegistrationsEvent(eventItem);
    setLoadingRegistrations(true);
    try {
      const res = await api.get(`/event/registrations/organizer/${eventItem.id}?organizerName=${encodeURIComponent(userName)}`);
      setRegistrationsList(res.data || []);
    } catch (err) {
      console.error("Error fetching registrations for organizer:", err);
      const errorMsg = err.response?.data || "Failed to load event registrations.";
      message.error(errorMsg);
      setRegistrationsList([]);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  // ── Tab Filtering Logic ──
  const getFilteredEvents = () => {
    let result = [];
    if (activeTab === 'Available') {
      result = events.filter(e => !isPast(e) && !e.registered && !isCreatedByCurrentAlumni(e) && isAlumniEligible(e));
    } else if (activeTab === 'Registered') {
      result = events.filter(e => e.registered === true);
    } else if (activeTab === 'Created') {
      result = events.filter(e => isCreatedByCurrentAlumni(e));
    } else if (activeTab === 'Past') {
      result = events.filter(e => isPast(e) && (isAlumniEligible(e) || isCreatedByCurrentAlumni(e) || e.registered));
    }

    // Apply search filter if query exists
    if ((searchQuery || '').trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.title?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        e.speaker?.toLowerCase().includes(q) ||
        e.venue?.toLowerCase().includes(q)
      );
    }

    return result;
  };

  const filteredEvents = getFilteredEvents();

  // Tab counts
  const availableCount = events.filter(e => !isPast(e) && !e.registered && !isCreatedByCurrentAlumni(e) && isAlumniEligible(e)).length;
  const registeredCount = events.filter(e => e.registered === true).length;
  const createdCount = events.filter(e => isCreatedByCurrentAlumni(e)).length;
  const pastCount = events.filter(e => isPast(e) && (isAlumniEligible(e) || isCreatedByCurrentAlumni(e) || e.registered)).length;

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
          onClick={() => {
            setEditingEvent(null);
            setIsCreateOpen(true);
          }}
        >
          Create New Event
        </Button>
      </div>

      {/* Tabs Selector Switcher */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--ac-border)', paddingBottom: 12, flexWrap: 'wrap' }}>
        {[
          { id: 'Available', label: 'Available Events', count: availableCount },
          { id: 'Registered', label: 'Registered Events', count: registeredCount },
          { id: 'Created', label: 'Created Events', count: createdCount },
          { id: 'Past', label: 'Past Events', count: pastCount }
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
          <p style={{ fontSize: 13.5, margin: 0 }}>
            {searchQuery ? `We couldn't find any events matching "${searchQuery}".` : `No events currently listed under ${activeTab} Events.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {filteredEvents.map(eventItem => {
            const eventEnded = isPast(eventItem);
            const isCreator = isCreatedByCurrentAlumni(eventItem);

            return (
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
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Tag color="blue" style={{ fontWeight: 700 }}>{eventItem.category}</Tag>
                      {eventItem.audience === 'STUDENTS' && (
                        <Tag color="purple" style={{ fontWeight: 600 }}>Students Only</Tag>
                      )}
                      {eventItem.audience === 'ALUMNI' && (
                        <Tag color="orange" style={{ fontWeight: 600 }}>Alumni Only</Tag>
                      )}
                      {isCreator && (
                        <Tag color="cyan" style={{ fontWeight: 600 }}>Organized by You</Tag>
                      )}
                    </div>
                    <Tag color={eventEnded ? 'default' : 'success'} style={{ fontWeight: 600 }}>
                      {eventEnded ? 'COMPLETED' : (eventItem.status || 'UPCOMING').toUpperCase()}
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
                      <FiCalendar color="var(--ac-brand)" /> <strong>{eventItem.eventDate ? new Date(eventItem.eventDate).toLocaleDateString() : 'N/A'}</strong> ({eventItem.time})
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FiMapPin color="var(--ac-brand)" /> {eventItem.venue}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FiUsers color="var(--ac-brand)" /> <strong style={{ color: '#16a34a' }}>Registered: {eventItem.registeredCount || 0} / {eventItem.maxParticipants || '∞'}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ac-text-muted)', marginTop: 4 }}>
                      Organizer: <strong>{isCreator ? 'You (Alumni Creator)' : eventItem.speaker}</strong>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div style={{ paddingTop: 16, borderTop: '1px solid var(--ac-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      style={{ flex: 1, fontWeight: 600 }}
                      icon={<FiEye />}
                      onClick={() => setSelectedEvent(eventItem)}
                    >
                      View Details
                    </Button>

                    {isCreator && (
                      <Button
                        type="primary"
                        icon={<FiList />}
                        style={{ backgroundColor: '#10b981', borderColor: '#10b981', fontWeight: 600 }}
                        onClick={() => handleViewRegistrations(eventItem)}
                      >
                        Registrations
                      </Button>
                    )}
                  </div>

                  {isCreator ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button
                        style={{ flex: 1, fontWeight: 600, borderColor: '#3b82f6', color: '#1d4ed8' }}
                        icon={<FiEdit />}
                        onClick={() => {
                          setEditingEvent(eventItem);
                          setIsCreateOpen(true);
                        }}
                      >
                        Edit Event
                      </Button>

                      <Button
                        type="primary"
                        danger
                        icon={<FiTrash2 />}
                        style={{ fontWeight: 600 }}
                        onClick={() => handleDeleteEvent(eventItem)}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : eventEnded ? (
                    eventItem.registered ? (
                      <Button disabled style={{ backgroundColor: '#e0edff', color: '#1b62d4', cursor: 'default' }}>
                        Registered ✓
                      </Button>
                    ) : (
                      <Button disabled style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'default' }}>
                        Completed
                      </Button>
                    )
                  ) : eventItem.registered ? (
                    <Button
                      type="primary"
                      danger
                      icon={<FiX />}
                      style={{ fontWeight: 600 }}
                      onClick={() => handleCancelRegistration(eventItem)}
                    >
                      Cancel Registration
                    </Button>
                  ) : (eventItem.maxParticipants && (eventItem.registeredCount || 0) >= eventItem.maxParticipants) ? (
                    <Button disabled style={{ backgroundColor: '#fee2e2', color: '#b91c1c', cursor: 'not-allowed' }}>
                      Registration Closed
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      icon={<FiCheck />}
                      style={{ backgroundColor: 'var(--ac-brand)', borderColor: 'var(--ac-brand)', fontWeight: 600 }}
                      onClick={() => handleRegisterClick(eventItem)}
                    >
                      Register Now
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
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
              <div><strong>Date & Time:</strong> {selectedEvent.eventDate ? new Date(selectedEvent.eventDate).toLocaleDateString() : 'N/A'} ({selectedEvent.time})</div>
              <div><strong>Venue:</strong> {selectedEvent.venue}</div>
              <div><strong>Speaker / Organizer:</strong> {selectedEvent.organizer}</div>
              <div><strong>Total Registrations:</strong> {selectedEvent.registeredCount || 0} / {selectedEvent.maxParticipants || '∞'} Attendees</div>
            </div>
          </div>
        )}
      </Modal>

      {/* View Registrations Modal for Organizer */}
      <Modal
        title={`Registered Attendees – "${viewRegistrationsEvent?.title}"`}
        open={!!viewRegistrationsEvent}
        onCancel={() => {
          setViewRegistrationsEvent(null);
          setRegistrationsList([]);
        }}
        width={750}
        footer={[
          <Button key="close" type="primary" onClick={() => {
            setViewRegistrationsEvent(null);
            setRegistrationsList([]);
          }}>
            Close
          </Button>
        ]}
      >
        {viewRegistrationsEvent && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>
              <div>
                <strong>Total Registrations:</strong> {registrationsList.length} / {viewRegistrationsEvent.maxParticipants || '∞'}
              </div>
              <Tag color="green" style={{ fontWeight: 600 }}>Organizer View</Tag>
            </div>

            {loadingRegistrations ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin size="large" />
                <p style={{ marginTop: 12, color: 'var(--ac-text-secondary)' }}>Loading registered attendees...</p>
              </div>
            ) : registrationsList.length === 0 ? (
              <Empty description="No registrations yet" style={{ margin: '40px 0' }} />
            ) : (
              <div style={{ maxHeight: 420, overflowY: 'auto' }}>
                <Table
                  dataSource={registrationsList}
                  rowKey="registrationId"
                  pagination={false}
                  columns={[
                    {
                      title: 'User Type',
                      key: 'userType',
                      render: (_, reg) => (
                        <Tag color={reg.studentId ? 'purple' : 'orange'} style={{ fontWeight: 600 }}>
                          {reg.studentId ? 'Student' : 'Alumni'}
                        </Tag>
                      )
                    },
                    {
                      title: 'Name',
                      key: 'name',
                      render: (_, reg) => (
                        <div>
                          <strong>{reg.student?.name || reg.alumni?.name || 'Registered User'}</strong>
                          <div style={{ fontSize: 11, color: 'var(--ac-text-muted)' }}>
                            {reg.student?.email || reg.alumni?.email || ''}
                          </div>
                        </div>
                      )
                    },
                    {
                      title: 'Identifier / Department',
                      key: 'identifier',
                      render: (_, reg) => (
                        <div style={{ fontSize: 12 }}>
                          {reg.student ? (
                            <>
                              <div>Reg No: <strong>{reg.student.registerNo || 'N/A'}</strong></div>
                              <div>Dept: {reg.student.department || 'N/A'} {reg.student.yearOfStudy ? `(Yr ${reg.student.yearOfStudy})` : ''}</div>
                            </>
                          ) : reg.alumni ? (
                            <>
                              <div>Dept: {reg.alumni.department || 'N/A'}</div>
                              <div>Grad Year: <strong>{reg.alumni.graduationYear || 'N/A'}</strong></div>
                            </>
                          ) : 'N/A'}
                        </div>
                      )
                    },
                    {
                      title: 'Registration Date',
                      dataIndex: 'registrationDate',
                      key: 'registrationDate',
                      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
                    }
                  ]}
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Event Registration Confirmation Modal (Reused from Student module) */}
      <EventRegisterModal
        visible={isRegisterOpen}
        event={selectedRegisterEvent}
        onClose={() => {
          setIsRegisterOpen(false);
          setSelectedRegisterEvent(null);
        }}
        onRegisterSuccess={handleRegisterSuccess}
      />

      {/* Create / Edit Event Modal */}
      <CreateEventModal
        visible={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingEvent(null);
        }}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        editingEvent={editingEvent}
      />
    </AlumniLayout>
  );
};
