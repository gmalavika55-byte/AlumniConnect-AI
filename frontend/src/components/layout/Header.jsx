import React from 'react';
import { Layout, Button, Avatar, Dropdown, Badge, Drawer, List, Tag, Space, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { mockNotifications } from '../../data/mockData';

const { Header: AntHeader } = Layout;

export const Header = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleLogout = () => {
    authService.logout();
    message.info('Logged out successfully');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'role-tag',
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 600 }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{user?.email}</div>
          <Tag color="blue" style={{ marginTop: '4px' }}>{user?.role}</Tag>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'landing',
      icon: <HomeOutlined />,
      label: 'Landing Page',
      onClick: () => navigate('/')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout
    }
  ];

  return (
    <AntHeader className="dashboard-header">
      <Space size="middle">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: '18px', width: 42, height: 42 }}
        />
        <span style={{ fontWeight: 600, fontSize: '16px', color: '#0f172a' }}>
          {user?.role ? `${user.role} Portal` : 'Alumni Management System'}
        </span>
      </Space>

      <Space size="large" align="center">
        <Badge count={2} offset={[-2, 4]} color="#1677ff">
          <Button
            type="text"
            shape="circle"
            icon={<BellOutlined style={{ fontSize: '18px' }} />}
            onClick={() => setDrawerOpen(true)}
          />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar src={user?.avatar} icon={<UserOutlined />} size="medium" style={{ backgroundColor: '#1677ff' }} />
            <span style={{ fontWeight: 500, color: '#334155', display: 'none', minWidth: '80px', sm: 'inline' }}>
              {user?.name || 'Account'}
            </span>
          </Space>
        </Dropdown>
      </Space>

      {/* Notifications Drawer */}
      <Drawer
        title="Notifications Center"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={360}
      >
        <List
          dataSource={mockNotifications}
          renderItem={(item) => (
            <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <List.Item.Meta
                title={<span style={{ fontWeight: 600, fontSize: '14px' }}>{item.title}</span>}
                description={
                  <div>
                    <p style={{ margin: '4px 0', fontSize: '13px', color: '#475569' }}>{item.message}</p>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.timestamp}</span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>
    </AntHeader>
  );
};
