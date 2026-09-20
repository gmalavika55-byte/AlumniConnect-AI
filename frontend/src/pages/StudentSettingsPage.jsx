import React, { useState, useEffect, useCallback } from 'react';
import { message, Switch, Form, Input, Spin, Tag, Divider, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiLogOut, FiBookOpen, FiTarget, FiBell, FiCheckCircle } from 'react-icons/fi';
import { StudentLayout } from '../components/student/StudentLayout';
import { authService } from '../services/authService';
import api from '../services/api';
import styles from './StudentSettingsPage.module.css';

const DEFAULT_PREFS = { mentorship: true, events: true, career: true };

export const StudentSettingsPage = () => {
  const navigate = useNavigate();
  const [passwordForm] = Form.useForm();
  const student = authService.getCurrentUser();
  const studentId = student?.studentId;

  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [saving, setSaving] = useState(null); // which key is currently saving

  // Load student profile and notification preferences from backend on mount
  const loadStudentData = useCallback(async () => {
    if (!studentId) {
      setLoading(false);
      setPrefsLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/student/get/${studentId}`);
      const data = res.data;
      setStudentProfile(data);

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
      console.error('Error loading student profile for settings:', err);
      message.error('Failed to load profile details.');
    } finally {
      setLoading(false);
      setPrefsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);

  // Save a single preference toggle to the backend
  const handleToggle = async (key, checked) => {
    if (!studentId) {
      message.error('Student ID not found. Please log in again.');
      return;
    }

    const previousPrefs = { ...prefs };
    const newPrefs = { ...prefs, [key]: checked };
    setPrefs(newPrefs); // optimistic UI update
    setSaving(key);

    try {
      // Fetch the latest student object to avoid overwriting other fields
      const profileRes = await api.get(`/student/get/${studentId}`);
      const studentObj = profileRes.data;

      // Update only the notificationPref field
      const updated = {
        ...studentObj,
        notificationPref: JSON.stringify(newPrefs)
      };

      await api.put('/student/update', updated);
      setStudentProfile(updated);
      message.success('Preference saved!');
    } catch (err) {
      console.error('Error saving notification preference:', err);
      message.error('Failed to save preference. Reverting.');
      setPrefs(previousPrefs); // revert on failure
    } finally {
      setSaving(null);
    }
  };

  // Handle Password Update with Backend Verification & Persistence
  const handlePasswordSave = async () => {
    try {
      const values = await passwordForm.validateFields();
      if (values.newPassword !== values.confirmPassword) {
        message.error('New passwords do not match!');
        return;
      }
      if (!studentId || !student?.email) {
        message.error('Student session missing. Please log in again.');
        return;
      }

      setPasswordUpdating(true);

      // 1. Verify current password via login API endpoint
      try {
        await api.post('/auth/login', {
          email: student.email,
          password: values.currentPassword
        });
      } catch (authErr) {
        console.error('Current password verification failed:', authErr);
        message.error('Invalid current password!');
        setPasswordUpdating(false);
        return;
      }

      // 2. Fetch student details to get current profile object
      const profileRes = await api.get(`/student/get/${studentId}`);
      const studentObj = profileRes.data;

      // 3. Persist updated password in database
      const updatedStudent = {
        ...studentObj,
        password: values.newPassword
      };

      await api.put('/student/update', updatedStudent);
      message.success('Password updated successfully!');
      passwordForm.resetFields();
      setStudentProfile(updatedStudent);
    } catch (err) {
      if (err.errorFields) {
        // Form validation error handled by Ant Design
        return;
      }
      console.error('Error updating student password:', err);
      message.error('Failed to update password. Please check your fields.');
    } finally {
      setPasswordUpdating(false);
    }
  };

  // Handle Logout using authService
  const handleLogout = () => {
    authService.logout();
    message.info('Logged out successfully.');
    navigate('/login');
  };

  return (
    <StudentLayout>
      {/* Title Header */}
      <div className={styles.headerBar}>
        <div>
          <h1 className={styles.pageTitle}>Account Settings & Preferences</h1>
          <p className={styles.pageSub}>Manage your account credentials, security preferences, and notification alerts.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
          <Spin size="large" tip="Loading settings..." />
        </div>
      ) : (
        <div className={styles.settingsGrid}>
          {/* Card 1: Account & Profile Overview */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <FiUser style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--ac-brand)' }} />
              Account & Profile Overview
            </h3>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--ac-text-primary)' }}>
                    {studentProfile?.name || student?.name || 'Student Member'}
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: 13, color: 'var(--ac-text-secondary)' }}>
                    <FiMail style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    {studentProfile?.email || student?.email || 'N/A'}
                  </p>
                </div>
                <Tag color="blue" style={{ fontSize: 12, padding: '4px 10px', borderRadius: 12 }}>
                  {student?.role || 'Student'}
                </Tag>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <Space direction="vertical" size={10} style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 13.5, color: 'var(--ac-text-secondary)' }}>
                  <FiBookOpen style={{ marginRight: 10, color: '#3b82f6', minWidth: 16 }} />
                  <span>
                    <strong>Department: </strong>
                    {studentProfile?.department || 'Computer Science'} {studentProfile?.course ? `(${studentProfile.course})` : ''}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', fontSize: 13.5, color: 'var(--ac-text-secondary)' }}>
                  <FiUser style={{ marginRight: 10, color: '#10b981', minWidth: 16 }} />
                  <span>
                    <strong>Reg No / Batch: </strong>
                    {studentProfile?.registerNo || 'N/A'} {studentProfile?.batch ? `(Batch of ${studentProfile.batch})` : ''}
                  </span>
                </div>

                {studentProfile?.yearOfStudy && (
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: 13.5, color: 'var(--ac-text-secondary)' }}>
                    <FiBookOpen style={{ marginRight: 10, color: '#8b5cf6', minWidth: 16 }} />
                    <span>
                      <strong>Year of Study: </strong>
                      Year {studentProfile.yearOfStudy}
                    </span>
                  </div>
                )}

                {studentProfile?.careerGoal && (
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: 13.5, color: 'var(--ac-text-secondary)' }}>
                    <FiTarget style={{ marginRight: 10, color: '#f59e0b', minWidth: 16 }} />
                    <span>
                      <strong>Career Goal: </strong>
                      {studentProfile.careerGoal}
                    </span>
                  </div>
                )}
              </Space>

              <Divider style={{ margin: '20px 0 16px 0' }} />

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  width: '100%',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
              >
                <FiLogOut style={{ marginRight: 8 }} />
                Sign Out / Logout
              </button>
            </div>
          </div>

          {/* Card 2: Security & Password Management */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <FiLock style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--ac-brand)' }} />
              Security & Password
            </h3>
            <Form form={passwordForm} layout="vertical">
              <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true, message: 'Please enter your current password' }]}>
                <Input.Password placeholder="Enter current password" />
              </Form.Item>
              <Form.Item name="newPassword" label="New Password" rules={[{ required: true, message: 'Please enter a new password' }, { min: 6, message: 'Password must be at least 6 characters' }]}>
                <Input.Password placeholder="Enter new password (min 6 characters)" />
              </Form.Item>
              <Form.Item name="confirmPassword" label="Confirm New Password" rules={[{ required: true, message: 'Please confirm your new password' }]}>
                <Input.Password placeholder="Re-enter new password" />
              </Form.Item>

              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handlePasswordSave}
                disabled={passwordUpdating}
                style={{ opacity: passwordUpdating ? 0.7 : 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {passwordUpdating ? <Spin size="small" style={{ marginRight: 8 }} /> : <FiCheckCircle style={{ marginRight: 8 }} />}
                Save Password Changes
              </button>
            </Form>
          </div>

          {/* Card 3: Notification Preferences */}
          <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
            <h3 className={styles.cardTitle}>
              <FiBell style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--ac-brand)' }} />
              Notification Preferences
            </h3>
            {prefsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
                <Spin size="small" />
              </div>
            ) : (
              <>
                <div className={styles.settingRow}>
                  <div>
                    <h5 className={styles.settingLabel}>Mentorship Session Alerts</h5>
                    <p className={styles.settingDesc}>Get notified when alumni accept or respond to session requests.</p>
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
      )}
    </StudentLayout>
  );
};
