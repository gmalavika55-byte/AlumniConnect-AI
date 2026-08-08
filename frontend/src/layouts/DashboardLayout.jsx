import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

const { Content } = Layout;

export const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="dashboard-layout">
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="dashboard-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
