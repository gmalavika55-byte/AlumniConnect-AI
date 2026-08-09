import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';

export const CreateEventModal = ({ visible, onClose, onAddEvent }) => {
  const [form] = Form.useForm();

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      if (onAddEvent) {
        onAddEvent({
          id: Date.now(),
          ...values,
          date: values.eventDate ? values.eventDate.format('YYYY-MM-DD') : '2026-09-15',
          registeredCount: 0,
          status: 'Upcoming'
        });
      }
      message.success(`Event "${values.title}" created successfully!`);
      form.resetFields();
      onClose();
    } catch (err) {
      console.log('Validation Error:', err);
    }
  };

  return (
    <Modal
      title="Publish New Event / Webinar"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" style={{ backgroundColor: 'var(--ac-brand)', border: 'none' }} onClick={handleFinish}>
          Create Event
        </Button>
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ category: 'Webinar', location: 'Online - Zoom / Meet' }}>
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
          rules={[{ required: true }]}
        >
          <Select options={[
            { value: 'Dr. Sarah Jenkins (Admin)', label: 'Dr. Sarah Jenkins (Admin)' },
            { value: 'Arun Kumar (Alumni)', label: 'Arun Kumar (Alumni)' },
            { value: 'Priya Sankar (Alumni)', label: 'Priya Sankar (Alumni)' }
          ]} placeholder="Select event organizer" />
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
