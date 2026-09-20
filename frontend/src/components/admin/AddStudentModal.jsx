import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';

export const AddStudentModal = ({ visible, onClose, onAddStudent }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      const payload = {
        name: values.fullName,
        registerNo: values.registerNumber,
        email: values.email,
        department: values.department,
        batch: values.batchYear,
        password: values.password || 'Student@123',
        cgpa: values.cgpa ? parseFloat(values.cgpa) : 8.0,
        mobile: values.mobile || ''
      };

      if (onAddStudent) {
        await onAddStudent(payload);
      }
      
      form.resetFields();
      onClose();
    } catch (err) {
      if (err.errorFields) {
        // Form validation error handled by Ant Design Form
        return;
      }
      console.error('Error adding student:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Add New Student Profile"
      open={visible}
      onCancel={onClose}
      confirmLoading={submitting}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" style={{ backgroundColor: '#1b62d4' }} loading={submitting} onClick={handleFinish}>
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
          rules={[{ required: true, message: 'Please enter year or batch (e.g. 2024-2028)' }]}
        >
          <Input placeholder="e.g. 2024-2028 or 2026" />
        </Form.Item>

        <Form.Item
          name="cgpa"
          label="Initial CGPA (Optional)"
        >
          <Input placeholder="e.g. 8.5" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Default Password (Optional)"
          extra="Default password will be set to 'Student@123' if left empty"
        >
          <Input.Password placeholder="Student@123" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
