import React from 'react';
import { Card, Tag, Button, Avatar, message } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';

export const EventCard = ({ event, onRSVP }) => {
  const handleRSVP = () => {
    if (onRSVP) {
      onRSVP(event);
    } else {
      message.success(`RSVP confirmed for "${event.title}"`);
    }
  };

  return (
    <Card
      hoverable
      cover={
        <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
          <img
            alt={event.title}
            src={event.image}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <Tag color="cyan" style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 600 }}>
              {event.category}
            </Tag>
          </div>
        </div>
      }
      bodyStyle={{ padding: '18px' }}
    >
      <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
        {event.title}
      </h4>

      <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1677ff', fontWeight: 500 }}>
          <CalendarOutlined /> {event.date} • {event.time}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EnvironmentOutlined /> {event.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TeamOutlined /> {event.attendeesCount} Attending
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Speaker: {event.speaker}</span>
        <Button type="primary" ghost size="small" onClick={handleRSVP}>
          RSVP Now
        </Button>
      </div>
    </Card>
  );
};
