import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialMentors,
  initialEvents,
  initialRequests,
  initialActiveMentorships,
  initialMeetingsHistory
} from '../data/studentData';

// ────────────────────────────────────────────
// TRANSLATION OBJECT  (English ↔ Tamil)
// ────────────────────────────────────────────
const translations = {
  dashboard: { english: 'Dashboard', tamil: 'டாஷ்போர்டு' },
  myProfile: { english: 'My Profile', tamil: 'என் சுயவிவரம்' },
  events: { english: 'Events', tamil: 'நிகழ்வுகள்' },
  myEvents: { english: 'My Events', tamil: 'என் நிகழ்வுகள்' },
  career: { english: 'Career', tamil: 'தொழில்' },
  mentorships: { english: 'Mentorships', tamil: 'வழிகாட்டுதல்கள்' },
  mentorshipRequests: { english: 'Mentorship Requests', tamil: 'வழிகாட்டுதல் கோரிக்கைகள்' },
  fundraising: { english: 'Fundraising', tamil: 'நிதி திரட்டல்' },
  settings: { english: 'Settings', tamil: 'அமைப்புகள்' },
  logout: { english: 'Logout', tamil: 'வெளியேறு' },
  uploadResume: { english: 'Upload Resume', tamil: 'சுருக்கம் பதிவேற்று' },
  editProfile: { english: 'Edit Profile', tamil: 'சுயவிவரம் திருத்து' },
  addSkill: { english: 'Add Skill', tamil: 'திறன் சேர்' },
  addCertificate: { english: 'Add Certificate', tamil: 'சான்றிதழ் சேர்' },
  requestMentorship: { english: 'Request Mentorship', tamil: 'வழிகாட்டுதல் கோரு' },
  viewProfile: { english: 'View Profile', tamil: 'சுயவிவரம் பார்' },
  registerEvent: { english: 'Register', tamil: 'பதிவு' },
  saveChanges: { english: 'Save Changes', tamil: 'மாற்றங்கள் சேமி' },
  cancel: { english: 'Cancel', tamil: 'ரத்துசெய்' },
  language: { english: 'Language', tamil: 'மொழி' },
  theme: { english: 'Theme', tamil: 'தீம்' },
  appearance: { english: 'Appearance & Language', tamil: 'தோற்றம் & மொழி' },
  notifications: { english: 'Notifications', tamil: 'அறிவிப்புகள்' },
  security: { english: 'Account & Security', tamil: 'கணக்கு & பாதுகாப்பு' },
  privacy: { english: 'Privacy & Visibility', tamil: 'தனியுரிமை & தெரிவுநிலை' },
  userManagement: { english: 'User Management', tamil: 'பயனர் மேலாண்மை' },
  studentManagement: { english: 'Student Management', tamil: 'மாணவர் மேலாண்மை' },
  alumniManagement: { english: 'Alumni Management', tamil: 'முன்னாள் மாணவர் மேலாண்மை' },
  mentorshipManagement: { english: 'Mentorship Management', tamil: 'வழிகாட்டுதல் மேலாண்மை' },
  eventManagement: { english: 'Event Management', tamil: 'நிகழ்வு மேலாண்மை' },
  fundraisingManagement: { english: 'Fundraising Management', tamil: 'நிதி திரட்டல் மேலாண்மை' },
  reportsAnalytics: { english: 'Reports & Analytics', tamil: 'அறிக்கைகள் & பகுப்பாய்வு' },
  settingsRoles: { english: 'Settings & Roles', tamil: 'அமைப்புகள் & பாத்திரங்கள்' },
};

// ────────────────────────────────────────────
// CONTEXT CREATION
// ────────────────────────────────────────────
const AppContext = createContext(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
};

// ────────────────────────────────────────────
// HELPER: translate a key
// ────────────────────────────────────────────
export const useTranslation = () => {
  const { language } = useAppContext();
  const t = (key) => {
    const entry = translations[key];
    if (!entry) return key;
    return language === 'Tamil' ? entry.tamil : entry.english;
  };
  return { t, language };
};

