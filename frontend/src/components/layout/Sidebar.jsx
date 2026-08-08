import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  NotificationOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  BranchesOutlined
} from '@ant-design/icons';
import { authService } from '../../services/authService';

const { Sider } = Layout;

export const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const role = user?.role?.toLowerCase() || 'student';

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return [
          { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Admin Overview' },
          { key: '/student/dashboard', icon: <UserOutlined />, label: 'Student View' },
          { key: '/alumni/dashboard', icon: <TeamOutlined />, label: 'Alumni View' },
        ];
      case 'alumni':
        return [
          { key: '/alumni/dashboard', icon: <DashboardOutlined />, label: 'Alumni Dashboard' },
        ];
      case 'student':
      default:
        return [
          { key: '/student/dashboard', icon: <DashboardOutlined />, label: 'Student Dashboard' },
        ];
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="dashboard-sidebar"
      width={240}
    >
      <div className="sidebar-logo-container">
        <div className="sidebar-logo-icon">
          <BranchesOutlined />
        </div>
        {!collapsed && <span className="sidebar-logo-text">AlumniConnect</span>}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
        style={{ borderRight: 0, paddingTop: '12px' }}
        items={getMenuItems()}
      />
    </Sider>
  );
};
