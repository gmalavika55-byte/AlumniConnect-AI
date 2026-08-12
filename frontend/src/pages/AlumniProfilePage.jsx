import React, { useState, useEffect } from 'react';
import { message, Modal, Form, Input, Button, Tag } from 'antd';
import {
  FiEdit2, FiPlus, FiBookOpen, FiUser, FiBriefcase,
  FiLink, FiAward, FiFileText, FiExternalLink, FiTrash2
} from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import { authService } from '../services/authService';
import api from '../services/api';

export const AlumniProfilePage = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Skills State & Modals
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isEditSkillOpen, setIsEditSkillOpen] = useState(false);
  const [editingSkillIndex, setEditingSkillIndex] = useState(null);
  const [editingSkillName, setEditingSkillName] = useState('');

  // Experience / Career Journey State & Modals
  const [isAddExpOpen, setIsAddExpOpen] = useState(false);
  const [isEditExpOpen, setIsEditExpOpen] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState(null);

  const [editForm] = Form.useForm();
  const [addExpForm] = Form.useForm();
  const [editExpForm] = Form.useForm();

  const [profile, setProfile] = useState({
    alumniId: null,
    registerNo: '',
    name: '',
    gradYear: '',
    dept: '',
    college: 'Karpagam College of Engineering',
    role: '',
    company: '',
    location: '',
    email: '',
    phone: '',
    bio: '',
    linkedin: '',
    resumeName: '',
    resumeUrl: ''
  });

  const [skills, setSkills] = useState([
    'Distributed Systems', 'React.js', 'System Design', 'Cloud Architecture', 'Go / Golang', 'Kubernetes', 'Python'
  ]);

  const [experienceList, setExperienceList] = useState([
    { title: 'Senior Software Engineer', company: 'Google India', period: '2022 - Present', desc: 'Leading distributed caching infrastructure and high-throughput microservices for Google Maps.' },
    { title: 'Software Development Engineer II', company: 'Amazon AWS', period: '2019 - 2022', desc: 'Designed automated deployment pipelines for AWS SageMaker backend services.' },
    { title: 'Junior Frontend Engineer', company: 'Flipkart', period: '2018 - 2019', desc: 'Built responsive web checkout flows using React & Redux.' }
  ]);

  // Load authenticated Alumni profile from backend API
  const fetchBackendProfile = async () => {
    const alumni = authService.getCurrentUser();
    if (!alumni || !alumni.alumniId) return;

    setLoading(true);
    try {
      const res = await api.get(`/alumni/get/${alumni.alumniId}`);
      const data = res.data;
      if (data) {
        // Sync local storage with fresh backend data
        const freshUser = {
          ...alumni,
          ...data,
          role: alumni.role
        };
        localStorage.setItem('alumni_user_data', JSON.stringify(freshUser));

        setProfile({
          alumniId: data.alumniId,
          registerNo: data.registerNo || '',
          name: data.name || '',
          gradYear: data.batch || '',
          dept: data.department || '',
          college: 'Karpagam College of Engineering',
          role: data.designation || '',
          company: data.currentCompany || '',
          location: data.location || '',
          email: data.email || '',
          phone: data.mobile || '',
          bio: data.bio || '',
          linkedin: data.linkedin || '',
          resumeName: data.resumeName || '',
          resumeUrl: data.resumeUrl || ''
        });

        if (data.skills) {
          const parsedSkills = data.skills.split(',').map(s => s.trim()).filter(Boolean);
          if (parsedSkills.length > 0) {
            setSkills(parsedSkills);
          }
        }
      }
    } catch (err) {
      console.warn('Backend profile fetch error, falling back to local user:', err);
      setProfile({
        alumniId: alumni.alumniId,
        registerNo: alumni.registerNo || '',
        name: alumni.name || '',
        gradYear: alumni.batch || '',
        dept: alumni.department || '',
        college: 'Karpagam College of Engineering',
        role: alumni.designation || '',
        company: alumni.currentCompany || '',
        location: alumni.location || '',
        email: alumni.email || '',
        phone: alumni.mobile || '',
        bio: alumni.bio || '',
        linkedin: alumni.linkedin || '',
        resumeName: alumni.resumeName || '',
        resumeUrl: alumni.resumeUrl || ''
      });
      if (alumni.skills) {
        const parsedSkills = alumni.skills.split(',').map(s => s.trim()).filter(Boolean);
        if (parsedSkills.length > 0) {
          setSkills(parsedSkills);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendProfile();
  }, []);

  // Skill Management Handlers
  const handleAddSkillSubmit = async () => {
    if (!newSkillInput.trim()) {
      message.error('Please enter a skill name');
      return;
    }
    const targetName = newSkillInput.trim();
    if (skills.some(s => s.toLowerCase() === targetName.toLowerCase())) {
      message.warning(`Skill "${targetName}" already exists.`);
      return;
    }

    const updatedSkills = [...skills, targetName];
    setSkills(updatedSkills);
    message.success(`Skill "${targetName}" added successfully!`);
    setNewSkillInput('');
    setIsAddSkillOpen(false);

    const alumniUser = authService.getCurrentUser();
    if (alumniUser && alumniUser.alumniId) {
      try {
        const payload = {
          ...alumniUser,
          skills: updatedSkills.join(',')
        };
        const res = await api.put('/alumni/update', payload);
        if (res?.data) {
          localStorage.setItem('alumni_user_data', JSON.stringify({ ...alumniUser, ...res.data, role: alumniUser.role }));
        }
      } catch (err) {
        console.error('Error persisting skill to backend:', err);
        message.error("Failed to persist skill to backend.");
      }
    }
  };

  const handleEditSkillSubmit = async () => {
    if (!editingSkillName.trim()) {
      message.error("Skill name cannot be empty.");
      return;
    }
    const targetName = editingSkillName.trim();
    if (editingSkillIndex === null || editingSkillIndex < 0 || editingSkillIndex >= skills.length) {
      message.error("Invalid skill selection.");
      return;
    }

    if (skills.some((s, idx) => idx !== editingSkillIndex && s.toLowerCase() === targetName.toLowerCase())) {
      message.warning(`Skill "${targetName}" already exists.`);
      return;
    }

    const updatedSkills = [...skills];
    updatedSkills[editingSkillIndex] = targetName;
    setSkills(updatedSkills);
    message.success("Skill updated successfully!");
    setIsEditSkillOpen(false);

    const alumniUser = authService.getCurrentUser();
    if (alumniUser && alumniUser.alumniId) {
      try {
        const payload = {
          ...alumniUser,
          skills: updatedSkills.join(',')
        };
        const res = await api.put('/alumni/update', payload);
        if (res?.data) {
          localStorage.setItem('alumni_user_data', JSON.stringify({ ...alumniUser, ...res.data, role: alumniUser.role }));
        }
      } catch (err) {
        console.error('Error persisting updated skill to backend:', err);
        message.error("Failed to update skill on backend.");
      }
    }
  };

  const handleDeleteSkill = async (index) => {
    if (index < 0 || index >= skills.length) return;
    const removedSkill = skills[index];
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    message.success(`Skill "${removedSkill}" deleted successfully!`);

    const alumniUser = authService.getCurrentUser();
    if (alumniUser && alumniUser.alumniId) {
      try {
        const payload = {
          ...alumniUser,
          skills: updatedSkills.join(',')
        };
        const res = await api.put('/alumni/update', payload);
        if (res?.data) {
          localStorage.setItem('alumni_user_data', JSON.stringify({ ...alumniUser, ...res.data, role: alumniUser.role }));
        }
      } catch (err) {
        console.error('Error deleting skill from backend:', err);
        message.error("Failed to delete skill on backend.");
      }
    }
  };

  // Experience / Career Journey Management Handlers
  const handleAddExperienceSubmit = async () => {
    try {
      const values = await addExpForm.validateFields();
      const newExp = {
        title: values.title,
        company: values.company,
        period: values.period,
        desc: values.desc
      };
      setExperienceList(prev => [newExp, ...prev]);
      message.success(`Career journey entry for "${values.title}" added!`);
      addExpForm.resetFields();
      setIsAddExpOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditExperienceSubmit = async () => {
    try {
      const values = await editExpForm.validateFields();
      if (editingExpIndex === null || editingExpIndex < 0 || editingExpIndex >= experienceList.length) return;

      const updatedList = [...experienceList];
      updatedList[editingExpIndex] = {
        title: values.title,
        company: values.company,
        period: values.period,
        desc: values.desc
      };
      setExperienceList(updatedList);
      message.success(`Career journey entry updated!`);
      setIsEditExpOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteExperience = (index) => {
    if (index < 0 || index >= experienceList.length) return;
    const removed = experienceList[index];
    setExperienceList(prev => prev.filter((_, i) => i !== index));
    message.success(`Removed "${removed.title} at ${removed.company}" from career journey.`);
  };

  // View Resume Link Handler
  const handleViewResume = () => {
    const url = profile.resumeUrl;
    if (url && url.trim() !== '' && url !== '#') {
      const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    } else {
      message.warning('Resume link/document URL is not available.');
    }
  };

  // Remove Resume Handler
  const handleDeleteResume = () => {
    Modal.confirm({
      title: 'Remove Primary Resume?',
      content: 'Are you sure you want to delete your saved resume details from your profile?',
      okText: 'Remove Resume',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        const alumniUser = authService.getCurrentUser();
        if (!alumniUser || !alumniUser.alumniId) return;

        const updatedAlumni = {
          ...alumniUser,
          resumeName: '',
          resumeUrl: ''
        };

        try {
          const res = await api.put('/alumni/update', updatedAlumni);
          const savedUser = res.data;

          localStorage.setItem('alumni_user_data', JSON.stringify({
            ...alumniUser,
            ...savedUser,
            role: alumniUser.role
          }));

          setProfile(prev => ({
            ...prev,
            resumeName: '',
            resumeUrl: ''
          }));

          message.success('Resume removed successfully!');
        } catch (err) {
          console.error('Error deleting resume:', err);
          message.error('Failed to remove resume from backend.');
        }
      }
    });
  };

  // Save Profile Details
  const handleSaveProfile = async () => {
    try {
      const values = await editForm.validateFields();
      const alumniUser = authService.getCurrentUser();
      if (!alumniUser || !alumniUser.alumniId) {
        message.error('Alumni user session not found.');
        return;
      }

      const updatedAlumni = {
        ...alumniUser,
        alumniId: alumniUser.alumniId,
        registerNo: alumniUser.registerNo || profile.registerNo || 'REG-ALUMNI',
        name: values.name,
        email: alumniUser.email || profile.email,
        designation: values.role,
        currentCompany: values.company,
        department: values.dept,
        location: values.location || alumniUser.location || '',
        linkedin: values.linkedin || alumniUser.linkedin || '',
        resumeName: values.resumeName || '',
        resumeUrl: values.resumeUrl || '',
        skills: skills.join(',')
      };

      const res = await api.put('/alumni/update', updatedAlumni);
      const savedUser = res.data;

      // Update session localStorage
      const newUserData = {
        ...alumniUser,
        ...savedUser,
        role: alumniUser.role
      };
      localStorage.setItem('alumni_user_data', JSON.stringify(newUserData));

      // Update React state
      setProfile(prev => ({
        ...prev,
        name: savedUser.name || values.name,
        role: savedUser.designation || values.role,
        company: savedUser.currentCompany || values.company,
        dept: savedUser.department || values.dept,
        location: savedUser.location || values.location || '',
        linkedin: savedUser.linkedin || values.linkedin || '',
        resumeName: savedUser.resumeName || values.resumeName || '',
        resumeUrl: savedUser.resumeUrl || values.resumeUrl || '',
        bio: values.bio || ''
      }));

      message.success('Profile details saved successfully!');
      setIsEditOpen(false);
    } catch (err) {
      console.error('Error saving alumni profile:', err);
      const errMsg = typeof err.response?.data === 'string'
        ? err.response.data
        : (err.response?.data?.message || 'Failed to update profile. Please try again.');
      message.error(errMsg);
    }
  };

  const getInitials = (nameStr) => {
    if (!nameStr) return 'AL';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  return (
    <AlumniLayout>
      {/* Cover Banner & Profile Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #071330 0%, #1b62d4 100%)",
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            height: 190,
            background: "linear-gradient(135deg, #071330 0%, #1b62d4 100%)",
          }}
        />

        <div
          style={{
            padding: "0 30px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: -70,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#071330,#1b62d4)",
                border: "5px solid #fff",
                color: "#fff",
                fontSize: 34,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 18px rgba(0,0,0,.25)",
                position: "relative",
                zIndex: 10,
                flexShrink: 0,
              }}
            >
              {getInitials(profile.name)}
            </div>

            <div style={{ marginTop: 35 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#ffffff", margin: 0 }}>
                {profile.name || 'Alumni Member'}
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginTop: 8, marginBottom: 0 }}>
                {profile.role || 'Alumni'} {profile.company ? <>at <strong>{profile.company}</strong></> : ''} {profile.gradYear || profile.dept ? <>• Class of {profile.gradYear} ({profile.dept})</> : ''}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Button
              icon={<FiEdit2 />}
              style={{ height: 42, borderRadius: 8, fontWeight: 600 }}
              onClick={() => {
                editForm.setFieldsValue({
                  name: profile.name,
                  role: profile.role,
                  company: profile.company,
                  dept: profile.dept,
                  location: profile.location,
                  linkedin: profile.linkedin,
                  resumeName: profile.resumeName,
                  resumeUrl: profile.resumeUrl,
                  bio: profile.bio
                });
                setIsEditOpen(true);
              }}
            >
              Edit Profile
            </Button>

            <Button
              type="primary"
              icon={<FiFileText />}
              style={{ background: "#2563eb", borderColor: "#2563eb", height: 42, borderRadius: 8, fontWeight: 600 }}
              onClick={() => {
                editForm.setFieldsValue({
                  name: profile.name,
                  role: profile.role,
                  company: profile.company,
                  dept: profile.dept,
                  location: profile.location,
                  linkedin: profile.linkedin,
                  resumeName: profile.resumeName,
                  resumeUrl: profile.resumeUrl,
                  bio: profile.bio
                });
                setIsEditOpen(true);
              }}
            >
              {profile.resumeName ? 'Change Resume Link' : 'Set Resume Link'}
            </Button>
          </div>
        </div>
      </div>

      {/* 2 Column Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
        {/* LEFT COLUMN */}
        <div>
          {/* Professional Information */}
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiBriefcase color="#1b62d4" /> Professional & Academic Info
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Current Role</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{profile.role || 'Not available'}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Company</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: '#1b62d4' }}>{profile.company || 'Not available'}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Graduation Year</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{profile.gradYear ? `Class of ${profile.gradYear}` : 'Not available'}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Department</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{profile.dept || 'Not available'}</p>
              </div>
              {profile.location && (
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Location</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{profile.location}</p>
                </div>
              )}
              {profile.linkedin && (
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>LinkedIn Profile</span>
                  <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: '#1b62d4' }}>
                    <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noreferrer">
                      View LinkedIn Profile <FiExternalLink size={12} />
                    </a>
                  </p>
                </div>
              )}
            </div>

            {profile.bio && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--ac-border)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Bio / About</span>
                <p style={{ margin: '4px 0 0 0', fontSize: 13.5, color: 'var(--ac-text-secondary)', lineHeight: 1.6 }}>{profile.bio}</p>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiAward color="#1b62d4" /> Skills & Technical Expertise
              </h3>
              <Button
                size="small"
                type="link"
                icon={<FiPlus />}
                style={{ fontWeight: 700, color: '#1b62d4' }}
                onClick={() => setIsAddSkillOpen(true)}
              >
                Add Skill
              </Button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map((skill, index) => (
                <Tag
                  key={index}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    backgroundColor: 'var(--ac-bg-input)',
                    borderColor: '#e2e8f0',
                    color: 'var(--ac-text-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => {
                      setEditingSkillIndex(index);
                      setEditingSkillName(skill);
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
                        title: 'Delete Skill?',
                        content: `Are you sure you want to delete "${skill}"?`,
                        okText: 'Delete',
                        okType: 'danger',
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
                </Tag>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Career Information Timeline */}
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiBriefcase color="#1b62d4" /> Career Journey & Experience
              </h3>
              <Button
                size="small"
                type="link"
                icon={<FiPlus />}
                style={{ fontWeight: 700, color: '#1b62d4' }}
                onClick={() => setIsAddExpOpen(true)}
              >
                Add Entry
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {experienceList.map((exp, idx) => (
                <div key={idx} style={{ padding: 14, backgroundColor: 'var(--ac-bg-input)', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong style={{ fontSize: 14, color: 'var(--ac-text-primary)' }}>{exp.title}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#1b62d4' }}>{exp.period}</span>
                      <button
                        onClick={() => {
                          setEditingExpIndex(idx);
                          editExpForm.setFieldsValue(exp);
                          setIsEditExpOpen(true);
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1b62d4', padding: 0, display: 'inline-flex', alignItems: 'center' }}
                        title="Edit Experience"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          Modal.confirm({
                            title: 'Delete Experience Entry?',
                            content: `Are you sure you want to remove "${exp.title} at ${exp.company}"?`,
                            okText: 'Delete',
                            okType: 'danger',
                            onOk() {
                              handleDeleteExperience(idx);
                            }
                          });
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0, display: 'inline-flex', alignItems: 'center' }}
                        title="Delete Experience"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ac-text-secondary)', marginBottom: 6 }}>{exp.company}</div>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ac-text-secondary)', lineHeight: 1.5 }}>{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Resume Section */}
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiFileText color="#1b62d4" /> Primary Resume
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--ac-bg-input)', border: '1px dashed #cbd5e1', borderRadius: 12, padding: 16, gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <h4 style={{ margin: 0, fontSize: 14, color: 'var(--ac-text-primary)' }}>
                  {profile.resumeName || profile.resumeUrl ? (
                    <span style={{ fontWeight: 700 }}>{profile.resumeName || 'Resume Document'}</span>
                  ) : (
                    <span style={{ color: 'var(--ac-text-secondary)', fontStyle: 'italic' }}>No Resume Added</span>
                  )}
                </h4>
                <span style={{ fontSize: 11, color: 'var(--ac-text-secondary)', marginTop: 4, display: 'block', wordBreak: 'break-all' }}>
                  {profile.resumeUrl ? profile.resumeUrl : 'Provide a document name & external URL'}
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
                        style={{ fontWeight: 600, backgroundColor: '#1b62d4' }}
                        onClick={handleViewResume}
                      >
                        View Resume
                      </Button>
                    )}
                    <Button
                      icon={<FiEdit2 />}
                      size="small"
                      style={{ fontWeight: 600 }}
                      onClick={() => {
                        editForm.setFieldsValue({
                          name: profile.name,
                          role: profile.role,
                          company: profile.company,
                          dept: profile.dept,
                          location: profile.location,
                          linkedin: profile.linkedin,
                          resumeName: profile.resumeName,
                          resumeUrl: profile.resumeUrl,
                          bio: profile.bio
                        });
                        setIsEditOpen(true);
                      }}
                    >
                      Change Link
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
                    icon={<FiPlus />}
                    size="small"
                    style={{ fontWeight: 600, backgroundColor: '#1b62d4' }}
                    onClick={() => {
                      editForm.setFieldsValue({
                        name: profile.name,
                        role: profile.role,
                        company: profile.company,
                        dept: profile.dept,
                        location: profile.location,
                        linkedin: profile.linkedin,
                        resumeName: profile.resumeName,
                        resumeUrl: profile.resumeUrl,
                        bio: profile.bio
                      });
                      setIsEditOpen(true);
                    }}
                  >
                    Set Resume Link
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      <Modal
        title="Add Technical Skill"
        open={isAddSkillOpen}
        onCancel={() => setIsAddSkillOpen(false)}
        onOk={handleAddSkillSubmit}
        okText="Add Skill"
      >
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ac-text-secondary)', display: 'block', marginBottom: 8 }}>Skill Name</label>
          <Input
            placeholder="e.g. AWS Cloud, Machine Learning, GraphQL..."
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onPressEnter={handleAddSkillSubmit}
          />
        </div>
      </Modal>

      {/* Edit Skill Modal */}
      <Modal
        title="Edit Technical Skill"
        open={isEditSkillOpen}
        onCancel={() => setIsEditSkillOpen(false)}
        onOk={handleEditSkillSubmit}
        okText="Save Skill Changes"
      >
        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ac-text-secondary)', display: 'block', marginBottom: 8 }}>Skill Name</label>
          <Input
            placeholder="e.g. React.js, Distributed Systems..."
            value={editingSkillName}
            onChange={(e) => setEditingSkillName(e.target.value)}
            onPressEnter={handleEditSkillSubmit}
          />
        </div>
      </Modal>

      {/* Add Experience Modal */}
      <Modal
        title="Add Career Journey Entry"
        open={isAddExpOpen}
        onCancel={() => setIsAddExpOpen(false)}
        onOk={handleAddExperienceSubmit}
        okText="Add Experience"
      >
        <Form form={addExpForm} layout="vertical">
          <Form.Item name="title" label="Job Title / Role" rules={[{ required: true, message: 'Please enter job title' }]}>
            <Input placeholder="e.g. Senior Software Engineer" />
          </Form.Item>
          <Form.Item name="company" label="Company / Organization" rules={[{ required: true, message: 'Please enter company' }]}>
            <Input placeholder="e.g. Google India" />
          </Form.Item>
          <Form.Item name="period" label="Period / Duration" rules={[{ required: true, message: 'Please enter duration' }]}>
            <Input placeholder="e.g. 2022 - Present" />
          </Form.Item>
          <Form.Item name="desc" label="Key Responsibilities / Achievements">
            <Input.TextArea rows={3} placeholder="Describe your key role, impact, and projects..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Experience Modal */}
      <Modal
        title="Edit Career Journey Entry"
        open={isEditExpOpen}
        onCancel={() => setIsEditExpOpen(false)}
        onOk={handleEditExperienceSubmit}
        okText="Save Entry"
      >
        <Form form={editExpForm} layout="vertical">
          <Form.Item name="title" label="Job Title / Role" rules={[{ required: true, message: 'Please enter job title' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="company" label="Company / Organization" rules={[{ required: true, message: 'Please enter company' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="period" label="Period / Duration" rules={[{ required: true, message: 'Please enter duration' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="desc" label="Key Responsibilities / Achievements">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Alumni Profile"
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onOk={handleSaveProfile}
        okText="Save Profile Changes"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter your name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Current Job Title" rules={[{ required: true, message: 'Please enter your job title' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="company" label="Company" rules={[{ required: true, message: 'Please enter your company' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dept" label="Department" rules={[{ required: true, message: 'Please enter your department' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input placeholder="e.g. Bengaluru, India" />
          </Form.Item>
          <Form.Item name="linkedin" label="LinkedIn URL">
            <Input placeholder="e.g. linkedin.com/in/username" />
          </Form.Item>

          <h4 style={{ margin: '16px 0 8px 0', color: 'var(--ac-text-primary)' }}>Primary Resume Details</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="resumeName" label="Resume Document Name">
              <Input placeholder="e.g. My_Resume_2026.pdf" />
            </Form.Item>
            <Form.Item name="resumeUrl" label="Resume Link / Document URL">
              <Input placeholder="https://drive.google.com/..." />
            </Form.Item>
          </div>

          <Form.Item name="bio" label="Bio / About">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </AlumniLayout>
  );
};
