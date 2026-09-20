import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Button, message, Table, Spin, Tooltip } from 'antd';
import { FiUser, FiLock, FiShield, FiSave, FiRefreshCw } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { authService } from '../services/authService';
import api from '../services/api';

const FEATURE_LABELS = {
  'VIEW_STUDENT_PROFILES': 'View Student Profiles',
  'VIEW_ALUMNI_DIRECTORY': 'View Alumni Directory',
  'REQUEST_MENTORSHIP': 'Request 1-on-1 Mentorship',
  'APPROVE_ALUMNI_VERIFICATION': 'Approve Alumni Verification',
  'PUBLISH_GLOBAL_EVENTS': 'Publish Global Events',
  'EXPORT_ANALYTICS': 'Export Institutional Analytics'
};

const ORDERED_FEATURES = [
  'VIEW_STUDENT_PROFILES',
  'VIEW_ALUMNI_DIRECTORY',
  'REQUEST_MENTORSHIP',
  'APPROVE_ALUMNI_VERIFICATION',
  'PUBLISH_GLOBAL_EVENTS',
  'EXPORT_ANALYTICS'
];

export const AdminSettingsPage = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // State Management
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [permissionsMatrix, setPermissionsMatrix] = useState([]);
  const [initialPermissions, setInitialPermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [savingPermissions, setSavingPermissions] = useState(false);

  // 1. Fetch Currently Logged In Admin Profile & Permissions on Mount
  const loadAdminProfile = async () => {
    setLoadingProfile(true);
    try {
      const currentUser = authService.getCurrentUser();
      let targetAdminId = currentUser?.adminId || currentUser?.id;

      let adminData = null;
      if (targetAdminId) {
        try {
          const res = await api.get(`/admin/get/${targetAdminId}`);
          adminData = res.data;
        } catch (e) {
          console.warn("Direct admin fetch failed, falling back to getall:", e);
        }
      }

      if (!adminData) {
        const allRes = await api.get('/admin/getall');
        const list = Array.isArray(allRes.data) ? allRes.data : (allRes.data ? [allRes.data] : []);
        adminData = list.find(a => String(a.email).toLowerCase() === String(currentUser?.email).toLowerCase()) || list[0];
      }

      if (!adminData) {
        throw new Error("No administrator profile found.");
      }

      setCurrentAdmin(adminData);

      profileForm.setFieldsValue({
        adminId: adminData.adminId,
        employeeId: adminData.employeeId || 'N/A',
        name: adminData.name || '',
        email: adminData.email || '',
        mobile: adminData.mobile || '',
        designation: adminData.designation || 'System Administrator',
        department: adminData.department || '',
        role: adminData.role || 'ADMIN'
      });
    } catch (err) {
      console.error('Error fetching admin profile:', err);
      message.error('Unable to load administrator profile from server.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const loadRolePermissions = async () => {
    setLoadingPermissions(true);
    try {
      const res = await api.get('/admin/permissions');
      const rawList = res.data || [];

      // Transform raw list into structured matrix rows by feature
      const matrixMap = {};
      ORDERED_FEATURES.forEach(fKey => {
        matrixMap[fKey] = {
          featureKey: fKey,
          featureLabel: FEATURE_LABELS[fKey] || fKey,
          ADMIN: true,
          ALUMNI: false,
          STUDENT: false
        };
      });

      rawList.forEach(p => {
        if (matrixMap[p.feature]) {
          matrixMap[p.feature][p.role] = !!p.enabled;
        }
      });

      const matrixRows = ORDERED_FEATURES.map(fKey => matrixMap[fKey]);
      setPermissionsMatrix(matrixRows);
      setInitialPermissions(JSON.parse(JSON.stringify(matrixRows)));
    } catch (err) {
      console.error('Error loading role permissions:', err);
      message.error('Unable to load role permissions from server.');
    } finally {
      setLoadingPermissions(false);
    }
  };

  useEffect(() => {
    Promise.allSettled([loadAdminProfile(), loadRolePermissions()]);
  }, []);

  // 2. Profile Update Handler
  const handleProfileUpdate = async () => {
    try {
      const values = await profileForm.validateFields();
      if (!currentAdmin) return;
      setUpdatingProfile(true);

      const payload = {
        ...currentAdmin,
        name: values.name.trim(),
        email: values.email.trim(),
        mobile: values.mobile ? values.mobile.trim() : '',
        designation: values.designation ? values.designation.trim() : '',
        department: values.department ? values.department.trim() : ''
      };

      const res = await api.put('/admin/update', payload);
      const updatedData = res.data;
      setCurrentAdmin(updatedData);

      // Synchronize local session user data for layout/header
      const existingUser = authService.getCurrentUser() || {};
      const newSessionUser = {
        ...existingUser,
        adminId: updatedData.adminId,
        name: updatedData.name,
        email: updatedData.email,
        mobile: updatedData.mobile,
        designation: updatedData.designation,
        department: updatedData.department
      };
      localStorage.setItem('alumni_user_data', JSON.stringify(newSessionUser));

      message.success(`Administrator profile for "${updatedData.name}" updated successfully!`);
    } catch (err) {
      if (err.errorFields) return;
      console.error('Error updating admin profile:', err);
      const errMsg = err.response?.data?.message || err.response?.data || 'Failed to update administrator profile.';
      message.error(typeof errMsg === 'string' ? errMsg : 'Failed to update administrator profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // 3. Security / Change Password Handler
  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      if (!currentAdmin?.adminId) {
        message.error('Admin ID not available for password change.');
        return;
      }
      setChangingPassword(true);

      const payload = {
        adminId: currentAdmin.adminId,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      };

      await api.put('/admin/change-password', payload);
      message.success('Password changed successfully!');
      passwordForm.resetFields();
    } catch (err) {
      if (err.errorFields) return;
      console.error('Error changing password:', err);
      const errMsg = err.response?.data?.message || err.response?.data || 'Failed to change password.';
      message.error(typeof errMsg === 'string' ? errMsg : 'Current password verification failed.');
    } finally {
      setChangingPassword(false);
    }
  };

  // 4. Matrix Toggle Handler
  const handleTogglePermission = (featureKey, role) => {
    // Protection: MANDATORY ADMIN permission for MANAGE_SETTINGS cannot be toggled off
    if (role === 'ADMIN' && featureKey === 'MANAGE_SETTINGS') {
      message.warning('System Administrator access to Admin Settings is mandatory and cannot be disabled.');
      return;
    }

    setPermissionsMatrix(prev => prev.map(row => {
      if (row.featureKey === featureKey) {
        return { ...row, [role]: !row[role] };
      }
      return row;
    }));
  };

  // 5. Save Permissions to Database Handler
  const handleSavePermissions = async () => {
    setSavingPermissions(true);
    try {
      // Flatten matrix rows back into AdminPermission entity DTOs
      const payload = [];
      permissionsMatrix.forEach(row => {
        ['ADMIN', 'ALUMNI', 'STUDENT'].forEach(role => {
          let isEnabled = !!row[role];
          // Enforce mandatory ADMIN protection
          if (role === 'ADMIN' && row.featureKey === 'MANAGE_SETTINGS') {
            isEnabled = true;
          }
          payload.push({
            role: role,
            feature: row.featureKey,
            enabled: isEnabled
          });
        });
      });

      await api.put('/admin/permissions', payload);
      message.success('Role permission control matrix saved successfully to database!');
      await loadRolePermissions();
    } catch (err) {
      console.error('Error saving role permissions:', err);
      const errMsg = err.response?.data?.message || err.response?.data || 'Failed to save permissions.';
      message.error(typeof errMsg === 'string' ? errMsg : 'Failed to save permissions.');
    } finally {
      setSavingPermissions(false);
    }
  };

  // 6. Reset Changes Handler
  const handleResetPermissions = () => {
    setPermissionsMatrix(JSON.parse(JSON.stringify(initialPermissions)));
    message.info('Unsaved permission changes discarded. Restored last values from database.');
  };

  // Permission Table Columns
  const permissionColumns = [
    {
      title: 'System Feature / Module',
      dataIndex: 'featureLabel',
      key: 'featureLabel',
      render: (text) => <strong style={{ color: 'var(--ac-text-primary)' }}>{text}</strong>
    },
    {
      title: 'Admin Access',
      dataIndex: 'ADMIN',
      key: 'ADMIN',
      width: 140,
      render: (val, record) => {
        const isMandatory = record.featureKey === 'MANAGE_SETTINGS';
        if (isMandatory) {
          return (
            <Tooltip title="Mandatory system permission: System Administrator access to Admin Settings cannot be disabled.">
              <Switch checked={true} disabled />
            </Tooltip>
          );
        }
        return (
          <Switch
            checked={val}
            onChange={() => handleTogglePermission(record.featureKey, 'ADMIN')}
          />
        );
      }
    },
    {
      title: 'Alumni Access',
      dataIndex: 'ALUMNI',
      key: 'ALUMNI',
      width: 140,
      render: (val, record) => (
        <Switch
          checked={val}
          onChange={() => handleTogglePermission(record.featureKey, 'ALUMNI')}
        />
      )
    },
    {
      title: 'Student Access',
      dataIndex: 'STUDENT',
      key: 'STUDENT',
      width: 140,
      render: (val, record) => (
        <Switch
          checked={val}
          onChange={() => handleTogglePermission(record.featureKey, 'STUDENT')}
        />
      )
    }
  ];

  return (
    <AdminLayout>
      {/* Page Title Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Settings & Role Configuration</h1>
        <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
          Manage administrator profile credentials, role permissions, and global appearance preferences.
        </p>
      </div>

      {/* Grid Layout: Profile & Security */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 24 }}>
        
        {/* A. Administrator Profile Card */}
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiUser color="var(--ac-brand)" /> Administrator Profile
          </h3>

          {loadingProfile ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <p style={{ marginTop: 12, color: 'var(--ac-text-secondary)' }}>Loading administrator profile...</p>
            </div>
          ) : (
            <Form form={profileForm} layout="vertical">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Form.Item name="adminId" label="Admin ID">
                  <Input disabled style={{ backgroundColor: 'var(--ac-bg-body)', color: 'var(--ac-text-secondary)' }} />
                </Form.Item>
                <Form.Item name="employeeId" label="Employee ID">
                  <Input disabled style={{ backgroundColor: 'var(--ac-bg-body)', color: 'var(--ac-text-secondary)' }} />
                </Form.Item>
              </div>

              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Full name is required' }]}
              >
                <Input placeholder="e.g. Dr. Sarah Jenkins" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Admin Email Address"
                rules={[
                  { required: true, message: 'Email address is required' },
                  { type: 'email', message: 'Please enter a valid email address' }
                ]}
              >
                <Input placeholder="e.g. admin@kce.ac.in" />
              </Form.Item>

              <Form.Item
                name="mobile"
                label="Mobile Number"
                rules={[
                  { pattern: /^[0-9+\-\s()]{7,15}$/, message: 'Please enter a valid mobile number' }
                ]}
              >
                <Input placeholder="e.g. +91 98765 43210" />
              </Form.Item>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Form.Item name="designation" label="Designation">
                  <Input placeholder="e.g. System Administrator" />
                </Form.Item>
                <Form.Item name="department" label="Department / Office">
                  <Input placeholder="e.g. Institutional Administration" />
                </Form.Item>
              </div>

              <Form.Item name="role" label="System Role">
                <Input disabled style={{ backgroundColor: 'var(--ac-bg-body)', color: 'var(--ac-text-secondary)', fontWeight: 600 }} />
              </Form.Item>

              <Button
                type="primary"
                icon={<FiSave />}
                loading={updatingProfile}
                style={{ backgroundColor: 'var(--ac-brand)', border: 'none', height: 42, width: '100%', borderRadius: 8, fontWeight: 600, marginTop: 4 }}
                onClick={handleProfileUpdate}
              >
                Update Admin Profile
              </Button>
            </Form>
          )}
        </div>

        {/* B. Security / Change Password Card */}
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiLock color="var(--ac-brand)" /> Security / Change Password
          </h3>
          <p style={{ fontSize: 13, color: 'var(--ac-text-secondary)', margin: '0 0 20px 0' }}>
            Update your administrator credentials. Current password verification is required.
          </p>

          <Form form={passwordForm} layout="vertical">
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: 'Please enter your current password' }]}
            >
              <Input.Password placeholder="Enter current password" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter a new password' },
                { min: 6, message: 'New password must be at least 6 characters' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('currentPassword') !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('New password cannot be identical to current password'));
                  }
                })
              ]}
            >
              <Input.Password placeholder="Enter new password (min. 6 characters)" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match'));
                  }
                })
              ]}
            >
              <Input.Password placeholder="Re-enter new password" />
            </Form.Item>

            <Button
              type="primary"
              icon={<FiLock />}
              loading={changingPassword}
              style={{ backgroundColor: '#0284c7', border: 'none', height: 42, width: '100%', borderRadius: 8, fontWeight: 600, marginTop: 12 }}
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </Form>
        </div>
      </div>

      {/* C. Role Permission Control Matrix Table Card */}
      <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiShield color="var(--ac-brand)" /> Role Permission Control Matrix
            </h3>
            <p style={{ fontSize: 13, color: 'var(--ac-text-secondary)', margin: 0 }}>
              Configure feature access rights for Admin, Alumni, and Student roles across the platform. Permissions are stored in Oracle DB.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Button
              icon={<FiRefreshCw />}
              onClick={handleResetPermissions}
              disabled={loadingPermissions || savingPermissions}
              style={{ borderRadius: 8, fontWeight: 600 }}
            >
              Reset Changes
            </Button>

            <Button
              type="primary"
              icon={<FiSave />}
              loading={savingPermissions}
              disabled={loadingPermissions}
              onClick={handleSavePermissions}
              style={{ backgroundColor: 'var(--ac-brand)', border: 'none', height: 38, borderRadius: 8, fontWeight: 600 }}
            >
              Save Permissions
            </Button>
          </div>
        </div>

        {loadingPermissions ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16, color: 'var(--ac-text-secondary)', fontWeight: 600 }}>Loading role permissions matrix from Oracle DB...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table
              dataSource={permissionsMatrix}
              columns={permissionColumns}
              rowKey="featureKey"
              pagination={false}
              bordered
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
