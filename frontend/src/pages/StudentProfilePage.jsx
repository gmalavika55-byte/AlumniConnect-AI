import { useEffect } from 'react';
import { authService } from '../services/authService';
import React, { useState, useRef } from 'react';
import { message } from 'antd';
import api from "../services/api";
import {
  FiEdit2,
  FiUpload,
  FiPlus,
  FiBookOpen,
  FiUser,
  FiLink,
  FiAward,
  FiFileText,
  FiExternalLink,
  FiCheckCircle,
  FiBriefcase
} from 'react-icons/fi';
import { StudentLayout } from '../components/student/StudentLayout';
import { AddSkillModal } from '../components/student/AddSkillModal';
import { AddCertificateModal } from '../components/student/AddCertificateModal';
import { EditProfileModal } from '../components/student/EditProfileModal';
import styles from './StudentProfilePage.module.css';

export const StudentProfilePage = () => {
  const fileInputRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAddCertOpen, setIsAddCertOpen] = useState(false);
const student = authService.getCurrentUser();
console.log("Student from localStorage:", student);
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
  resumeSize: ''
});
useEffect(() => {
  if (student) {
    setProfile({
      fullName: student.name,
      registerNumber: student.registerNo,
      email: student.email,
      phone: student.mobile,
      department: student.department,
      semester: student.yearOfStudy
        ? `Year ${student.yearOfStudy}`
        : '',
      cgpa: student.cgpa || '',
college: 'Karpagam College of Engineering',
bio: student.careerGoal || '',
linkedin: student.linkedin || '',
github: student.github || '',
portfolio: student.portfolio || '',
resumeName: student.resumeName || '',
resumeSize: ''
    });
    api.get(`/certificate/student/${student.studentId}`)
.then((res) => {
    setCertificates(res.data);
})
.catch((err) => console.log(err));
setSkills(
  student.skills
    ? student.skills.split(",").map(skill => ({
        name: skill.trim(),
        proficiency: ""
      }))
    : []
);
  }
}, []);

 const [skills, setSkills] = useState([]);

 const [certificates, setCertificates] = useState([]);

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({
        ...prev,
        resumeName: file.name,
        resumeSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      }));
      message.success(`Resume "${file.name}" uploaded successfully!`);
    }
  };

  const handleAddSkill = (newSkill) => {
    setSkills(prev => [...prev, newSkill]);
  };

  const handleAddCertificate = (newCert) => {
    setCertificates(prev => [...prev, newCert]);
  };

  const handleSaveProfile = (updatedValues) => {
    setProfile(prev => ({ ...prev, ...updatedValues }));
  };

  return (
    <StudentLayout>
      {/* Hidden File Input for Resume Upload */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx"
        onChange={handleResumeUpload}
      />

      {/* Header Profile Cover Card */}
      <div className={styles.profileHeaderCard}>
        <div className={styles.coverBanner} />
        <div className={styles.profileHeaderContent}>
          <div className={styles.avatarWrapper}>
           <div className={styles.avatarCircle}>
  {profile.fullName
    ?.split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()}
</div>
            <div>
              <h1 className={styles.profileName}>{profile.fullName}</h1>
              <p className={styles.profileSub}>{profile.department} • {profile.semester}</p>
            </div>
          </div>

          <div className={styles.actionBtnGroup}>
            <button className={styles.editBtn} onClick={() => setIsEditModalOpen(true)}>
              <FiEdit2 /> Edit Profile
            </button>
            <button className={styles.uploadResumeBtn} onClick={() => fileInputRef.current?.click()}>
              <FiUpload /> Upload Resume
            </button>
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
                <span className={styles.infoVal}>{profile.registerNumber}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Institution</span>
                <span className={styles.infoVal}>{profile.college}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Department</span>
                <span className={styles.infoVal}>{profile.department}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Current CGPA</span>
              <span className={styles.infoVal}>
  {profile.cgpa || "-"}
</span>
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
                <span className={styles.infoVal}>{profile.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Mobile Number</span>
                <span className={styles.infoVal}>{profile.phone}</span>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <span className={styles.infoLabel}>About / Bio</span>
              <p style={{ margin: '4px 0 0 0', fontSize: 13.5, color: '#334155', lineHeight: 1.5 }}>
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <FiBriefcase style={{ color: '#1b62d4' }} /> Skills & Technical Expertise
              </h3>
              <button className={styles.addBtnSmall} onClick={() => setIsAddSkillOpen(true)}>
                <FiPlus /> Add Skill
              </button>
            </div>
            <div className={styles.skillPills}>
              {skills.map((skill, index) => (
                <div key={index} className={styles.skillBadge}>
                  <span>{skill.name}</span>
                  <span className={styles.profTag}>{skill.proficiency}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Section */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <FiAward style={{ color: '#1b62d4' }} /> Certificates & Certifications
              </h3>
              <button className={styles.addBtnSmall} onClick={() => setIsAddCertOpen(true)}>
                <FiPlus /> Add Certificate
              </button>
            </div>
            <div className={styles.certList}>
              {certificates.map((cert) => (
  <div key={cert.certificateId} className={styles.certItem}>
    <div>
      <h4
        style={{
          margin: 0,
          fontSize: 14,
          color: "#0f1e36"
        }}
      >
        {cert.certificateName}
      </h4>

      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: "#64748b"
        }}
      >
        {cert.organization} • Issued {cert.issueDate}
      </p>
    </div>

    <a
      href={cert.certificateUrl}
      target="_blank"
      rel="noreferrer"
      style={{ color: "#1b62d4" }}
    >
      <FiExternalLink />
    </a>
  </div>
))}
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

    {/* LinkedIn */}
    <div className={styles.infoItem}>
      <span className={styles.infoLabel}>LinkedIn</span>

      {profile.linkedin ? (
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className={styles.infoVal}
          style={{ color: '#1b62d4' }}
        >
          {profile.linkedin}
        </a>
      ) : (
        <span className={styles.infoVal}>-</span>
      )}
    </div>

    {/* GitHub */}
    <div className={styles.infoItem}>
      <span className={styles.infoLabel}>GitHub</span>

      {profile.github ? (
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className={styles.infoVal}
          style={{ color: '#1b62d4' }}
        >
          {profile.github}
        </a>
      ) : (
        <span className={styles.infoVal}>-</span>
      )}
    </div>

    {/* Portfolio */}
    <div className={styles.infoItem}>
      <span className={styles.infoLabel}>Portfolio</span>

      {profile.portfolio ? (
        <a
          href={profile.portfolio}
          target="_blank"
          rel="noreferrer"
          className={styles.infoVal}
          style={{ color: '#1b62d4' }}
        >
          {profile.portfolio}
        </a>
      ) : (
        <span className={styles.infoVal}>-</span>
      )}
    </div>

  </div>
</div>

          {/* Resume Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <FiFileText style={{ color: '#1b62d4' }} /> Primary Resume
              </h3>
            </div>
            <div className={styles.resumeBox}>
              <div>
                <h4>
  {profile.resumeName ? (
    <a
      href={student.resumeUrl}
      target="_blank"
      rel="noreferrer"
      style={{ color: "#1b62d4" }}
    >
      {profile.resumeName}
    </a>
  ) : (
    "No Resume Uploaded"
  )}
</h4>
                <span style={{ fontSize: 11, color: '#64748b' }}>{profile.resumeSize} • PDF</span>
              </div>
              <button
                className={styles.addBtnSmall}
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUpload /> Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Modals */}
      <EditProfileModal
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileData={profile}
        onSave={handleSaveProfile}
      />

      <AddSkillModal
        visible={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        onAddSkill={handleAddSkill}
      />

      <AddCertificateModal
        visible={isAddCertOpen}
        onClose={() => setIsAddCertOpen(false)}
        onAddCertificate={handleAddCertificate}
      />
    </StudentLayout>
  );
};
