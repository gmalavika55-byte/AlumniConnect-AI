import React, { useState } from 'react';
import { Table, Tag, Input, Select, Button, Modal, Form, message, Space } from 'antd';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiUser, FiCheckCircle } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';

export const AdminUsersPage = () => {
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm] = Form.useForm();

  // Initial user list state
  const [users, setUsers] = useState([
    { id: 1, name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@kce.ac.in', role: 'System Administrator', dept: 'Administration', status: 'Active', joinedDate: '2022-01-15' },
    { id: 2, name: 'John Mathew', email: 'john.mathew@student.kce.ac.in', role: 'Student', dept: 'Computer Science', status: 'Active', joinedDate: '2024-08-10' },
    { id: 3, name: 'Priya Sankar', email: 'priya.sankar@alumni.kce.ac.in', role: 'Alumni', dept: 'Computer Science', status: 'Active', joinedDate: '2019-06-20' },
    { id: 4, name: 'Arun Kumar', email: 'arun.kumar@alumni.kce.ac.in', role: 'Alumni', dept: 'Information Technology', status: 'Active', joinedDate: '2018-05-12' },
    { id: 5, name: 'Marco Rossi', email: 'marco.rossi@alumni.kce.ac.in', role: 'Alumni', dept: 'Electronics & Comm.', status: 'Active', joinedDate: '2018-07-04' },
    { id: 6, name: 'Ananya Sharma', email: 'ananya.sharma@student.kce.ac.in', role: 'Student', dept: 'Information Technology', status: 'Active', joinedDate: '2025-09-01' },
    { id: 7, name: 'Devendra Patel', email: 'devendra.p@student.kce.ac.in', role: 'Student', dept: 'Mechanical', status: 'Inactive', joinedDate: '2023-08-15' },
    { id: 8, name: 'Divya Rajan', email: 'divya.rajan@alumni.kce.ac.in', role: 'Alumni', dept: 'Computer Science', status: 'Active', joinedDate: '2020-06-18' }
  ]);

  const handleAddOrEditUser = async () => {
    try {
      const values = await userForm.validateFields();
      if (editingUser) {
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...values } : u));
        message.success(`User "${values.name}" updated successfully!`);
      } else {
        const newUser = {
          id: Date.now(),
          ...values,
          status: 'Active',
          joinedDate: new Date().toISOString().split('T')[0]
        };
        setUsers([newUser, ...users]);
        message.success(`New user "${values.name}" created!`);
      }
      userForm.resetFields();
      setEditingUser(null);
      setIsAddUserOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteUser = (user) => {
    Modal.confirm({
      title: `Delete User "${user.name}"?`,
      content: 'This action cannot be undone. User login access and permissions will be permanently removed.',
      okText: 'Delete User',
      okType: 'danger',
      onOk() {
        setUsers(users.filter(u => u.id !== user.id));
        message.success(`User "${user.name}" removed from system.`);
      }
    });
  };

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchText.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchText.toLowerCase()) ||
                          u.dept.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    {
      title: 'User Profile',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: '#071330',
            color: '#ffffff',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13
          }}>
            {text.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#0f1e36' }}>{text}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = role === 'System Administrator' ? 'purple' : role === 'Alumni' ? 'blue' : 'green';
        return <Tag color={color} style={{ fontWeight: 600 }}>{role}</Tag>;
      }
    },
    {
      title: 'Department',
      dataIndex: 'dept',
      key: 'dept'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'success' : 'default'} style={{ fontWeight: 600 }}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Joined Date',
      dataIndex: 'joinedDate',
      key: 'joinedDate'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<FiEdit2 />}
            style={{ color: '#1b62d4' }}
            onClick={() => {
              setEditingUser(record);
              userForm.setFieldsValue(record);
              setIsAddUserOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            type="text"
            danger
            icon={<FiTrash2 />}
            onClick={() => handleDeleteUser(record)}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <AdminLayout onSearch={setSearchText}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f1e36', margin: '0 0 4px 0' }}>User Management</h1>
          <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
            Manage system administrators, students, and alumni accounts across the platform.
          </p>
        </div>

        <Button
          type="primary"
          icon={<FiPlus />}
          style={{ backgroundColor: '#1b62d4', height: 42, borderRadius: 8, fontWeight: 600 }}
          onClick={() => {
            setEditingUser(null);
            userForm.resetFields();
            setIsAddUserOpen(true);
          }}
        >
          Add New User
        </Button>
      </div>

      {/* Filter & Search Controls */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: '18px 24px',
        border: '1px solid #e2e8f0',
        marginBottom: 24,
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
          <Input
            prefix={<FiSearch style={{ color: '#94a3b8', marginRight: 6 }} />}
            placeholder="Search by name, email, or department..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ borderRadius: 8 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Role:</span>
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 160 }}
            options={[
              { value: 'All', label: 'All Roles' },
              { value: 'Student', label: 'Student' },
              { value: 'Alumni', label: 'Alumni' },
              { value: 'System Administrator', label: 'Admin' }
            ]}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Status:</span>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140 }}
            options={[
              { value: 'All', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
          />
        </div>
      </div>

      {/* Users Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{ pageSize: 6 }}
        />
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        title={editingUser ? `Edit User "${editingUser.name}"` : 'Create New User Account'}
        open={isAddUserOpen}
        onCancel={() => {
          setIsAddUserOpen(false);
          setEditingUser(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsAddUserOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" style={{ backgroundColor: '#1b62d4' }} onClick={handleAddOrEditUser}>
            {editingUser ? 'Save Changes' : 'Create User'}
          </Button>
        ]}
      >
        <Form form={userForm} layout="vertical" initialValues={{ role: 'Student', dept: 'Computer Science' }}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter user full name' }]}
          >
            <Input placeholder="e.g. Dr. Ramesh Kumar" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email address' }]}
          >
            <Input placeholder="e.g. ramesh@kce.ac.in" />
          </Form.Item>

          <Form.Item name="role" label="Account Role" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Student', label: 'Student' },
              { value: 'Alumni', label: 'Alumni' },
              { value: 'System Administrator', label: 'System Administrator' }
            ]} />
          </Form.Item>

          <Form.Item name="dept" label="Department" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'Information Technology', label: 'Information Technology' },
              { value: 'Electronics & Comm.', label: 'Electronics & Comm.' },
              { value: 'Electrical & Electronics', label: 'Electrical & Electronics' },
              { value: 'Mechanical', label: 'Mechanical' },
              { value: 'Civil', label: 'Civil' },
              { value: 'Administration', label: 'Administration' }
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};
