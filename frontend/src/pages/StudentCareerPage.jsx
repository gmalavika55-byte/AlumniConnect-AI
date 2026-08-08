import React, { useState } from 'react';
import { message, Progress, Modal } from 'antd';
import { FiBriefcase, FiTrendingUp, FiMap, FiDownload, FiCompass, FiZap } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';
import { StudentLayout } from '../components/student/StudentLayout';
import styles from './StudentCareerPage.module.css';

export const StudentCareerPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    {
      id: 1,
      title: 'Software Developer',
      company: 'TCS Digital',
      match: '94%',
      type: 'Full-time',
      location: 'Bangalore / Remote',
      salary: '₹9.0 - ₹12.0 LPA',
      skillsReq: ['React.js', 'Data Structures', 'REST APIs', 'SQL']
    },
    {
      id: 2,
      title: 'ML Engineering Intern',
      company: 'Zoho Corp',
      match: '88%',
      type: 'Internship',
      location: 'Chennai',
      stipend: '₹35,000 / month',
      skillsReq: ['Python', 'TensorFlow', 'PyTorch', 'NLP']
    },
    {
      id: 3,
      title: 'Backend Systems Engineer',
      company: 'Freshworks',
      match: '82%',
      type: 'Full-time',
      location: 'Chennai / Hyderabad',
      salary: '₹14.0 - ₹18.0 LPA',
      skillsReq: ['Node.js', 'Go', 'System Design', 'Redis', 'PostgreSQL']
    }
  ];

  const skillGaps = [
    { skill: 'React & Frontend Architecture', score: 90, label: 'Mastered' },
    { skill: 'Data Structures & Algorithms', score: 85, label: 'Strong' },
    { skill: 'System Design & Scalability', score: 60, label: 'In Progress (Gap)' },
    { skill: 'Cloud & Kubernetes Deployment', score: 40, label: 'Needs Focus (Gap)' }
  ];

  const roadmapSteps = [
    { phase: 'Phase 1', title: 'Data Structures & OS Fundamentals', desc: 'Master Array, Tree, Graph algorithms and OS Concurrency.' },
    { phase: 'Phase 2', title: 'Full Stack React & Node Architecture', desc: 'Build 2 full-stack projects using React, Node.js & PostgreSQL.' },
    { phase: 'Phase 3', title: 'System Design & Cloud Microservices', desc: 'Learn Caching, Load Balancing, Docker & AWS Deployment.' }
  ];

  const companies = ['Google India', 'Microsoft', 'Stripe', 'TCS Digital', 'Zoho Corp', 'Freshworks'];

  return (
    <StudentLayout>
      <div className={styles.headerBar}>
        <div>
          <h1 className={styles.pageTitle}>Career Intelligence & AI Recommendations</h1>
          <p className={styles.pageSub}>Explore AI-matched career paths, skill gaps, and hiring partners.</p>
        </div>
      </div>

      <div className={styles.careerGrid}>
        {/* Left Column */}
        <div>
          {/* AI Career Recommendations */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <FiZap style={{ color: '#1b62d4' }} /> Recommended Roles & Opportunities
              </h3>
            </div>
            {jobs.map(job => (
              <div key={job.id} className={styles.jobItem}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h4 className={styles.jobTitle}>{job.title}</h4>
                    <span className={styles.matchPill}>{job.match} AI MATCH</span>
                  </div>
                  <div className={styles.jobCompany}>
                    {job.company} • {job.location} ({job.type})
                  </div>
                </div>
                <button
                  className={styles.primaryBtn}
                  onClick={() => setSelectedJob(job)}
                >
                  Explore Opportunity
                </button>
              </div>
            ))}
          </div>

          {/* Learning Roadmap */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <FiMap style={{ color: '#1b62d4' }} /> Personalized Career Roadmap
              </h3>
              <button
                className={styles.secondaryBtn}
                onClick={() => message.info('Opening interactive Learning Roadmap viewer...')}
              >
                View Full Roadmap
              </button>
            </div>
            <div className={styles.roadmapList}>
              {roadmapSteps.map((step, idx) => (
                <div key={idx} className={styles.roadmapStep}>
                  <h4 className={styles.stepTitle}>{step.phase}: {step.title}</h4>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Partners */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <FaBuilding style={{ color: '#1b62d4' }} /> Active Hiring Companies
              </h3>
            </div>
            <div className={styles.companyGrid}>
              {companies.map((c, i) => (
                <div key={i} className={styles.companyBox}>
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Skill Gap Analysis */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <FiTrendingUp style={{ color: '#1b62d4' }} /> Skill Gap Analysis
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {skillGaps.map((item, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    <span>{item.skill}</span>
                    <span>{item.score}%</span>
                  </div>
                  <Progress percent={item.score} showInfo={false} strokeColor={item.score > 70 ? '#1b62d4' : '#eab308'} />
                </div>
              ))}
            </div>
            <button
              className={styles.primaryBtn}
              style={{ width: '100%', marginTop: 20 }}
              onClick={() => message.info('Redirecting to Skill Enhancement Courses...')}
            >
              Update & Bridge Skills
            </button>
          </div>

          {/* Quick Actions Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <FiCompass style={{ color: '#1b62d4' }} /> Quick Actions
              </h3>
            </div>
            <div className={styles.quickActionsGrid}>
              <div className={styles.actionCardBtn} onClick={() => message.info('Exploring new career paths...')}>
                EXPLORE PATHS
              </div>
              <div className={styles.actionCardBtn} onClick={() => message.info('Generating career roadmap report...')}>
                VIEW ROADMAP
              </div>
              <div className={styles.actionCardBtn} onClick={() => message.info('Opening skill update portal...')}>
                UPDATE SKILLS
              </div>
              <div className={styles.actionCardBtn} onClick={() => message.success('Career Insights Report PDF downloaded!')}>
                DOWNLOAD REPORT
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunity Details Modal */}
      {selectedJob && (
        <Modal
          title={`${selectedJob.title} at ${selectedJob.company}`}
          open={!!selectedJob}
          onCancel={() => setSelectedJob(null)}
          footer={[
            <button key="cancel" className={styles.secondaryBtn} onClick={() => setSelectedJob(null)}>
              Close
            </button>,
            <button
              key="apply"
              className={styles.primaryBtn}
              onClick={() => {
                message.success(`Application submitted for ${selectedJob.title} at ${selectedJob.company}!`);
                setSelectedJob(null);
              }}
            >
              Apply via Alumni Referral
            </button>
          ]}
        >
          <p><strong>Location:</strong> {selectedJob.location}</p>
          <p><strong>Type:</strong> {selectedJob.type}</p>
          <p><strong>Compensation:</strong> {selectedJob.salary || selectedJob.stipend}</p>
          <p><strong>Required Skills:</strong></p>
          <ul>
            {selectedJob.skillsReq.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </Modal>
      )}
    </StudentLayout>
  );
};
