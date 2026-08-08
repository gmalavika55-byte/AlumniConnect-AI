import React from 'react';
import { Card, Avatar, Tag, Button, Rate, Tooltip, message } from 'antd';
import { EnvironmentOutlined, BankOutlined, UserAddOutlined, StarFilled } from '@ant-design/icons';

export const MentorCard = ({ mentor, onConnect }) => {
  const handleConnectClick = () => {
    if (onConnect) {
      onConnect(mentor);
    } else {
      message.success(`Mentorship request sent to ${mentor.name}`);
    }
  };

  return (
    <Card className="mentor-card" bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
        <Avatar src={mentor.avatar} size={64} className="mentor-avatar" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {mentor.name}
          </h4>
          <p style={{ margin: '2px 0 4px', fontSize: '13px', color: '#1677ff', fontWeight: 500 }}>
            {mentor.title}
          </p>
          <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BankOutlined /> {mentor.company}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: '#475569', marginBottom: '14px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {mentor.bio}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', fontSize: '12px', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <EnvironmentOutlined /> {mentor.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#faad14', fontWeight: 600 }}>
          <StarFilled /> {mentor.rating || '4.9'}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        {mentor.skills?.slice(0, 3).map((skill, i) => (
          <Tag key={i} color="blue" className="mentor-skill-tag">
            {skill}
          </Tag>
        ))}
        {mentor.skills?.length > 3 && (
          <Tag className="mentor-skill-tag">+{mentor.skills.length - 3}</Tag>
        )}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
        <Button 
          type="primary" 
          icon={<UserAddOutlined />} 
          block 
          onClick={handleConnectClick}
        >
          Request Mentorship
        </Button>
      </div>
    </Card>
  );
};
