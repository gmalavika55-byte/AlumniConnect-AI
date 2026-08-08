import React from 'react';
import { Button, Space } from 'antd';
import { BranchesOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const role = authService.getUserRole();

  const handleDashboardClick = () => {
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'alumni') navigate('/alumni/dashboard');
    else navigate('/student/dashboard');
  };

  return (
    <nav className="landing-header">
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <div className="sidebar-logo-icon">
          <BranchesOutlined />
        </div>
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Alumni<span style={{ color: '#1677ff' }}>Connect</span>
        </span>
      </div>

      <Space size="middle">
        {isAuthenticated ? (
          <Button type="primary" size="large" onClick={handleDashboardClick}>
            Go to Dashboard
          </Button>
        ) : (
          <>
            <Button
              type="text"
              size="large"
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
              style={{ fontWeight: 500 }}
            >
              Sign In
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<UserAddOutlined />}
              onClick={() => navigate('/register')}
            >
              Join Network
            </Button>
          </>
        )}
      </Space>
    </nav>
  );
};
