import React from 'react';
import { Button, Tag, Table, message } from 'antd';
import { FiDownload, FiBriefcase, FiCpu, FiUsers } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { downloadCsv } from '../utils/exportCsv';
import { mockAlumni } from '../data/mockAlumni';
import {
  calculateAlumniOverview,
  calculateSectorDistribution,
  calculateRoleDistribution,
  calculateTopCompanies,
  calculateBatchTrends,
  calculateDepartmentOutcomes,
  calculateSkillDistribution,
  calculateLocationDistribution
} from '../utils/analyticsHelper';

export const AdminReportsPage = () => {
  // 1. Calculate dynamic career analytics from mockAlumni
  const overview = calculateAlumniOverview(mockAlumni);
  const sectors = calculateSectorDistribution(mockAlumni);
  const roles = calculateRoleDistribution(mockAlumni);
  const companies = calculateTopCompanies(mockAlumni);
  const batchTrends = calculateBatchTrends(mockAlumni);
  const departmentOutcomes = calculateDepartmentOutcomes(mockAlumni);
  const skills = calculateSkillDistribution(mockAlumni);
  const locations = calculateLocationDistribution(mockAlumni);

  // Centralized placement drive records used dynamically
  const placementCompanies = [
    { key: '1', company: 'Google DeepMind', hired: 8, package: '₹32.0 LPA', year: '2026 Drive' },
    { key: '2', company: 'Stripe Payments', hired: 15, package: '₹22.0 LPA', year: '2026 Drive' },
    { key: '3', company: 'Amazon AWS', hired: 42, package: '₹18.5 LPA', year: '2026 Drive' },
    { key: '4', company: 'Wipro Digital', hired: 78, package: '₹6.5 LPA', year: '2025/26 Cycle' },
    { key: '5', company: 'Infosys Systems', hired: 112, package: '₹5.8 LPA', year: '2025/26 Cycle' }
  ];

  // CSV Report Generator (Uses dynamically calculated data fields)
  const handleExportFullAnalytics = () => {
    const headers = ['Metric / Segment', 'Field Name / Category', 'Aggregated Outcome'];
    const rows = [
      ['Placement Metrics', 'Overall Placement Rate', '94.2%'],
      ['Placement Metrics', 'Students Placed', '856 / 1200'],
      ['Placement Metrics', 'Average Salary Package', '₹12.8 LPA'],
      ['Placement Metrics', 'Highest Salary Package', '₹32.0 LPA'],
      ['Placement Metrics', 'Placement Drives', '124 Companies'],
      // Department placement rates
      ['Placement Rate', 'Computer Science & Engineering', '98.5%'],
      ['Placement Rate', 'Information Technology', '96.2%'],
      ['Placement Rate', 'Electronics & Communication', '92.4%'],
      ['Placement Rate', 'Electrical & Electronics', '88.0%'],
      ['Placement Rate', 'Mechanical Engineering', '84.5%'],
      ['Placement Rate', 'Civil Engineering', '81.0%'],
      // Career overview
      ['Career Overview', 'Total Profiles Evaluated', `${overview.total}`],
      ['Career Overview', 'Unique Active Companies', `${overview.uniqueCompanies}`],
      ['Career Overview', 'Distinct Job Roles', `${overview.uniqueRoles}`],
      ['Career Overview', 'Departments Represented', `${overview.uniqueDepts}`],
      // Dynamic Sector outcomes
      ...sectors.map(s => ['Alumni Sector Distribution', s.sector, `${s.count} (${s.percentage}%)`]),
      // Dynamic roles
      ...roles.map(r => ['Top Career Roles', r.role, `${r.count} (${r.percentage}%)`]),
      // Top skills
      ...skills.map(sk => ['Professional Specialization Skills', sk.skill, `${sk.count} occurrences`]),
      // Top locations
      ...locations.map(loc => ['Placement Locations', loc.location, `${loc.count} alumni`])
    ];

    downloadCsv('KCE_Institutional_Placement_Career_Report_2026.csv', rows, headers);
    message.success('Official KCE Institutional Report exported successfully!');
  };

  // Determine top values dynamically for the AI insights summary
  const primarySectorName = sectors[0]?.sector || 'N/A';
  const primarySectorPct = sectors[0]?.percentage || '0.0';
  const primaryRoleName = roles[0]?.role || 'N/A';
  const topSkillName = skills[0]?.skill || 'N/A';
  const primaryCityName = locations[0]?.location || 'N/A';

  return (
    <AdminLayout>
      {/* 1. Header block */}
      <div style={{ borderBottom: '2px solid var(--ac-border)', paddingBottom: 16, marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--ac-brand)', textTransform: 'uppercase' }}>KCE College Report</span>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '4px 0 0 0' }}>Institutional Reports & Outcomes</h1>
          <p style={{ fontSize: 13, color: 'var(--ac-text-secondary)', margin: '4px 0 0 0' }}>
            Official reporting summary generated for the College Academic Council on August 9, 2026.
          </p>
        </div>
        <Button
          type="primary"
          icon={<FiDownload />}
          style={{ backgroundColor: 'var(--ac-brand)', border: 'none', height: 40, fontWeight: 600 }}
          onClick={handleExportFullAnalytics}
        >
          Export Full Report (CSV)
        </Button>
      </div>

      {/* ================================================== */}
      {/* SECTION 1: PLACEMENT OVERVIEW                     */}
      {/* ================================================== */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ac-text-primary)', borderBottom: '1px solid var(--ac-border)', paddingBottom: 8, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiBriefcase color="var(--ac-brand)" /> Placement Overview
        </h2>

        {/* Compact Summary Metrics Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20, padding: '16px 20px', background: 'var(--ac-bg-input)', borderRadius: 12, border: '1px solid var(--ac-border)', marginBottom: 24, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Overall Placement Rate</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>94.2%</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--ac-border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Students Placed</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>856 / 1,200</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--ac-border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Average Salary Package</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>₹12.8 LPA</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--ac-border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Highest Salary Package</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-brand)', marginTop: 4 }}>₹32.0 LPA</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--ac-border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Placement Drives</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>124 Companies</div>
          </div>
        </div>

        {/* Department-wise Placement Rates (Full-width responsive grid) */}
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', marginBottom: 16 }}>
            Department-wise Placement Rates
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { name: 'Computer Science & Engineering', rate: 98.5 },
              { name: 'Information Technology', rate: 96.2 },
              { name: 'Electronics & Communication', rate: 92.4 },
              { name: 'Electrical & Electronics', rate: 89.0 },
              { name: 'Mechanical Engineering', rate: 84.5 },
              { name: 'Civil Engineering', rate: 81.0 }
            ].map((item, idx) => (
              <div key={idx} style={{ background: 'var(--ac-bg-input)', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--ac-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: 'var(--ac-text-primary)', marginBottom: 6 }}>
                  <span>{item.name}</span>
                  <span style={{ color: '#16a34a' }}>{item.rate}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--ac-bg-card)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.rate}%`, background: 'var(--ac-brand)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placement Company Breakdown Details Table (Full-width) */}
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 24 }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', marginBottom: 12 }}>
            Placement Drive Breakdown
          </h3>
          <Table
            dataSource={placementCompanies}
            pagination={false}
            columns={[
              { title: 'Company', dataIndex: 'company', key: 'company', render: (t) => <strong style={{ color: 'var(--ac-text-primary)' }}>{t}</strong> },
              { title: 'Students Hired', dataIndex: 'hired', key: 'hired', render: (t) => <span style={{ color: 'var(--ac-text-primary)' }}>{t}</span> },
              { title: 'Package Offered', dataIndex: 'package', key: 'package', render: (t) => <span style={{ color: 'var(--ac-brand)', fontWeight: 700 }}>{t}</span> },
              { title: 'Placement Drive / Year', dataIndex: 'year', key: 'year', render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span> }
            ]}
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* SECTION 2: CAREER ANALYTICS                       */}
      {/* ================================================== */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ac-text-primary)', borderBottom: '1px solid var(--ac-border)', paddingBottom: 8, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiCpu color="var(--ac-brand)" /> Career Analytics
        </h2>

        {/* Row 1: Industry & Sector and Career Role Distribution side-by-side */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 30, marginBottom: 30 }}>
          {/* B. Industry / Sector Distribution */}
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 24 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', marginBottom: 16 }}>
              Industry & Sector Distribution
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sectors.map((sec, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: 'var(--ac-text-primary)', marginBottom: 4 }}>
                    <span>{sec.sector}</span>
                    <span>{sec.count} ({sec.percentage}%)</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--ac-bg-input)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${sec.percentage}%`, background: 'var(--ac-brand)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* C. Career Role Distribution */}
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 24 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', marginBottom: 16 }}>
              Career Role Distribution
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {roles.map((r, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: 'var(--ac-text-primary)', marginBottom: 4 }}>
                    <span>{r.role}</span>
                    <span>{r.count} ({r.percentage}%)</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--ac-bg-input)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${r.percentage}%`, background: 'var(--ac-text-secondary)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Career Distribution by Graduation Batch (Full-width) */}
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 24, marginBottom: 30 }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', marginBottom: 16 }}>
            Career Distribution by Graduation Batch
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 15 }}>
            {batchTrends.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--ac-bg-input)', borderRadius: 8, border: '1px solid var(--ac-border)', fontSize: 13 }}>
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--ac-text-primary)' }}>Class of {t.batch}</span>
                  <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', marginTop: 2 }}>{t.role} ({t.company})</div>
                </div>
                <Tag color="blue" style={{ margin: 0 }}>{t.sector}</Tag>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Top Companies and Skills Analysis side-by-side */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 30, marginBottom: 30 }}>
          {/* Top Companies */}
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 24 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', marginBottom: 16 }}>
              Top Alumni Employer Organizations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {companies.map((c, idx) => {
                const pct = ((c.count / overview.total) * 100).toFixed(1);
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: 'var(--ac-text-primary)', marginBottom: 4 }}>
                      <span>{c.company}</span>
                      <span>{c.count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--ac-bg-input)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--ac-brand)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills Analysis */}
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 24 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', marginBottom: 16 }}>
              Top Professional Specialization Skills
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 12, background: 'var(--ac-bg-input)', borderRadius: 8, border: '1px solid var(--ac-border)' }}>
              {skills.map((s, idx) => (
                <span key={idx} style={{ fontSize: 12, color: 'var(--ac-text-primary)', background: 'var(--ac-bg-card)', padding: '6px 12px', borderRadius: 4, border: '1px solid var(--ac-border)', fontWeight: 600 }}>
                  {s.skill} ({s.count})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Department-wise Career Outcomes Table (Full-width) */}
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 24, marginBottom: 30 }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', marginBottom: 12 }}>
            Department-wise Career Placement Outcomes Matrix
          </h3>
          <Table
            dataSource={departmentOutcomes}
            rowKey="department"
            pagination={false}
            columns={[
              { title: 'Department', dataIndex: 'department', key: 'department', render: (t) => <strong style={{ color: 'var(--ac-text-primary)' }}>{t}</strong> },
              { title: 'Alumni Count', dataIndex: 'count', key: 'count', render: (t) => <span style={{ color: 'var(--ac-text-primary)' }}>{t}</span> },
              { title: 'Dominant Career Sector', dataIndex: 'dominantSector', key: 'dominantSector', render: (t) => <Tag color="blue">{t}</Tag> },
              { title: 'Dominant Career Role', dataIndex: 'dominantRole', key: 'dominantRole', render: (t) => <span style={{ color: 'var(--ac-text-primary)' }}>{t}</span> }
            ]}
          />
        </div>

        {/* AI / ML CAREER INSIGHTS */}
        <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--ac-text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiCpu color="var(--ac-brand)" /> AI Career Insights
          </h3>
          <div style={{ padding: 18, background: 'var(--ac-bg-input)', border: '1px solid var(--ac-border)', borderRadius: 8 }}>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: 13.5, color: 'var(--ac-text-primary)', lineHeight: 2.0, listStyleType: 'disc' }}>
              <li>
                <strong>Most represented industry:</strong> {primarySectorName}
              </li>
              <li>
                <strong>Most common career role:</strong> {primaryRoleName}
              </li>
              <li>
                <strong>Most common professional skill:</strong> {topSkillName}
              </li>
              {departmentOutcomes.length > 0 && (
                <li>
                  <strong>Department career pattern:</strong> Graduates from {departmentOutcomes[0]?.department} show primary outcomes in {departmentOutcomes[0]?.dominantSector} as {departmentOutcomes[0]?.dominantRole}.
                </li>
              )}
            </ul>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
