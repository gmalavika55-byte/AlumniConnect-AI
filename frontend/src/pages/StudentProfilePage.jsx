import { useEffect } from 'react';
import { authService } from '../services/authService';
import React, { useState, useRef } from 'react';
import { message, Modal, Input, Button } from 'antd';
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
  FiBriefcase,
  FiTrash2
} from 'react-icons/fi';
import { StudentLayout } from '../components/student/StudentLayout';
import { AddSkillModal } from '../components/student/AddSkillModal';
import { AddCertificateModal } from '../components/student/AddCertificateModal';
import { EditCertificateModal } from '../components/student/EditCertificateModal';
import { EditProfileModal } from '../components/student/EditProfileModal';
import styles from './StudentProfilePage.module.css';

export const StudentProfilePage = () => {
  const fileInputRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAddCertOpen, setIsAddCertOpen] = useState(false);
  const student = authService.getCurrentUser();
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
    resumeUrl: '',
    resumeSize: ''
  });

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
      resumeUrl: s.resumeUrl || '',
      resumeSize: ''
    });
    setSkills(
      s.skills
        ? s.skills.split(',').map(skill => ({ name: skill.trim(), proficiency: '' }))
        : []
    );
  };

  useEffect(() => {
    if (student) {
      applyStudentData(student);
      api.get(`/certificate/student/${student.studentId}`)
        .then(res => setCertificates(res.data || []))
        .catch(err => console.error('Error loading certificates:', err));
      api.get(`/student/get/${student.studentId}`)
        .then(res => {
          const fresh = res.data;
          if (fresh) {
            applyStudentData(fresh);
            localStorage.setItem('alumni_user_data', JSON.stringify({
              ...fresh,
              role: student.role
            }));
          }
        })
        .catch(err => console.error('Error fetching fresh student profile:', err));
    }
  }, []);

  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [isEditSkillOpen, setIsEditSkillOpen] = useState(false);
  const [editingSkillIndex, setEditingSkillIndex] = useState(null);
  const [editingSkillName, setEditingSkillName] = useState('');
  const [isEditCertOpen, setIsEditCertOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  const fetchFreshProfile = async () => {
    if (student) {
      try {
        const res = await api.get(`/student/get/${student.studentId}`);
        const fresh = res.data;
        if (fresh) {
          applyStudentData(fresh);
          localStorage.setItem('alumni_user_data', JSON.stringify({
            ...fresh,
            role: student.role
          }));
        }
      } catch (err) {
        console.error('Error fetching fresh profile:', err);
      }
    }
  };

  const fetchCertificates = async () => {
    if (student) {
      try {
        const res = await api.get(`/certificate/student/${student.studentId}`);
        setCertificates(res.data || []);
      } catch (err) {
        console.error('Error fetching certificates:', err);
      }
    }
  };

  const openSafeResumeUrl = async (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '' || url === '#') {
      message.warning('Document URL is not available.');
      return;
    }
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      window.open(trimmed, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      message.loading('Retrieving document...');
      const response = await api.get(trimmed, { responseType: 'blob' });
      const contentType = response.headers['content-type'] || 'application/pdf';
      const disposition = response.headers['content-disposition'] || '';

      const blob = new Blob([response.data], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      if (disposition.includes('attachment') || contentType.includes('msword') || contentType.includes('wordprocessingml')) {
        let filename = 'document';
        const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(blobUrl, '_blank');
      }
    } catch (err) {
      console.error('Error retrieving document:', err);
      if (err.response?.status === 404) {
        message.error('Document file not found on server.');
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        message.error('Unauthorized access to document.');
      } else {
        message.error('Failed to retrieve document.');
      }
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !student) return;

    if (file.size > 5 * 1024 * 1024) {
      message.error('File size exceeds maximum limit of 5 MB.');
      return;
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.doc') && !name.endsWith('.docx')) {
      message.error('Invalid file format. Only PDF, DOC, and DOCX files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      message.loading('Uploading resume...');
      const res = await api.post(`/student/${student.studentId}/resume/upload`, formData);
      message.success(`Resume "${file.name}" uploaded successfully!`);
      await fetchFreshProfile();
    } catch (err) {
      console.error('Resume upload error:', err);
      const errMsg = typeof err.response?.data === 'string'
        ? err.response.data
        : (err.response?.data?.message || 'Failed to upload resume file.');
      message.error(errMsg);
    }
  };

  const handleDeleteResume = () => {
    Modal.confirm({
      title: 'Remove Primary Resume?',
      content: 'Are you sure you want to delete your saved resume details from your profile?',
      okText: 'Remove Resume',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        if (!student || !student.studentId) return;

        try {
          const profileRes = await api.get(`/student/get/${student.studentId}`);
          const freshStudent = profileRes.data;
          const updatedStudent = {
            ...freshStudent,
            resumeName: '',
            resumeUrl: ''
          };
          const res = await api.put('/student/update', updatedStudent);
          const savedUser = res.data;

          localStorage.setItem('alumni_user_data', JSON.stringify({
            ...savedUser,
            role: student.role
          }));

          setProfile(prev => ({
            ...prev,
            resumeName: '',
            resumeUrl: ''
          }));

          message.success('Resume removed successfully!');
        } catch (err) {
          console.error('Error deleting resume:', err);
          message.error('Failed to remove resume from profile.');
        }
      }
    });
  };

  const handleAddSkill = async (newSkill) => {
    if (student) {
      try {
        const profileRes = await api.get(`/student/get/${student.studentId}`);
        const freshStudent = profileRes.data;
        const currentSkills = freshStudent.skills
          ? freshStudent.skills.split(',').map(s => s.trim()).filter(Boolean)
          : [];

        const targetName = newSkill.name.trim();
        if (currentSkills.some(s => s.toLowerCase() === targetName.toLowerCase())) {
          message.warning(`Skill "${targetName}" already exists.`);
          return;
        }

        const updatedSkillsList = [...currentSkills, targetName];
        const skillsStr = updatedSkillsList.join(',');
        const updatedStudent = { ...freshStudent, skills: skillsStr };
        await api.put('/student/update', updatedStudent);
        message.success(`Skill "${targetName}" added successfully!`);
        await fetchFreshProfile();
      } catch (err) {
        console.error('Error persisting skill to backend:', err);
        message.error("Failed to add skill.");
      }
    }
  };

  const handleEditSkill = async (index, newName) => {
    if (!newName || !newName.trim()) {
      message.error("Skill name cannot be empty.");
      return;
    }
    if (student) {
      try {
        const profileRes = await api.get(`/student/get/${student.studentId}`);
        const freshStudent = profileRes.data;
        const currentSkills = freshStudent.skills
          ? freshStudent.skills.split(',').map(s => s.trim()).filter(Boolean)
          : [];

        if (index < 0 || index >= currentSkills.length) {
          message.error("Invalid skill selection.");
          return;
        }

        const targetName = newName.trim();
        if (currentSkills.some((s, idx) => idx !== index && s.toLowerCase() === targetName.toLowerCase())) {
          message.warning(`Skill "${targetName}" already exists.`);
          return;
        }

        currentSkills[index] = targetName;
        const skillsStr = currentSkills.join(',');
        const updatedStudent = { ...freshStudent, skills: skillsStr };
        await api.put('/student/update', updatedStudent);
        message.success("Skill updated successfully!");
        await fetchFreshProfile();
      } catch (err) {
        console.error('Error persisting updated skill to backend:', err);
        message.error("Failed to update skill.");
      }
    }
  };

  const handleDeleteSkill = async (index) => {
    if (student) {
      try {
        const profileRes = await api.get(`/student/get/${student.studentId}`);
        const freshStudent = profileRes.data;
        const currentSkills = freshStudent.skills
          ? freshStudent.skills.split(',').map(s => s.trim()).filter(Boolean)
          : [];

        if (index < 0 || index >= currentSkills.length) {
          message.error("Invalid skill selection.");
          return;
        }

        const removedSkill = currentSkills[index];
        const updatedSkillsList = currentSkills.filter((_, i) => i !== index);
        const skillsStr = updatedSkillsList.join(',');
        const updatedStudent = { ...freshStudent, skills: skillsStr };
        await api.put('/student/update', updatedStudent);
        message.success(`Skill "${removedSkill}" deleted successfully!`);
        await fetchFreshProfile();
      } catch (err) {
        console.error('Error deleting skill from backend:', err);
        message.error("Failed to delete skill.");
      }
    }
  };

  const handleAddCertificate = async (newCert) => {
    if (!student) return;
    try {
      if (newCert.file) {
        const formData = new FormData();
        formData.append('studentId', student.studentId);
        formData.append('certificateName', newCert.name);
        formData.append('organization', newCert.organization);
        formData.append('issueDate', newCert.issueDate);
        if (newCert.url) formData.append('url', newCert.url);
        formData.append('file', newCert.file);

        await api.post('/certificate/upload', formData);
      } else {
        const payload = {
          studentId: student.studentId,
          certificateName: newCert.name,
          organization: newCert.organization,
          issueDate: newCert.issueDate,
          certificateUrl: newCert.url || '#'
        };
        await api.post('/certificate/add', payload);
      }
      message.success(`Certificate "${newCert.name}" added successfully!`);
      await fetchCertificates();
    } catch (err) {
      console.error('Error adding certificate to backend:', err);
      message.error('Failed to save certificate to backend.');
    }
  };

  const handleUpdateCertificate = async (updatedCert) => {
    if (!student) return;
    try {
      await api.put('/certificate/update', updatedCert);
      message.success(`Certificate "${updatedCert.certificateName}" updated successfully!`);
      await fetchCertificates();
    } catch (err) {
      console.error('Error updating certificate:', err);
      message.error('Failed to update certificate.');
    }
  };

  const handleDeleteCertificate = async (certificateId) => {
    if (!student) return;
    try {
      await api.delete(`/certificate/delete/${certificateId}`);
      message.success('Certificate deleted successfully!');
      await fetchCertificates();
    } catch (err) {
      console.error('Error deleting certificate:', err);
      message.error('Failed to delete certificate.');
    }
  };

  const handleNavigateCertificate = (cert) => {
    openSafeResumeUrl(cert.certificateUrl);
  };

  const handleSaveProfile = async (updatedValues) => {
    if (!student) return;

    const updatedStudent = {
      ...student,
      name: updatedValues.fullName || student.name,
      email: updatedValues.email || student.email,
      registerNo: updatedValues.registerNumber || student.registerNo,
      mobile: updatedValues.phone || student.mobile,
      department: updatedValues.department || student.department,
      careerGoal: updatedValues.bio || student.careerGoal,
      linkedin: updatedValues.linkedin || student.linkedin,
      github: updatedValues.github || student.github,
      portfolio: updatedValues.portfolio || student.portfolio,
      yearOfStudy: updatedValues.semester ? parseInt(updatedValues.semester.replace(/\D/g, '')) : student.yearOfStudy,
      cgpa: updatedValues.cgpa || student.cgpa,
      resumeName: updatedValues.resumeName !== undefined ? updatedValues.resumeName : student.resumeName,
      resumeUrl: updatedValues.resumeUrl !== undefined ? updatedValues.resumeUrl : student.resumeUrl
    };

    try {
      const res = await api.put('/student/update', updatedStudent);
      const savedUser = res.data;
      localStorage.setItem('alumni_user_data', JSON.stringify({
        ...savedUser,
        role: student.role
      }));
      setProfile(prev => ({
        ...prev,
        fullName: savedUser.name,
        registerNumber: savedUser.registerNo,
        email: savedUser.email,
        phone: savedUser.mobile,
        department: savedUser.department,
        semester: savedUser.yearOfStudy ? `Year ${savedUser.yearOfStudy}` : '',
        cgpa: savedUser.cgpa || '',
        bio: savedUser.careerGoal || '',
        linkedin: savedUser.linkedin || '',
        github: savedUser.github || '',
        portfolio: savedUser.portfolio || '',
        resumeName: savedUser.resumeName || '',
        resumeUrl: savedUser.resumeUrl || ''
      }));
      setSkills(
        savedUser.skills
          ? savedUser.skills.split(',').map(s => ({ name: s.trim(), proficiency: '' }))
          : []
      );
      message.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating student profile:', err);
      message.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <StudentLayout>
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
              <FiUpload /> {profile.resumeName || profile.resumeUrl ? 'Upload / Change Resume' : 'Upload Resume File'}
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
                <span className={styles.infoVal}>{profile.cgpa || "-"}</span>
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
                <div key={index} className={styles.skillBadge} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{skill.name}</span>
                  <span className={styles.profTag}>{skill.proficiency}</span>
                  <button 
                    onClick={() => {
                      setEditingSkillIndex(index);
                      setEditingSkillName(skill.name);
                      setIsEditSkillOpen(true);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1b62d4', padding: '0 2px', display: 'inline-flex', alignItems: 'center' }}
                    title="Edit Skill"
                  >
                    <FiEdit2 size={12} />
                  </button>
                  <button 
                    onClick={() => {
                      Modal.confirm({
                        title: 'Are you sure you want to delete this skill?',
                        content: `This will remove "${skill.name}" from your profile.`,
                        okText: 'Delete',
                        okType: 'danger',
                        cancelText: 'Cancel',
                        onOk() {
                          handleDeleteSkill(index);
                        }
                      });
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0 2px', display: 'inline-flex', alignItems: 'center' }}
                    title="Delete Skill"
                  >
                    <FiTrash2 size={12} />
                  </button>
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
                    <h4 style={{ margin: 0, fontSize: 14, color: "#0f1e36" }}>
                      {cert.certificateName}
                    </h4>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                      {cert.organization} • Issued {cert.issueDate}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                      onClick={() => handleNavigateCertificate(cert)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1b62d4', padding: 0, display: 'inline-flex', alignItems: 'center' }}
                      title="View Certificate"
                    >
                      <FiExternalLink size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedCert(cert);
                        setIsEditCertOpen(true);
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1b62d4', padding: 0, display: 'inline-flex', alignItems: 'center' }}
                      title="Edit Certificate"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        Modal.confirm({
                          title: 'Are you sure you want to delete this certificate?',
                          content: `This will permanently remove "${cert.certificateName}" from your profile.`,
                          okText: 'Delete',
                          okType: 'danger',
                          cancelText: 'Cancel',
                          onOk() {
                            handleDeleteCertificate(cert.certificateId);
                          }
                        });
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0, display: 'inline-flex', alignItems: 'center' }}
                      title="Delete Certificate"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 12, padding: 16, gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <h4 style={{ margin: 0, fontSize: 14, color: '#0f1e36' }}>
                  {profile.resumeName || profile.resumeUrl ? (
                    <span style={{ fontWeight: 700 }}>{profile.resumeName || 'Resume Document'}</span>
                  ) : (
                    <span style={{ color: '#64748b', fontStyle: 'italic' }}>No Resume Added</span>
                  )}
                </h4>
                <span style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block', wordBreak: 'break-all' }}>
                  {profile.resumeUrl ? profile.resumeUrl : 'No document uploaded yet'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {profile.resumeName || profile.resumeUrl ? (
                  <>
                    {profile.resumeUrl && (
                      <Button
                        icon={<FiExternalLink />}
                        type="primary"
                        size="small"
                        style={{ fontWeight: 600, backgroundColor: '#1b62d4', borderColor: '#1b62d4' }}
                        onClick={() => openSafeResumeUrl(profile.resumeUrl)}
                      >
                        View Resume
                      </Button>
                    )}
                    <Button
                      icon={<FiUpload />}
                      size="small"
                      style={{ fontWeight: 600 }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Replace File
                    </Button>
                    <Button
                      icon={<FiTrash2 />}
                      danger
                      size="small"
                      style={{ fontWeight: 600 }}
                      onClick={handleDeleteResume}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <Button
                    type="primary"
                    icon={<FiUpload />}
                    size="small"
                    style={{ fontWeight: 600, backgroundColor: '#1b62d4', borderColor: '#1b62d4' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Computer File
                  </Button>
                )}
              </div>
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

      <Modal
        title="Edit Skill"
        open={isEditSkillOpen}
        onOk={() => {
          handleEditSkill(editingSkillIndex, editingSkillName);
          setIsEditSkillOpen(false);
        }}
        onCancel={() => setIsEditSkillOpen(false)}
        okButtonProps={{ style: { backgroundColor: '#1b62d4' } }}
      >
        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 13, color: '#64748b', display: 'block', marginBottom: 8 }}>Skill Name</label>
          <Input 
            value={editingSkillName} 
            onChange={(e) => setEditingSkillName(e.target.value)} 
            placeholder="e.g. React.js"
          />
        </div>
      </Modal>

      <AddCertificateModal
        visible={isAddCertOpen}
        onClose={() => setIsAddCertOpen(false)}
        onAddCertificate={handleAddCertificate}
      />

      <EditCertificateModal
        visible={isEditCertOpen}
        onClose={() => {
          setIsEditCertOpen(false);
          setSelectedCert(null);
        }}
        certificate={selectedCert}
        onUpdateCertificate={handleUpdateCertificate}
      />
    </StudentLayout>
  );
};
