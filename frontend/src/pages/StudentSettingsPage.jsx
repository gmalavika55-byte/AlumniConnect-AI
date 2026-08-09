import React from 'react';
import { message, Switch, Form, Input } from 'antd';
import { StudentLayout } from '../components/student/StudentLayout';
import styles from './StudentSettingsPage.module.css';

export const StudentSettingsPage = () => {
  const [passwordForm] = Form.useForm();

  const handlePasswordSave = async () => {
    try {
      await passwordForm.validateFields();
      message.success('Password updated successfully!');
      passwordForm.resetFields();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <StudentLayout>
      {/* Title Header */}
      <div className={styles.headerBar}>
        <div>
          <h1 className={styles.pageTitle}>Account Settings & Preferences</h1>
          <p className={styles.pageSub}>Manage your security credentials and notification alerts.</p>
        </div>
      </div>

      {/* Grid Layout of Cards */}
      <div className={styles.settingsGrid}>
        {/* Card 1: Security & Password */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Security & Password</h3>
          <Form form={passwordForm} layout="vertical">
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

          {/* 2FA Section inside Account Card */}
          <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--ac-border)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 15, color: 'var(--ac-text-primary)', fontWeight: 700 }}>Two-Factor Authentication (2FA)</h4>
            <div className={styles.settingRow}>
              <div>
                <h5 className={styles.settingLabel}>Enable 2FA via SMS / Authenticator</h5>
                <p className={styles.settingDesc}>Add an extra security layer during login verification.</p>
              </div>
              <Switch defaultChecked onChange={(checked) => message.success(`2FA ${checked ? 'enabled' : 'disabled'}`)} />
            </div>
          </div>
        </div>

        {/* Card 2: Notification Preferences */}
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
      </div>
    </StudentLayout>
  );
};
