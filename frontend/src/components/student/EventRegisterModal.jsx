import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { authService } from '../../services/authService';

export const EventRegisterModal = ({ visible, event, onClose, onRegisterSuccess }) => {
  const [form] = Form.useForm();
  const student = authService.getCurrentUser();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onRegisterSuccess(event.id);
      message.success(`Successfully registered for "${event.title}"! Confirmation sent to ${values.email}.`);
      form.resetFields();
      onClose();
    } catch (err) {
      console.log('Validation failed:', err);
    }
  };

  if (!event) return null;

  return (
    <Modal
      title={`Register for ${event.title}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" style={{ backgroundColor: '#1b62d4' }} onClick={handleSubmit}>
          Confirm Registration
        </Button>,
      ]}
    >
      <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
          <strong>Date:</strong> {event.dayNum} {event.monthStr} • <strong>Time:</strong> {event.time}
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#475569' }}>
          <strong>Venue:</strong> {event.venue}
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          fullName: student?.name || '',
          email: student?.email || '',
          department: student?.department || '',
          semester: student?.yearOfStudy ? `Year ${student.yearOfStudy}` : ''
        }}
      >
        <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="College Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Form.Item name="department" label="Department">
            <Input disabled />
          </Form.Item>
          <Form.Item name="semester" label="Year of Study">
            <Input disabled />
          </Form.Item>
        </div>
        <Form.Item name="queries" label="Any specific question for the speakers? (Optional)">
          <Input.TextArea rows={2} placeholder="Type your questions or discussion topics..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
