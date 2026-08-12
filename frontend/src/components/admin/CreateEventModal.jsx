import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import dayjs from 'dayjs';

export const CreateEventModal = ({ visible, onClose, onAddEvent, onUpdateEvent, editingEvent }) => {
  const [form] = Form.useForm();
  const isEdit = !!editingEvent;

  useEffect(() => {
    if (visible && editingEvent) {
      form.setFieldsValue({
        title: editingEvent.title || '',
        category: editingEvent.category || 'Webinar',
        audience: editingEvent.audience || 'BOTH',
        eventDate: editingEvent.eventDate ? dayjs(editingEvent.eventDate) : null,
        time: editingEvent.time || '',
        location: editingEvent.venue || editingEvent.location || '',
        speaker: editingEvent.speaker || '',
        organizer: editingEvent.organizer || '',
        capacity: editingEvent.maxParticipants || editingEvent.capacity || 100,
        description: editingEvent.description || ''
      });
    } else if (visible && !editingEvent) {
      form.resetFields();
    }
  }, [visible, editingEvent, form]);

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      const formattedDate = values.eventDate ? values.eventDate.format('YYYY-MM-DD') : '2026-09-15';

      if (isEdit && onUpdateEvent) {
        onUpdateEvent({
          id: editingEvent.id,
          ...values,
          date: formattedDate
        });
      } else if (onAddEvent) {
        onAddEvent({
          id: Date.now(),
          ...values,
          date: formattedDate,
          registeredCount: 0,
          status: 'Upcoming'
        });
      }
      form.resetFields();
      onClose();
    } catch (err) {
      console.log('Validation Error:', err);
    }
  };

  return (
    <Modal
      title={isEdit ? `Edit Event – "${editingEvent?.title}"` : "Publish New Event / Webinar"}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" style={{ backgroundColor: 'var(--ac-brand)', border: 'none' }} onClick={handleFinish}>
          {isEdit ? "Save Changes" : "Create Event"}
        </Button>
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ category: 'Webinar', audience: 'BOTH', location: 'Online - Zoom / Meet' }}>
        <Form.Item
          name="title"
          label="Event Title"
          rules={[{ required: true, message: 'Please enter event title' }]}
        >
          <Input placeholder="e.g. Global Alumni Career Meetup 2026" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Event Category"
          rules={[{ required: true }]}
        >
          <Select options={[
            { value: 'Webinar', label: 'Webinar / Guest Lecture' },
            { value: 'Hackathon', label: 'Hackathon / Competition' },
            { value: 'Networking', label: 'Alumni Networking Reunion' },
            { value: 'Workshop', label: 'Technical Workshop' },
            { value: 'Job Drive', label: 'Campus Placement Drive' }
          ]} />
        </Form.Item>

        <Form.Item
          name="audience"
          label="Target Audience"
          rules={[{ required: true }]}
        >
          <Select options={[
            { value: 'BOTH', label: 'Everyone (Students & Alumni)' },
            { value: 'STUDENTS', label: 'Students' },
            { value: 'ALUMNI', label: 'Alumni' }
          ]} />
        </Form.Item>

        <Form.Item
          name="eventDate"
          label="Event Date"
          rules={[{ required: true, message: 'Please select date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="time"
          label="Time & Duration"
          rules={[{ required: true, message: 'Please enter time' }]}
        >
          <Input placeholder="e.g. 05:00 PM - 07:00 PM IST" />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location / Venue"
          rules={[{ required: true }]}
        >
          <Input placeholder="e.g. Main Auditorium / Zoom Link" />
        </Form.Item>

        <Form.Item
          name="speaker"
          label="Guest Speaker / Organization"
        >
          <Input placeholder="e.g. Priya Sankar (Sr. SWE, Google)" />
        </Form.Item>

        <Form.Item
          name="organizer"
          label="Event Organizer"
          rules={[{ required: true, message: 'Please enter event organizer' }]}
        >
          <Input placeholder="e.g. Lohidha" disabled={isEdit} />
        </Form.Item>

        <Form.Item
          name="capacity"
          label="Max Capacity (seats)"
          rules={[{ required: true }]}
        >
          <Input type="number" placeholder="e.g. 150" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Event Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={3} placeholder="Brief summary of event agenda and key takeaways..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
