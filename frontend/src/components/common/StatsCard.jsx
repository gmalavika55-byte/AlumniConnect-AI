import React from 'react';
import { Tag } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

export const StatsCard = ({
  title,
  value,
  icon,
  bgColor = '#e6f4ff',
  iconColor = '#1677ff',
  trend,
  trendText,
  suffix = ''
}) => {
  return (
    <div className="stats-card-container">
      <div className="stats-icon-wrapper" style={{ backgroundColor: bgColor, color: iconColor }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div className="stats-label">{title}</div>
        <div className="stats-value">
          {value} <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>{suffix}</span>
        </div>
        {trendText && (
          <div style={{ marginTop: '4px', fontSize: '12px' }}>
            <Tag color={trend === 'up' ? 'success' : trend === 'down' ? 'error' : 'default'} style={{ margin: 0 }}>
              {trend === 'up' ? <RiseOutlined /> : trend === 'down' ? <FallOutlined /> : null} {trendText}
            </Tag>
          </div>
        )}
      </div>
    </div>
  );
};
