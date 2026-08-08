import React, { useState } from 'react';
import { Form, Input, Select, Switch, Button, message, Modal } from 'antd';
import { FiUser, FiShield, FiGlobe, FiBell, FiLogOut, FiTrash2, FiSave } from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import { useAppContext } from '../context/AppContext';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export const AlumniSettingsPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme, language, setLanguage } = useAppContext();
  const [activeSection, setActiveSection] = useState('Account');
  const [passwordForm] = Form.useForm();
  const [profileSettingsForm] = Form.useForm();

  const handlePasswordSave = async () => {
    try {
      await passwordForm.validateFields();
      message.success('Security password updated successfully!');
      passwordForm.resetFields();
    } catch (err) {
      console.log(err);
    }
  };

  const handleProfileSettingsSave = async () => {
    try {
      const values = await profileSettingsForm.validateFields();
      message.success('Account profile preferences saved!');
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    authService.logout();
    message.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <AlumniLayout>
      {/* Title Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f1e36', margin: '0 0 4px 0' }}>Alumni Settings & Preferences</h1>
        <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
          Manage your security credentials, notification alerts, theme appearance, and language preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Navigation Sidebar */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { id: 'Account', label: 'Account & Security', icon: FiShield },
            { id: 'Profile', label: 'Profile Preferences', icon: FiUser },
            { id: 'Notifications', label: 'Notifications', icon: FiBell },
            { id: 'Appearance', label: 'Appearance & Language', icon: FiGlobe }
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: isActive ? '#e0edff' : 'transparent',
                  color: isActive ? '#1b62d4' : '#0f1e36',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: 13.5,
                  textAlign: 'left'
                }}
              >
                <Icon size={16} color={isActive ? '#1b62d4' : '#64748b'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Settings Panels */}
        <div>
          {/* 1. Account & Security / Password */}
          {activeSection === 'Account' && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f1e36', margin: '0 0 20px 0' }}>Security & Password</h3>
              <Form form={passwordForm} layout="vertical" style={{ maxWidth: 460 }}>
                <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true }]}>
                  <Input.Password placeholder="Enter current password" />
                </Form.Item>
                <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 6 }]}>
                  <Input.Password placeholder="Enter new password" />
                </Form.Item>
                <Form.Item name="confirmPassword" label="Confirm New Password" rules={[{ required: true }]}>
                  <Input.Password placeholder="Re-enter new password" />
                </Form.Item>
                <Button type="primary" style={{ backgroundColor: '#1b62d4', borderRadius: 8, fontWeight: 600, height: 40 }} onClick={handlePasswordSave}>
                  Save Password
                </Button>
              </Form>
            </div>
          )}

          {/* 2. Profile Preferences */}
          {activeSection === 'Profile' && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f1e36', margin: '0 0 20px 0' }}>Profile & Directory Visibility</h3>
              <Form form={profileSettingsForm} layout="vertical" initialValues={{ visibility: 'Verified Alumni & Students', mentorshipStatus: 'Available for Mentorship' }} style={{ maxWidth: 460 }}>
                <Form.Item name="visibility" label="Profile Directory Visibility">
                  <Select options={[
                    { value: 'Public', label: 'Public (Everyone)' },
                    { value: 'Verified Alumni & Students', label: 'Verified Alumni & Students' },
                    { value: 'Only Me', label: 'Private (Only Me)' }
                  ]} />
                </Form.Item>

                <Form.Item name="mentorshipStatus" label="Mentorship Status">
                  <Select options={[
                    { value: 'Available for Mentorship', label: 'Available for 1-on-1 Mentorship' },
                    { value: 'Busy / Paused', label: 'Busy / Temporarily Paused' }
                  ]} />
                </Form.Item>

                <Button type="primary" style={{ backgroundColor: '#1b62d4', borderRadius: 8, fontWeight: 600, height: 40 }} onClick={handleProfileSettingsSave}>
                  Save Profile Settings
                </Button>
              </Form>
            </div>
          )}

          {/* 3. Notifications Settings */}
          {activeSection === 'Notifications' && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f1e36', margin: '0 0 20px 0' }}>Notification Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <strong style={{ fontSize: 14, color: '#0f1e36', display: 'block' }}>Student Mentorship Alerts</strong>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Receive email notifications when students request mentorship sessions.</span>
                  </div>
                  <Switch defaultChecked onChange={() => message.success('Preference updated!')} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <strong style={{ fontSize: 14, color: '#0f1e36', display: 'block' }}>Reunion & Event Announcements</strong>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Get notified about upcoming alumni meetups and keynote requests.</span>
                  </div>
                  <Switch defaultChecked onChange={() => message.success('Preference updated!')} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: 14, color: '#0f1e36', display: 'block' }}>Fundraising Progress Digest</strong>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Receive monthly updates on campus scholarship campaigns.</span>
                  </div>
                  <Switch defaultChecked onChange={() => message.success('Preference updated!')} />
                </div>
              </div>
            </div>
          )}

          {/* 4. Appearance & Language (AppContext Integration) */}
          {activeSection === 'Appearance' && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f1e36', margin: '0 0 20px 0' }}>Appearance & Language</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Theme Toggle */}
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

                {/* Language Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: 14, color: '#0f1e36', display: 'block' }}>Preferred Language</strong>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Choose application language. Sidebar items update dynamically.</span>
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

                {/* Active Settings Summary */}
                <div style={{ padding: 16, background: theme === 'Dark' ? '#161b22' : '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}>
                  <div style={{ fontWeight: 700, color: theme === 'Dark' ? '#58a6ff' : '#1b62d4', marginBottom: 4 }}>
                    Active Preferences
                  </div>
                  <div style={{ color: theme === 'Dark' ? '#e6edf3' : '#334155' }}>
                    Current Theme: <strong>{theme} Mode</strong> • Language: <strong>{language}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div style={{ marginTop: 24, padding: 20, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 16 }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#dc2626', fontSize: 15 }}>Danger Zone</h4>
            <p style={{ margin: '0 0 14px 0', fontSize: 13, color: '#991b1b' }}>
              Sign out of your active alumni session.
            </p>
            <Button type="primary" danger icon={<FiLogOut />} onClick={handleLogout}>
              Logout Account
            </Button>
          </div>
        </div>
      </div>
    </AlumniLayout>
  );
};
