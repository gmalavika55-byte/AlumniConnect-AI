import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { message, Rate, Button } from 'antd';
import {
  FiArrowLeft, FiBriefcase, FiMapPin, FiGlobe, FiLinkedin,
  FiStar, FiCalendar, FiCheckCircle, FiUsers, FiMessageSquare,
  FiFileText, FiExternalLink
} from 'react-icons/fi';
import { StudentLayout } from '../components/student/StudentLayout';
import { RequestMentorshipModal } from '../components/student/RequestMentorshipModal';
import styles from './MentorProfilePage.module.css';

// Comprehensive fallback mentor data (if navigated directly by URL)
const MENTOR_MAP = {
  1: {
    id: 1,
    name: 'Priya Sankar',
    role: 'Senior Software Engineer',
    company: 'Google India',
    location: 'Bangalore, India',
    match: '98% MATCH',
    rating: 4.9,
    totalSessions: 72,
    studentsHelped: 48,
    bio: 'Ex-KCE alumni (Class of 2019). Specialized in Distributed Systems, React architecture, and big tech interview strategies. Passionate about bridging the gap between student learning and industry expectations.',
    longBio: 'I graduated from Karpagam College of Engineering in 2019 and joined Google as a Software Engineer. Over 5 years, I\'ve grown from SWE to Senior SWE, leading projects for Google Maps infrastructure. I mentor students to help them crack top tech companies by focusing on fundamentals, problem-solving patterns, and system design principles.',
    skills: ['React', 'System Design', 'Cloud', 'Algorithms', 'TypeScript', 'Node.js'],
    expertise: ['Big Tech Interview Prep', 'Frontend Architecture', 'Distributed Systems', 'Career Roadmapping'],
    education: 'B.E. Computer Science – Karpagam College of Engineering (2015–2019)',
    availability: 'Weekdays 7–9 PM IST | Weekends 10 AM–12 PM IST',
    sessionTypes: ['1-on-1 Video Session', 'Resume Review', 'Mock Interview'],
    resumeName: 'Priya_Sankar_Resume_2026.pdf',
    resumeUrl: 'https://drive.google.com/file/d/priya_resume/view',
    reviews: [
      { name: 'Rahul M.', rating: 5, text: 'Priya helped me crack my Google interview. Her system design tips were invaluable!', date: 'July 2026' },
      { name: 'Aishwarya K.', rating: 5, text: 'Brilliant mentor. She reviewed my resume and I got 3 interview calls in a week.', date: 'June 2026' }
    ]
  },
  2: {
    id: 2,
    name: 'Arun Kumar',
    role: 'Staff ML Scientist',
    company: 'Amazon AWS',
    location: 'Hyderabad, India',
    match: '92% MATCH',
    rating: 4.8,
    totalSessions: 55,
    studentsHelped: 36,
    bio: 'Alumni Class of 2018. Passionate about guiding students in Natural Language Processing, Machine Learning, and Python optimization.',
    longBio: 'Joined Amazon after completing my B.E. from KCE in 2018. I specialize in building scalable ML pipelines for AWS SageMaker. I love helping students discover their passion for AI/ML and guiding them through open-source contributions and internship placements.',
    skills: ['Python', 'Deep Learning', 'NLP', 'PyTorch', 'AWS SageMaker', 'Scikit-learn'],
    expertise: ['Machine Learning Projects', 'NLP & LLMs', 'Research Paper Reading', 'Internship Guidance'],
    education: 'B.E. Computer Science – Karpagam College of Engineering (2014–2018)',
    availability: 'Saturdays 2–5 PM IST | Sundays 10 AM–1 PM IST',
    sessionTypes: ['1-on-1 Video Session', 'Project Mentorship', 'Career Q&A'],
    resumeName: 'Arun_Kumar_Resume_2026.pdf',
    resumeUrl: 'https://storage.alumniconnect.com/resumes/Arun_Kumar_Resume_2026.pdf',
    reviews: [
      { name: 'Deepika S.', rating: 5, text: 'Arun explained NLP transformers in the clearest way I\'ve ever heard. Truly exceptional!', date: 'July 2026' },
      { name: 'Karthik R.', rating: 4, text: 'Great mentor for ML career guidance. Got detailed project feedback.', date: 'May 2026' }
    ]
  },
  3: {
    id: 3,
    name: 'Divya Rajan',
    role: 'Lead Cloud Architect',
    company: 'Flipkart',
    location: 'Chennai, India',
    match: '87% MATCH',
    rating: 4.7,
    totalSessions: 40,
    studentsHelped: 28,
    bio: 'Alumni Class of 2020. Helps mentees master AWS microservices, DevOps automation, and scalable backend design.',
    longBio: 'I graduated from KCE in 2020 and now lead cloud infrastructure at Flipkart. I design systems that handle millions of requests daily. I mentor students passionate about cloud computing, containerization, and DevOps culture, helping them build real-world skills and land cloud engineering roles.',
    skills: ['AWS', 'Kubernetes', 'Go', 'DevOps', 'Terraform', 'Docker'],
    expertise: ['Cloud Architecture', 'DevOps & CI/CD', 'Microservices Design', 'Open Source Contribution'],
    education: 'B.E. Computer Science – Karpagam College of Engineering (2016–2020)',
    availability: 'Tuesdays & Thursdays 8–10 PM IST',
    sessionTypes: ['1-on-1 Video Session', 'Portfolio Review', 'Hands-on Demos'],
    resumeName: 'Divya_Rajan_Resume_2026.pdf',
    resumeUrl: 'https://drive.google.com/file/d/divya_resume/view',
    reviews: [
      { name: 'Saran P.', rating: 5, text: 'Divya helped me set up my first Kubernetes cluster. Incredibly patient and knowledgeable.', date: 'June 2026' }
    ]
  }
};

