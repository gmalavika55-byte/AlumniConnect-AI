import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BranchesOutlined, SafetyCertificateOutlined, TeamOutlined, RocketOutlined } from '@ant-design/icons';

export const AuthLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-layout-container">
      <div className="auth-hero-banner">
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <div className="sidebar-logo-icon" style={{ width: 44, height: 44, fontSize: 22 }}>
            <BranchesOutlined />
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
            AlumniConnect
          </span>
        </div>

        <div style={{ maxWidth: '480px', zIndex: 1 }}>
          <h1 style={{ fontSize: '38px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '20px' }}>
            Connect with your Global Alumni Ecosystem.
          </h1>
          <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '32px' }}>
            Empowering students with 1-on-1 mentorship, career opportunities, networking, and institutional events.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#1677ff' }}>
                <TeamOutlined />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>10,000+ Verified Members</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>Global network spanning leading tech & enterprises</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#52c41a' }}>
                <RocketOutlined />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>Accelerate Career Growth</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>1-on-1 mentorship sessions and resume feedback</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#faad14' }}>
                <SafetyCertificateOutlined />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>Institutional Verification</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>Secured access approved by campus administrators</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: '#64748b', zIndex: 1 }}>
          © {new Date().getFullYear()} AlumniConnect. Phase 1 Release.
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
