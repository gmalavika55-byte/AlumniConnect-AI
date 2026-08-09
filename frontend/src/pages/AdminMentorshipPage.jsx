import React, { useState } from 'react';
import { Table, Tag, Input, Button, Space, Card, Modal, message } from 'antd';
import { FiSearch, FiCheck, FiX, FiUsers, FiUser } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { useAppContext } from '../context/AppContext';

export const AdminMentorshipPage = () => {
  const { alumniRequests, setAlumniRequests } = useAppContext();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const handleApprove = (id) => {
    setAlumniRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Accepted', acceptedDate: 'Today' } : req));
    message.success('Mentorship request successfully approved by Admin!');
  };

  const handleDecline = (id) => {
    setAlumniRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Completed', completionDate: 'Today' } : req)); // status past
    message.info('Mentorship request declined.');
  };

  const query = searchText.trim().toLowerCase();
  
  // Map records to fit the tabs
  const pendingRequests = alumniRequests.filter(r => r.status === 'Pending' && r.studentName.toLowerCase().includes(query));
  const activeMentorships = alumniRequests.filter(r => r.status === 'Accepted' && r.studentName.toLowerCase().includes(query));
  const completedMentorships = alumniRequests.filter(r => r.status === 'Completed' && r.studentName.toLowerCase().includes(query));
  
  // Sample declined list
  const declinedMentorships = [
    { id: 201, studentName: 'Vikas Kumar', mentorName: 'Priya Sankar', topic: 'Game Dev with Unity', date: '2026-08-01', status: 'Declined', reason: 'Mentor unavailable' }
  ].filter(r => r.studentName.toLowerCase().includes(query));

  const pendingColumns = [
    { title: 'Student', dataIndex: 'studentName', key: 'studentName', render: (t) => <strong style={{ color: 'var(--ac-text-primary)' }}>{t}</strong> },
    { title: 'Suggested Mentor', dataIndex: 'mentorName', key: 'mentorName', render: () => <span style={{ color: 'var(--ac-text-primary)' }}>Rahul Kumar (Alumni)</span> },
    { title: 'Requested Topic', dataIndex: 'topic', key: 'topic', render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span> },
    { title: 'Request Date', dataIndex: 'requestDate', key: 'requestDate', render: (d) => <span style={{ color: 'var(--ac-text-secondary)' }}>{d}</span> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" icon={<FiCheck />} style={{ backgroundColor: 'var(--ac-brand)', border: 'none' }} onClick={() => handleApprove(record.id)}>
            Approve
          </Button>
          <Button size="small" danger icon={<FiX />} onClick={() => handleDecline(record.id)}>
            Decline
          </Button>
        </Space>
      )
    }
  ];

  const activeColumns = [
    { title: 'Student', dataIndex: 'studentName', key: 'studentName', render: (t) => <strong style={{ color: 'var(--ac-text-primary)' }}>{t}</strong> },
    { title: 'Alumni Mentor', dataIndex: 'mentorName', key: 'mentorName', render: () => <span style={{ color: 'var(--ac-text-primary)' }}>Rahul Kumar (Alumni)</span> },
    { title: 'Topic / Focus Area', dataIndex: 'topic', key: 'topic', render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span> },
    { title: 'Accepted Date', dataIndex: 'acceptedDate', key: 'acceptedDate', render: () => <span style={{ color: 'var(--ac-text-secondary)' }}>July 28, 2026</span> },
    { title: 'Completed Sessions', key: 'sessions', render: () => <Tag color="blue">4 Sessions</Tag> }
  ];

  const completedColumns = [
    { title: 'Student', dataIndex: 'studentName', key: 'studentName', render: (t) => <strong style={{ color: 'var(--ac-text-primary)' }}>{t}</strong> },
    { title: 'Alumni Mentor', dataIndex: 'mentorName', key: 'mentorName', render: () => <span style={{ color: 'var(--ac-text-primary)' }}>Rahul Kumar (Alumni)</span> },
    { title: 'Topic / Focus Area', dataIndex: 'topic', key: 'topic', render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span> },
    { title: 'Completion Date', dataIndex: 'completionDate', key: 'completionDate', render: () => <span style={{ color: 'var(--ac-text-secondary)' }}>July 29, 2026</span> },
    { title: 'Rating / Feedback', key: 'rating', render: () => <span style={{ color: '#eab308', fontWeight: 700 }}>⭐⭐⭐⭐⭐ (5/5)</span> }
  ];

  const declinedColumns = [
    { title: 'Student', dataIndex: 'studentName', key: 'studentName', render: (t) => <strong style={{ color: 'var(--ac-text-primary)' }}>{t}</strong> },
    { title: 'Mentor', dataIndex: 'mentorName', key: 'mentorName', render: (t) => <span style={{ color: 'var(--ac-text-primary)' }}>{t}</span> },
    { title: 'Topic', dataIndex: 'topic', key: 'topic', render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span> },
    { title: 'Action Date', dataIndex: 'date', key: 'date', render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span> },
    { title: 'Reason for Denial', dataIndex: 'reason', key: 'reason', render: (t) => <Tag color="error">{t}</Tag> }
  ];

  return (
    <AdminLayout onSearch={setSearchText}>
      {/* Page Title */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Mentorship Management</h1>
        <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
          Manage relationships, requests, and active pairings between students and institutional alumni mentors.
        </p>
      </div>

      {/* Statistics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Active Connections</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>{alumniRequests.filter(r => r.status === 'Accepted').length} Pairings</div>
        </div>
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Pending Approvals</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>{alumniRequests.filter(r => r.status === 'Pending').length} Requests</div>
        </div>
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Completed Tracks</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>{alumniRequests.filter(r => r.status === 'Completed').length} Sessions</div>
        </div>
      </div>

      {/* Filtering Tabs & Search */}
      <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 14, border: '1px solid var(--ac-border)', padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'pending', label: 'Pending Requests' },
              { id: 'active', label: 'Active Mentorships' },
              { id: 'completed', label: 'Completed History' },
              { id: 'declined', label: 'Declined' }
            ].map(tab => (
              <Button
                key={tab.id}
                type={activeTab === tab.id ? 'primary' : 'default'}
                onClick={() => setActiveTab(tab.id)}
                style={activeTab === tab.id ? { backgroundColor: 'var(--ac-brand)', border: 'none' } : {}}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          <Input
            prefix={<FiSearch style={{ color: 'var(--ac-text-secondary)', marginRight: 6 }} />}
            placeholder="Search by student name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280, borderRadius: 8 }}
          />
        </div>

        {/* Tab Tables */}
        {activeTab === 'pending' && (
          <Table dataSource={pendingRequests} columns={pendingColumns} rowKey="id" pagination={{ pageSize: 5 }} />
        )}
        {activeTab === 'active' && (
          <Table dataSource={activeMentorships} columns={activeColumns} rowKey="id" pagination={{ pageSize: 5 }} />
        )}
        {activeTab === 'completed' && (
          <Table dataSource={completedMentorships} columns={completedColumns} rowKey="id" pagination={{ pageSize: 5 }} />
        )}
        {activeTab === 'declined' && (
          <Table dataSource={declinedMentorships} columns={declinedColumns} rowKey="id" pagination={{ pageSize: 5 }} />
        )}
      </div>
    </AdminLayout>
  );
};
