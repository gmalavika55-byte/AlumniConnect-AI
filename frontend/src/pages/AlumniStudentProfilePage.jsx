import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button, Tag, message } from 'antd';
import {
  FiArrowLeft, FiBookOpen, FiUser, FiBriefcase,
  FiAward, FiFileText, FiDownload, FiCheck, FiX, FiCheckCircle
} from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';

const STUDENT_MAP = {
  101: {
    id: 101,
    studentName: 'John Mathew',
    registerNumber: '21CS085',
    dept: 'Computer Science & Engineering',
    semester: 'Semester 5 (3rd Year)',
    cgpa: '8.85 / 10.0',
    college: 'Karpagam College of Engineering',
    email: 'john.mathew@student.kce.ac.in',
    phone: '+91 98765 43210',
    bio: 'Passionate computer science student specializing in React, System Design, and Machine Learning. Actively seeking mentorship and internship opportunities in big tech.',
    topic: 'System Design & Scalable Frontend Architecture',
    careerGoal: 'Aspiring Full Stack Engineer aiming for Big Tech interviews.',
    skills: ['React.js', 'System Design', 'Algorithms', 'Node.js', 'TypeScript', 'Data Structures'],
    certificates: [
      { name: 'AWS Certified Cloud Practitioner', org: 'Amazon Web Services', date: 'Jan 2026' },
      { name: 'Meta Front-End Developer Specialization', org: 'Coursera / Meta', date: 'Nov 2025' }
    ],
    resumeName: 'John_Mathew_Resume_2026.pdf',
    resumeSize: '1.2 MB'
  },
  102: {
    id: 102,
    studentName: 'Ananya Sharma',
    registerNumber: '21CS099',
    dept: 'Information Technology',
    semester: 'Semester 5 (3rd Year)',
    cgpa: '9.12 / 10.0',
    college: 'Karpagam College of Engineering',
    email: 'ananya.s@student.kce.ac.in',
    phone: '+91 98123 45678',
    bio: 'Top-ranking IT undergraduate specializing in Machine Learning, PyTorch, and Data Processing pipelines. Looking for research mentorship.',
    topic: 'Machine Learning Pipeline Optimization & PyTorch',
    careerGoal: 'Seeking guidance for AI/ML research internships and projects.',
    skills: ['Python', 'Machine Learning', 'PyTorch', 'Data Structures', 'SQL', 'Scikit-learn'],
    certificates: [
      { name: 'Deep Learning Specialization', org: 'DeepLearning.AI', date: 'Feb 2026' }
    ],
    resumeName: 'Ananya_Sharma_CV_2026.pdf',
    resumeSize: '1.1 MB'
  }
};

export const AlumniStudentProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const studentFromState = location.state?.student;
  const studentStatic = STUDENT_MAP[parseInt(id, 10)];
  const student = (studentStatic && { ...studentFromState, ...studentStatic }) || studentFromState || STUDENT_MAP[101];

  return (
    <AlumniLayout>
      {/* Back Button */}
      <button
        onClick={() => navigate('/alumni/mentorship')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'none',
          border: 'none',
          color: '#1b62d4',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0,
          marginBottom: 20
        }}
      >
        <FiArrowLeft size={16} /> Back to Mentorship Requests
      </button>

      {/* Header Profile Hero */}
      <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', overflow: 'hidden', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ height: 140, background: 'linear-gradient(135deg, #071330 0%, #1b62d4 100%)' }} />
        <div style={{ padding: '0 28px 24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -44 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
            <div style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              backgroundColor: '#071330',
              border: '4px solid #ffffff',
              color: '#ffffff',
              fontSize: 32,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {student.studentName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 4px 0' }}>{student.studentName}</h1>
              <p style={{ fontSize: 13.5, color: 'var(--ac-text-secondary)', margin: 0 }}>
                {student.registerNumber} • {student.dept} ({student.semester})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Button
              type="primary"
              icon={<FiCheck />}
              style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', borderRadius: 8, fontWeight: 600, height: 40 }}
              onClick={() => message.success(`Mentorship request accepted for ${student.studentName}!`)}
            >
              Accept Mentorship
            </Button>
            <Button
              type="primary"
              danger
              icon={<FiX />}
              style={{ borderRadius: 8, fontWeight: 600, height: 40 }}
              onClick={() => message.info(`Request from ${student.studentName} declined.`)}
            >
              Decline
            </Button>
          </div>
        </div>
      </div>

      {/* 2 Column Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
        {/* LEFT COLUMN */}
        <div>
          {/* Academic Information */}
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiBookOpen color="#1b62d4" /> Academic Profile & Performance
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Register Number</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{student.registerNumber}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Current CGPA</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 700, color: '#059669' }}>{student.cgpa}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Department</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{student.dept}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Academic Batch</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{student.semester}</p>
              </div>
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--ac-border)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Student Bio</span>
              <p style={{ margin: '4px 0 0 0', fontSize: 13.5, color: 'var(--ac-text-secondary)', lineHeight: 1.6 }}>{student.bio}</p>
            </div>
          </div>

          {/* Requested Mentorship Goal */}
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiBriefcase color="#1b62d4" /> Mentorship Goals & Requested Topic
            </h3>

            <div style={{ padding: 14, backgroundColor: 'var(--ac-bg-input)', borderRadius: 10, border: '1px solid #f1f5f9', marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Requested Session Topic</span>
              <p style={{ margin: '2px 0 0 0', fontSize: 14, fontWeight: 700, color: 'var(--ac-text-primary)' }}>{student.topic}</p>
            </div>

            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Career Goal & Expectations</span>
              <p style={{ margin: '4px 0 0 0', fontSize: 13.5, color: 'var(--ac-text-secondary)', lineHeight: 1.6 }}>{student.careerGoal}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Skills Badges */}
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiAward color="#1b62d4" /> Technical Skills
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {student.skills?.map((skill, idx) => (
                <Tag key={idx} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, backgroundColor: 'var(--ac-bg-input)', color: 'var(--ac-text-primary)' }}>
                  {skill}
                </Tag>
              ))}
            </div>
          </div>

          {/* Primary Resume Box */}
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiFileText color="#1b62d4" /> Attached Resume
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--ac-bg-input)', border: '1px dashed #cbd5e1', borderRadius: 12, padding: 16 }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 13.5, color: 'var(--ac-text-primary)' }}>{student.resumeName}</h4>
                <span style={{ fontSize: 11, color: 'var(--ac-text-secondary)' }}>{student.resumeSize} • PDF</span>
              </div>
              <Button
                type="primary"
                icon={<FiDownload />}
                size="small"
                style={{ backgroundColor: '#1b62d4' }}
                onClick={() => message.success(`Downloading ${student.resumeName}...`)}
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AlumniLayout>
  );
};
