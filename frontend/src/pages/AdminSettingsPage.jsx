import React, { useState } from 'react';
import { Form, Input, Select, Switch, Button, message, Table, Tag } from 'antd';
import { FiUser, FiShield, FiGlobe, FiMoon, FiCheck, FiSave } from 'react-icons/fi';
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
      render: (text) => <strong style={{ color: '#0f1e36' }}>{text}</strong>
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
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f1e36', margin: '0 0 4px 0' }}>Settings & Role Configuration</h1>
        <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
          Manage administrator profile credentials, role permissions, and global appearance preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
        {/* 1. Admin Profile Settings Form */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f1e36', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiUser color="#1b62d4" /> Administrator Profile
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
              style={{ backgroundColor: '#1b62d4', height: 40, width: '100%', borderRadius: 8, fontWeight: 600 }}
              onClick={handleProfileSave}
            >
              Update Admin Profile
            </Button>
          </Form>
        </div>

        {/* 2. Global Theme & Language Settings (AppContext) */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f1e36', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiGlobe color="#1b62d4" /> Appearance & Localization
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Theme Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <strong style={{ fontSize: 14, color: '#0f1e36', display: 'block' }}>Interface Theme</strong>
                <span style={{ fontSize: 12, color: '#64748b' }}>Switch between Light and Dark Navy theme globally.</span>
              </div>
              <Select
                value={theme}
                options={[
                  { value: 'Light', label: '☀️ Light Theme' },
                  { value: 'Dark', label: '🌙 Dark Navy' }
                ]}
                onChange={(val) => {
                  setTheme(val);
                  message.success(`Global Theme changed to ${val}`);
                }}
                style={{ width: 160 }}
              />
            </div>

            {/* Language Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <strong style={{ fontSize: 14, color: '#0f1e36', display: 'block' }}>System Language</strong>
                <span style={{ fontSize: 12, color: '#64748b' }}>Dynamic translation across sidebar & labels.</span>
              </div>
              <Select
                value={language}
                options={[
                  { value: 'English', label: 'English (US)' },
                  { value: 'Tamil', label: 'Tamil (தமிழ்)' }
                ]}
                onChange={(val) => {
                  setLanguage(val);
                  message.success(`Language updated to ${val}`);
                }}
                style={{ width: 160 }}
              />
            </div>

            {/* Active Status Box */}
            <div style={{ padding: 16, background: theme === 'Dark' ? '#161b22' : '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}>
              <div style={{ fontWeight: 700, color: theme === 'Dark' ? '#58a6ff' : '#1b62d4', marginBottom: 4 }}>
                Active Settings Summary
              </div>
              <div style={{ color: theme === 'Dark' ? '#e6edf3' : '#334155' }}>
                Current Theme: <strong>{theme} Mode</strong> • Language: <strong>{language}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Role Permissions Matrix Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24, marginTop: 24 }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f1e36', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiShield color="#1b62d4" /> Role Permission Control Matrix
        </h3>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px 0' }}>
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
