import React from 'react';
import { Button, Tag, message } from 'antd';
import { FiDownload, FiTrendingUp, FiUsers, FiBriefcase, FiZap, FiCheckCircle, FiFileText } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { downloadCsv } from '../utils/exportCsv';

export const AdminReportsPage = () => {
  const handleExportFullAnalytics = () => {
    const headers = ['Metric', 'Category / Department', 'Current Value', 'Target Value', 'YoY Growth'];
    const rows = [
      ['Placement Rate', 'Computer Science & Engg.', '98.5%', '95%', '+4.5%'],
      ['Placement Rate', 'Information Technology', '96.2%', '92%', '+3.8%'],
      ['Placement Rate', 'Electronics & Comm.', '92.4%', '90%', '+2.1%'],
      ['Placement Rate', 'Electrical & Electronics', '88.0%', '85%', '+3.0%'],
      ['Placement Rate', 'Mechanical Engineering', '84.5%', '80%', '+5.2%'],
      ['Placement Rate', 'Civil Engineering', '81.0%', '80%', '+1.5%'],
      ['User Registrations', 'Verified Alumni', '24109', '25000', '+5.0%'],
      ['User Registrations', 'Active Students', '8432', '8000', '+12.0%'],
      ['Mentorship Sessions', '1-on-1 Completed', '1245', '1000', '+18.0%']
    ];
    downloadCsv('AlumniConnect_Institutional_Analytics_2026.csv', rows, headers);
    message.success('Institutional Analytics CSV downloaded successfully!');
  };

  return (
    <AdminLayout>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f1e36', margin: '0 0 4px 0' }}>Reports & Institutional Analytics</h1>
          <p style={{ fontSize: 13.5, color: '#64748b', margin: 0 }}>
            Comprehensive analytics on placement statistics, alumni network growth, and mentorship engagement.
          </p>
        </div>

        <Button
          type="primary"
          icon={<FiDownload />}
          style={{ backgroundColor: '#1b62d4', height: 42, borderRadius: 8, fontWeight: 600 }}
          onClick={handleExportFullAnalytics}
        >
          Export Full Report (CSV)
        </Button>
      </div>

      {/* Top 3 Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>OVERALL PLACEMENT</span>
            <Tag color="success">+4% YoY</Tag>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f1e36' }}>94.2%</div>
          <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, marginTop: 4 }}>856 of 1,200 Mapped Students Placed</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>AVG SALARY PACKAGE</span>
            <Tag color="processing">Top: ₹32 LPA</Tag>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f1e36' }}>₹12.8 LPA</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Median Package: ₹9.5 LPA</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>NETWORK ENGAGEMENT</span>
            <Tag color="purple">+18% Growth</Tag>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f1e36' }}>1,245 Sessions</div>
          <div style={{ fontSize: 13, color: '#7c3aed', fontWeight: 600, marginTop: 4 }}>48 Active Alumni Mentors</div>
        </div>
      </div>

      {/* 2-Column Analytics Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
        {/* Placement Rate by Department */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f1e36', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiBriefcase color="#1b62d4" /> Placement Rate by Department
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { dept: 'Computer Science & Engineering', rate: 98.5, placed: '240 / 244' },
              { dept: 'Information Technology', rate: 96.2, placed: '180 / 187' },
              { dept: 'Electronics & Communication', rate: 92.4, placed: '160 / 173' },
              { dept: 'Electrical & Electronics', rate: 88.0, placed: '110 / 125' },
              { dept: 'Mechanical Engineering', rate: 84.5, placed: '102 / 120' },
              { dept: 'Civil Engineering', rate: 81.0, placed: '64 / 79' }
            ].map(item => (
              <div key={item.dept}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#0f1e36', marginBottom: 4 }}>
                  <span>{item.dept}</span>
                  <span style={{ color: '#16a34a' }}>{item.rate}% ({item.placed})</span>
                </div>
                <div style={{ height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.rate}%`, background: 'linear-gradient(90deg, #1b62d4, #3b82f6)', borderRadius: 5 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth & Demographics */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f1e36', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiUsers color="#1b62d4" /> User Base Breakdown & Growth
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 14, background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: 14, color: '#0f1e36' }}>Verified Alumni</strong>
                <div style={{ fontSize: 12, color: '#64748b' }}>Class of 2010 – 2025</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#1b62d4' }}>24,109</span>
                <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>+5% growth</div>
              </div>
            </div>

            <div style={{ padding: 14, background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: 14, color: '#0f1e36' }}>Enrolled Students</strong>
                <div style={{ fontSize: 12, color: '#64748b' }}>Semesters 1 – 8</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#1b62d4' }}>8,432</span>
                <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>+12% growth</div>
              </div>
            </div>

            <div style={{ padding: 14, background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: 14, color: '#0f1e36' }}>Active Mentors</strong>
                <div style={{ fontSize: 12, color: '#64748b' }}>Tech & Core Industry Lead</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#7c3aed' }}>1,245</span>
                <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>+18% growth</div>
              </div>
            </div>

            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <Button icon={<FiFileText />} onClick={handleExportFullAnalytics}>
                Download Detailed CSV Breakdown
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
