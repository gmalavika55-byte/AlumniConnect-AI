import React, { useState, useEffect, useCallback } from 'react';
import { message, Switch, Form, Input, Spin, Tag, Divider, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiLogOut, FiBriefcase, FiMapPin, FiCheckCircle, FiBell } from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import { authService } from '../services/authService';
import api from '../services/api';
import styles from './StudentSettingsPage.module.css';

const DEFAULT_PREFS = { mentorship: true, events: true, fundraising: true, eventRegistrations: true };

export const AlumniSettingsPage = () => {
  const navigate = useNavigate();
  const [passwordForm] = Form.useForm();
  const user = authService.getCurrentUser();
  const alumniId = user?.alumniId;

  const [alumniProfile, setAlumniProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  // Notification Preferences State (mirrors StudentSettingsPage pattern)
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [prefsSaving, setPrefsSaving] = useState(null);

  // Load latest Alumni profile and notification preferences from backend
  const loadAlumniProfile = useCallback(async () => {
    if (!alumniId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/alumni/get/${alumniId}`);
      const data = res.data;
      setAlumniProfile(data);

      if (data.notificationPref) {
        try {
          const parsed = JSON.parse(data.notificationPref);
          setPrefs({
            mentorship: parsed.mentorship !== undefined ? parsed.mentorship : true,
            events: parsed.events !== undefined ? parsed.events : true,
            fundraising: parsed.fundraising !== undefined ? parsed.fundraising : true,
            eventRegistrations: parsed.eventRegistrations !== undefined ? parsed.eventRegistrations : true
          });
        } catch {
          setPrefs(DEFAULT_PREFS);
        }
      } else {
        setPrefs(DEFAULT_PREFS);
      }
    } catch (err) {
      console.error('Error loading alumni profile for settings:', err);
      message.error('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  }, [alumniId]);

  useEffect(() => {
    loadAlumniProfile();
  }, [loadAlumniProfile]);

  // Handle Notification Preference Toggle (persisted via PUT /alumni/update)
  const handleTogglePreference = async (key, checked) => {
    if (!alumniId) {
      message.error('Alumni session missing.');
      return;
    }

    const previousPrefs = { ...prefs };
    const newPrefs = { ...prefs, [key]: checked };
    setPrefs(newPrefs); // optimistic UI update
    setPrefsSaving(key);

    try {
      const profileRes = await api.get(`/alumni/get/${alumniId}`);
      const currentAlumni = profileRes.data;

      const updatedAlumni = {
        ...currentAlumni,
        notificationPref: JSON.stringify(newPrefs)
      };

      await api.put('/alumni/update', updatedAlumni);
      setAlumniProfile(updatedAlumni);
      message.success('Preference saved!');
    } catch (err) {
      console.error('Error saving alumni notification preference:', err);
      message.error('Failed to save preference. Reverting.');
      setPrefs(previousPrefs); // revert on failure
    } finally {
      setPrefsSaving(null);
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
      if (!alumniId || !user?.email) {
        message.error('Alumni session not found. Please log in again.');
        return;
      }

      setPasswordUpdating(true);

      // 1. Verify current password via login API endpoint
      try {
        await api.post('/alumni/login', {
          email: user.email,
          password: values.currentPassword
        });
      } catch (authErr) {
        console.error('Current password verification failed:', authErr);
        message.error('Invalid current password!');
        setPasswordUpdating(false);
        return;
      }

      // 2. Fetch fresh alumni profile to preserve existing fields
      const profileRes = await api.get(`/alumni/get/${alumniId}`);
      const currentAlumni = profileRes.data;

      // 3. Persist new password to database via update API
      const updatedAlumni = {
        ...currentAlumni,
        password: values.newPassword
      };

      await api.put('/alumni/update', updatedAlumni);
      message.success('Password updated successfully!');
      passwordForm.resetFields();
      setAlumniProfile(updatedAlumni);
    } catch (err) {
      if (err.errorFields) {
        // Form validation error handled by Ant Design
        return;
      }
      console.error('Error updating alumni password:', err);
      message.error('Failed to update password. Please check your inputs.');
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
    <AlumniLayout>
      {/* Title Header */}
      <div className={styles.headerBar}>
        <div>
          <h1 className={styles.pageTitle}>Account Settings & Preferences</h1>
          <p className={styles.pageSub}>Manage your account credentials, security settings, and notification preferences.</p>
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
                    {alumniProfile?.name || user?.name || 'Alumni Member'}
                  </h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: 13, color: 'var(--ac-text-secondary)' }}>
                    <FiMail style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    {alumniProfile?.email || user?.email || 'N/A'}
                  </p>
                </div>
                <Tag color="blue" style={{ fontSize: 12, padding: '4px 10px', borderRadius: 12 }}>
                  {user?.role || 'Alumni'}
                </Tag>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <Space direction="vertical" size={10} style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 13.5, color: 'var(--ac-text-secondary)' }}>
                  <FiBriefcase style={{ marginRight: 10, color: '#3b82f6', minWidth: 16 }} />
                  <span>
                    <strong>Role: </strong>
                    {alumniProfile?.designation || 'Software Professional'} {alumniProfile?.currentCompany ? `at ${alumniProfile.currentCompany}` : ''}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', fontSize: 13.5, color: 'var(--ac-text-secondary)' }}>
                  <FiUser style={{ marginRight: 10, color: '#10b981', minWidth: 16 }} />
                  <span>
                    <strong>Department: </strong>
                    {alumniProfile?.department || 'Engineering'} {alumniProfile?.batch ? `(Class of ${alumniProfile.batch})` : ''}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', fontSize: 13.5, color: 'var(--ac-text-secondary)' }}>
                  <FiMapPin style={{ marginRight: 10, color: '#ef4444', minWidth: 16 }} />
                  <span>
                    <strong>Location: </strong>
                    {alumniProfile?.location || 'India'}
                  </span>
                </div>
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


            <div className={styles.settingRow}>
              <div>
                <h5 className={styles.settingLabel}>Mentorship Session Alerts</h5>
                <p className={styles.settingDesc}>Get notified immediately when a student submits a mentorship session request.</p>
              </div>
              <Switch
                checked={prefs.mentorship}
                loading={prefsSaving === 'mentorship'}
                onChange={(checked) => handleTogglePreference('mentorship', checked)}
              />
            </div>

            <div className={styles.settingRow}>
              <div>
                <h5 className={styles.settingLabel}>Event & Webinar Announcements</h5>
                <p className={styles.settingDesc}>Get notified about new campus reunions and alumni webinars.</p>
              </div>
              <Switch
                checked={prefs.events}
                loading={prefsSaving === 'events'}
                onChange={(checked) => handleTogglePreference('events', checked)}
              />
            </div>

            <div className={styles.settingRow}>
              <div>
                <h5 className={styles.settingLabel}>Fundraising & Giving Digest Updates</h5>
                <p className={styles.settingDesc}>Receive notifications when campaign progress updates and contribution milestones are posted.</p>
              </div>
              <Switch
                checked={prefs.fundraising}
                loading={prefsSaving === 'fundraising'}
                onChange={(checked) => handleTogglePreference('fundraising', checked)}
              />
            </div>

            <div className={styles.settingRow}>
              <div>
                <h5 className={styles.settingLabel}>Event Registration Notifications</h5>
                <p className={styles.settingDesc}>Receive notifications when someone registers for an event you organized.</p>
              </div>
              <Switch
                checked={prefs.eventRegistrations !== false}
                loading={prefsSaving === 'eventRegistrations'}
                onChange={(checked) => handleTogglePreference('eventRegistrations', checked)}
              />
            </div>
          </div>
        </div>
      )}
    </AlumniLayout>
  );
};
