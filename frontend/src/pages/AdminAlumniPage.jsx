import React, { useState } from 'react';
import { Table, Tag, Input, Select, Button, Modal, message, Space, Drawer } from 'antd';
import { FiSearch, FiCheckCircle, FiXCircle, FiEye, FiCheck, FiX, FiFileText, FiAward } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';

export const AdminAlumniPage = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewAlumni, setViewAlumni] = useState(null);

  // Alumni state with verification status
  const [alumniList, setAlumniList] = useState([
    { id: 1, name: 'Priya Sankar', year: '2019', dept: 'Computer Science', company: 'Google India', designation: 'Senior Software Engineer', status: 'Verified', certificate: 'KCE_Degree_2019_Priya.pdf' },
    { id: 2, name: 'Arun Kumar', year: '2018', dept: 'Information Technology', company: 'Amazon AWS', designation: 'Staff ML Scientist', status: 'Verified', certificate: 'KCE_Degree_2018_Arun.pdf' },
    { id: 3, name: 'Marco Rossi', year: '2018', dept: 'Electronics & Comm.', company: 'Microsoft', designation: 'Systems Architect', status: 'Pending', certificate: 'KCE_Degree_2018_Marco.pdf' },
    { id: 4, name: 'Divya Rajan', year: '2020', dept: 'Computer Science', company: 'Flipkart', designation: 'Lead Cloud Architect', status: 'Verified', certificate: 'KCE_Degree_2020_Divya.pdf' },
    { id: 5, name: 'Vikram Seth', year: '2021', dept: 'Electrical & Electronics', company: 'Tesla India', designation: 'Power Electronics Engineer', status: 'Pending', certificate: 'KCE_Degree_2021_Vikram.pdf' },
    { id: 6, name: 'Deepika Sundaram', year: '2022', dept: 'Mechanical', company: 'TATA Motors', designation: 'Design Engineer', status: 'Rejected', certificate: 'KCE_Degree_2022_Deepika.pdf' }
  ]);

  const handleApprove = (alumni) => {
    setAlumniList(alumniList.map(a => a.id === alumni.id ? { ...a, status: 'Verified' } : a));
    message.success(`Alumni profile for "${alumni.name}" approved & verified!`);
  };

  const handleReject = (alumni) => {
    Modal.confirm({
      title: `Reject Verification for "${alumni.name}"?`,
      content: 'Please confirm if the graduation certificate submitted does not match institutional records.',
      okText: 'Reject Profile',
      okType: 'danger',
      onOk() {
        setAlumniList(alumniList.map(a => a.id === alumni.id ? { ...a, status: 'Rejected' } : a));
        message.warning(`Alumni profile for "${alumni.name}" marked as Rejected.`);
      }
    });
  };

  const filteredAlumni = alumniList.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchText.toLowerCase()) ||
                          a.company.toLowerCase().includes(searchText.toLowerCase()) ||
                          a.dept.toLowerCase().includes(searchText.toLowerCase());
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
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#0f1e36' }}>{name}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Class of {record.year} • {record.dept}</div>
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
          <div style={{ fontWeight: 700, color: '#0f1e36' }}>{record.designation}</div>
          <div style={{ fontSize: 12, color: '#1b62d4', fontWeight: 600 }}>at {company}</div>
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
            onClick={() => setViewAlumni(record)}
          >
            View Details
          </Button>

          {record.status === 'Pending' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<FiCheck />}
                style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                onClick={() => handleApprove(record)}
              >
                Approve
              </Button>
              <Button
                type="primary"
                danger
                size="small"
                icon={<FiX />}
                onClick={() => handleReject(record)}
              >
                Reject
              </Button>
            </>
          )}

          {record.status === 'Verified' && (
            <Button
              type="text"
              size="small"
              danger
              onClick={() => handleReject(record)}
            >
              Revoke
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <AdminLayout onSearch={setSearchText}>
      {/* Page Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f1e36', margin: '0 0 4px 0' }}>Alumni Verification & Management</h1>
          <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
            Verify graduation certificates, approve alumni accounts, and monitor institutional alumni records.
          </p>
        </div>
      </div>

      {/* Filter Row */}
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
        <div style={{ flex: 1, minWidth: 240 }}>
          <Input
            prefix={<FiSearch style={{ color: '#94a3b8', marginRight: 6 }} />}
            placeholder="Search by alumni name, company, or department..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ borderRadius: 8 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Status:</span>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Pending', label: '⏳ Pending Verification' },
              { value: 'Verified', label: '✅ Verified' },
              { value: 'Rejected', label: '❌ Rejected' }
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Table
          columns={columns}
          dataSource={filteredAlumni}
          rowKey="id"
          pagination={{ pageSize: 6 }}
        />
      </div>

      {/* View Alumni Drawer */}
      <Drawer
        title="Alumni Profile & Certificate Verification"
        placement="right"
        width={460}
        onClose={() => setViewAlumni(null)}
        open={!!viewAlumni}
      >
        {viewAlumni && (
          <div>
            <div style={{ textAlign: 'center', paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #071330 0%, #1b62d4 100%)', color: 'white', fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                {viewAlumni.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px 0', color: '#0f1e36' }}>{viewAlumni.name}</h2>
              <p style={{ color: '#1b62d4', fontWeight: 600, margin: 0 }}>{viewAlumni.designation} at <strong>{viewAlumni.company}</strong></p>
            </div>

            <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Graduation Year & Degree</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: '#0f1e36' }}>Class of {viewAlumni.year} • B.E. {viewAlumni.dept}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Verification Document</span>
                <div style={{ marginTop: 6, padding: '12px 16px', background: '#f8fafc', border: '1px border-dashed #cbd5e1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiFileText size={18} color="#1b62d4" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f1e36' }}>{viewAlumni.certificate}</span>
                  </div>
                  <Button type="link" size="small" onClick={() => message.info('Opening certificate preview...')}>View PDF</Button>
                </div>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Status</span>
                <div style={{ marginTop: 4 }}>
                  <Tag color={viewAlumni.status === 'Verified' ? 'success' : viewAlumni.status === 'Pending' ? 'warning' : 'error'} style={{ fontWeight: 700 }}>
                    {viewAlumni.status.toUpperCase()}
                  </Tag>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 12 }}>
              <Button
                type="primary"
                style={{ flex: 1, backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                onClick={() => {
                  handleApprove(viewAlumni);
                  setViewAlumni(null);
                }}
              >
                Approve Verification
              </Button>
              <Button
                type="primary"
                danger
                style={{ flex: 1 }}
                onClick={() => {
                  handleReject(viewAlumni);
                  setViewAlumni(null);
                }}
              >
                Reject Verification
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </AdminLayout>
  );
};
