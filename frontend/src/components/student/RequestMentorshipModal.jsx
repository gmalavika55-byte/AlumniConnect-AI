import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button, message } from 'antd';
import { FiUpload } from 'react-icons/fi';
import api from '../../services/api';
import { authService } from '../../services/authService';
import { useAppContext } from '../../context/AppContext';

export const RequestMentorshipModal = ({ visible, mentor, onClose, onRequestSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshData } = useAppContext();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const currentUser = authService.getCurrentUser();
      const currentStudentId = currentUser ? currentUser.studentId : null;
      if (!currentStudentId) {
        message.error('Student ID not found. Please log in again.');
        return;
      }

      setIsSubmitting(true);

      const payload = {
        studentId: currentStudentId,
        alumniId: mentor?.id,
        status: 'PENDING',
        remarks: `${values.topic || ''}: ${values.purpose || ''}`.trim().replace(/^:/, '').trim(),
        requestDate: values.date ? values.date.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0]
      };

      await api.post('/mentorship/add', payload);

      message.success(`Mentorship request submitted successfully to ${mentor?.name || 'Mentor'}!`);
      form.resetFields();
      setFileList([]);
      refreshData();
      onClose();
    } catch (err) {
      console.error('Error submitting mentorship request:', err);
      if (err.name === 'FieldsValidationError' || err.errorFields) {
        // Validation failed, do not show error message or close modal
        return;
      }
      const errData = err.response?.data;
      const errorMsg = typeof errData === 'string' ? errData : 'Failed to send mentorship request. Please try again.';
      message.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={mentor ? `Request Mentorship with ${mentor.name}` : 'Request Mentorship Session'}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" style={{ backgroundColor: '#1b62d4' }} onClick={handleSubmit} loading={isSubmitting}>
          Send Request
        </Button>,
      ]}
    >
      {mentor && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#071330', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {mentor.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: 14 }}>{mentor.name}</h4>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{mentor.role} at {mentor.company}</p>
          </div>
        </div>
      )}

      <Form form={form} layout="vertical" initialValues={{ mode: 'Virtual 1-on-1', timeSlot: '05:00 PM - 06:00 PM' }}>
        <Form.Item name="topic" label="Mentorship Topic" rules={[{ required: true, message: 'Please select a topic' }]}>
          <Select options={[
            { value: 'System Design & Architecture', label: 'System Design & Architecture' },
            { value: 'Resume Review & Interview Prep', label: 'Resume Review & Interview Prep' },
            { value: 'Career Transition to ML / AI', label: 'Career Transition to ML / AI' },
            { value: 'Higher Studies & Overseas Guidance', label: 'Higher Studies & Overseas Guidance' }
          ]} />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Form.Item name="date" label="Preferred Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="timeSlot" label="Preferred Time Slot" rules={[{ required: true }]}>
            <Select options={[
              { value: '10:00 AM - 11:00 AM', label: '10:00 AM - 11:00 AM' },
              { value: '02:00 PM - 03:00 PM', label: '02:00 PM - 03:00 PM' },
              { value: '05:00 PM - 06:00 PM', label: '05:00 PM - 06:00 PM' },
              { value: '07:00 PM - 08:00 PM', label: '07:00 PM - 08:00 PM' }
            ]} />
          </Form.Item>
        </div>

        <Form.Item name="mode" label="Interaction Mode">
          <Select options={[
            { value: 'Virtual 1-on-1 Video Call', label: 'Virtual 1-on-1 Video Call' },
            { value: 'In-Person Campus Meeting', label: 'In-Person Campus Meeting' },
            { value: 'Asynchronous Q&A', label: 'Asynchronous Q&A' }
          ]} />
        </Form.Item>

        <Form.Item name="purpose" label="Purpose / Specific Goals for Session" rules={[{ required: true, message: 'Please write session objectives' }]}>
          <Input.TextArea rows={3} placeholder="Describe what you want to achieve or specific questions you want to ask..." />
        </Form.Item>

        <Form.Item label="Attach Latest Resume (Optional)">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
          >
            <Button icon={<FiUpload />}>Upload Resume PDF</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
