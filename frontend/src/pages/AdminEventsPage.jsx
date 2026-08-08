import React, { useState } from 'react';
import { Card, Tag, Button, Modal, Form, Input, DatePicker, Select, message, Space, Table } from 'antd';
import { FiPlus, FiCalendar, FiClock, FiMapPin, FiUsers, FiEdit2, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { CreateEventModal } from '../components/admin/CreateEventModal';

export const AdminEventsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
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
      status: 'Upcoming',
      description: '24-hour hackathon with cash prizes & direct internship referrals sponsored by alumni tech startups.'
    },
    {
      id: 4,
      title: 'Cloud Architecture & DevOps Masterclass',
      category: 'Webinar',
      date: '2026-07-20',
      time: '05:00 PM - 07:00 PM',
      location: 'Zoom Virtual Hall',
      speaker: 'Divya Rajan (Lead Architect, Flipkart)',
      registeredCount: 115,
      status: 'Completed',
      description: 'Mastering Kubernetes deployment pipelines and AWS microservice architecture.'
    }
  ]);

  // Sample participants per event
  const dummyParticipants = [
    { id: 1, name: 'John Mathew', role: 'Student', dept: 'CSE', email: 'john.mathew@student.kce.ac.in' },
    { id: 2, name: 'Ananya Sharma', role: 'Student', dept: 'IT', email: 'ananya.s@student.kce.ac.in' },
    { id: 3, name: 'Marco Rossi', role: 'Alumni', dept: 'ECE', email: 'marco.rossi@alumni.kce.ac.in' },
    { id: 4, name: 'Sneha Venkatesh', role: 'Student', dept: 'EEE', email: 'sneha.v@student.kce.ac.in' }
  ];

  const handleAddEvent = (newEvent) => {
    setEvents([newEvent, ...events]);
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

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchText.toLowerCase()) ||
    e.category.toLowerCase().includes(searchText.toLowerCase()) ||
    e.speaker.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <AdminLayout onSearch={setSearchText}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f1e36', margin: '0 0 4px 0' }}>Event & Webinar Management</h1>
          <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
            Create and schedule campus reunions, webinars, hackathons, and monitor participant registrations.
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

      {/* Search Input */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: 14, padding: 18, border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <Input
          prefix={<FiSearch style={{ color: '#94a3b8', marginRight: 6 }} />}
          placeholder="Search events by title, category, or speaker..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ borderRadius: 8 }}
        />
      </div>

      {/* Event Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
        {filteredEvents.map(eventItem => (
          <div key={eventItem.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Tag color={eventItem.category === 'Hackathon' ? 'purple' : eventItem.category === 'Webinar' ? 'blue' : 'orange'} style={{ fontWeight: 700 }}>
                  {eventItem.category}
                </Tag>
                <Tag color={eventItem.status === 'Upcoming' ? 'success' : 'default'} style={{ fontWeight: 600 }}>
                  {eventItem.status}
                </Tag>
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
                  <FiUsers color="#1b62d4" /> <strong style={{ color: '#16a34a' }}>{eventItem.registeredCount} Registered Attendees</strong>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                type="text"
                icon={<FiEye />}
                style={{ color: '#1b62d4', fontWeight: 600 }}
                onClick={() => setViewParticipantsEvent(eventItem)}
              >
                Participants
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
        ))}
      </div>

      {/* View Participants Modal */}
      <Modal
        title={`Registered Participants – "${viewParticipantsEvent?.title}"`}
        open={!!viewParticipantsEvent}
        onCancel={() => setViewParticipantsEvent(null)}
        footer={[
          <Button key="close" type="primary" onClick={() => setViewParticipantsEvent(null)}>
            Close
          </Button>
        ]}
        width={600}
      >
        <div style={{ marginBottom: 16, fontWeight: 600, color: '#16a34a' }}>
          Total Registrations: {viewParticipantsEvent?.registeredCount || 0}
        </div>
        <Table
          dataSource={dummyParticipants}
          rowKey="id"
          pagination={false}
          columns={[
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Role', dataIndex: 'role', key: 'role', render: (r) => <Tag color={r === 'Student' ? 'green' : 'blue'}>{r}</Tag> },
            { title: 'Dept', dataIndex: 'dept', key: 'dept' },
            { title: 'Email', dataIndex: 'email', key: 'email' }
          ]}
        />
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
