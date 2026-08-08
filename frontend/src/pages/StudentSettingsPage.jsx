import React, { useState } from 'react';
import { message, Switch, Select, Form, Input, Modal } from 'antd';
import { FiShield, FiBell, FiEye, FiGlobe, FiTrash2, FiLogOut } from 'react-icons/fi';
import { StudentLayout } from '../components/student/StudentLayout';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styles from './StudentSettingsPage.module.css';

export const StudentSettingsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Account');
  const [passwordForm] = Form.useForm();

  // ── Context: theme & language ──────────────────────────────
  const { theme, setTheme, language, setLanguage } = useAppContext();

  const handlePasswordSave = async () => {
    try {
      await passwordForm.validateFields();
      message.success('Password updated successfully!');
      passwordForm.resetFields();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    authService.logout();
    message.info('Logged out successfully');
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: 'Delete Student Account',
      content: 'Are you sure you want to permanently delete your account? All data will be removed.',
      okText: 'Delete Permanently',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        authService.logout();
        message.success('Account deleted successfully');
        navigate('/');
      }
    });
  };

  const handleThemeChange = (val) => {
    setTheme(val);
    message.success(`Theme changed to ${val}`);
  };

  const handleLanguageChange = (val) => {
    setLanguage(val);
    message.success(`Language changed to ${val}`);
  };

  return (
    <StudentLayout>
      <div className={styles.headerBar}>
        <div>
          <h1 className={styles.pageTitle}>Account Settings & Preferences</h1>
          <p className={styles.pageSub}>Manage your security credentials, notification alerts, privacy, and theme preferences.</p>
        </div>
      </div>

      <div className={styles.settingsGrid}>
        {/* Navigation Sidebar */}
        <div className={styles.settingsNav}>
          {[
            { id: 'Account', label: 'Account & Security', icon: FiShield },
            { id: 'Notifications', label: 'Notifications', icon: FiBell },
            { id: 'Privacy', label: 'Privacy & Visibility', icon: FiEye },
            { id: 'Appearance', label: 'Appearance & Language', icon: FiGlobe }
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`${styles.navBtn} ${activeSection === item.id ? styles.activeNavBtn : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon size={16} /> {item.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Content Panel */}
        <div>
          {activeSection === 'Account' && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Security & Password</h3>
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
                <button type="button" className={styles.primaryBtn} onClick={handlePasswordSave}>
                  Save Password
                </button>
              </Form>

              <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: 15, color: '#0f1e36' }}>Two-Factor Authentication (2FA)</h4>
                <div className={styles.settingRow}>
                  <div>
                    <h5 className={styles.settingLabel}>Enable 2FA via SMS / Authenticator</h5>
                    <p className={styles.settingDesc}>Add an extra security layer during login verification.</p>
                  </div>
                  <Switch defaultChecked onChange={(checked) => message.success(`2FA ${checked ? 'enabled' : 'disabled'}`)} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Notifications' && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Notification Preferences</h3>
              <div className={styles.settingRow}>
                <div>
                  <h5 className={styles.settingLabel}>Mentorship Session Alerts</h5>
                  <p className={styles.settingDesc}>Get notified when alumni accept session requests.</p>
                </div>
                <Switch defaultChecked onChange={() => message.success('Preferences saved!')} />
              </div>
              <div className={styles.settingRow}>
                <div>
                  <h5 className={styles.settingLabel}>Event & Hackathon Announcements</h5>
                  <p className={styles.settingDesc}>Get notified about new campus hackathons and alumni webinars.</p>
                </div>
                <Switch defaultChecked onChange={() => message.success('Preferences saved!')} />
              </div>
              <div className={styles.settingRow}>
                <div>
                  <h5 className={styles.settingLabel}>Weekly Career Recommendations</h5>
                  <p className={styles.settingDesc}>Receive personalized job & internship recommendations digest.</p>
                </div>
                <Switch defaultChecked onChange={() => message.success('Preferences saved!')} />
              </div>
            </div>
          )}

          {activeSection === 'Privacy' && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Privacy & Profile Visibility</h3>
              <div className={styles.settingRow}>
                <div>
                  <h5 className={styles.settingLabel}>Profile Visibility</h5>
                  <p className={styles.settingDesc}>Control who can view your profile & academic details.</p>
                </div>
                <Select
                  defaultValue="Alumni & Students"
                  options={[
                    { value: 'Public', label: 'Public (Everyone)' },
                    { value: 'Alumni & Students', label: 'Verified Alumni & Students' },
                    { value: 'Only Me', label: 'Private (Only Me)' }
                  ]}
                  onChange={(val) => message.success(`Visibility set to ${val}`)}
                />
              </div>
              <div className={styles.settingRow}>
                <div>
                  <h5 className={styles.settingLabel}>Show Email & Mobile on Mentorship</h5>
                  <p className={styles.settingDesc}>Allow accepted alumni mentors to view direct contact info.</p>
                </div>
                <Switch defaultChecked onChange={() => message.success('Privacy settings saved!')} />
              </div>
            </div>
          )}

          {activeSection === 'Appearance' && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Appearance & Language</h3>

              {/* ── Theme Selector ── */}
              <div className={styles.settingRow}>
                <div>
                  <h5 className={styles.settingLabel}>Interface Theme</h5>
                  <p className={styles.settingDesc}>Select your preferred dashboard color theme. Applied globally.</p>
                </div>
                <Select
                  value={theme}
                  options={[
                    { value: 'Light', label: '☀️  Light Theme' },
                    { value: 'Dark', label: '🌙  Dark Theme' }
                  ]}
                  onChange={handleThemeChange}
                  style={{ minWidth: 160 }}
                />
              </div>

              {/* ── Language Selector ── */}
              <div className={styles.settingRow}>
                <div>
                  <h5 className={styles.settingLabel}>Preferred Language</h5>
                  <p className={styles.settingDesc}>
                    Choose your application language. Sidebar labels will update immediately.
                  </p>
                </div>
                <Select
                  value={language}
                  options={[
                    { value: 'English', label: 'English (US)' },
                    { value: 'Tamil', label: 'Tamil (தமிழ்)' }
                  ]}
                  onChange={handleLanguageChange}
                  style={{ minWidth: 160 }}
                />
              </div>

              {/* Live preview strip */}
              <div style={{
                marginTop: 20,
                padding: '14px 18px',
                background: theme === 'Dark' ? '#161b22' : '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                color: theme === 'Dark' ? '#e6edf3' : '#0f1e36',
                fontSize: 13
              }}>
                <span style={{ fontSize: 20 }}>{theme === 'Dark' ? '🌙' : '☀️'}</span>
                <div>
                  <strong>Current theme:</strong> {theme} &nbsp;|&nbsp;
                  <strong>Language:</strong> {language}
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Settings are saved and persist across sessions.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone Card */}
          <div className={styles.dangerCard}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 16, color: '#dc2626' }}>Danger Zone</h3>
            <p style={{ fontSize: 13, color: '#7f1d1d', margin: '0 0 16px 0' }}>
              Sign out of your active session or permanently delete your student account from AlumniConnect.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                style={{ backgroundColor: '#ffffff', color: '#0f1e36', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={handleLogout}
              >
                <FiLogOut /> Logout Account
              </button>
              <button
                type="button"
                style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={handleDeleteAccount}
              >
                <FiTrash2 /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};
