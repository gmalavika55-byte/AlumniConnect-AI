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
  BranchesOutlined,
  BarChartOutlined,
  FileTextOutlined,
  HeartOutlined
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
          { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
          { key: '/admin/students', icon: <UserOutlined />, label: 'Student Management' },
          { key: '/admin/alumni', icon: <TeamOutlined />, label: 'Alumni Management' },
          { key: '/admin/mentorship', icon: <BranchesOutlined />, label: 'Mentorship Management' },
          { key: '/admin/events', icon: <CalendarOutlined />, label: 'Event Management' },
          { key: '/admin/fundraising', icon: <HeartOutlined />, label: 'Fundraising Management' },
          { key: '/admin/reports', icon: <FileTextOutlined />, label: 'Reports & Analytics' },
          { key: '/admin/settings', icon: <SettingOutlined />, label: 'Settings & Roles' },
        ];
      case 'alumni':
        return [
          { key: '/alumni/dashboard', icon: <DashboardOutlined />, label: 'Alumni Dashboard' },
          { key: '/alumni/profile', icon: <UserOutlined />, label: 'My Profile' },
          { key: '/alumni/mentorship', icon: <BranchesOutlined />, label: 'Mentorships' },
          { key: '/alumni/events', icon: <CalendarOutlined />, label: 'Events' },
          { key: '/alumni/fundraising', icon: <HeartOutlined />, label: 'Fundraising' },
          { key: '/alumni/settings', icon: <SettingOutlined />, label: 'Settings' },
        ];
      case 'student':
      default:
        return [
          { key: '/student/dashboard', icon: <DashboardOutlined />, label: 'Student Dashboard' },
          { key: '/student/profile', icon: <UserOutlined />, label: 'My Profile' },
          { key: '/student/mentorship', icon: <BranchesOutlined />, label: 'Mentorship' },
          { key: '/student/events', icon: <CalendarOutlined />, label: 'Events' },
          { key: '/student/settings', icon: <SettingOutlined />, label: 'Settings' },
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
