import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Tag, Table, Alert, Spin, Modal, Select, Progress } from 'antd';
import { FiDownload, FiBriefcase, FiCpu, FiUser, FiCheckCircle, FiXCircle, FiInfo, FiBarChart2 } from 'react-icons/fi';
import { AdminLayout } from '../components/admin/AdminLayout';
import { downloadCsv } from '../utils/exportCsv';
import api from '../services/api';

const AI_BASE_URL = (import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000').replace(/\/+$/, '');

export const AdminReportsPage = () => {
  const location = useLocation();
  const studentDemographicsRef = useRef(null);
  const alumniDistributionRef = useRef(null);
  const mlPredictionRef = useRef(null);
  const [highlightedSection, setHighlightedSection] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [careerAnalytics, setCareerAnalytics] = useState(null);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);

  // ML Prediction State
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [predictError, setPredictError] = useState(null);

  // Overall ML Predicted Placement Trend State (starts true during initial fetch)
  const [overallMlLoading, setOverallMlLoading] = useState(true);
  const [overallMlData, setOverallMlData] = useState(null);
  const [overallMlError, setOverallMlError] = useState(null);

  const buildPredictionPayload = (studentObj) => {
    const rawBatch = String(studentObj?.batch || studentObj?.graduationYear || 2026);
    const gradYear = parseInt(rawBatch.split('-')[0].trim(), 10) || 2026;

    return {
      cgpa: studentObj?.cgpa !== null && studentObj?.cgpa !== undefined && !isNaN(studentObj.cgpa) ? parseFloat(studentObj.cgpa) : 7.5,
      department: (studentObj?.department || 'CSE').toString().trim().toUpperCase(),
      skills: (studentObj?.skills || 'General Engineering').toString().trim() || 'General Engineering',
      careerGoal: (studentObj?.careerGoal || 'Software Developer').toString().trim() || 'Software Developer',
      graduationYear: gradYear
    };
  };

  const isEvaluatingRef = useRef(false);

  const fetchOverallMlTrend = async (studentArray) => {
    if (!Array.isArray(studentArray) || studentArray.length === 0) {
      setOverallMlData({
        totalStudentsAssessed: 0,
        predictedPlacedCount: 0,
        predictedNotPlacedCount: 0,
        predictedPlacementRate: 0.0,
        averagePlacementProbability: 0.0,
        predictions: []
      });
      setOverallMlLoading(false);
      return;
    }

    if (isEvaluatingRef.current) return;
    isEvaluatingRef.current = true;

    setOverallMlLoading(true);
    setOverallMlError(null);

    try {
      const batchPayload = studentArray.map(s => buildPredictionPayload(s));
      console.log(`[ML Batch Request] Evaluating ${batchPayload.length} students via predict-batch:`, batchPayload);

      const res = await api.post('/ai/career/predict-batch', batchPayload);
      setOverallMlData(res.data);
    } catch (err) {
      console.error('Error fetching overall ML predictions batch:', err);
      setOverallMlError(err.response?.data?.detail || err.message || 'Unable to generate overall ML predicted placement trend.');
    } finally {
      setOverallMlLoading(false);
      isEvaluatingRef.current = false;
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/ai/career/analytics');
      const data = response.data;
      if (data.status === 'degraded') {
        throw new Error(data.message || 'Career analytics data is currently degraded.');
      }
      setCareerAnalytics(data);
    } catch (err) {
      console.error('Error fetching live AI Career Analytics:', err);
      setError('Career analytics are currently unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setOverallMlLoading(true);
    setOverallMlError(null);
    try {
      const res = await api.get('/student/getall');
      const studentData = Array.isArray(res.data) 
        ? res.data 
        : (Array.isArray(res.data?.data) ? res.data.data : []);

      setStudentsList(studentData);

      if (studentData.length > 0) {
        await fetchOverallMlTrend(studentData);
      } else {
        setOverallMlData({
          totalStudentsAssessed: 0,
          predictedPlacedCount: 0,
          predictedNotPlacedCount: 0,
          predictedPlacementRate: 0.0,
          averagePlacementProbability: 0.0,
          predictions: []
        });
        setOverallMlLoading(false);
      }
    } catch (err) {
      console.error('Error fetching students list for ML evaluation:', err);
      setOverallMlError('Failed to load student profiles for ML prediction.');
      setOverallMlLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchStudents();
  }, []);

  const handleSelectStudent = async (studentId) => {
    setSelectedStudentId(studentId);
    setPredictionData(null);
    setPredictError(null);
    if (!studentId) return;

    const studentObj = studentsList.find(s => String(s.studentId) === String(studentId));
    if (!studentObj) return;

    setPredictLoading(true);
    try {
      const payload = buildPredictionPayload(studentObj);
      console.log(`[ML Individual Request] Evaluating student ID ${studentObj.studentId || studentObj.id} (${studentObj.name}):`, payload);

      const res = await api.post('/ai/career/predict', payload);
      setPredictionData({
        student: studentObj,
        result: res.data
      });
    } catch (err) {
      console.error('Error fetching student ML prediction:', err);
      setPredictError('Unable to generate ML career outcome prediction for the selected student.');
    } finally {
      setPredictLoading(false);
    }
  };

  // Target Section Smooth Scroll & Visual Highlight Effect
  useEffect(() => {
    if (!loading) {
      if (location.pathname === '/admin/analytics') {
        const scrollTimer = setTimeout(() => {
          mlPredictionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          setHighlightedSection('ml-prediction');
        }, 150);

        const clearHighlightTimer = setTimeout(() => {
          setHighlightedSection(null);
        }, 2000);

        return () => {
          clearTimeout(scrollTimer);
          clearTimeout(clearHighlightTimer);
        };
      } else if (location.state?.scrollTo) {
        const target = location.state.scrollTo;
        if (target === 'student-demographics') {
          const scrollTimer = setTimeout(() => {
            studentDemographicsRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            setHighlightedSection('student-demographics');
          }, 150);

          const clearHighlightTimer = setTimeout(() => {
            setHighlightedSection(null);
          }, 2000);

          return () => {
            clearTimeout(scrollTimer);
            clearTimeout(clearHighlightTimer);
          };
        } else if (target === 'alumni-distribution') {
          const scrollTimer = setTimeout(() => {
            alumniDistributionRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            setHighlightedSection('alumni-distribution');
          }, 150);

          const clearHighlightTimer = setTimeout(() => {
            setHighlightedSection(null);
          }, 2000);

          return () => {
            clearTimeout(scrollTimer);
            clearTimeout(clearHighlightTimer);
          };
        }
      }
    }
  }, [loading, location.pathname, location.state]);

  // Derived state from live AI analytics
  const overview = careerAnalytics?.overview || {};
  const departmentAnalytics = careerAnalytics?.departmentAnalytics || [];
  const companyAnalytics = careerAnalytics?.companyAnalytics || [];
  const skillAnalytics = careerAnalytics?.skillAnalytics || [];
  const alumniAnalytics = careerAnalytics?.alumniAnalytics || {};
  const aiInsights = careerAnalytics?.aiInsights || [];

  // Format overview metrics
  const overallPlacementRate = overview.placementRate !== undefined ? `${overview.placementRate}%` : 'N/A';
  const studentsPlaced = overview.placedStudents !== undefined ? `${overview.placedStudents} / ${overview.totalOutcomes}` : 'N/A';
  
  const rawAvgPkg = overview.averagePackage ?? overview.averageSalaryPackage;
  const avgPkgVal = (rawAvgPkg !== undefined && rawAvgPkg !== null && !isNaN(Number(rawAvgPkg)) && Number(rawAvgPkg) > 0)
    ? Number(rawAvgPkg)
    : null;
  const avgPackage = avgPkgVal !== null ? `₹${avgPkgVal.toFixed(2)} LPA` : 'N/A';

  const highestPackage = overview.highestPackage !== undefined ? `₹${overview.highestPackage} LPA` : 'N/A';
  const drivesCount = companyAnalytics.length > 0 ? `${companyAnalytics.length} Companies` : 'N/A';

  // Format Sector distribution
  const totalAlumni = alumniAnalytics.totalAlumni || 1;
  const sectorList = Object.keys(alumniAnalytics.sectorDistribution || {}).map(sectorName => {
    const count = alumniAnalytics.sectorDistribution[sectorName];
    const percentage = ((count / totalAlumni) * 100).toFixed(1);
    return { sector: sectorName, count, percentage };
  }).sort((a, b) => b.count - a.count);

  // Format Placement Breakdown Table
  const placementCompaniesTable = companyAnalytics.map((c, idx) => ({
    key: String(idx + 1),
    company: c.company,
    hired: c.studentsPlaced,
    package: `Avg ₹${c.averagePackage} LPA (Max ₹${c.highestPackage} LPA)`,
    year: 'Historical Data'
  }));

  // CSV Export handler using live data
  const handleExportFullAnalytics = () => {
    if (!careerAnalytics) return;
    const headers = ['Metric / Segment', 'Field Name / Category', 'Aggregated Outcome'];
    const rows = [
      ['Placement Metrics', 'Overall Placement Rate', overallPlacementRate],
      ['Placement Metrics', 'Students Placed', studentsPlaced],
      ['Placement Metrics', 'Average Salary Package', avgPackage],
      ['Placement Metrics', 'Highest Salary Package', highestPackage],
      ['Placement Metrics', 'Placement Drives', drivesCount],
      ['Career Overview', 'Total Outcomes Evaluated', `${overview.totalOutcomes}`],
      ...departmentAnalytics.map(d => ['Department Placement Rate', d.department, `${d.placementRate}% (${d.placedStudents} Placed / ${d.totalStudents} Total)`]),
      ...companyAnalytics.map(c => ['Company Placement Breakdown', c.company, `${c.studentsPlaced} Hired (Avg ₹${c.averagePackage} LPA)`]),
      ...sectorList.map(s => ['Alumni Sector Distribution', s.sector, `${s.count} (${s.percentage}%)`]),
      ...skillAnalytics.map(sk => ['Professional Specialization Skills', sk.skill, `${sk.studentCount} Students (${sk.placementRate}% Placed)`]),
      ...aiInsights.map(insight => ['AI Career Insights', insight.type, insight.message])
    ];

    downloadCsv('AlumniConnect_Live_Career_Analytics_2026.csv', rows, headers);
  };

  return (
    <AdminLayout>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: 0 }}>Institutional Reports & Analytics</h1>
          <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', marginTop: 4, margin: 0 }}>
            Real-time AI Career Analytics & Machine Learning Outcome Predictions
          </p>
        </div>
        <Button
          type="primary"
          icon={<FiDownload />}
          style={{ backgroundColor: 'var(--ac-brand)', border: 'none', height: 40, fontWeight: 600 }}
          onClick={handleExportFullAnalytics}
          disabled={!careerAnalytics}
        >
          Export Full Report (CSV)
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: 'var(--ac-text-secondary)', fontWeight: 600 }}>
            Fetching live AI career analytics from {AI_BASE_URL}/ai/career/analytics...
          </p>
        </div>
      ) : error ? (
        <div style={{ padding: '40px 0' }}>
          <Alert
            message="Analytics Service Error"
            description={error}
            type="error"
            showIcon
            style={{ borderRadius: 8 }}
          />
        </div>
      ) : (
        <>
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
                <div style={{ fontSize: 22, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>{overallPlacementRate}</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--ac-border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Students Placed</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>{studentsPlaced}</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--ac-border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Average Salary Package</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>{avgPackage}</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--ac-border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Highest Salary Package</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-brand)', marginTop: 4 }}>{highestPackage}</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--ac-border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Recruiting Companies</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>{drivesCount}</div>
              </div>
            </div>

            {/* Department-wise Placement Rates Container */}
            <div
              ref={studentDemographicsRef}
              style={{
                backgroundColor: 'var(--ac-bg-card)',
                borderRadius: 12,
                border: highlightedSection === 'student-demographics' ? '2px solid #1b62d4' : '1px solid var(--ac-border)',
                boxShadow: highlightedSection === 'student-demographics' ? '0 0 16px rgba(27, 98, 212, 0.35)' : 'none',
                padding: 24,
                marginBottom: 24,
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', marginBottom: 16 }}>
                Department-wise Placement Rates & Student Demographics
              </h3>
              {departmentAnalytics.length === 0 ? (
                <p style={{ color: 'var(--ac-text-secondary)', margin: 0 }}>No department placement data available.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                  {departmentAnalytics.map((deptItem, idx) => (
                    <div key={idx} style={{ background: 'var(--ac-bg-input)', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--ac-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: 'var(--ac-text-primary)', marginBottom: 6 }}>
                        <span>{deptItem.department}</span>
                        <span style={{ color: '#16a34a' }}>{deptItem.placementRate}% ({deptItem.placedStudents}/{deptItem.totalStudents})</span>
                      </div>
                      <div style={{ height: 8, background: 'var(--ac-bg-card)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${deptItem.placementRate}%`, background: 'var(--ac-brand)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Company Breakdown Table */}
            <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 24 }}>
              <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', marginBottom: 12 }}>
                Recruiting Companies & Hiring Breakdown
              </h3>
              <Table
                dataSource={placementCompaniesTable}
                pagination={false}
                locale={{ emptyText: 'No recruiting company records available.' }}
                columns={[
                  { title: 'Company Name', dataIndex: 'company', key: 'company', render: (t) => <strong style={{ color: 'var(--ac-text-primary)' }}>{t}</strong> },
                  { title: 'Students Hired', dataIndex: 'hired', key: 'hired', render: (t) => <span style={{ color: 'var(--ac-text-primary)', fontWeight: 600 }}>{t}</span> },
                  { title: 'Salary Package Range', dataIndex: 'package', key: 'package', render: (t) => <span style={{ color: 'var(--ac-brand)', fontWeight: 700 }}>{t}</span> },
                  { title: 'Data Segment', dataIndex: 'year', key: 'year', render: (t) => <span style={{ color: 'var(--ac-text-secondary)' }}>{t}</span> }
                ]}
              />
            </div>
          </div>

          {/* ================================================== */}
          {/* SECTION 2: ML CAREER OUTCOME PREDICTION            */}
          {/* ================================================== */}
          <div ref={mlPredictionRef} style={{ marginBottom: 40, backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-brand)', padding: 24, boxShadow: '0 4px 20px rgba(27, 98, 212, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ac-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiCpu color="var(--ac-brand)" size={22} /> ML Career Outcome Prediction
                </h2>
                <p style={{ fontSize: 13, color: 'var(--ac-text-secondary)', marginTop: 4, margin: 0 }}>
                  Evaluate aggregate ML placement trends and individual student placement probability using trained Random Forest Classifier.
                </p>
              </div>
            </div>

            {/* Overall ML Predicted Placement Trend (Aggregate Cohort Assessment) */}
            <div style={{ backgroundColor: 'var(--ac-bg-input)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 20, marginBottom: 24 }}>
              <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiBarChart2 color="var(--ac-brand)" size={18} /> ML Predicted Placement Trend (Aggregate Cohort Assessment)
              </h3>

              {overallMlLoading ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Spin size="default" />
                  <span style={{ marginLeft: 10, fontSize: 13, color: 'var(--ac-text-secondary)', fontWeight: 600 }}>
                    Evaluating student profiles with Random Forest model (POST /ai/career/predict-batch)...
                  </span>
                </div>
              ) : overallMlError ? (
                <Alert message="ML Trend Evaluation Note" description={overallMlError} type="warning" showIcon style={{ borderRadius: 8 }} />
              ) : !overallMlData || overallMlData.totalStudentsAssessed === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--ac-text-secondary)', fontStyle: 'italic', padding: '8px 0' }}>
                  No eligible student data available for ML prediction.
                </div>
              ) : (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
                    <div style={{ backgroundColor: 'var(--ac-bg-card)', padding: '14px 16px', borderRadius: 10, border: '1px solid var(--ac-border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Total Students Assessed</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-text-primary)', marginTop: 4 }}>
                        {overallMlData.totalStudentsAssessed}
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--ac-bg-card)', padding: '14px 16px', borderRadius: 10, border: '1px solid var(--ac-border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Predicted WILL BE PLACED</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#16a34a', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FiCheckCircle size={18} /> {overallMlData.predictedPlacedCount}
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--ac-bg-card)', padding: '14px 16px', borderRadius: 10, border: '1px solid var(--ac-border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Predicted UNLIKELY TO BE PLACED</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#dc2626', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FiXCircle size={18} /> {overallMlData.predictedNotPlacedCount}
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--ac-bg-card)', padding: '14px 16px', borderRadius: 10, border: '1px solid var(--ac-border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Predicted Placement Rate</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ac-brand)', marginTop: 4 }}>
                        {overallMlData.predictedPlacementRate}%
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--ac-bg-card)', padding: '14px 16px', borderRadius: 10, border: '1px solid var(--ac-border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Avg Placement Probability</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#0284c7', marginTop: 4 }}>
                        {overallMlData.averagePlacementProbability}%
                      </div>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div style={{ marginTop: 14, backgroundColor: 'var(--ac-bg-card)', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--ac-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: 'var(--ac-text-primary)', marginBottom: 6 }}>
                      <span>Predicted Placement Ratio ({overallMlData.predictedPlacedCount} Will Be Placed / {overallMlData.predictedNotPlacedCount} Unlikely)</span>
                      <span style={{ color: 'var(--ac-brand)', fontWeight: 700 }}>{overallMlData.predictedPlacementRate}% Rate</span>
                    </div>
                    <div style={{ height: 8, background: '#fee2e2', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                      <div style={{ height: '100%', width: `${overallMlData.predictedPlacementRate}%`, background: '#16a34a', transition: 'width 0.5s ease-in-out' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Student Selection Control */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--ac-text-primary)', marginBottom: 8 }}>
                Select Student for ML Career Outcome Assessment:
              </label>
              <Select
                style={{ width: '100%', maxWidth: 500 }}
                placeholder="-- Select a student from database --"
                value={selectedStudentId}
                onChange={handleSelectStudent}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={studentsList.map(s => ({
                  value: s.studentId,
                  label: `${s.name || 'Student #' + s.studentId} (${s.registerNo || 'ID: ' + s.studentId}) — ${s.department || 'General'}`
                }))}
              />
            </div>

            {/* Prediction Display Area */}
            {predictLoading ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <Spin size="large" />
                <p style={{ marginTop: 12, color: 'var(--ac-text-secondary)', fontWeight: 600 }}>
                  Passing student features to Random Forest model ({AI_BASE_URL}/ai/career/predict)...
                </p>
              </div>
            ) : predictError ? (
              <Alert message="ML Prediction Error" description={predictError} type="warning" showIcon style={{ borderRadius: 8 }} />
            ) : predictionData ? (
              <div style={{ backgroundColor: 'var(--ac-bg-input)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 20 }}>
                {/* Selected Student Information Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--ac-border)' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase', display: 'block' }}>Student Name</span>
                    <strong style={{ fontSize: 15, color: 'var(--ac-text-primary)' }}>{predictionData.student.name || 'Student #' + predictionData.student.studentId}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase', display: 'block' }}>Department</span>
                    <span style={{ fontSize: 14, color: 'var(--ac-text-primary)', fontWeight: 600 }}>{predictionData.student.department || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase', display: 'block' }}>Academic CGPA</span>
                    <span style={{ fontSize: 14, color: 'var(--ac-brand)', fontWeight: 700 }}>{predictionData.student.cgpa !== null && predictionData.student.cgpa !== undefined ? predictionData.student.cgpa : 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase', display: 'block' }}>Career Goal</span>
                    <span style={{ fontSize: 14, color: 'var(--ac-text-primary)', fontWeight: 600 }}>{predictionData.student.careerGoal || 'Software Developer'}</span>
                  </div>
                </div>

                {/* Machine Learning Prediction Result Card */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
                  <div style={{ backgroundColor: 'var(--ac-bg-card)', padding: 16, borderRadius: 10, border: '1px solid var(--ac-border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Predicted Outcome</div>
                    <div style={{ marginTop: 8 }}>
                      <Tag color={predictionData.result.predictedOutcome === 'PLACED' ? 'green' : 'red'} style={{ fontSize: 14, fontWeight: 800, padding: '4px 12px', borderRadius: 6 }}>
                        {predictionData.result.predictedOutcome === 'PLACED' ? <FiCheckCircle style={{ marginRight: 6 }} /> : <FiXCircle style={{ marginRight: 6 }} />}
                        {predictionData.result.predictedOutcome === 'PLACED' ? 'WILL BE PLACED' : 'UNLIKELY TO BE PLACED'}
                      </Tag>
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--ac-bg-card)', padding: 16, borderRadius: 10, border: '1px solid var(--ac-border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Placement Probability</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: predictionData.result.placementProbability >= 50 ? '#16a34a' : '#dc2626', marginTop: 4 }}>
                      {predictionData.result.placementProbability}%
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--ac-bg-card)', padding: 16, borderRadius: 10, border: '1px solid var(--ac-border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>Model Confidence</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-brand)', marginTop: 4 }}>
                      {predictionData.result.confidence}%
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--ac-bg-card)', padding: 16, borderRadius: 10, border: '1px solid var(--ac-border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ac-text-secondary)', textTransform: 'uppercase' }}>ML Model Architecture</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ac-text-primary)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiCpu color="var(--ac-brand)" /> {predictionData.result.model || 'RandomForestClassifier'}
                    </div>
                  </div>
                </div>

                {/* Model Performance Evaluation Metrics */}
                {predictionData.result.modelMetrics && (
                  <div style={{ backgroundColor: 'var(--ac-bg-card)', padding: 16, borderRadius: 10, border: '1px solid var(--ac-border)', marginBottom: 16 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--ac-text-primary)', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiBarChart2 color="var(--ac-brand)" /> Random Forest Model Performance Metrics (Test Set Evaluation)
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, textAlign: 'center' }}>
                      <div style={{ background: 'var(--ac-bg-input)', padding: 8, borderRadius: 6 }}>
                        <div style={{ fontSize: 11, color: 'var(--ac-text-secondary)' }}>Accuracy</div>
                        <strong style={{ fontSize: 15, color: '#16a34a' }}>{predictionData.result.modelMetrics.accuracy !== null ? `${predictionData.result.modelMetrics.accuracy}%` : 'N/A'}</strong>
                      </div>
                      <div style={{ background: 'var(--ac-bg-input)', padding: 8, borderRadius: 6 }}>
                        <div style={{ fontSize: 11, color: 'var(--ac-text-secondary)' }}>Precision</div>
                        <strong style={{ fontSize: 15, color: 'var(--ac-text-primary)' }}>{predictionData.result.modelMetrics.precision !== null ? `${predictionData.result.modelMetrics.precision}%` : 'N/A'}</strong>
                      </div>
                      <div style={{ background: 'var(--ac-bg-input)', padding: 8, borderRadius: 6 }}>
                        <div style={{ fontSize: 11, color: 'var(--ac-text-secondary)' }}>Recall</div>
                        <strong style={{ fontSize: 15, color: 'var(--ac-text-primary)' }}>{predictionData.result.modelMetrics.recall !== null ? `${predictionData.result.modelMetrics.recall}%` : 'N/A'}</strong>
                      </div>
                      <div style={{ background: 'var(--ac-bg-input)', padding: 8, borderRadius: 6 }}>
                        <div style={{ fontSize: 11, color: 'var(--ac-text-secondary)' }}>F1-Score</div>
                        <strong style={{ fontSize: 15, color: 'var(--ac-brand)' }}>{predictionData.result.modelMetrics.f1 !== null ? `${predictionData.result.modelMetrics.f1}%` : 'N/A'}</strong>
                      </div>
                      <div style={{ background: 'var(--ac-bg-input)', padding: 8, borderRadius: 6 }}>
                        <div style={{ fontSize: 11, color: 'var(--ac-text-secondary)' }}>Training Samples</div>
                        <strong style={{ fontSize: 15, color: 'var(--ac-text-primary)' }}>{predictionData.result.modelMetrics.trainingSampleCount || 0}</strong>
                      </div>
                      <div style={{ background: 'var(--ac-bg-input)', padding: 8, borderRadius: 6 }}>
                        <div style={{ fontSize: 11, color: 'var(--ac-text-secondary)' }}>Test Samples</div>
                        <strong style={{ fontSize: 15, color: 'var(--ac-text-primary)' }}>{predictionData.result.modelMetrics.testSampleCount || 0}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feature Importance List */}
                {Array.isArray(predictionData.result.featureImportance) && predictionData.result.featureImportance.length > 0 && (
                  <div style={{ backgroundColor: 'var(--ac-bg-card)', padding: 16, borderRadius: 10, border: '1px solid var(--ac-border)', marginBottom: 16 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--ac-text-primary)', margin: '0 0 12px 0' }}>
                      Random Forest Feature Importance Weights
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                      {predictionData.result.featureImportance.map((f, fIdx) => (
                        <div key={fIdx} style={{ fontSize: 12, color: 'var(--ac-text-primary)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontWeight: 600 }}>{f.feature}</span>
                            <span style={{ color: 'var(--ac-brand)', fontWeight: 700 }}>{(f.importance * 100).toFixed(1)}%</span>
                          </div>
                          <div style={{ height: 6, background: 'var(--ac-bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(100, f.importance * 100)}%`, background: 'var(--ac-brand)' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Explanatory Disclaimer */}
                <div style={{ fontSize: 12, color: 'var(--ac-text-secondary)', display: 'flex', alignItems: 'center', gap: 6, fontStyle: 'italic' }}>
                  <FiInfo color="var(--ac-brand)" size={14} />
                  <span>This is an ML-based prediction generated from the student's career profile and historical career outcome data. It does not represent official placement status.</span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', backgroundColor: 'var(--ac-bg-input)', borderRadius: 10, border: '1px dashed var(--ac-border)' }}>
                <FiUser size={32} color="var(--ac-text-secondary)" style={{ marginBottom: 8 }} />
                <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ac-text-secondary)', fontWeight: 500 }}>
                  Select a student from the dropdown above to view their ML career outcome prediction.
                </p>
              </div>
            )}
          </div>

          {/* ================================================== */}
          {/* SECTION 3: CAREER ANALYTICS                       */}
          {/* ================================================== */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ac-text-primary)', borderBottom: '1px solid var(--ac-border)', paddingBottom: 8, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiCpu color="var(--ac-brand)" /> Career Analytics
            </h2>

            {/* Row 1: Industry & Sector and Specialization Skills side-by-side */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 24, alignItems: 'start' }}>
              {/* Alumni Distribution / Industry & Sector Container */}
              <div
                ref={alumniDistributionRef}
                style={{
                  backgroundColor: 'var(--ac-bg-card)',
                  borderRadius: 12,
                  border: highlightedSection === 'alumni-distribution' ? '2px solid #1b62d4' : '1px solid var(--ac-border)',
                  boxShadow: highlightedSection === 'alumni-distribution' ? '0 0 16px rgba(27, 98, 212, 0.35)' : 'none',
                  padding: 24,
                  height: 'fit-content',
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', marginBottom: 16 }}>
                  Alumni Distribution & Sector Breakdown
                </h3>
                {sectorList.length === 0 ? (
                  <p style={{ color: 'var(--ac-text-secondary)', margin: 0 }}>No career sector data available</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {sectorList.map((sec, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: 'var(--ac-text-primary)', marginBottom: 4 }}>
                          <span>{sec.sector}</span>
                          <span style={{ color: 'var(--ac-brand)' }}>{sec.count} Alumni ({sec.percentage}%)</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--ac-bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${sec.percentage}%`, background: 'var(--ac-brand)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skill Analytics Container */}
              <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 24, height: 'fit-content' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', margin: 0 }}>
                    Professional Specialization Skills
                  </h3>
                  {skillAnalytics.length > 5 && (
                    <Button type="link" style={{ padding: 0, height: 'auto', fontWeight: 600 }} onClick={() => setIsSkillsModalOpen(true)}>
                      View All Skills ({skillAnalytics.length}) →
                    </Button>
                  )}
                </div>
                {skillAnalytics.length === 0 ? (
                  <p style={{ color: 'var(--ac-text-secondary)', margin: 0 }}>No skill placement data available</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {skillAnalytics.slice(0, 5).map((sk, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: 'var(--ac-text-primary)', marginBottom: 4 }}>
                          <span>{sk.skill}</span>
                          <span style={{ color: '#16a34a' }}>{sk.placementRate}% ({sk.placedCount}/{sk.studentCount} Placed)</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--ac-bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${sk.placementRate}%`, background: '#16a34a' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Insights & Trend Card */}
            <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 12, border: '1px solid var(--ac-border)', padding: 24 }}>
              <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ac-text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiCpu color="var(--ac-brand)" /> AI Insights & Trend Analysis
              </h3>
              {aiInsights.length === 0 ? (
                <p style={{ color: 'var(--ac-text-secondary)', margin: 0 }}>No AI insights generated yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {aiInsights.map((insight, idx) => (
                    <div key={idx} style={{ background: 'var(--ac-bg-input)', padding: 14, borderRadius: 8, borderLeft: '4px solid var(--ac-brand)' }}>
                      <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ac-text-primary)', fontWeight: 600, lineHeight: 1.5 }}>
                        {insight.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* View All Skills Dialog Modal */}
      <Modal
        title={`All Professional Specialization Skills (${skillAnalytics.length})`}
        open={isSkillsModalOpen}
        onCancel={() => setIsSkillsModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsSkillsModalOpen(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        <div style={{ maxHeight: 400, overflowY: 'auto', paddingRight: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {skillAnalytics.map((sk, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: 'var(--ac-text-primary)', marginBottom: 4 }}>
                  <span>{sk.skill}</span>
                  <span style={{ color: '#16a34a' }}>{sk.placementRate}% ({sk.placedCount}/{sk.studentCount} Placed)</span>
                </div>
                <div style={{ height: 6, background: 'var(--ac-bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${sk.placementRate}%`, background: '#16a34a' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};
