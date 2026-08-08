import React from 'react';
import { Modal, Form, Rate, Input, Button, message } from 'antd';

export const LeaveFeedbackModal = ({ visible, session, onClose }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      message.success('Thank you! Your feedback has been submitted to the alumni network.');
      form.resetFields();
      onClose();
    } catch (err) {
      console.log('Validation error:', err);
    }
  };

  if (!session) return null;

  return (
    <Modal
      title={`Leave Feedback for ${session.mentorName}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" style={{ backgroundColor: '#1b62d4' }} onClick={handleSubmit}>
          Submit Feedback
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ rating: 5 }}>
        <Form.Item name="rating" label="Session Rating" rules={[{ required: true }]}>
          <Rate allowHalf />
        </Form.Item>

        <Form.Item name="feedback" label="Your Feedback & Key Learnings" rules={[{ required: true, message: 'Please write your feedback' }]}>
          <Input.TextArea rows={4} placeholder="How was your session? What key insights did you gain?" />
        </Form.Item>

        <Form.Item name="recommend" label="Would you recommend this mentor to other students?">
          <Input placeholder="e.g. Yes, absolutely! Very knowledgeable and helpful." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
