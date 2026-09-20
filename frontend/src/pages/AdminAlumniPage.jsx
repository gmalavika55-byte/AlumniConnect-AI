import React, { useState, useEffect } from 'react';
import { Table, Tag, Input, Select, Button, Modal, Form, message, Space, Drawer, Spin } from 'antd';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiCheck, FiX, FiFileText, FiDownload } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import api from '../services/api';

export const AdminAlumniPage = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewAlumni, setViewAlumni] = useState(null);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [editAlumni, setEditAlumni] = useState(null);
  const [editForm] = Form.useForm();
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const res = await api.get('/alumni/getall');
      const data = res.data || [];
      const mapped = data.map(a => ({
        id: a.alumniId,
        registerNumber: a.registerNo || 'Not provided',
        name: a.name || 'Not provided',
        email: a.email || 'Not provided',
        year: a.batch || 'Not provided',
        dept: a.department || 'Not provided',
        company: a.currentCompany || 'Not provided',
        designation: a.designation || 'Not provided',
        location: a.location || 'Not provided',
        mobile: a.mobile || 'Not provided',
        status: 'Verified',
        rawAlumni: a
      }));
      setAlumniList(mapped);
    } catch (err) {
      console.error("Error loading alumni directory:", err);
      message.error("Failed to load alumni directory from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    if (editAlumni) {
      editForm.setFieldsValue({
        name: editAlumni.name,
        registerNo: editAlumni.registerNumber,
        email: editAlumni.email,
        department: editAlumni.dept,
        batch: editAlumni.year,
        currentCompany: editAlumni.company,
        designation: editAlumni.designation,
        location: editAlumni.location,
        mobile: editAlumni.mobile
      });
    }
  }, [editAlumni, editForm]);

  const handleOpenViewDrawer = async (record) => {
    setFetchingProfile(true);
    try {
      const res = await api.get(`/alumni/get/${record.id}`);
      const a = res.data || record.rawAlumni || {};
      setViewAlumni({
        id: a.alumniId,
        registerNumber: a.registerNo || 'Not provided',
        name: a.name || 'Not provided',
        email: a.email || 'Not provided',
        mobile: a.mobile || 'Not provided',
        location: a.location || 'Not provided',
        department: a.department || 'Not provided',
        batch: a.batch || 'Not provided',
        designation: a.designation || 'Not provided',
        company: a.currentCompany || 'Not provided',
        experience: a.experience !== null && a.experience !== undefined ? `${a.experience} Years` : 'Not provided',
        skills: a.skills || 'Not provided',
        linkedin: a.linkedin || 'Not provided',
        availableForMentorship: a.availableForMentorship ? String(a.availableForMentorship) : 'Available',
        status: 'Verified',
        rawAlumni: a
      });
    } catch (err) {
      console.error("Error fetching alumni profile:", err);
      message.error("Failed to load latest alumni profile details.");
      setViewAlumni(null);
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editAlumni) return;

      setSavingEdit(true);
      const payload = {
        ...editAlumni.rawAlumni,
        name: values.name,
        registerNo: values.registerNo,
        email: values.email,
        department: values.department,
        batch: values.batch,
        currentCompany: values.currentCompany,
        designation: values.designation,
        location: values.location,
        mobile: values.mobile
      };

      await api.put('/alumni/update', payload);
      message.success(`Alumni profile for "${values.name}" updated successfully!`);
      setEditAlumni(null);
      await fetchAlumni();
    } catch (err) {
      if (err.errorFields) return;
      console.error("Error updating alumni:", err);
      const errMsg = err.response?.data?.message || err.response?.data || "Failed to update alumni profile.";
      message.error(typeof errMsg === 'string' ? errMsg : "Failed to update alumni profile.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = (alumni) => {
    Modal.confirm({
      title: `Delete Alumni Profile "${alumni.name}"?`,
      content: `Register Number: ${alumni.registerNumber}. Are you sure you want to permanently delete this Alumni profile and all related alumni records?`,
      okText: 'Delete Permanently',
      okType: 'danger',
      async onOk() {
        try {
          await api.delete(`/alumni/delete/${alumni.id}`);
          message.success(`Alumni profile for "${alumni.name}" deleted successfully.`);
          fetchAlumni();
        } catch (err) {
          console.error("Error deleting alumni:", err);
          const errMsg = err.response?.data?.message || "Failed to delete alumni profile.";
          message.error(errMsg);
        }
      }
    });
  };

  const filteredAlumni = alumniList.filter(a => {
    const query = searchText.trim().toLowerCase();
    const matchesSearch = !query ||
                          (a.name || '').toLowerCase().includes(query) ||
                          (a.email || '').toLowerCase().includes(query) ||
                          (a.company || '').toLowerCase().includes(query) ||
                          (a.dept || '').toLowerCase().includes(query) ||
                          (a.designation || '').toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Alumni Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #071330 0%, #1b62d4 100%)',
            color: '#ffffff',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13
          }}>
            {(name || 'A').split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--ac-text-primary)' }}>{name}</div>
            <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)' }}>Class of {record.year} • {record.dept}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Company & Role',
      dataIndex: 'company',
      key: 'company',
      render: (company, record) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--ac-text-primary)' }}>{record.designation}</div>
          <div style={{ fontSize: 12, color: 'var(--ac-brand)', fontWeight: 600 }}>at {company}</div>
        </div>
      )
    },
    {
      title: 'Graduation Year',
      dataIndex: 'year',
      key: 'year',
      render: (yr) => <span style={{ fontWeight: 600 }}>{yr}</span>
    },
    {
      title: 'Verification Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'Verified' ? 'success' : status === 'Pending' ? 'warning' : 'error';
        return <Tag color={color} style={{ fontWeight: 700, padding: '4px 10px' }}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<FiEye />}
            style={{ color: '#0284c7' }}
            onClick={() => handleOpenViewDrawer(record)}
          >
            View
          </Button>
          <Button
            type="text"
            icon={<FiEdit2 />}
            style={{ color: 'var(--ac-brand)' }}
            onClick={() => {
              setEditAlumni(record);
            }}
          >
            Edit
          </Button>
          <Button
            type="text"
            danger
            icon={<FiTrash2 />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <AdminLayout onSearch={setSearchText}>
      {/* Page Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Alumni Directory & Management</h1>
          <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
            Manage institutional alumni profiles, verify graduation records, and monitor professional details. Total Verified: <strong>{alumniList.length}</strong>
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{
        backgroundColor: 'var(--ac-bg-card)',
        borderRadius: 14,
        padding: '18px 24px',
        border: '1px solid var(--ac-border)',
        marginBottom: 24,
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <Input
            prefix={<FiSearch style={{ color: 'var(--ac-text-secondary)', marginRight: 6 }} />}
            placeholder="Search by alumni name, email, company, or designation..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ borderRadius: 8 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ac-text-secondary)' }}>Status:</span>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Verified', label: '✅ Verified' }
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 14, border: '1px solid var(--ac-border)', overflow: 'hidden' }}>
        <Table
          columns={columns}
          dataSource={filteredAlumni}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 6 }}
        />
      </div>

      {/* View Alumni Drawer */}
      <Drawer
        title="Alumni Profile Details"
        placement="right"
        width={460}
        onClose={() => setViewAlumni(null)}
        open={!!viewAlumni || fetchingProfile}
      >
        {fetchingProfile ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16, color: 'var(--ac-text-secondary)', fontWeight: 600 }}>Loading profile...</p>
          </div>
        ) : viewAlumni ? (
          <div>
            <div style={{ textAlign: 'center', paddingBottom: 20, borderBottom: '1px solid var(--ac-border)' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #071330 0%, #1b62d4 100%)', color: 'white', fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                {(viewAlumni.name || 'A').split(' ').map(n => n[0]).join('')}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px 0', color: 'var(--ac-text-primary)' }}>{viewAlumni.name}</h2>
              <p style={{ color: 'var(--ac-brand)', fontWeight: 600, margin: 0 }}>{viewAlumni.designation} at <strong>{viewAlumni.company}</strong></p>
            </div>

            <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Section 1: Personal Information */}
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--ac-brand)', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid var(--ac-border)', paddingBottom: 6, marginBottom: 12 }}>
                  Personal Information
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Full Name</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewAlumni.name}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Email Address</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewAlumni.email}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Mobile Number</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewAlumni.mobile}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Location / City</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewAlumni.location}</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Information */}
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--ac-brand)', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid var(--ac-border)', paddingBottom: 6, marginBottom: 12 }}>
                  Academic Information
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Alumni ID</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewAlumni.id}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Register Number</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewAlumni.registerNumber}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Department</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewAlumni.dept}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Graduation Batch</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>Class of {viewAlumni.year}</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Professional Information */}
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--ac-brand)', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid var(--ac-border)', paddingBottom: 6, marginBottom: 12 }}>
                  Professional Information
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Designation / Role</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewAlumni.designation}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Current Company</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewAlumni.company}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Work Experience</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewAlumni.experience}</p>
                  </div>
                  {viewAlumni.skills !== 'Not provided' && (
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Key Skills</span>
                      <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewAlumni.skills}</p>
                    </div>
                  )}
                  {viewAlumni.linkedin !== 'Not provided' && (
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>LinkedIn Profile</span>
                      <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-brand)' }}>{viewAlumni.linkedin}</p>
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Mentorship Availability</span>
                    <div style={{ marginTop: 4 }}>
                      <Tag color="success" style={{ fontWeight: 700 }}>AVAILABLE FOR MENTORSHIP</Tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 16, borderTop: '1px solid var(--ac-border)', display: 'flex', gap: 12 }}>
              <Button
                type="primary"
                style={{ flex: 1, backgroundColor: 'var(--ac-brand)' }}
                onClick={() => {
                  setEditAlumni(viewAlumni);
                  setViewAlumni(null);
                }}
              >
                Edit Alumni Profile
              </Button>
            </div>
          </div>
        ) : null}
      </Drawer>

      {/* Edit Alumni Modal */}
      <Modal
        title={`Edit Alumni "${editAlumni?.name}"`}
        open={!!editAlumni}
        onCancel={() => setEditAlumni(null)}
        onOk={handleSaveEdit}
        okText="Save Changes"
        confirmLoading={savingEdit}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="registerNo" label="Register Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true }]}>
            <Select options={[
              { value: 'Computer Science & Engineering', label: 'Computer Science & Engineering' },
              { value: 'Information Technology', label: 'Information Technology' },
              { value: 'Electronics & Communication', label: 'Electronics & Communication' },
              { value: 'Electrical & Electronics', label: 'Electrical & Electronics' },
              { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
              { value: 'Civil Engineering', label: 'Civil Engineering' }
            ]} />
          </Form.Item>
          <Form.Item name="batch" label="Graduation Year / Batch" rules={[{ required: true, message: 'Please enter graduation year or batch (e.g. 2020-2024 or 2020)' }]}>
            <Input placeholder="e.g. 2020-2024 or 2020" />
          </Form.Item>
          <Form.Item name="currentCompany" label="Current Company">
            <Input />
          </Form.Item>
          <Form.Item name="designation" label="Designation / Role">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location / City">
            <Input />
          </Form.Item>
          <Form.Item name="mobile" label="Mobile Number">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};
