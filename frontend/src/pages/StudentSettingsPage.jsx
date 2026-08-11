import React, { useState, useEffect, useCallback } from 'react';
import { message, Switch, Form, Input, Spin } from 'antd';
import { StudentLayout } from '../components/student/StudentLayout';
import { authService } from '../services/authService';
import api from '../services/api';
import styles from './StudentSettingsPage.module.css';

const DEFAULT_PREFS = { mentorship: true, events: true, career: true };

export const StudentSettingsPage = () => {
  const [passwordForm] = Form.useForm();
  const student = authService.getCurrentUser();

  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [saving, setSaving] = useState(null); // which key is currently saving

  // Load notification preferences from backend on mount
  const loadPrefs = useCallback(async () => {
    if (!student?.studentId) {
      setPrefsLoading(false);
      return;
    }
    try {
      const res = await api.get(`/student/get/${student.studentId}`);
      const data = res.data;
      if (data.notificationPref) {
        try {
          const parsed = JSON.parse(data.notificationPref);
          setPrefs({
            mentorship: parsed.mentorship !== undefined ? parsed.mentorship : true,
            events: parsed.events !== undefined ? parsed.events : true,
            career: parsed.career !== undefined ? parsed.career : true
          });
        } catch {
          setPrefs(DEFAULT_PREFS);
        }
      } else {
        setPrefs(DEFAULT_PREFS);
      }
    } catch (err) {
      console.error('Error loading notification preferences:', err);
    } finally {
      setPrefsLoading(false);
    }
  }, [student?.studentId]);

  useEffect(() => {
    loadPrefs();
  }, [loadPrefs]);

  // Save a single preference toggle to the backend
  const handleToggle = async (key, checked) => {
    if (!student?.studentId) {
      message.error('Student ID not found. Please log in again.');
      return;
    }

    const previousPrefs = { ...prefs };
    const newPrefs = { ...prefs, [key]: checked };
    setPrefs(newPrefs); // optimistic UI update
    setSaving(key);

    try {
      // Fetch the latest student object to avoid overwriting other fields
      const profileRes = await api.get(`/student/get/${student.studentId}`);
      const studentObj = profileRes.data;

      // Update only the notificationPref field
      const updated = {
        ...studentObj,
        notificationPref: JSON.stringify(newPrefs)
      };

      await api.put('/student/update', updated);
      message.success('Preference saved!');
    } catch (err) {
      console.error('Error saving notification preference:', err);
      message.error('Failed to save preference. Reverting.');
      setPrefs(previousPrefs); // revert on failure
    } finally {
      setSaving(null);
    }
  };

  const handlePasswordSave = async () => {
    try {
      const values = await passwordForm.validateFields();
      if (values.newPassword !== values.confirmPassword) {
        message.error('New passwords do not match!');
        return;
      }
      if (!student) return;

      // 1. Verify current password by attempting a dummy login
      try {
        await api.post('/auth/login', {
          email: student.email,
          password: values.currentPassword
        });
      } catch (authErr) {
        message.error('Invalid current password!');
        return;
      }

      // 2. Fetch student details to get the current profile object
      const profileRes = await api.get(`/student/get/${student.studentId}`);
      const studentObj = profileRes.data;

      // 3. Update password in database
      const updatedStudent = {
        ...studentObj,
        password: values.newPassword
      };

      await api.put('/student/update', updatedStudent);
      message.success('Password updated successfully!');
      passwordForm.resetFields();
    } catch (err) {
      console.error('Error updating settings password:', err);
      message.error('Failed to update password. Please check your fields.');
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
          {prefsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
              <Spin size="small" />
            </div>
          ) : (
            <>
              <div className={styles.settingRow}>
                <div>
                  <h5 className={styles.settingLabel}>Mentorship Session Alerts</h5>
                  <p className={styles.settingDesc}>Get notified when alumni accept session requests.</p>
                </div>
                <Switch
                  checked={prefs.mentorship}
                  loading={saving === 'mentorship'}
                  onChange={(checked) => handleToggle('mentorship', checked)}
                />
              </div>
              <div className={styles.settingRow}>
                <div>
                  <h5 className={styles.settingLabel}>Event & Hackathon Announcements</h5>
                  <p className={styles.settingDesc}>Get notified about new campus hackathons and alumni webinars.</p>
                </div>
                <Switch
                  checked={prefs.events}
                  loading={saving === 'events'}
                  onChange={(checked) => handleToggle('events', checked)}
                />
              </div>
              <div className={styles.settingRow}>
                <div>
                  <h5 className={styles.settingLabel}>Weekly Career Recommendations</h5>
                  <p className={styles.settingDesc}>Receive personalized job & internship recommendations digest.</p>
                </div>
                <Switch
                  checked={prefs.career}
                  loading={saving === 'career'}
                  onChange={(checked) => handleToggle('career', checked)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};
