import React from 'react';
import { Card, Avatar, Tag, Button } from 'antd';
import { EditOutlined, EnvironmentOutlined, IdcardOutlined } from '@ant-design/icons';

export const ProfileCard = ({ user }) => {
  if (!user) return null;

  return (
    <Card bodyStyle={{ padding: '24px', textAlign: 'center' }}>
      <Avatar src={user.avatar} size={84} style={{ border: '3px solid #1677ff', marginBottom: '14px' }} />
      <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
        {user.name}
      </h3>
      <div style={{ marginBottom: '12px' }}>
        <Tag color="blue">{user.role}</Tag>
        {user.graduationYear && <Tag color="purple">Class of {user.graduationYear}</Tag>}
      </div>

      <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px' }}>
        {user.title ? `${user.title} @ ${user.company}` : user.degree || user.department}
      </p>

      {user.location && (
        <p style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '0 0 16px' }}>
          <EnvironmentOutlined /> {user.location}
        </p>
      )}

      {user.bio && (
        <p style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic', marginBottom: '20px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}>
          "{user.bio}"
        </p>
      )}

      <Button icon={<EditOutlined />} block>
        View Full Profile
      </Button>
    </Card>
  );
};
