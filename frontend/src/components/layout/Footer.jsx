import React from 'react';
import { Row, Col, Space } from 'antd';
import { BranchesOutlined, LinkedinOutlined, TwitterOutlined, GithubOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[40, 40]}>
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div className="sidebar-logo-icon" style={{ width: 34, height: 34, fontSize: 16 }}>
                <BranchesOutlined />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                Alumni<span style={{ color: '#1677ff' }}>Connect</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
              Empowering lifelong connections, career growth, and mentorship between students, alumni, and institution administrators.
            </p>
            <Space size="middle" style={{ fontSize: '20px', color: '#cbd5e1' }}>
              <LinkedinOutlined style={{ cursor: 'pointer' }} />
              <TwitterOutlined style={{ cursor: 'pointer' }} />
              <GithubOutlined style={{ cursor: 'pointer' }} />
            </Space>
          </Col>

          <Col xs={12} sm={8} md={5}>
            <h4 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Quick Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <Link to="/" className="footer-link">Landing Page</Link>
              <Link to="/login" className="footer-link">Sign In</Link>
              <Link to="/register" className="footer-link">Register Account</Link>
            </div>
          </Col>

          <Col xs={12} sm={8} md={5}>
            <h4 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Dashboards</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <Link to="/student/dashboard" className="footer-link">Student Portal</Link>
              <Link to="/alumni/dashboard" className="footer-link">Alumni Portal</Link>
              <Link to="/admin/dashboard" className="footer-link">Admin Portal</Link>
            </div>
          </Col>

          <Col xs={24} sm={8} md={6}>
            <h4 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>System Architecture</h4>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
              Phase 1 Core Infrastructure built with React, Vite, Ant Design, & React Router DOM.
            </p>
          </Col>
        </Row>

        <div style={{ borderTop: '1px solid #1e293b', marginTop: '40px', paddingTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
          © {new Date().getFullYear()} AlumniConnect Management System. All rights reserved. Phase 1 Release.
        </div>
      </div>
    </footer>
  );
};