// ────────────────────────────────────────────
// PROVIDER
// ────────────────────────────────────────────
export const AppProvider = ({ children }) => {
  const [theme, setThemeState] = useState(
    () => {
      const saved = localStorage.getItem('alumniConnectTheme');
      if (saved) return saved.toLowerCase();
      const legacy = localStorage.getItem('ac_theme');
      if (legacy) return legacy.toLowerCase();
      return 'light';
    }
  );
  const [language, setLanguageState] = useState(
    () => localStorage.getItem('ac_language') || 'English'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Centralized states from studentData
  const [mentors, setMentors] = useState(initialMentors);
  const [events, setEvents] = useState(initialEvents);
  const [requests, setRequests] = useState(initialRequests);
  const [activeMentorships, setActiveMentorships] = useState(initialActiveMentorships);
  const [meetingsHistory, setMeetingsHistory] = useState(initialMeetingsHistory);

  // Centralized states for alumni notifications
  const [alumniNotifications, setAlumniNotifications] = useState([
    {
      id: 1,
      category: 'Mentorship',
      title: 'New Mentorship Request from John Mathew',
      desc: 'John Mathew requested a 1-on-1 session on "System Design & Scalable Frontend Architecture".',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      category: 'Mentorship',
      title: 'Mentorship Session Reminder',
      desc: 'Upcoming session with Karthik Raja scheduled for Tomorrow at 05:00 PM IST.',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      category: 'Events',
      title: 'Invitation: Global Alumni Meetup 2026',
      desc: 'You are invited as a Keynote Speaker for Global Alumni Meetup on September 15, 2026.',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      category: 'System',
      title: 'Donation Receipt Generated',
      desc: 'Tax exemption certificate for your contribution of ₹15,000 to AI Innovation Lab is ready.',
      time: '2 days ago',
      read: true
    },
    {
      id: 5,
      category: 'Events',
      title: 'New Workshop Published: ML Transformer Pipeline',
      desc: 'Arun Kumar published a new technical workshop for computer science mentees.',
      time: '3 days ago',
      read: true
    }
  ]);

  // Centralized states for alumni mentorship requests and donations
  const [alumniRequests, setAlumniRequests] = useState([
    {
      id: 101,
      studentName: 'John Mathew',
      registerNumber: '21CS085',
      dept: 'Computer Science & Engineering',
      semester: 'Semester 5',
      cgpa: '8.85',
      matchPct: '98% MATCH',
      topic: 'System Design & Scalable Frontend Architecture',
      careerGoal: 'Aspiring Full Stack Engineer aiming for Big Tech interviews.',
      skills: ['React.js', 'System Design', 'Algorithms', 'Node.js'],
      status: 'Pending',
      requestDate: 'Today, 02:30 PM'
    },
    {
      id: 102,
      studentName: 'Ananya Sharma',
      registerNumber: '21CS099',
      dept: 'Information Technology',
      semester: 'Semester 5',
      cgpa: '9.12',
      matchPct: '95% MATCH',
      topic: 'Machine Learning Pipeline Optimization & PyTorch',
      careerGoal: 'Seeking guidance for AI/ML research internships and projects.',
      skills: ['Python', 'Machine Learning', 'PyTorch', 'Data Structures'],
      status: 'Pending',
      requestDate: 'Yesterday, 05:15 PM'
    },
    {
      id: 103,
      studentName: 'Karthik Raja',
      registerNumber: '22EC042',
      dept: 'Electronics & Communication',
      semester: 'Semester 3',
      cgpa: '8.40',
      matchPct: '88% MATCH',
      topic: 'Embedded Systems & Cloud IoT Integration',
      careerGoal: 'Building smart hardware IoT prototypes with cloud backends.',
      skills: ['C++', 'Embedded C', 'AWS IoT', 'Microcontrollers'],
      status: 'Accepted',
      requestDate: 'July 28, 2026'
    },
    {
      id: 104,
      studentName: 'Devendra Patel',
      registerNumber: '23ME015',
      dept: 'Mechanical Engineering',
      semester: 'Semester 1',
      cgpa: '7.85',
      matchPct: '82% MATCH',
      topic: 'CAD Design & Manufacturing Automation',
      careerGoal: 'Preparing for Core Mechanical design roles.',
      skills: ['SolidWorks', 'CAD', 'Python Basics'],
      status: 'Completed',
      requestDate: 'July 25, 2026',
      completionDate: 'July 29, 2026'
    }
  ]);

  const [alumniDonations, setAlumniDonations] = useState(45000);

  const setTheme = (val) => {
    if (!val) return;
    const normalized = val.toLowerCase();
    setThemeState(normalized);
    localStorage.setItem('alumniConnectTheme', normalized);
  };

  const setLanguage = (val) => {
    setLanguageState(val);
    localStorage.setItem('ac_language', val);
  };

  // Apply dark / light class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [theme]);

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      language, setLanguage,
      searchQuery, setSearchQuery,
      mentors, setMentors,
      events, setEvents,
      requests, setRequests,
      activeMentorships, setActiveMentorships,
      meetingsHistory, setMeetingsHistory,
      alumniNotifications, setAlumniNotifications,
      alumniRequests, setAlumniRequests,
      alumniDonations, setAlumniDonations,
      translations
    }}>
      {children}
    </AppContext.Provider>
  );
};
