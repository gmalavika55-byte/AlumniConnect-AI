import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Tag, Button, Modal, Table, Spin, message, Space, Input, Select } from 'antd';
import { FiPlus, FiCalendar, FiClock, FiMapPin, FiUsers, FiEdit2, FiTrash2, FiEye, FiSearch, FiFilter } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { CreateEventModal } from '../components/admin/CreateEventModal';
import api from '../services/api';

export const AdminEventsPage = () => {
  const location = useLocation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState((location.state && location.state.tab) || 'All');

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveStatusTab(location.state.tab);
    }
  }, [location.state]);
  const [creatorFilter, setCreatorFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('ALL');
  
  // Registration Modal State
  const [viewParticipantsEvent, setViewParticipantsEvent] = useState(null);
  const [participantsList, setParticipantsList] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Helper to determine status dynamically from eventDate
  const calculateEventStatus = (eventDateStr, backendStatus) => {
    if (!eventDateStr) return backendStatus || 'Upcoming';
    const eventDate = new Date(eventDateStr);
    const today = new Date();

    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (eventDay > todayDay) {
      return 'Upcoming';
    } else if (eventDay.getTime() === todayDay.getTime()) {
      return 'Ongoing';
    } else {
      return 'Past';
    }
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await api.get('/event/getall');
      const data = res.data || [];
      const mapped = data.map(e => {
        const dateObj = e.eventDate ? new Date(e.eventDate) : new Date();
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const calculatedStatus = calculateEventStatus(e.eventDate, e.status);
        const normAudience = String(e.audience || 'BOTH').toUpperCase();

        return {
          id: e.eventId,
          title: e.title || 'Untitled Event',
          category: e.category || 'General',
          date: formattedDate,
          time: (e.startTime && e.endTime) ? `${e.startTime} - ${e.endTime}` : (e.startTime || '10:00 AM - 12:00 PM'),
          location: e.venue || 'Virtual',
          speaker: e.organizer || 'Guest Speaker',
          registeredCount: e.registeredCount !== null && e.registeredCount !== undefined ? Number(e.registeredCount) : 0,
          capacity: e.maxParticipants || 100,
          organizer: e.organizer || 'KCE Admin',
          status: calculatedStatus,
          description: e.description || '',
          eventDate: e.eventDate,
          venue: e.venue,
          startTime: e.startTime,
          endTime: e.endTime,
          maxParticipants: e.maxParticipants,
          audience: normAudience,
          rawEvent: e
        };
      });
      setEvents(mapped);
    } catch (err) {
      console.error("Error loading events", err);
      message.error("Failed to load events from server.");
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const loadParticipants = async (eventId) => {
    setLoadingParticipants(true);
    try {
      const res = await api.get(`/event/registrations/event/${eventId}`);
      const data = res.data || [];
      const mapped = data.map(r => ({
        id: r.registrationId,
        name: r.student?.name || r.alumni?.name || 'Registered Participant',
        role: r.studentId ? 'Student' : 'Alumni',
        email: r.student?.email || r.alumni?.email || 'N/A',
        date: r.registrationDate ? new Date(r.registrationDate).toLocaleDateString() : 'N/A',
        status: r.attendanceStatus || 'Confirmed'
      }));
      setParticipantsList(mapped);
    } catch (err) {
      console.error("Error fetching participants:", err);
      message.error("Failed to load participant registrations.");
    } finally {
      setLoadingParticipants(false);
    }
  };

  useEffect(() => {
    if (viewParticipantsEvent) {
      loadParticipants(viewParticipantsEvent.id);
    } else {
      setParticipantsList([]);
    }
  }, [viewParticipantsEvent]);

  const handleAddEvent = async (newEvent) => {
    const payload = {
      title: newEvent.title,
      category: newEvent.category || 'Webinar',
      audience: newEvent.audience || 'BOTH',
      description: newEvent.description || '',
      eventDate: newEvent.date ? newEvent.date : (newEvent.eventDate ? newEvent.eventDate.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0]),
      startTime: newEvent.time ? (newEvent.time.split('-')[0]?.trim() || '10:00 AM') : '10:00 AM',
      endTime: newEvent.time ? (newEvent.time.split('-')[1]?.trim() || '12:00 PM') : '12:00 PM',
      venue: newEvent.location || 'Virtual',
      organizer: newEvent.organizer || 'KCE Admin',
      maxParticipants: parseInt(newEvent.capacity || 100, 10),
      status: 'UPCOMING'
    };

    try {
      await api.post('/event/add', payload);
      message.success('Event created and published successfully!');
      setIsCreateOpen(false);
      await fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err);
      const errMsg = err.response?.data?.message || err.response?.data || "Failed to create event.";
      message.error(typeof errMsg === 'string' ? errMsg : "Failed to create event.");
    }
  };

  const handleUpdateEvent = async (updatedData) => {
    try {
      const payload = {
        ...editingEvent?.rawEvent,
        eventId: updatedData.id,
        title: updatedData.title,
        category: updatedData.category || 'Webinar',
        audience: updatedData.audience || 'BOTH',
        description: updatedData.description || '',
        eventDate: updatedData.date ? updatedData.date : new Date().toISOString().split('T')[0],
        startTime: updatedData.time ? (updatedData.time.split('-')[0]?.trim() || '10:00 AM') : '10:00 AM',
        endTime: updatedData.time ? (updatedData.time.split('-')[1]?.trim() || '12:00 PM') : '12:00 PM',
        venue: updatedData.location || 'Virtual',
        organizer: updatedData.organizer || 'KCE Admin',
        maxParticipants: parseInt(updatedData.capacity || 100, 10),
        status: 'UPCOMING'
      };

      await api.put('/event/update?requesterName=ADMIN', payload);
      message.success(`Event "${updatedData.title}" updated successfully!`);
      setIsCreateOpen(false);
      setEditingEvent(null);
      await fetchEvents();
    } catch (err) {
      console.error("Error updating event:", err);
      const errMsg = err.response?.data?.message || err.response?.data || "Failed to update event.";
      message.error(typeof errMsg === 'string' ? errMsg : "Failed to update event.");
    }
  };

  const handleDeleteEvent = (eventItem) => {
    Modal.confirm({
      title: `Delete Event "${eventItem.title}"?`,
      content: 'Are you sure you want to delete this event? Registered attendees will be notified and the record will be permanently removed.',
      okText: 'Delete Event',
      okType: 'danger',
      async onOk() {
        try {
          await api.delete(`/event/delete/${eventItem.id}?requesterName=ADMIN`);
          message.success('Event deleted successfully.');
          await fetchEvents();
        } catch (err) {
          console.error("Error deleting event:", err);
          const errMsg = err.response?.data?.message || "Failed to delete event.";
          message.error(errMsg);
        }
      }
    });
  };

  // Filter combination: Search + Status Tab + Creator Filter + Audience Filter
  const filteredEvents = events.filter(e => {
    const query = searchText.trim().toLowerCase();
    const matchesSearch = !query ||
                          (e.title || '').toLowerCase().includes(query) ||
                          (e.category || '').toLowerCase().includes(query) ||
                          (e.speaker || '').toLowerCase().includes(query) ||
                          (e.description || '').toLowerCase().includes(query) ||
                          (e.location || '').toLowerCase().includes(query);

    const matchesStatus = activeStatusTab === 'All' ? true : e.status === activeStatusTab;

    const orgLower = (e.organizer || '').toLowerCase();
    const isCreatedByAdmin = orgLower.includes('admin') || orgLower.includes('jenkins') || orgLower.includes('kce');
    
    let matchesCreator = true;
    if (creatorFilter === 'admin') {
      matchesCreator = isCreatedByAdmin;
    } else if (creatorFilter === 'alumni') {
      matchesCreator = !isCreatedByAdmin;
    }

    let matchesAudience = true;
    if (audienceFilter === 'STUDENTS') {
      matchesAudience = e.audience === 'STUDENTS';
    } else if (audienceFilter === 'ALUMNI') {
      matchesAudience = e.audience === 'ALUMNI';
    } else if (audienceFilter === 'BOTH') {
      matchesAudience = e.audience === 'BOTH' || e.audience === 'EVERYONE' || !e.audience;
    }

    return matchesSearch && matchesStatus && matchesCreator && matchesAudience;
  });

  const studentsList = participantsList.filter(p => p.role === 'Student');
  const alumniList = participantsList.filter(p => p.role === 'Alumni');

  return (
    <AdminLayout onSearch={setSearchText}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Event & Webinar Management</h1>
          <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
            Create and schedule campus meetings, webinars, hackathons, and monitor participant registrations. Total Events: <strong>{events.length}</strong>
          </p>
        </div>

        <Button
          type="primary"
          icon={<FiPlus />}
          style={{ backgroundColor: 'var(--ac-brand)', border: 'none', height: 42, borderRadius: 8, fontWeight: 600 }}
          onClick={() => {
            setEditingEvent(null);
            setIsCreateOpen(true);
          }}
        >
          Create New Event
        </Button>
      </div>

      {/* Status Filtering Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid var(--ac-border)', paddingBottom: 10, flexWrap: 'wrap' }}>
        {['All', 'Upcoming', 'Ongoing', 'Past'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveStatusTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeStatusTab === tab ? 'var(--ac-brand)' : 'transparent',
              color: activeStatusTab === tab ? '#ffffff' : 'var(--ac-text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab} Events
          </button>
        ))}
      </div>

      {/* Search Input, Creator Filter, and Audience Filter Bar */}
      <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 14, padding: 18, border: '1px solid var(--ac-border)', marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <Input
            prefix={<FiSearch style={{ color: 'var(--ac-text-secondary)', marginRight: 6 }} />}
            placeholder="Search events by title, category, or speaker..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ borderRadius: 8 }}
          />
        </div>

        {/* Creator Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ac-text-secondary)' }}>Created By:</span>
          <Select
            value={creatorFilter}
            onChange={setCreatorFilter}
            options={[
              { value: 'all', label: 'All Organizers' },
              { value: 'admin', label: 'Admin Created' },
              { value: 'alumni', label: 'Alumni Created' }
            ]}
            style={{ width: 160 }}
          />
        </div>

        {/* Audience Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ac-text-secondary)' }}>Event For:</span>
          <Select
            value={audienceFilter}
            onChange={setAudienceFilter}
            options={[
              { value: 'ALL', label: 'All Audiences' },
              { value: 'STUDENTS', label: 'Students' },
              { value: 'ALUMNI', label: 'Alumni' },
              { value: 'BOTH', label: 'Everyone' }
            ]}
            style={{ width: 160 }}
          />
        </div>
      </div>

      {/* Event Cards Grid / Loading State */}
      {loadingEvents ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: 'var(--ac-text-secondary)', fontWeight: 600 }}>Loading event catalog...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 48, textAlign: 'center', color: 'var(--ac-text-secondary)' }}>
          <FiCalendar size={48} color="var(--ac-text-muted)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 16, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>No events found</h3>
          <p style={{ fontSize: 13.5, margin: 0 }}>No events match the selected status, search query, or audience filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {filteredEvents.map(eventItem => {
            const orgLower = (eventItem.organizer || '').toLowerCase();
            const isAdminCreated = orgLower.includes('admin') || orgLower.includes('jenkins') || orgLower.includes('kce');
            const isFull = eventItem.registeredCount >= eventItem.capacity;

            return (
              <div key={eventItem.id} style={{
                backgroundColor: 'var(--ac-bg-card)',
                borderRadius: 16,
                border: '1px solid var(--ac-border)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Tag color={eventItem.category === 'Hackathon' ? 'purple' : eventItem.category === 'Webinar' ? 'blue' : 'orange'} style={{ fontWeight: 700 }}>
                        {eventItem.category}
                      </Tag>

                      {/* Audience Badge */}
                      {eventItem.audience === 'STUDENTS' && (
                        <Tag color="purple" style={{ fontWeight: 600 }}>Students</Tag>
                      )}
                      {eventItem.audience === 'ALUMNI' && (
                        <Tag color="orange" style={{ fontWeight: 600 }}>Alumni</Tag>
                      )}
                      {(eventItem.audience === 'BOTH' || eventItem.audience === 'EVERYONE' || !eventItem.audience) && (
                        <Tag color="cyan" style={{ fontWeight: 600 }}>Everyone</Tag>
                      )}
                    </div>

                    <Space>
                      <Tag color={isAdminCreated ? 'geekblue' : 'gold'} style={{ fontWeight: 700 }}>
                        {isAdminCreated ? 'Admin' : 'Alumni'}
                      </Tag>
                      <Tag color={eventItem.status === 'Upcoming' ? 'success' : eventItem.status === 'Ongoing' ? 'processing' : 'default'} style={{ fontWeight: 600 }}>
                        {eventItem.status.toUpperCase()}
                      </Tag>
                      {isFull && <Tag color="red" style={{ fontWeight: 700 }}>FULL</Tag>}
                    </Space>
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 10px 0', lineHeight: 1.3 }}>
                    {eventItem.title}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--ac-text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    {eventItem.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--ac-text-primary)', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FiCalendar color="var(--ac-brand)" /> <strong>{eventItem.date}</strong> ({eventItem.time})
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FiMapPin color="var(--ac-brand)" /> {eventItem.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FiUsers color="var(--ac-brand)" /> 
                      <span style={{ color: 'var(--ac-text-primary)' }}>
                        <strong>{eventItem.registeredCount}</strong> / {eventItem.capacity} Capacity
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', marginTop: 4 }}>
                      Organizer: <strong>{eventItem.organizer}</strong>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div style={{ paddingTop: 16, borderTop: '1px solid var(--ac-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    type="text"
                    icon={<FiEye />}
                    style={{ color: 'var(--ac-brand)', fontWeight: 600 }}
                    onClick={() => setViewParticipantsEvent(eventItem)}
                  >
                    View Registrations
                  </Button>
                  <Space>
                    <Button
                      type="text"
                      icon={<FiEdit2 />}
                      onClick={() => {
                        setEditingEvent(eventItem);
                        setIsCreateOpen(true);
                      }}
                    />
                    <Button
                      type="text"
                      danger
                      icon={<FiTrash2 />}
                      onClick={() => handleDeleteEvent(eventItem)}
                    />
                  </Space>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Participants Modal */}
      <Modal
        title={`Registered Participants – "${viewParticipantsEvent?.title}"`}
        open={!!viewParticipantsEvent}
        onCancel={() => setViewParticipantsEvent(null)}
        footer={[
          <Button key="close" type="primary" style={{ backgroundColor: 'var(--ac-brand)', border: 'none' }} onClick={() => setViewParticipantsEvent(null)}>
            Close
          </Button>
        ]}
        width={700}
      >
        <div style={{ marginBottom: 16, fontWeight: 600, color: 'var(--ac-text-primary)' }}>
          Total Registrations: {viewParticipantsEvent?.registeredCount || 0} / {viewParticipantsEvent?.capacity || 0} Capacity
        </div>
        {loadingParticipants ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="medium" />
            <p style={{ marginTop: 12, color: 'var(--ac-text-secondary)' }}>Loading participants...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Students Group */}
            <div>
              <h4 style={{ color: 'var(--ac-text-primary)', borderBottom: '1px solid var(--ac-border)', paddingBottom: 6, fontWeight: 700, marginBottom: 10 }}>
                Students ({studentsList.length})
              </h4>
              {studentsList.length > 0 ? (
                <Table
                  dataSource={studentsList}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  columns={[
                    { title: 'Name', dataIndex: 'name', key: 'name', render: (t) => <strong style={{ color: 'var(--ac-text-primary)' }}>{t}</strong> },
                    { title: 'Email', dataIndex: 'email', key: 'email', render: (t) => <span style={{ color: 'var(--ac-text-primary)' }}>{t}</span> },
                    { title: 'Reg. Date', dataIndex: 'date', key: 'date', render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span> },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="success">{s}</Tag> }
                  ]}
                />
              ) : (
                <div style={{ color: 'var(--ac-text-secondary)', padding: '10px 0' }}>No students registered yet.</div>
              )}
            </div>

            {/* Alumni Group */}
            <div>
              <h4 style={{ color: 'var(--ac-text-primary)', borderBottom: '1px solid var(--ac-border)', paddingBottom: 6, fontWeight: 700, marginBottom: 10 }}>
                Alumni ({alumniList.length})
              </h4>
              {alumniList.length > 0 ? (
                <Table
                  dataSource={alumniList}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  columns={[
                    { title: 'Name', dataIndex: 'name', key: 'name', render: (t) => <strong style={{ color: 'var(--ac-text-primary)' }}>{t}</strong> },
                    { title: 'Email', dataIndex: 'email', key: 'email', render: (t) => <span style={{ color: 'var(--ac-text-primary)' }}>{t}</span> },
                    { title: 'Reg. Date', dataIndex: 'date', key: 'date', render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span> },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="success">{s}</Tag> }
                  ]}
                />
              ) : (
                <div style={{ color: 'var(--ac-text-secondary)', padding: '10px 0' }}>No alumni registered yet.</div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Shared Create / Edit Event Modal matching Alumni Module */}
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
    </AdminLayout>
  );
};
