import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
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

  // Centralized states loaded from backend (or fallback to empty lists)
  const [mentors, setMentors] = useState([]);
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeMentorships, setActiveMentorships] = useState([]);
  const [meetingsHistory, setMeetingsHistory] = useState([]);

  // Centralized states for alumni notifications
  const [alumniNotifications, setAlumniNotifications] = useState([]);

  // Centralized states for alumni mentorship requests and donations
  const [alumniRequests, setAlumniRequests] = useState([]);
  const [alumniDonations, setAlumniDonations] = useState(0);

  const fetchBackendData = async () => {
    const token = localStorage.getItem('alumni_auth_token');
    const userStr = localStorage.getItem('alumni_user_data');
    if (!token || !userStr) return;

    try {
      const user = JSON.parse(userStr);
      const userRole = user.role ? user.role.toLowerCase() : '';
      const userId = user.studentId || user.alumniId || user.adminId;

      // 1. Fetch Alumni for Directory and Mentors lists
      const alumniRes = await api.get('/alumni/getall');
      const allAlumni = alumniRes.data || [];
      const mappedMentors = allAlumni.map(a => ({
        id: a.alumniId,
        name: a.name,
        avatar: a.name ? a.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'A',
        match: '95% match',
        role: a.designation || 'Software Engineer',
        company: a.currentCompany || 'Independent',
        skills: a.skills ? a.skills.split(',').map(s => s.trim()) : [],
        batch: a.batch || 'N/A',
        rating: 4.8,
        bio: a.currentCompany ? `Alumni (Class of ${a.batch}). Specialized in ${a.skills || 'Engineering'}.` : 'Alumni Connect Member',
        availableForMentorship: a.availableForMentorship,
        email: a.email,
        mobile: a.mobile,
        department: a.department,
        location: a.location,
        linkedin: a.linkedin
      }));
      setMentors(mappedMentors);

      // 2. Fetch Events
      const eventsRes = await api.get('/event/getall');
      const allEvents = eventsRes.data || [];

      // Fetch user specific registrations
      let registeredEventIds = [];
      if (userRole === 'student' || userRole === 'alumni') {
        const type = userRole === 'student' ? 'student' : 'alumni';
        try {
          const regRes = await api.get(`/event/registrations/user/${type}/${userId}`);
          registeredEventIds = (regRes.data || []).map(r => r.eventId);
        } catch (e) {
          console.error("Error loading user event registrations", e);
        }
      }

      const mappedEvents = allEvents.map(e => {
        const dateObj = e.eventDate ? new Date(e.eventDate) : new Date();
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return {
          id: e.eventId,
          title: e.title,
          category: e.category || 'General',
          dayNum: String(dateObj.getDate()),
          monthStr: months[dateObj.getMonth()],
          time: `${e.startTime || '10:00 AM'} - ${e.endTime || '12:00 PM'}`,
          venue: e.venue || 'Virtual',
          registered: registeredEventIds.includes(e.eventId),
          speaker: e.organizer || 'Guest Speaker',
          description: e.description || '',
          eventDate: e.eventDate,
          organizer: e.organizer
        };
      });
      setEvents(mappedEvents);

      // 3. Fetch Mentorship Requests
      const mentorshipsRes = await api.get('/mentorship/getall');
      const allMentorships = mentorshipsRes.data || [];

      // Filter based on active role
      const userRequests = allMentorships.filter(m => {
        if (userRole === 'student') return String(m.studentId) === String(userId);
        if (userRole === 'alumni') return String(m.alumniId) === String(userId);
        return true;
      });

      const formattedRequests = userRequests.map(r => {
        const m = mappedMentors.find(mt => String(mt.id) === String(r.alumniId)) || {};
        return {
          id: r.requestId,
          mentorId: r.alumniId,
          mentorName: r.alumni?.name || m.name || 'Alumni Mentor',
          role: r.alumni?.designation || m.role || 'Professional',
          company: r.alumni?.currentCompany || m.company || 'Enterprise',
          date: r.requestDate ? new Date(r.requestDate).toLocaleDateString() : 'N/A',
          status: r.status || 'Pending',
          studentId: r.studentId,
          studentName: r.student?.name || 'Student Name',
          remarks: r.remarks,
          meetingDate: r.meetingDate,
          meetingLink: r.meetingLink
        };
      });
      setRequests(formattedRequests);

      // Distribute student metrics
      setActiveMentorships(formattedRequests.filter(r => r.status === 'ACCEPTED'));
      setMeetingsHistory(formattedRequests.filter(r => r.status === 'COMPLETED' || r.status === 'DECLINED'));

      // Distribute alumni requests metrics
      if (userRole === 'alumni') {
        const formattedAlumniRequests = allMentorships
          .filter(m => String(m.alumniId) === String(userId))
          .map(r => ({
            id: r.requestId,
            studentName: r.student?.name || 'Student Name',
            registerNumber: r.student?.registerNo || 'N/A',
            dept: r.student?.department || 'N/A',
            semester: r.student?.yearOfStudy ? `Year ${r.student.yearOfStudy}` : 'N/A',
            cgpa: '8.5', // mock CGPA
            matchPct: '95% MATCH',
            topic: r.remarks || 'General Guidance',
            careerGoal: r.student?.careerGoal || 'Seeking mentorship',
            skills: r.student?.skills ? r.student.skills.split(',').map(s => s.trim()) : [],
            status: r.status || 'Pending',
            requestDate: r.requestDate ? new Date(r.requestDate).toLocaleDateString() : 'N/A'
          }));
        setAlumniRequests(formattedAlumniRequests);

        // Fetch donations for alumni
        try {
          const donationsRes = await api.get(`/fundraising/donations/alumni/${userId}`);
          const list = donationsRes.data || [];
          const total = list.reduce((sum, d) => sum + (d.amount || 0), 0);
          setAlumniDonations(total);
        } catch (e) {
          console.error("Error fetching alumni donations", e);
        }
      }

      // 4. Fetch notifications client-side scoped
      try {
        const notificationsRes = await api.get('/notification/getall');
        const list = notificationsRes.data || [];
        const userNotifications = list.filter(n => {
          // Verify that we only display the current user's notification data
          return String(n.userId) === String(userId) && String(n.userType).toLowerCase() === userRole;
        }).map(n => ({
          id: n.notificationId,
          category: n.title || 'System',
          title: n.title || 'Notification',
          desc: n.message || '',
          time: n.notificationDate ? new Date(n.notificationDate).toLocaleDateString() : 'Just now',
          read: n.status === 'READ'
        }));
        setAlumniNotifications(userNotifications);
      } catch (e) {
        console.error("Error fetching notifications", e);
      }

    } catch (err) {
      console.error('Error fetching backend data in AppContext:', err);
    }
  };

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

  // Load backend data immediately when authenticated on mount
  useEffect(() => {
    fetchBackendData();
  }, []);

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
      translations,
      refreshData: fetchBackendData
    }}>
      {children}
    </AppContext.Provider>
  );
};
