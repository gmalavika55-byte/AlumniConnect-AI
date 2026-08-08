import React, { useState } from 'react';
import { Form, Input, Select, Switch, Button, message } from 'antd';
import { FiUser, FiShield, FiGlobe, FiBell, FiLogOut, FiSave } from 'react-icons/fi';
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
      await profileSettingsForm.validateFields();
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
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Alumni Settings & Preferences</h1>
        <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
          Manage your security credentials, notification alerts, theme appearance, and language preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Navigation Sidebar */}
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                  backgroundColor: isActive ? 'var(--ac-brand-bg)' : 'transparent',
                  color: isActive ? 'var(--ac-brand)' : 'var(--ac-text-primary)',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: 13.5,
                  textAlign: 'left'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--ac-brand)' : 'var(--ac-text-secondary)'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Settings Panels */}
        <div>
          {/* 1. Account & Security / Password */}
          {activeSection === 'Account' && (
            <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 20px 0' }}>Security & Password</h3>
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
                <Button type="primary" style={{ backgroundColor: 'var(--ac-brand)', borderRadius: 8, fontWeight: 600, height: 40 }} onClick={handlePasswordSave}>
                  Save Password
                </Button>
              </Form>
            </div>
          )}

          {/* 2. Profile Preferences */}
          {activeSection === 'Profile' && (
            <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 20px 0' }}>Profile & Directory Visibility</h3>
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

                <Button type="primary" style={{ backgroundColor: 'var(--ac-brand)', borderRadius: 8, fontWeight: 600, height: 40 }} onClick={handleProfileSettingsSave}>
                  Save Profile Settings
                </Button>
              </Form>
            </div>
          )}

          {/* 3. Notifications Settings */}
          {activeSection === 'Notifications' && (
            <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 20px 0' }}>Notification Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--ac-border)' }}>
                  <div>
                    <strong style={{ fontSize: 14, color: 'var(--ac-text-primary)', display: 'block' }}>Student Mentorship Alerts</strong>
                    <span style={{ fontSize: 12, color: 'var(--ac-text-secondary)' }}>Receive email notifications when students request mentorship sessions.</span>
                  </div>
                  <Switch defaultChecked onChange={() => message.success('Preference updated!')} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--ac-border)' }}>
                  <div>
                    <strong style={{ fontSize: 14, color: 'var(--ac-text-primary)', display: 'block' }}>Reunion & Event Announcements</strong>
                    <span style={{ fontSize: 12, color: 'var(--ac-text-secondary)' }}>Get notified about upcoming alumni meetups and keynote requests.</span>
                  </div>
                  <Switch defaultChecked onChange={() => message.success('Preference updated!')} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: 14, color: 'var(--ac-text-primary)', display: 'block' }}>Fundraising Progress Digest</strong>
                    <span style={{ fontSize: 12, color: 'var(--ac-text-secondary)' }}>Receive monthly updates on campus scholarship campaigns.</span>
                  </div>
                  <Switch defaultChecked onChange={() => message.success('Preference updated!')} />
                </div>
              </div>
            </div>
          )}

          {/* 4. Appearance & Language (AppContext Integration) */}
          {activeSection === 'Appearance' && (
            <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 20px 0' }}>Appearance & Language</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Theme Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--ac-border)' }}>
                  <div>
                    <strong style={{ fontSize: 14, color: 'var(--ac-text-primary)', display: 'block' }}>Interface Theme</strong>
                    <span style={{ fontSize: 12, color: 'var(--ac-text-secondary)' }}>Switch between Light and Dark Navy theme globally.</span>
                  </div>
                  <Select
                    value={theme === 'dark' ? 'Dark' : 'Light'}
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
                    <strong style={{ fontSize: 14, color: 'var(--ac-text-primary)', display: 'block' }}>Preferred Language</strong>
                    <span style={{ fontSize: 12, color: 'var(--ac-text-secondary)' }}>Choose application language. Sidebar items update dynamically.</span>
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
                <div style={{ padding: 16, background: theme === 'dark' ? 'var(--ac-bg-input)' : 'var(--ac-bg-main)', borderRadius: 12, border: '1px solid var(--ac-border)', fontSize: 13 }}>
                  <div style={{ fontWeight: 700, color: 'var(--ac-brand)', marginBottom: 4 }}>
                    Active Preferences
                  </div>
                  <div style={{ color: 'var(--ac-text-primary)' }}>
                    Current Theme: <strong>{theme} Mode</strong> • Language: <strong>{language}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div style={{
            marginTop: 24,
            padding: 20,
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.08)' : '#fef2f2',
            border: theme === 'dark' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca',
            borderRadius: 16
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: theme === 'dark' ? '#f87171' : '#dc2626', fontSize: 15 }}>Danger Zone</h4>
            <p style={{ margin: '0 0 14px 0', fontSize: 13, color: theme === 'dark' ? '#fca5a5' : '#991b1b' }}>
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
