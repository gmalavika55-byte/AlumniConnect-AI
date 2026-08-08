import React from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';

export const EditProfileModal = ({ visible, onClose, profileData, onSave }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && profileData) {
      form.setFieldsValue({
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        department: profileData.department,
        semester: profileData.semester,
        registerNumber: profileData.registerNumber,
        cgpa: profileData.cgpa,
        bio: profileData.bio,
        linkedin: profileData.linkedin,
        github: profileData.github,
        portfolio: profileData.portfolio
      });
    }
  }, [visible, profileData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
      message.success('Profile details updated successfully!');
      onClose();
    } catch (err) {
      console.log('Validation failed:', err);
    }
  };

  return (
    <Modal
      title="Edit Student Profile"
      open={visible}
      onCancel={onClose}
      width={640}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" style={{ backgroundColor: '#1b62d4' }} onClick={handleSubmit}>
          Save Changes
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="registerNumber" label="Register Number / Student ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Mobile Number">
            <Input />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Form.Item name="department" label="Department">
            <Select options={[
              { value: 'Computer Science & Engineering', label: 'CSE' },
              { value: 'Information Technology', label: 'IT' },
              { value: 'Electronics & Communication', label: 'ECE' },
              { value: 'Mechanical Engineering', label: 'Mech' }
            ]} />
          </Form.Item>
          <Form.Item name="semester" label="Semester">
            <Input />
          </Form.Item>
          <Form.Item name="cgpa" label="Current CGPA">
            <Input />
          </Form.Item>
        </div>

        <Form.Item name="bio" label="About / Professional Bio">
          <Input.TextArea rows={3} placeholder="Brief summary of your academic background and career ambitions..." />
        </Form.Item>

        <h4 style={{ margin: '16px 0 8px 0', color: '#0f1e36' }}>Professional Links</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Form.Item name="linkedin" label="LinkedIn URL">
            <Input placeholder="https://linkedin.com/in/..." />
          </Form.Item>
          <Form.Item name="github" label="GitHub URL">
            <Input placeholder="https://github.com/..." />
          </Form.Item>
          <Form.Item name="portfolio" label="Portfolio URL">
            <Input placeholder="https://johnmathew.dev" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
