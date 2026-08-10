import React, { useState, useRef, useEffect } from 'react';
import { message, Modal, Form, Input, Button, Tag } from 'antd';
import {
  FiEdit2, FiUpload, FiPlus, FiBookOpen, FiUser, FiBriefcase,
  FiLink, FiAward, FiFileText, FiExternalLink, FiCheckCircle
} from 'react-icons/fi';
import { AlumniLayout } from '../components/alumni/AlumniLayout';
import { authService } from '../services/authService';
import api from '../services/api';

export const AlumniProfilePage = () => {
  const fileInputRef = useRef(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [editForm] = Form.useForm();

  const [profile, setProfile] = useState({
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
    github: '',
    resumeName: 'Resume.pdf',
    resumeSize: '1.2 MB'
  });

  const alumni = authService.getCurrentUser();

  useEffect(() => {
    if (alumni) {
      setProfile({
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
        github: alumni.github || '',
        resumeName: 'Resume.pdf',
        resumeSize: '1.2 MB'
      });
      if (alumni.skills) {
        setSkills(alumni.skills.split(',').map(s => s.trim()));
      }
    }
  }, []);

  useEffect(() => {
    if (isEditOpen) {
      editForm.setFieldsValue({
        name: profile.name,
        role: profile.role,
        company: profile.company,
        dept: profile.dept,
        bio: profile.bio
      });
    }
  }, [isEditOpen, profile, editForm]);

  const [skills, setSkills] = useState([
    'Distributed Systems', 'React.js', 'System Design', 'Cloud Architecture', 'Go / Golang', 'Kubernetes', 'Python'
  ]);

  const [experienceList, setExperienceList] = useState([
    { title: 'Senior Software Engineer', company: 'Google India', period: '2022 - Present', desc: 'Leading distributed caching infrastructure and high-throughput microservices for Google Maps.' },
    { title: 'Software Development Engineer II', company: 'Amazon AWS', period: '2019 - 2022', desc: 'Designed automated deployment pipelines for AWS SageMaker backend services.' },
    { title: 'Junior Frontend Engineer', company: 'Flipkart', period: '2018 - 2019', desc: 'Built responsive web checkout flows using React & Redux.' }
  ]);

  const handleAddSkillSubmit = () => {
    if (!newSkillInput.trim()) {
      message.error('Please enter a skill name');
      return;
    }
    if (skills.includes(newSkillInput.trim())) {
      message.warning('Skill already exists!');
      return;
    }
    setSkills([...skills, newSkillInput.trim()]);
    message.success(`Skill "${newSkillInput.trim()}" added successfully!`);
    setNewSkillInput('');
    setIsAddSkillOpen(false);
  };

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

  const handleSaveProfile = async () => {
    try {
      const values = await editForm.validateFields();
      const alumniUser = authService.getCurrentUser();
      if (!alumniUser) return;

      const updatedAlumni = {
        ...alumniUser,
        name: values.name,
        designation: values.role,
        currentCompany: values.company,
        department: values.dept,
        bio: values.bio
      };

      const res = await api.put('/alumni/update', updatedAlumni);
      const savedUser = res.data;

      localStorage.setItem('alumni_user_data', JSON.stringify({
        ...alumniUser,
        ...savedUser,
        role: alumniUser.role
      }));

      setProfile(prev => ({
        ...prev,
        name: savedUser.name,
        role: savedUser.designation,
        company: savedUser.currentCompany,
        dept: savedUser.department,
        bio: savedUser.bio || ''
      }));

      message.success('Profile details saved successfully!');
      setIsEditOpen(false);
    } catch (err) {
      console.error('Error saving alumni profile:', err);
      message.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <AlumniLayout>
      {/* Hidden File Input for Resume */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx"
        onChange={handleResumeUpload}
      />

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
  {/* Cover Banner */}
  <div
    style={{
      height: 190,
      background: "linear-gradient(135deg, #071330 0%, #1b62d4 100%)",
    }}
  />

  {/* Profile Content */}
  <div
    style={{
      padding: "0 30px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: -70,
    }}
  >
    {/* Left Side */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      {/* Avatar */}
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
        RK
      </div>

      {/* Profile Details */}
      <div style={{ marginTop: 35 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#ffffff",
            margin: 0,
          }}
        >
          {profile.name}
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.85)",
            marginTop: 8,
            marginBottom: 0,
          }}
        >
          {profile.role} at <strong>{profile.company}</strong> • Class of{" "}
          {profile.gradYear} ({profile.dept})
        </p>
      </div>
    </div>

    {/* Right Side Buttons */}
    <div style={{ display: "flex", gap: 12 }}>
      <Button
        icon={<FiEdit2 />}
        style={{
          height: 42,
          borderRadius: 8,
          fontWeight: 600,
        }}
        onClick={() => {
          editForm.setFieldsValue(profile);
          setIsEditOpen(true);
        }}
      >
        Edit Profile
      </Button>

      <Button
        type="primary"
        icon={<FiUpload />}
        style={{
          background: "#2563eb",
          borderColor: "#2563eb",
          height: 42,
          borderRadius: 8,
          fontWeight: 600,
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Resume
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
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{profile.role}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Company</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: '#1b62d4' }}>{profile.company}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Graduation Year</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>Class of {profile.gradYear}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Department</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: 'var(--ac-text-primary)' }}>{profile.dept}</p>
              </div>
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--ac-border)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-text-muted)', textTransform: 'uppercase' }}>Bio / About</span>
              <p style={{ margin: '4px 0 0 0', fontSize: 13.5, color: 'var(--ac-text-secondary)', lineHeight: 1.6 }}>{profile.bio}</p>
            </div>
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
                    color: 'var(--ac-text-primary)'
                  }}
                >
                  {skill}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Career Information Timeline */}
          <div style={{ backgroundColor: 'var(--ac-bg-card)', borderRadius: 16, border: '1px solid var(--ac-border)', padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ac-text-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiBriefcase color="#1b62d4" /> Career Journey & Experience
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {experienceList.map((exp, idx) => (
                <div key={idx} style={{ padding: 14, backgroundColor: 'var(--ac-bg-input)', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong style={{ fontSize: 14, color: 'var(--ac-text-primary)' }}>{exp.title}</strong>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#1b62d4' }}>{exp.period}</span>
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--ac-bg-input)', border: '1px dashed #cbd5e1', borderRadius: 12, padding: 16 }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 13.5, color: 'var(--ac-text-primary)' }}>{profile.resumeName}</h4>
                <span style={{ fontSize: 11, color: 'var(--ac-text-secondary)' }}>{profile.resumeSize} • PDF</span>
              </div>
              <Button
                icon={<FiUpload />}
                size="small"
                style={{ fontWeight: 600 }}
                onClick={() => fileInputRef.current?.click()}
              >
                Change
              </Button>
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

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Alumni Profile"
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onOk={handleSaveProfile}
        okText="Save Profile Changes"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Current Job Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="company" label="Company" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dept" label="Department" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="bio" label="Bio / About">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </AlumniLayout>
  );
};
