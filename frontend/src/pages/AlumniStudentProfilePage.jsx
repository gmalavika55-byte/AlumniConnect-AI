import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
import {
  FiArrowLeft,
  FiBookOpen,
  FiUser,
  FiLink,
  FiAward,
  FiFileText,
  FiExternalLink,
  FiBriefcase
} from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import api from '../services/api';
import styles from './StudentProfilePage.module.css';

export const AlumniStudentProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: '',
    registerNumber: '',
    email: '',
    phone: '',
    department: '',
    semester: '',
    cgpa: '',
    college: 'Karpagam College of Engineering',
    bio: '',
    linkedin: '',
    github: '',
    portfolio: '',
    resumeName: '',
    resumeUrl: ''
  });
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const applyStudentData = (s) => {
    setProfile({
      fullName: s.name || '',
      registerNumber: s.registerNo || '',
      email: s.email || '',
      phone: s.mobile || '',
      department: s.department || '',
      semester: s.yearOfStudy ? `Year ${s.yearOfStudy}` : '',
      cgpa: s.cgpa || '',
      college: 'Karpagam College of Engineering',
      bio: s.careerGoal || '',
      linkedin: s.linkedin || '',
      github: s.github || '',
      portfolio: s.portfolio || '',
      resumeName: s.resumeName || '',
      resumeUrl: s.resumeUrl || ''
    });
    setSkills(
      s.skills
        ? s.skills.split(',').map(skill => ({ name: skill.trim(), proficiency: '' }))
        : []
    );
  };

  useEffect(() => {
    const studentIdToFetch = location.state?.student?.studentId || id;
    if (studentIdToFetch) {
      setLoading(true);
      api.get(`/student/get/${studentIdToFetch}`)
        .then(res => {
          if (res.data) {
            applyStudentData(res.data);
          }
        })
        .catch(err => console.error('Error loading student profile for alumni viewer:', err))
        .finally(() => setLoading(false));

      api.get(`/certificate/student/${studentIdToFetch}`)
        .then(res => setCertificates(res.data || []))
        .catch(err => console.error('Error loading certificates for alumni viewer:', err));
    } else {
      setLoading(false);
    }
  }, [id, location.state]);

  const openSafeResumeUrl = (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '' || url === '#') {
      message.warning('Resume link / document URL is not available.');
      return;
    }
    const trimmed = url.trim();
    const fullUrl = (trimmed.startsWith('http://') || trimmed.startsWith('https://'))
      ? trimmed
      : `https://${trimmed}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

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

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: 'var(--ac-text-secondary)' }}>Loading student profile...</p>
        </div>
      ) : (
        <>
          {/* Header Profile Cover Card (Matches StudentProfilePage) */}
          <div className={styles.profileHeaderCard}>
            <div className={styles.coverBanner} />
            <div className={styles.profileHeaderContent}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatarCircle}>
                  {profile.fullName
                    ?.split(" ")
                    .map(word => word.charAt(0))
                    .join("")
                    .toUpperCase() || 'S'}
                </div>
                <div>
                  <h1 className={styles.profileName}>{profile.fullName || 'Student Profile'}</h1>
                  <p className={styles.profileSub}>
                    {profile.department ? profile.department : 'Student'}
                    {profile.semester ? ` • ${profile.semester}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2 Column Main Profile Grid */}
          <div className={styles.grid2Col}>
            {/* Left Column */}
            <div>
              {/* Academic Information */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>
                    <FiBookOpen style={{ color: '#1b62d4' }} /> Academic Information
                  </h3>
                </div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Register Number</span>
                    <span className={styles.infoVal}>{profile.registerNumber || '-'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Institution</span>
                    <span className={styles.infoVal}>{profile.college}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Department</span>
                    <span className={styles.infoVal}>{profile.department || '-'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Current CGPA</span>
                    <span className={styles.infoVal}>{profile.cgpa || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>
                    <FiUser style={{ color: '#1b62d4' }} /> Personal Information
                  </h3>
                </div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email Address</span>
                    <span className={styles.infoVal}>{profile.email || '-'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Mobile Number</span>
                    <span className={styles.infoVal}>{profile.phone || '-'}</span>
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <span className={styles.infoLabel}>About / Bio</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: 13.5, color: '#334155', lineHeight: 1.5 }}>
                    {profile.bio || 'No bio provided.'}
                  </p>
                </div>
              </div>

              {/* Skills Section */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>
                    <FiBriefcase style={{ color: '#1b62d4' }} /> Skills & Technical Expertise
                  </h3>
                </div>
                <div className={styles.skillPills}>
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <div key={index} className={styles.skillBadge} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{skill.name}</span>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>No skills added.</span>
                  )}
                </div>
              </div>

              {/* Certifications Section */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>
                    <FiAward style={{ color: '#1b62d4' }} /> Certificates & Certifications
                  </h3>
                </div>
                <div className={styles.certList}>
                  {certificates.length > 0 ? (
                    certificates.map((cert) => (
                      <div key={cert.certificateId} className={styles.certItem}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: 14, color: "#0f1e36" }}>
                            {cert.certificateName}
                          </h4>
                          <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                            {cert.organization} • Issued {cert.issueDate}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {cert.certificateUrl && cert.certificateUrl !== '#' && (
                            <button
                              onClick={() => openSafeResumeUrl(cert.certificateUrl)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1b62d4', padding: 0, display: 'inline-flex', alignItems: 'center' }}
                              title="View Certificate"
                            >
                              <FiExternalLink size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>No certificates added.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Professional Links */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>
                    <FiLink style={{ color: '#1b62d4' }} /> Professional Links
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>LinkedIn</span>
                    {profile.linkedin ? (
                      <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noreferrer" className={styles.infoVal} style={{ color: '#1b62d4' }}>
                        {profile.linkedin}
                      </a>
                    ) : (
                      <span className={styles.infoVal}>-</span>
                    )}
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>GitHub</span>
                    {profile.github ? (
                      <a href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`} target="_blank" rel="noreferrer" className={styles.infoVal} style={{ color: '#1b62d4' }}>
                        {profile.github}
                      </a>
                    ) : (
                      <span className={styles.infoVal}>-</span>
                    )}
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Portfolio</span>
                    {profile.portfolio ? (
                      <a href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`} target="_blank" rel="noreferrer" className={styles.infoVal} style={{ color: '#1b62d4' }}>
                        {profile.portfolio}
                      </a>
                    ) : (
                      <span className={styles.infoVal}>-</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Primary Resume Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>
                    <FiFileText style={{ color: '#1b62d4' }} /> Primary Resume
                  </h3>
                </div>
                <div className={styles.resumeBox}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <h4 style={{ margin: 0, fontSize: 14, color: '#0f1e36' }}>
                      {profile.resumeName || profile.resumeUrl ? (
                        <span style={{ fontWeight: 700 }}>{profile.resumeName || 'Resume Document'}</span>
                      ) : (
                        <span style={{ color: '#64748b', fontStyle: 'italic' }}>No Resume Added</span>
                      )}
                    </h4>
                    <span style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block', wordBreak: 'break-all' }}>
                      {profile.resumeUrl ? profile.resumeUrl : 'No document link provided'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {profile.resumeUrl && (
                      <button
                        className={styles.addBtnSmall}
                        style={{ backgroundColor: '#1b62d4', color: '#ffffff', borderColor: '#1b62d4' }}
                        onClick={() => openSafeResumeUrl(profile.resumeUrl)}
                      >
                        <FiExternalLink /> View Resume
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AlumniLayout>
  );
};
