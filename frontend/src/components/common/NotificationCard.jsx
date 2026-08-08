import React from 'react';
import { Card, Badge, Tag } from 'antd';
import { BellOutlined, CheckCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';

export const NotificationCard = ({ notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14', fontSize: '18px' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#1677ff', fontSize: '18px' }} />;
    }
  };

  return (
    <div
      style={{
        padding: '14px 16px',
        borderRadius: '10px',
        backgroundColor: notification.read ? '#ffffff' : '#f0f7ff',
        border: '1px solid #f0f0f0',
        marginBottom: '10px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        transition: 'background-color 0.2s ease'
      }}
    >
      <div style={{ marginTop: '2px' }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
            {notification.title}
          </h5>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{notification.timestamp}</span>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.4 }}>
          {notification.message}
        </p>
      </div>
      {!notification.read && <Badge dot color="#1677ff" />}
    </div>
  );
};
