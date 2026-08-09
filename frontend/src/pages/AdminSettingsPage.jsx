import React, { useState } from 'react';
import { Form, Input, Select, Switch, Button, message, Table } from 'antd';
import { FiUser, FiShield, FiGlobe, FiSave } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { useAppContext } from '../context/AppContext';

export const AdminSettingsPage = () => {
  const { theme, setTheme, language, setLanguage } = useAppContext();
  const [profileForm] = Form.useForm();

  // Role permissions matrix state
  const [permissions, setPermissions] = useState([
    { key: '1', feature: 'View Student Profiles', admin: true, alumni: true, student: true },
    { key: '2', feature: 'View Alumni Directory', admin: true, alumni: true, student: true },
    { key: '3', feature: 'Request 1-on-1 Mentorship', admin: true, alumni: false, student: true },
    { key: '4', feature: 'Approve Alumni Verification', admin: true, alumni: false, student: false },
    { key: '5', feature: 'Publish Global Events', admin: true, alumni: true, student: false },
    { key: '6', feature: 'Export Institutional Analytics', admin: true, alumni: false, student: false }
  ]);

  const handleProfileSave = async () => {
    try {
      const values = await profileForm.validateFields();
      message.success(`Admin profile for ${values.name} updated!`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTogglePermission = (key, role) => {
    setPermissions(permissions.map(p => {
      if (p.key === key) {
        const updated = { ...p, [role]: !p[role] };
        message.info(`Permission "${p.feature}" for ${role.toUpperCase()} updated.`);
        return updated;
      }
      return p;
    }));
  };

  const permissionColumns = [
    {
      title: 'System Feature / Module',
      dataIndex: 'feature',
      key: 'feature',
      render: (text) => <strong style={{ color: 'var(--ac-text-primary)' }}>{text}</strong>
    },
    {
      title: 'Admin Access',
      dataIndex: 'admin',
      key: 'admin',
      render: (val, record) => (
        <Switch
          checked={val}
          onChange={() => handleTogglePermission(record.key, 'admin')}
        />
      )
    },
    {
      title: 'Alumni Access',
      dataIndex: 'alumni',
      key: 'alumni',
      render: (val, record) => (
        <Switch
          checked={val}
          onChange={() => handleTogglePermission(record.key, 'alumni')}
        />
      )
    },
    {
      title: 'Student Access',
      dataIndex: 'student',
      key: 'student',
      render: (val, record) => (
        <Switch
          checked={val}
          onChange={() => handleTogglePermission(record.key, 'student')}
        />
      )
    }
  ];

  return (
    <AdminLayout>
      {/* Title Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Settings & Role Configuration</h1>
        <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
          Manage administrator profile credentials, role permissions, and global appearance preferences.
        </p>
      </div>

      {/* 1. Admin Profile Settings Form */}
      <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiUser color="var(--ac-brand)" /> Administrator Profile
        </h3>

        <Form
          form={profileForm}
          layout="vertical"
          initialValues={{
            name: 'Dr. Sarah Jenkins',
            email: 'sarah.jenkins@kce.ac.in',
            role: 'System Administrator',
            dept: 'Institutional Administration'
          }}
        >
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Admin Email Address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Administrative Role">
            <Input disabled />
          </Form.Item>
          <Form.Item name="dept" label="Department / Office">
            <Input />
          </Form.Item>
          <Button
            type="primary"
            icon={<FiSave />}
            style={{ backgroundColor: 'var(--ac-brand)', border: 'none', height: 40, width: '100%', borderRadius: 8, fontWeight: 600 }}
            onClick={handleProfileSave}
          >
            Update Admin Profile
          </Button>
        </Form>
      </div>

      {/* 3. Role Permissions Matrix Table */}
      <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24, marginTop: 24 }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiShield color="var(--ac-brand)" /> Role Permission Control Matrix
        </h3>
        <p style={{ fontSize: 13, color: 'var(--ac-text-secondary)', margin: '0 0 20px 0' }}>
          Configure feature access rights for Admin, Alumni, and Student roles across the platform.
        </p>
        <Table
          dataSource={permissions}
          columns={permissionColumns}
          pagination={false}
        />
      </div>
    </AdminLayout>
  );
};
