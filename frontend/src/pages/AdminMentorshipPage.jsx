import React, { useState, useEffect } from 'react';
import { Table, Tag, Input, Button, Space, Drawer, Spin, message } from 'antd';
import { FiSearch, FiEye, FiCheck, FiX, FiUsers, FiUser } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import api from '../services/api';

export const AdminMentorshipPage = () => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [mentorships, setMentorships] = useState([]);
  const [studentsMap, setStudentsMap] = useState({});
  const [alumniMap, setAlumniMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewMentorship, setViewMentorship] = useState(null);

  const fetchMentorshipData = async () => {
    setLoading(true);
    try {
      const [mentorshipRes, studentRes, alumniRes] = await Promise.allSettled([
        api.get('/mentorship/getall'),
        api.get('/student/getall'),
        api.get('/alumni/getall')
      ]);

      const mentorshipData = mentorshipRes.status === 'fulfilled' ? (mentorshipRes.value.data || []) : [];
      const studentData = studentRes.status === 'fulfilled' ? (studentRes.value.data || []) : [];
      const alumniData = alumniRes.status === 'fulfilled' ? (alumniRes.value.data || []) : [];

      const sMap = {};
      studentData.forEach(s => {
        if (s && s.studentId) sMap[s.studentId] = s;
      });

      const aMap = {};
      alumniData.forEach(a => {
        if (a && a.alumniId) aMap[a.alumniId] = a;
      });

      setStudentsMap(sMap);
      setAlumniMap(aMap);

      const mapped = mentorshipData.map(m => {
        const studentObj = m.student || sMap[m.studentId] || {};
        const alumniObj = m.alumni || aMap[m.alumniId] || {};

        return {
          ...m,
          id: m.requestId,
          studentName: studentObj.name || (m.studentId ? `Student #${m.studentId}` : 'Student Profile Unavailable'),
          mentorName: alumniObj.name || (m.alumniId ? `Alumni #${m.alumniId}` : 'Alumni Profile Unavailable'),
          topic: m.remarks || 'Mentorship Guidance',
          requestDateFormatted: m.requestDate || 'N/A',
          meetingDateFormatted: m.meetingDate || 'N/A',
          studentObj,
          alumniObj
        };
      });

      setMentorships(mapped);
    } catch (err) {
      console.error("Error fetching mentorship records:", err);
      message.error("Failed to load mentorship records from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorshipData();
  }, []);

  const query = searchText.trim().toLowerCase();

  // Filter records by status
  const pendingList = mentorships.filter(r => (r.status === 'PENDING' || r.status === 'Pending') &&
    (r.studentName.toLowerCase().includes(query) || r.mentorName.toLowerCase().includes(query) || r.topic.toLowerCase().includes(query)));

  const activeList = mentorships.filter(r => (r.status === 'ACCEPTED' || r.status === 'Accepted') &&
    (r.studentName.toLowerCase().includes(query) || r.mentorName.toLowerCase().includes(query) || r.topic.toLowerCase().includes(query)));

  const completedList = mentorships.filter(r => (r.status === 'COMPLETED' || r.status === 'Completed') &&
    (r.studentName.toLowerCase().includes(query) || r.mentorName.toLowerCase().includes(query) || r.topic.toLowerCase().includes(query)));

  const declinedList = mentorships.filter(r => (r.status === 'DECLINED' || r.status === 'Declined' || r.status === 'REJECTED' || r.status === 'Rejected') &&
    (r.studentName.toLowerCase().includes(query) || r.mentorName.toLowerCase().includes(query) || r.topic.toLowerCase().includes(query)));

  // Real Counts for Statistics
  const acceptedCount = mentorships.filter(r => r.status === 'ACCEPTED' || r.status === 'Accepted').length;
  const pendingCount = mentorships.filter(r => r.status === 'PENDING' || r.status === 'Pending').length;
  const completedCount = mentorships.filter(r => r.status === 'COMPLETED' || r.status === 'Completed').length;

  const pendingColumns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (name, record) => (
        <div>
          <strong style={{ color: 'var(--ac-text-primary)' }}>{name}</strong>
          {record.studentObj?.registerNo && (
            <div style={{ fontSize: 12, color: 'var(--ac-brand)' }}>{record.studentObj.registerNo}</div>
          )}
        </div>
      )
    },
    {
      title: 'Suggested Mentor',
      dataIndex: 'mentorName',
      key: 'mentorName',
      render: (name, record) => (
        <div>
          <span style={{ color: 'var(--ac-text-primary)', fontWeight: 600 }}>{name}</span>
          {record.alumniObj?.currentCompany && (
            <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)' }}>{record.alumniObj.currentCompany}</div>
          )}
        </div>
      )
    },
    {
      title: 'Requested Topic',
      dataIndex: 'topic',
      key: 'topic',
      render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span>
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDateFormatted',
      key: 'requestDateFormatted',
      render: (d) => <span style={{ color: 'var(--ac-text-secondary)' }}>{d}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="text"
          icon={<FiEye />}
          style={{ color: '#0284c7' }}
          onClick={() => setViewMentorship(record)}
        >
          View Details
        </Button>
      )
    }
  ];

  const activeColumns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (name, record) => (
        <div>
          <strong style={{ color: 'var(--ac-text-primary)' }}>{name}</strong>
          {record.studentObj?.registerNo && (
            <div style={{ fontSize: 12, color: 'var(--ac-brand)' }}>{record.studentObj.registerNo}</div>
          )}
        </div>
      )
    },
    {
      title: 'Alumni Mentor',
      dataIndex: 'mentorName',
      key: 'mentorName',
      render: (name, record) => (
        <div>
          <span style={{ color: 'var(--ac-text-primary)', fontWeight: 600 }}>{name}</span>
          {record.alumniObj?.designation && (
            <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)' }}>{record.alumniObj.designation}</div>
          )}
        </div>
      )
    },
    {
      title: 'Topic / Focus Area',
      dataIndex: 'topic',
      key: 'topic',
      render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span>
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDateFormatted',
      key: 'requestDateFormatted',
      render: (d) => <span style={{ color: 'var(--ac-text-secondary)' }}>{d}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="text"
          icon={<FiEye />}
          style={{ color: '#0284c7' }}
          onClick={() => setViewMentorship(record)}
        >
          View Details
        </Button>
      )
    }
  ];

  const completedColumns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (name) => <strong style={{ color: 'var(--ac-text-primary)' }}>{name}</strong>
    },
    {
      title: 'Alumni Mentor',
      dataIndex: 'mentorName',
      key: 'mentorName',
      render: (name) => <span style={{ color: 'var(--ac-text-primary)', fontWeight: 600 }}>{name}</span>
    },
    {
      title: 'Topic / Focus Area',
      dataIndex: 'topic',
      key: 'topic',
      render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span>
    },
    {
      title: 'Completion Date',
      dataIndex: 'requestDateFormatted',
      key: 'requestDateFormatted',
      render: (d) => <span style={{ color: 'var(--ac-text-secondary)' }}>{d}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="text"
          icon={<FiEye />}
          style={{ color: '#0284c7' }}
          onClick={() => setViewMentorship(record)}
        >
          View Details
        </Button>
      )
    }
  ];

  const declinedColumns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (name) => <strong style={{ color: 'var(--ac-text-primary)' }}>{name}</strong>
    },
    {
      title: 'Mentor',
      dataIndex: 'mentorName',
      key: 'mentorName',
      render: (name) => <span style={{ color: 'var(--ac-text-primary)', fontWeight: 600 }}>{name}</span>
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span>
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDateFormatted',
      key: 'requestDateFormatted',
      render: (d) => <span style={{ color: 'var(--ac-text-secondary)' }}>{d}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st) => <Tag color="error">{st}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="text"
          icon={<FiEye />}
          style={{ color: '#0284c7' }}
          onClick={() => setViewMentorship(record)}
        >
          View Details
        </Button>
      )
    }
  ];

  return (
    <AdminLayout onSearch={setSearchText}>
      {/* Page Title */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>Mentorship Management</h1>
        <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
          Manage relationships, requests, and active pairings between students and institutional alumni mentors. Total Tracked: <strong>{mentorships.length}</strong>
        </p>
      </div>

      {/* Statistics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Active Connections</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>
            {loading ? <Spin size="small" /> : `${acceptedCount} Pairings`}
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Pending Approvals</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>
            {loading ? <Spin size="small" /> : `${pendingCount} Requests`}
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Completed Tracks</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>
            {loading ? <Spin size="small" /> : `${completedCount} Sessions`}
          </div>
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
            placeholder="Search by student or mentor name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280, borderRadius: 8 }}
          />
        </div>

        {/* Tab Tables */}
        {activeTab === 'pending' && (
          <Table
            loading={loading}
            dataSource={pendingList}
            columns={pendingColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: 'No pending mentorship requests' }}
          />
        )}
        {activeTab === 'active' && (
          <Table
            loading={loading}
            dataSource={activeList}
            columns={activeColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: 'No active mentorships' }}
          />
        )}
        {activeTab === 'completed' && (
          <Table
            loading={loading}
            dataSource={completedList}
            columns={completedColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: 'No completed mentorships' }}
          />
        )}
        {activeTab === 'declined' && (
          <Table
            loading={loading}
            dataSource={declinedList}
            columns={declinedColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: 'No declined mentorship requests' }}
          />
        )}
      </div>

      {/* View Mentorship Details Drawer */}
      <Drawer
        title="Mentorship Pairing Details"
        placement="right"
        width={460}
        onClose={() => setViewMentorship(null)}
        open={!!viewMentorship}
      >
        {viewMentorship && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Request Header */}
            <div style={{ textAlign: 'center', paddingBottom: 16, borderBottom: '1px solid var(--ac-border)' }}>
              <Tag color={viewMentorship.status === 'ACCEPTED' ? 'success' : viewMentorship.status === 'PENDING' ? 'warning' : viewMentorship.status === 'COMPLETED' ? 'blue' : 'error'} style={{ fontWeight: 800, padding: '4px 12px', fontSize: 12 }}>
                {viewMentorship.status}
              </Tag>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: '10px 0 4px 0', color: 'var(--ac-text-primary)' }}>Request #{viewMentorship.requestId}</h3>
              <p style={{ fontSize: 13, color: 'var(--ac-text-secondary)', margin: 0 }}>Requested on: <strong>{viewMentorship.requestDateFormatted}</strong></p>
            </div>

            {/* Section 1: Mentorship Details */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--ac-brand)', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid var(--ac-border)', paddingBottom: 6, marginBottom: 12 }}>
                Mentorship Details
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Requested Topic / Remarks</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewMentorship.remarks || 'Not provided'}</p>
                </div>
                {viewMentorship.meetingDateFormatted !== 'N/A' && (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Scheduled Meeting Date</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewMentorship.meetingDateFormatted}</p>
                  </div>
                )}
                {viewMentorship.meetingLink && (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Virtual Session Room</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-brand)', wordBreak: 'break-all' }}>{viewMentorship.meetingLink}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Student Details */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--ac-brand)', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid var(--ac-border)', paddingBottom: 6, marginBottom: 12 }}>
                Student Profile
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Student Name</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewMentorship.studentObj?.name || viewMentorship.studentName}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Register Number</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewMentorship.studentObj?.registerNo || 'Not provided'}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Email Address</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewMentorship.studentObj?.email || 'Not provided'}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Department</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewMentorship.studentObj?.department || 'Not provided'}</p>
                </div>
                {viewMentorship.studentObj?.cgpa && (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Current CGPA</span>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 700, color: '#059669' }}>{viewMentorship.studentObj.cgpa} / 10.0</p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Alumni Mentor Details */}
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--ac-brand)', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid var(--ac-border)', paddingBottom: 6, marginBottom: 12 }}>
                Alumni Mentor Profile
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Alumni Mentor Name</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewMentorship.alumniObj?.name || viewMentorship.mentorName}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Current Company</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewMentorship.alumniObj?.currentCompany || 'Not provided'}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Designation / Role</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewMentorship.alumniObj?.designation || 'Not provided'}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Email Address</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewMentorship.alumniObj?.email || 'Not provided'}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Location</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{viewMentorship.alumniObj?.location || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </AdminLayout>
  );
};
