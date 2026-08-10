import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Modal, Form, Input, DatePicker, Select, message, Space, Table, Spin } from 'antd';
import { FiPlus, FiCalendar, FiClock, FiMapPin, FiUsers, FiEdit2, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { CreateEventModal } from '../components/admin/CreateEventModal';
import api from '../services/api';

export const AdminEventsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [creatorFilter, setCreatorFilter] = useState('all');
  const [viewParticipantsEvent, setViewParticipantsEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [editForm] = Form.useForm();
  const [events, setEvents] = useState([]);
  const [participantsList, setParticipantsList] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/event/getall');
      const data = res.data || [];
      const mapped = data.map(e => {
        const dateObj = e.eventDate ? new Date(e.eventDate) : new Date();
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return {
          id: e.eventId,
          title: e.title,
          category: e.category || 'General',
          date: `${year}-${month}-${day}`,
          time: `${e.startTime || '10:00 AM'} - ${e.endTime || '12:00 PM'}`,
          location: e.venue || 'Virtual',
          speaker: e.organizer || 'Guest Speaker',
          registeredCount: 0,
          capacity: e.maxParticipants || 150,
          organizer: e.organizer || 'Admin',
          status: e.status || 'Upcoming',
          description: e.description || '',
          eventDate: e.eventDate,
          venue: e.venue,
          startTime: e.startTime,
          endTime: e.endTime,
          maxParticipants: e.maxParticipants
        };
      });
      setEvents(mapped);
    } catch (err) {
      console.error("Error loading events", err);
      message.error("Failed to load events from server.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (editEvent) {
      editForm.setFieldsValue({
        title: editEvent.title,
        category: editEvent.category,
        organizer: editEvent.organizer,
        capacity: editEvent.maxParticipants || editEvent.capacity,
        date: editEvent.date || (editEvent.eventDate ? new Date(editEvent.eventDate).toISOString().split('T')[0] : ''),
        time: editEvent.time || `${editEvent.startTime || '10:00 AM'} - ${editEvent.endTime || '12:00 PM'}`,
        location: editEvent.venue || editEvent.location
      });
    }
  }, [editEvent, editForm]);

  const loadParticipants = async (eventId) => {
    setLoadingParticipants(true);
    try {
      const res = await api.get(`/event/registrations/event/${eventId}`);
      const data = res.data || [];
      const mapped = data.map(r => ({
        id: r.registrationId,
        name: r.student?.name || r.alumni?.name || 'User',
        role: r.studentId ? 'Student' : 'Alumni',
        email: r.student?.email || r.alumni?.email || 'N/A',
        date: r.registrationDate ? new Date(r.registrationDate).toLocaleDateString() : 'N/A',
        status: 'Confirmed'
      }));
      setParticipantsList(mapped);
    } catch (err) {
      console.error("Error fetching participants:", err);
      message.error("Failed to load participants.");
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
      category: newEvent.category || 'Technical Workshop',
      description: newEvent.description,
      eventDate: newEvent.date ? newEvent.date.toISOString() : new Date().toISOString(),
      startTime: newEvent.startTime || '04:00 PM',
      endTime: newEvent.endTime || '06:00 PM',
      venue: newEvent.location || 'Virtual',
      organizer: newEvent.organizer || 'Dr. Sarah Jenkins (Admin)',
      maxParticipants: parseInt(newEvent.capacity || 150),
      status: 'UPCOMING'
    };

    try {
      await api.post('/event/add', payload);
      message.success('Event created successfully!');
      setIsCreateOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err);
      message.error("Failed to create event.");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      const payload = {
        ...editEvent,
        eventId: editEvent.id,
        title: values.title,
        category: values.category,
        organizer: values.organizer,
        maxParticipants: parseInt(values.capacity),
        eventDate: values.date ? new Date(values.date).toISOString() : new Date().toISOString(),
        startTime: values.time?.split('-')[0]?.trim() || '10:00 AM',
        endTime: values.time?.split('-')[1]?.trim() || '12:00 PM',
        venue: values.location
      };

      await api.put('/event/update', payload);
      message.success(`Event "${values.title}" updated successfully!`);
      setEditEvent(null);
      fetchEvents();
    } catch (err) {
      console.error("Error updating event:", err);
      message.error("Failed to update event.");
    }
  };

  const handleDeleteEvent = (eventItem) => {
    Modal.confirm({
      title: `Delete Event "${eventItem.title}"?`,
      content: 'This will notify registered attendees and remove the event from student and alumni portals.',
      okText: 'Delete Event',
      okType: 'danger',
      async onOk() {
        try {
          await api.delete(`/event/delete/${eventItem.id}`);
          message.success('Event deleted successfully');
          fetchEvents();
        } catch (err) {
          console.error("Error deleting event:", err);
          message.error("Failed to delete event.");
        }
      }
    });
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchText.toLowerCase()) ||
                          e.category.toLowerCase().includes(searchText.toLowerCase()) ||
                          e.speaker.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = activeStatusTab === 'All' ? true : e.status === activeStatusTab;
    const isCreatedByAdmin = e.organizer?.toLowerCase().includes('admin');
    let matchesCreator = true;
    if (creatorFilter === 'admin') {
      matchesCreator = isCreatedByAdmin;
    } else if (creatorFilter === 'alumni') {
      matchesCreator = !isCreatedByAdmin;
    }

    return matchesSearch && matchesStatus && matchesCreator;
  });

  const studentsList = participantsList.filter(p => p.role === 'Student');
  const alumniList = participantsList.filter(p => p.role === 'Alumni');

  return (
    <AdminLayout onSearch={setSearchText}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Event & Webinar Management</h1>
          <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
            Create and schedule campus reunions, webinars, hackathons, and monitor participant registrations.
          </p>
        </div>

        <Button
          type="primary"
          icon={<FiPlus />}
          style={{ backgroundColor: 'var(--ac-brand)', border: 'none', height: 42, borderRadius: 8, fontWeight: 600 }}
          onClick={() => setIsCreateOpen(true)}
        >
          Create New Event
        </Button>
      </div>

      {/* Event Status Filtering Tabs */}
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

      {/* Search Input and Creator Filter Dropdown */}
      <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 14, padding: 18, border: '1px solid var(--ac-border)', marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <Input
            prefix={<FiSearch style={{ color: 'var(--ac-text-secondary)', marginRight: 6 }} />}
            placeholder="Search events by title, category, or speaker..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ borderRadius: 8 }}
          />
        </div>
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
            style={{ width: 180 }}
          />
        </div>
      </div>

      {/* Event Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
        {filteredEvents.map(eventItem => {
          const isAdminCreated = eventItem.organizer?.toLowerCase().includes('admin');
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
                  <Tag color={eventItem.category === 'Hackathon' ? 'purple' : eventItem.category === 'Webinar' ? 'blue' : 'orange'} style={{ fontWeight: 700 }}>
                    {eventItem.category}
                  </Tag>
                  <Space>
                    <Tag color={isAdminCreated ? 'geekblue' : 'gold'} style={{ fontWeight: 700 }}>
                      {isAdminCreated ? 'Admin' : 'Alumni'}
                    </Tag>
                    <Tag color={eventItem.status === 'Upcoming' ? 'success' : eventItem.status === 'Ongoing' ? 'processing' : 'default'} style={{ fontWeight: 600 }}>
                      {eventItem.status}
                    </Tag>
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
                      setEditEvent(eventItem);
                      editForm.setFieldsValue(eventItem);
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
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        title={`Edit Event "${editEvent?.title}"`}
        open={!!editEvent}
        onCancel={() => setEditEvent(null)}
        onOk={handleSaveEdit}
        okText="Save Event Changes"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="title" label="Event Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Webinar', label: 'Webinar' },
              { value: 'Hackathon', label: 'Hackathon' },
              { value: 'Networking', label: 'Networking Reunion' },
              { value: 'Workshop', label: 'Workshop' }
            ]} />
          </Form.Item>
          <Form.Item name="organizer" label="Event Organizer" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Dr. Sarah Jenkins (Admin)', label: 'Dr. Sarah Jenkins (Admin)' },
              { value: 'Arun Kumar (Alumni)', label: 'Arun Kumar (Alumni)' },
              { value: 'Priya Sankar (Alumni)', label: 'Priya Sankar (Alumni)' }
            ]} />
          </Form.Item>
          <Form.Item name="capacity" label="Max Capacity (seats)" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="date" label="Date (YYYY-MM-DD)">
            <Input />
          </Form.Item>
          <Form.Item name="time" label="Time">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Event Modal */}
      <CreateEventModal
        visible={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddEvent={handleAddEvent}
      />
    </AdminLayout>
  );
};
