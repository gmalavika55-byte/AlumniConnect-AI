import React, { useState } from 'react';
import { Card, Tag, Button, Modal, Form, Input, DatePicker, Select, message, Space, Table } from 'antd';
import { FiPlus, FiCalendar, FiClock, FiMapPin, FiUsers, FiEdit2, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { CreateEventModal } from '../components/admin/CreateEventModal';

export const AdminEventsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [creatorFilter, setCreatorFilter] = useState('all');
  const [viewParticipantsEvent, setViewParticipantsEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [editForm] = Form.useForm();

  // Events list state
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Global Alumni Meetup 2026',
      category: 'Networking',
      date: '2026-09-15',
      time: '06:00 PM - 09:00 PM',
      location: 'Grand Ballroom & Online Zoom',
      speaker: 'Priya Sankar (Sr. SWE, Google)',
      registeredCount: 142,
      capacity: 200,
      organizer: 'Dr. Sarah Jenkins (Admin)',
      status: 'Upcoming',
      description: 'Annual global reunion connecting alumni across big tech, research, and entrepreneurship with current students.'
    },
    {
      id: 2,
      title: 'Machine Learning & LLM Workshop',
      category: 'Workshop',
      date: '2026-08-28',
      time: '04:00 PM - 06:00 PM',
      location: 'Computer Lab 3 & Meet',
      speaker: 'Arun Kumar (Staff Scientist, AWS)',
      registeredCount: 88,
      capacity: 100,
      organizer: 'Arun Kumar (Alumni)',
      status: 'Upcoming',
      description: 'Hands-on practical session on fine-tuning PyTorch transformer models for real-world enterprise tasks.'
    },
    {
      id: 3,
      title: 'Campus Hackathon 2026: AI Solutions',
      category: 'Hackathon',
      date: '2026-10-05',
      time: '09:00 AM - 09:00 PM',
      location: 'KCE Innovation Hub',
      speaker: 'KCE Alumni Tech Council',
      registeredCount: 210,
      capacity: 250,
      organizer: 'Dr. Sarah Jenkins (Admin)',
      status: 'Upcoming',
      description: '24-hour hackathon with cash prizes & direct internship referrals sponsored by alumni tech startups.'
    },
    {
      id: 4,
      title: 'Alumni Q&A Panel Discussion',
      category: 'Webinar',
      date: '2026-08-09',
      time: '12:00 PM - 02:00 PM',
      location: 'Zoom Session 4',
      speaker: 'Priya Sankar (Sr. SWE, Google)',
      registeredCount: 45,
      capacity: 100,
      organizer: 'Dr. Sarah Jenkins (Admin)',
      status: 'Ongoing',
      description: 'Live ongoing Q&A panel matching alumni with final-year students.'
    },
    {
      id: 5,
      title: 'Cloud Architecture & DevOps Masterclass',
      category: 'Webinar',
      date: '2026-07-20',
      time: '05:00 PM - 07:00 PM',
      location: 'Zoom Virtual Hall',
      speaker: 'Divya Rajan (Lead Architect, Flipkart)',
      registeredCount: 115,
      capacity: 150,
      organizer: 'Divya Rajan (Alumni)',
      status: 'Past',
      description: 'Mastering Kubernetes deployment pipelines and AWS microservice architecture.'
    }
  ]);

  // Sample unique participants map per event
  const participantsMap = {
    1: [
      { id: 101, name: 'John Mathew', role: 'Student', email: 'john.mathew@student.kce.ac.in', date: '2026-08-01', status: 'Confirmed' },
      { id: 102, name: 'Ananya Sharma', role: 'Student', email: 'ananya.s@student.kce.ac.in', date: '2026-08-02', status: 'Confirmed' },
      { id: 103, name: 'Priya Sankar', role: 'Alumni', email: 'priya.sankar@alumni.kce.ac.in', date: '2026-08-01', status: 'Confirmed' },
      { id: 104, name: 'Rahul Kumar', role: 'Alumni', email: 'rahul.kumar@alumni.kce.ac.in', date: '2026-08-03', status: 'Confirmed' }
    ],
    2: [
      { id: 201, name: 'Malavika Raja', role: 'Student', email: 'malavika.r@student.kce.ac.in', date: '2026-08-05', status: 'Confirmed' },
      { id: 202, name: 'Arun Kumar', role: 'Alumni', email: 'arun.k@alumni.kce.ac.in', date: '2026-08-04', status: 'Confirmed' },
      { id: 203, name: 'Divya Rajan', role: 'Alumni', email: 'divya.r@alumni.kce.ac.in', date: '2026-08-04', status: 'Confirmed' }
    ],
    3: [
      { id: 301, name: 'John Mathew', role: 'Student', email: 'john.mathew@student.kce.ac.in', date: '2026-08-01', status: 'Confirmed' },
      { id: 302, name: 'Ananya Sharma', role: 'Student', email: 'ananya.s@student.kce.ac.in', date: '2026-08-02', status: 'Confirmed' },
      { id: 303, name: 'Sneha Venkatesh', role: 'Student', email: 'sneha.v@student.kce.ac.in', date: '2026-08-03', status: 'Confirmed' }
    ],
    4: [
      { id: 401, name: 'John Mathew', role: 'Student', email: 'john.mathew@student.kce.ac.in', date: '2026-08-09', status: 'Confirmed' },
      { id: 402, name: 'Priya Sankar', role: 'Alumni', email: 'priya.sankar@alumni.kce.ac.in', date: '2026-08-09', status: 'Confirmed' }
    ],
    5: [
      { id: 501, name: 'Ananya Sharma', role: 'Student', email: 'ananya.s@student.kce.ac.in', date: '2026-07-15', status: 'Confirmed' },
      { id: 502, name: 'Divya Rajan', role: 'Alumni', email: 'divya.r@alumni.kce.ac.in', date: '2026-07-16', status: 'Confirmed' }
    ]
  };

  const handleAddEvent = (newEvent) => {
    setEvents([
      {
        ...newEvent,
        organizer: newEvent.organizer || 'Dr. Sarah Jenkins (Admin)',
        capacity: newEvent.capacity || 150
      },
      ...events
    ]);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      setEvents(events.map(ev => ev.id === editEvent.id ? { ...ev, ...values } : ev));
      message.success(`Event "${values.title}" updated successfully!`);
      setEditEvent(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteEvent = (eventItem) => {
    Modal.confirm({
      title: `Delete Event "${eventItem.title}"?`,
      content: 'This will notify registered attendees and remove the event from student and alumni portals.',
      okText: 'Delete Event',
      okType: 'danger',
      onOk() {
        setEvents(events.filter(ev => ev.id !== eventItem.id));
        message.success('Event deleted');
      }
    });
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchText.toLowerCase()) ||
                          e.category.toLowerCase().includes(searchText.toLowerCase()) ||
                          e.speaker.toLowerCase().includes(searchText.toLowerCase());
    
    // Status tab filter (All, Upcoming, Ongoing, Past)
    const matchesStatus = activeStatusTab === 'All' ? true : e.status === activeStatusTab;

    // Creator filter (All, Admin, Alumni)
    const isCreatedByAdmin = e.organizer?.toLowerCase().includes('admin');
    let matchesCreator = true;
    if (creatorFilter === 'admin') {
      matchesCreator = isCreatedByAdmin;
    } else if (creatorFilter === 'alumni') {
      matchesCreator = !isCreatedByAdmin;
    }

    return matchesSearch && matchesStatus && matchesCreator;
  });

  // Calculate lists of participants for the currently viewed event
  const currentParticipants = participantsMap[viewParticipantsEvent?.id] || [];
  const studentsList = currentParticipants.filter(p => p.role === 'Student');
  const alumniList = currentParticipants.filter(p => p.role === 'Alumni');

  return (
    <AdminLayout onSearch={setSearchText}>
      {/* Title Header */}
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
