import React from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';

export const AddStudentModal = ({ visible, onClose, onAddStudent }) => {
  const [form] = Form.useForm();

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      if (onAddStudent) {
        onAddStudent({
          id: Date.now(),
          ...values,
          cgpa: '8.5',
          status: 'Active'
        });
      }
      message.success(`Student "${values.fullName}" added successfully!`);
      form.resetFields();
      onClose();
    } catch (err) {
      console.log('Validation Error:', err);
    }
  };

  return (
    <Modal
      title="Add New Student Profile"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" style={{ backgroundColor: '#1b62d4' }} onClick={handleFinish}>
          Save Student
        </Button>
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ batchYear: '2026', department: 'Computer Science & Engineering' }}>
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter student full name' }]}
        >
          <Input placeholder="e.g. Ananya Sharma" />
        </Form.Item>

        <Form.Item
          name="registerNumber"
          label="Register Number / Student ID"
          rules={[{ required: true, message: 'Please enter register number' }]}
        >
          <Input placeholder="e.g. 21CS099" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid institutional email' }]}
        >
          <Input placeholder="e.g. ananya.s@student.kce.ac.in" />
        </Form.Item>

        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true }]}
        >
          <Select options={[
            { value: 'Computer Science & Engineering', label: 'Computer Science & Engineering' },
            { value: 'Information Technology', label: 'Information Technology' },
            { value: 'Electronics & Communication', label: 'Electronics & Communication' },
            { value: 'Electrical & Electronics', label: 'Electrical & Electronics' },
            { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
            { value: 'Civil Engineering', label: 'Civil Engineering' }
          ]} />
        </Form.Item>

        <Form.Item
          name="batchYear"
          label="Year / Batch"
          rules={[{ required: true }]}
        >
          <Select options={[
            { value: '2027 (1st Year)', label: '2027 (1st Year)' },
            { value: '2026 (2nd Year)', label: '2026 (2nd Year)' },
            { value: '2025 (3rd Year)', label: '2025 (3rd Year)' },
            { value: '2024 (4th Year)', label: '2024 (4th Year)' }
          ]} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
