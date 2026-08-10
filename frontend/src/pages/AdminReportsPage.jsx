import React, { useState, useEffect } from 'react';
import { Button, Tag, Table, message, Spin } from 'antd';
import { FiDownload, FiBriefcase, FiCpu, FiUsers } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { downloadCsv } from '../utils/exportCsv';
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
import api from '../services/api';

export const AdminReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ total: 0, uniqueCompanies: 0, uniqueRoles: 0, uniqueDepts: 0 });
  const [sectors, setSectors] = useState([]);
  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [batchTrends, setBatchTrends] = useState([]);
  const [departmentOutcomes, setDepartmentOutcomes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [locations, setLocations] = useState([]);

  const [placementStats, setPlacementStats] = useState({
    overallPlacementRate: '94.2%',
    studentsPlaced: '856 / 1,200',
    avgPackage: '₹12.8 LPA',
    highestPackage: '₹32.0 LPA',
    drivesCount: '124 Companies'
  });

  const [placementCompanies, setPlacementCompanies] = useState([
    { key: '1', company: 'Google DeepMind', hired: 8, package: '₹32.0 LPA', year: '2026 Drive' },
    { key: '2', company: 'Stripe Payments', hired: 15, package: '₹22.0 LPA', year: '2026 Drive' },
    { key: '3', company: 'Amazon AWS', hired: 42, package: '₹18.5 LPA', year: '2026 Drive' },
    { key: '4', company: 'Wipro Digital', hired: 78, package: '₹6.5 LPA', year: '2025/26 Cycle' },
    { key: '5', company: 'Infosys Systems', hired: 112, package: '₹5.8 LPA', year: '2025/26 Cycle' }
  ]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const careerRes = await api.get('/career/getall');
      const careerData = careerRes.data || {};

      const placementRes = await api.get('/placement/getall');
      const placementData = placementRes.data || {};

      const alumniRes = await api.get('/alumni/getall');
      const allAlumni = alumniRes.data || [];

      const localOverview = calculateAlumniOverview(allAlumni);
      const localBatchTrends = calculateBatchTrends(allAlumni);
      const localDeptOutcomes = calculateDepartmentOutcomes(allAlumni);
      const localLocations = calculateLocationDistribution(allAlumni);

      setOverview(localOverview);
      setBatchTrends(localBatchTrends);
      setDepartmentOutcomes(localDeptOutcomes);
      setLocations(localLocations);

      if (careerData.sectorDistribution) {
        const totalAlumni = careerData.totalAlumniProfiles || allAlumni.length || 1;
        const mappedSectors = Object.keys(careerData.sectorDistribution).map(k => ({
          sector: k,
          count: careerData.sectorDistribution[k],
          percentage: ((careerData.sectorDistribution[k] / totalAlumni) * 100).toFixed(1)
        })).sort((a,b) => b.count - a.count);
        setSectors(mappedSectors);
      }

      if (careerData.roleDistribution) {
        const totalAlumni = careerData.totalAlumniProfiles || allAlumni.length || 1;
        const mappedRoles = Object.keys(careerData.roleDistribution).map(k => ({
          role: k,
          count: careerData.roleDistribution[k],
          percentage: ((careerData.roleDistribution[k] / totalAlumni) * 100).toFixed(1)
        })).sort((a,b) => b.count - a.count);
        setRoles(mappedRoles);
      }

      if (careerData.employerOrganizations) {
        const mappedCompanies = Object.keys(careerData.employerOrganizations).map(k => ({
          company: k,
          count: careerData.employerOrganizations[k]
        })).sort((a,b) => b.count - a.count);
        setCompanies(mappedCompanies);
      }

      if (careerData.skillsDistribution) {
        const mappedSkills = Object.keys(careerData.skillsDistribution).map(k => ({
          skill: k,
          count: careerData.skillsDistribution[k]
        })).sort((a,b) => b.count - a.count);
        setSkills(mappedSkills);
      }

      if (placementData.overallPlacementRate !== undefined) {
        setPlacementStats({
          overallPlacementRate: `${placementData.overallPlacementRate}%`,
          studentsPlaced: `${placementData.totalAlumniPlaced} / ${placementData.totalStudentsCount}`,
          avgPackage: `₹${placementData.averageSalaryPackage} LPA`,
          highestPackage: `₹${placementData.highestSalaryPackage} LPA`,
          drivesCount: `${placementData.placementDrivesCount} Companies`
        });
      }

      if (placementData.placementDrives && placementData.placementDrives.length > 0) {
        const mappedDrives = placementData.placementDrives.map((d, idx) => ({
          key: String(idx + 1),
          company: d.company || 'Unknown',
          hired: d.hired || d.studentsHired || 0,
          package: `₹${d.package || d.salaryPackage} LPA`,
          year: d.year || d.driveYear || '2026 Drive'
        }));
        setPlacementCompanies(mappedDrives);
      }

    } catch (err) {
      console.error("Error loading analytics data:", err);
      message.error("Failed to load institutional reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExportFullAnalytics = () => {
    const headers = ['Metric / Segment', 'Field Name / Category', 'Aggregated Outcome'];
    const rows = [
      ['Placement Metrics', 'Overall Placement Rate', placementStats.overallPlacementRate],
      ['Placement Metrics', 'Students Placed', placementStats.studentsPlaced],
      ['Placement Metrics', 'Average Salary Package', placementStats.avgPackage],
      ['Placement Metrics', 'Highest Salary Package', placementStats.highestPackage],
      ['Placement Metrics', 'Placement Drives', placementStats.drivesCount],
      ['Career Overview', 'Total Profiles Evaluated', `${overview.total}`],
      ['Career Overview', 'Unique Active Companies', `${overview.uniqueCompanies}`],
      ['Career Overview', 'Distinct Job Roles', `${overview.uniqueRoles}`],
      ['Career Overview', 'Departments Represented', `${overview.uniqueDepts}`],
      ...sectors.map(s => ['Alumni Sector Distribution', s.sector, `${s.count} (${s.percentage}%)`]),
      ...roles.map(r => ['Top Career Roles', r.role, `${r.count} (${r.percentage}%)`]),
      ...skills.map(sk => ['Professional Specialization Skills', sk.skill, `${sk.count} occurrences`]),
      ...locations.map(loc => ['Placement Locations', loc.location, `${loc.count} alumni`])
    ];

    downloadCsv('KCE_Institutional_Placement_Career_Report_2026.csv', rows, headers);
    message.success('Official KCE Institutional Report exported successfully!');
  };

  const primarySectorName = sectors[0]?.sector || 'N/A';
  const primaryRoleName = roles[0]?.role || 'N/A';
  const topSkillName = skills[0]?.skill || 'N/A';

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)' }}>Institutional Reports</h1>
          <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', marginTop: 4 }}>
            Aggregated career and placement analytics for {new Date().getFullYear()}
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
            <div style={{ fontSize: 22, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>{placementStats.overallPlacementRate}</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--ac-border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Students Placed</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>{placementStats.studentsPlaced}</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--ac-border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Average Salary Package</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>{placementStats.avgPackage}</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--ac-border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Highest Salary Package</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-brand)', marginTop: 4 }}>{placementStats.highestPackage}</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--ac-border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Placement Drives</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>{placementStats.drivesCount}</div>
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

        {/* Row 1: Industry & Sector and Specialization Skills side-by-side */}
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

        {/* Row 2: Department-wise Career Placement Outcomes Matrix Table (Full-width) */}
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