export const MentorProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const mentorFromState = location.state?.mentor;
  const mentorStatic = MENTOR_MAP[parseInt(id, 10)];
  const baseMentor = mentorFromState || mentorStatic;

  const mentor = (mentorStatic && { ...baseMentor, ...mentorStatic }) || baseMentor;

  const handleViewResume = () => {
    const url = mentor?.resumeUrl;
    if (url && url.trim() !== '' && url !== '#') {
      const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url.trim() : `https://${url.trim()}`;
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    } else {
      message.warning('Resume document URL is not available for this mentor.');
    }
  };

  if (!mentor) {
    return (
      <StudentLayout>
        <div style={{ textAlign: 'center', padding: 60 }}>
          <h2>Mentor not found</h2>
          <button onClick={() => navigate('/student/mentorship')} style={{ marginTop: 16 }}>
            ← Back to Mentorships
          </button>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      {/* Back Navigation */}
      <button className={styles.backBtn} onClick={() => navigate('/student/mentorship')}>
        <FiArrowLeft size={16} /> Back to Mentors
      </button>

      {/* ── Profile Hero Card ─────────────────────── */}
      <div className={styles.heroCard}>
        <div className={styles.heroTop}>
          <div className={styles.heroAvatar}>
            {(mentor.name || 'M').split(' ').map(n => n[0]).join('')}
          </div>
          <div className={styles.heroInfo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 className={styles.heroName}>{mentor.name}</h1>
              {mentor.match && (
                <span className={styles.matchPill}>{mentor.match}</span>
              )}
            </div>
            <p className={styles.heroRole}>
              <FiBriefcase size={14} style={{ marginRight: 6 }} />
              {mentor.role} at <strong>{mentor.company}</strong>
            </p>
            {mentor.location && (
              <p className={styles.heroLocation}>
                <FiMapPin size={13} style={{ marginRight: 5 }} />
                {mentor.location}
              </p>
            )}
            <div className={styles.ratingRow}>
              <Rate allowHalf disabled defaultValue={mentor.rating} style={{ fontSize: 14 }} />
              <span className={styles.ratingText}>{mentor.rating} / 5.0</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statNum}>{mentor.totalSessions || 0}</span>
            <span className={styles.statLbl}>Sessions Completed</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statNum}>{mentor.studentsHelped || 0}</span>
            <span className={styles.statLbl}>Students Mentored</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statNum}>100%</span>
            <span className={styles.statLbl}>Response Rate</span>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ────────────────────── */}
      <div className={styles.grid2Col}>
        {/* LEFT COLUMN */}
        <div>
          {/* About / Bio */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>About Mentor</h3>
            <p className={styles.bodyText}>
              {mentor.longBio || mentor.bio}
            </p>
          </div>

          {/* Education */}
          {mentor.education && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🎓 Education</h3>
              <p className={styles.bodyText}>{mentor.education}</p>
            </div>
          )}

          {/* Student Reviews */}
          {mentor.reviews && mentor.reviews.length > 0 && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <FiMessageSquare size={16} style={{ marginRight: 8, color: '#1b62d4' }} />
                Student Reviews ({mentor.reviews.length})
              </h3>

              <div className={styles.reviewList}>
                {mentor.reviews.map((r, i) => (
                  <div key={i} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewAvatar}>{r.name[0]}</div>
                      <div>
                        <strong style={{ fontSize: 14, color: '#0f1e36' }}>{r.name}</strong>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>{r.date}</div>
                      </div>
                      <Rate allowHalf disabled defaultValue={r.rating} style={{ fontSize: 12, marginLeft: 'auto' }} />
                    </div>
                    <p className={styles.reviewText}>"{r.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Skills */}
          {mentor.skills && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🛠 Technical Skills</h3>
              <div className={styles.skillPills}>
                {mentor.skills.map((s, i) => (
                  <span key={i} className={styles.skillBadge}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Attached Resume (Viewer Mode) */}
          {(mentor.resumeName || mentor.resumeUrl) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <FiFileText size={15} style={{ marginRight: 8, color: '#1b62d4' }} /> Primary Resume
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--ac-bg-input)', border: '1px dashed #cbd5e1', borderRadius: 12, padding: 16 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 13.5, color: 'var(--ac-text-primary)' }}>
                    {mentor.resumeName || 'Mentor_Resume.pdf'}
                  </h4>
                  <span style={{ fontSize: 11, color: 'var(--ac-text-secondary)', marginTop: 4, display: 'block' }}>
                    {mentor.resumeUrl ? mentor.resumeUrl : 'Verified Resume Link'}
                  </span>
                </div>
                {mentor.resumeUrl && (
                  <Button
                    type="primary"
                    icon={<FiExternalLink />}
                    size="small"
                    style={{ backgroundColor: '#1b62d4' }}
                    onClick={handleViewResume}
                  >
                    View Resume
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Expertise */}
          {mentor.expertise && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <FiCheckCircle size={15} style={{ marginRight: 8, color: '#22c55e' }} /> Areas of Expertise
              </h3>
              <ul className={styles.expertiseList}>
                {mentor.expertise.map((e, i) => (
                  <li key={i} className={styles.expertiseItem}>
                    <FiCheckCircle size={13} color="#22c55e" style={{ flexShrink: 0 }} />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Availability */}
          {mentor.availability && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <FiCalendar size={15} style={{ marginRight: 8 }} /> Availability
              </h3>
              <p className={styles.bodyText}>{mentor.availability}</p>
            </div>
          )}

          {/* Session Types */}
          {mentor.sessionTypes && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>📋 Session Types Offered</h3>
              <ul className={styles.expertiseList}>
                {mentor.sessionTypes.map((s, i) => (
                  <li key={i} className={styles.expertiseItem}>
                    <FiCheckCircle size={13} color="#1b62d4" style={{ flexShrink: 0 }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Card */}
          <div className={styles.actionCard}>
            <h4 className={styles.actionCardTitle}>Ready to connect?</h4>
            <p className={styles.actionCardDesc}>Book a 1-on-1 session and accelerate your career with expert mentorship.</p>
            <button className={styles.primaryBtn} style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsRequestOpen(true)}>
              <FiCalendar size={15} /> Request Session
            </button>
          </div>
        </div>
      </div>

      {/* Request Mentorship Modal */}
      <RequestMentorshipModal
        visible={isRequestOpen}
        mentor={mentor}
        onClose={() => setIsRequestOpen(false)}
        onRequestSuccess={() => message.success(`Mentorship request sent to ${mentor.name}!`)}
      />
    </StudentLayout>
  );
};
