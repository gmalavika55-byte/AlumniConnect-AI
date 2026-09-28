import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';

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
  reports: { english: 'Reports', tamil: 'அறிக்கைகள்' },
  analytics: { english: 'Analytics', tamil: 'பகுப்பாய்வு' },
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

  // Centralized states for notifications (shared, filtered per role)
  const [alumniNotifications, setAlumniNotifications] = useState([]);
  const [studentNotifications, setStudentNotifications] = useState([]);

  // Centralized states for alumni mentorship requests and donations
  const [alumniRequests, setAlumniRequests] = useState([]);
  const [alumniDonations, setAlumniDonations] = useState(0);
  const [loading, setLoading] = useState(true);

  const isTransientError = (error) => {
    if (!error) return false;
    const status = error.response?.status;
    if (status === 502 || status === 503 || status === 504) return true;
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') return true;
    if (!error.response && (error.code === 'ERR_NETWORK' || error.message?.toLowerCase().includes('network') || error.message?.toLowerCase().includes('timeout'))) return true;
    return false;
  };

  const retryCountRef = useRef(0);
  const retryTimerRef = useRef(null);

  // Clear retry timer on unmount
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  const fetchBackendData = useCallback(async (isRetry = false) => {
    const token = localStorage.getItem('alumni_auth_token');
    const userStr = localStorage.getItem('alumni_user_data');
    if (!token || !userStr) {
      setLoading(false);
      return;
    }

    if (!isRetry) {
      retryCountRef.current = 0;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    }

    let user;
    try {
      user = JSON.parse(userStr);
    } catch {
      setLoading(false);
      return;
    }

    const userRole = user.role ? user.role.toLowerCase() : '';
    const userId = user.studentId || user.alumniId || user.adminId || user.id || user.userId;

    let hasTransientFailure = false;

    // 1. Fetch Alumni Sub-task
    const fetchAlumniTask = async () => {
      try {
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
        return { success: true, mentors: mappedMentors };
      } catch (err) {
        if (isTransientError(err)) hasTransientFailure = true;
        console.warn('Alumni fetch failed (non-fatal):', err.message);
        return { success: false, isTransient: isTransientError(err) };
      }
    };

    // 2. Fetch Events Sub-task
    const fetchEventsTask = async () => {
      try {
        const eventsRes = await api.get('/event/getall');
        const allEvents = eventsRes.data || [];

        let registeredEventIds = [];
        if ((userRole === 'student' || userRole === 'alumni') && userId) {
          const type = userRole === 'student' ? 'student' : 'alumni';
          try {
            const regRes = await api.get(`/event/registrations/user/${type}/${userId}`);
            registeredEventIds = (regRes.data || []).map(r => r.eventId || (r.event ? r.event.eventId : null)).filter(Boolean);
          } catch (e) {
            if (isTransientError(e)) hasTransientFailure = true;
            console.warn("Error loading user event registrations (non-fatal)", e.message);
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
            startTime: e.startTime,
            endTime: e.endTime,
            venue: e.venue || 'Virtual',
            registered: registeredEventIds.includes(e.eventId),
            speaker: e.organizer || 'Guest Speaker',
            description: e.description || '',
            eventDate: e.eventDate,
            organizer: e.organizer,
            createdByType: e.createdByType,
            status: e.status || 'UPCOMING',
            audience: e.audience || 'BOTH',
            maxParticipants: e.maxParticipants,
            registeredCount: e.registeredCount
          };
        });

        const uniqueEvents = [];
        const seenIds = new Set();
        for (const ev of mappedEvents) {
          if (ev.id && !seenIds.has(ev.id)) {
            seenIds.add(ev.id);
            uniqueEvents.push(ev);
          }
        }
        setEvents(uniqueEvents);
        return { success: true };
      } catch (err) {
        if (isTransientError(err)) hasTransientFailure = true;
        console.warn("Event fetch failed (non-fatal):", err.message);
        return { success: false, isTransient: isTransientError(err) };
      }
    };

    // 3. Fetch Mentorships Sub-task
    const fetchMentorshipTask = async (currentMentors) => {
      try {
        const mentorshipsRes = await api.get('/mentorship/getall');
        const allMentorships = mentorshipsRes.data || [];

        const userRequests = allMentorships.filter(m => {
          if (userRole === 'student') return String(m.studentId) === String(userId);
          if (userRole === 'alumni') return String(m.alumniId) === String(userId);
          return true;
        });

        const mentorList = currentMentors || mentors;
        const formattedRequests = userRequests.map(r => {
          const m = mentorList.find(mt => String(mt.id) === String(r.alumniId)) || {};
          return {
            id: r.requestId,
            mentorId: r.alumniId,
            mentorName: r.alumni?.name || m.name || 'Alumni Mentor',
            role: r.alumni?.designation || m.role || 'Professional',
            company: r.alumni?.currentCompany || m.company || 'Enterprise',
            date: r.requestDate ? new Date(r.requestDate).toLocaleDateString() : 'N/A',
            status: r.status ? r.status.toUpperCase() : 'PENDING',
            studentId: r.studentId,
            studentName: r.student?.name || 'Student Name',
            topic: r.remarks || 'General Guidance',
            remarks: r.remarks,
            meetingDate: r.meetingDate,
            meetingLink: r.meetingLink
          };
        });

        setRequests(formattedRequests);
        setActiveMentorships(formattedRequests.filter(r => r.status === 'ACCEPTED'));
        setMeetingsHistory(formattedRequests.filter(r => (r.status || '').toUpperCase() === 'COMPLETED'));

        if (userRole === 'alumni') {
          const formattedAlumniRequests = allMentorships
            .filter(m => String(m.alumniId) === String(userId))
            .map(r => ({
              id: r.requestId,
              studentId: r.studentId,
              studentName: r.student?.name || 'Student Name',
              registerNumber: r.student?.registerNo || 'N/A',
              dept: r.student?.department || 'N/A',
              semester: r.student?.yearOfStudy ? `Year ${r.student.yearOfStudy}` : 'N/A',
              cgpa: r.student?.cgpa || 'N/A',
              matchPct: '95% MATCH',
              topic: r.remarks || 'General Guidance',
              careerGoal: r.student?.careerGoal || 'Seeking mentorship',
              skills: r.student?.skills ? r.student.skills.split(',').map(s => s.trim()) : [],
              status: r.status ? r.status.toUpperCase() : 'PENDING',
              requestDate: r.requestDate ? new Date(r.requestDate).toLocaleDateString() : 'N/A',
              completionDate: r.requestDate ? new Date(r.requestDate).toLocaleDateString() : 'N/A'
            }));
          setAlumniRequests(formattedAlumniRequests);
        }
        return { success: true };
      } catch (err) {
        if (isTransientError(err)) hasTransientFailure = true;
        console.warn('Mentorship fetch failed (non-fatal):', err.message);
        return { success: false, isTransient: isTransientError(err) };
      }
    };

    // 4. Fetch Donations Sub-task
    const fetchDonationsTask = async () => {
      if (userRole !== 'alumni') return { success: true };
      try {
        const donationsRes = await api.get(`/fundraising/donations/alumni/${userId}`);
        const list = donationsRes.data || [];
        const total = list.reduce((sum, d) => sum + (d.amount || 0), 0);
        setAlumniDonations(total);
        return { success: true };
      } catch (err) {
        if (isTransientError(err)) hasTransientFailure = true;
        console.warn("Donations fetch failed (non-fatal):", err.message);
        return { success: false, isTransient: isTransientError(err) };
      }
    };

    // 5. Fetch Notifications Sub-task
    const fetchNotificationsTask = async () => {
      try {
        let studentPref = null;
        if (userRole === 'student') {
          try {
            const studentRes = await api.get(`/student/get/${userId}`);
            if (studentRes.data?.notificationPref) {
              studentPref = JSON.parse(studentRes.data.notificationPref);
            }
          } catch (err) {
            console.warn("Student pref fetch failed (non-fatal):", err.message);
          }
        }

        const notificationsRes = await api.get('/notification/getall');
        const list = notificationsRes.data || [];
        const mapNotification = n => ({
          id: n.notificationId,
          category: n.title || 'System',
          title: n.title || 'Notification',
          desc: n.message || '',
          time: n.notificationDate ? new Date(n.notificationDate).toLocaleDateString() : 'Just now',
          read: n.status === 'READ'
        });
        const myNotifications = list.filter(n => {
          const nType = n.userType ? String(n.userType).toUpperCase() : '';
          if (userRole === 'admin') {
            return nType === 'ADMIN';
          }
          const matchesUser = String(n.userId) === String(userId);
          const matchesRole = nType === userRole.toUpperCase();
          return matchesUser && matchesRole;
        }).map(mapNotification)
          .sort((a, b) => b.id - a.id);

        const filteredMyNotifications = myNotifications.filter(n => {
          if (userRole !== 'student' || !studentPref) return true;
          const allDisabled = studentPref.mentorship === false && studentPref.events === false && studentPref.career === false;
          if (allDisabled) return false;

          const titleLower = (n.title || '').toLowerCase();
          const descLower = (n.desc || '').toLowerCase();
          if (studentPref.mentorship === false && (titleLower.includes('mentorship') || titleLower.includes('session') || titleLower.includes('mentor') || descLower.includes('mentorship') || descLower.includes('session') || descLower.includes('mentor'))) {
            return false;
          }
          if (studentPref.events === false && (titleLower.includes('event') || titleLower.includes('webinar') || titleLower.includes('hackathon') || descLower.includes('event') || descLower.includes('webinar') || descLower.includes('hackathon'))) {
            return false;
          }
          if (studentPref.career === false && (titleLower.includes('career') || titleLower.includes('job') || titleLower.includes('internship') || descLower.includes('career') || descLower.includes('job') || descLower.includes('internship'))) {
            return false;
          }
          return true;
        });

        if (userRole === 'alumni') {
          setAlumniNotifications(myNotifications);
        } else if (userRole === 'student') {
          setStudentNotifications(filteredMyNotifications);
          setAlumniNotifications([]);
        } else {
          setAlumniNotifications(myNotifications);
        }
        return { success: true };
      } catch (err) {
        if (isTransientError(err)) hasTransientFailure = true;
        console.warn("Notifications fetch failed (non-fatal):", err.message);
        return { success: false, isTransient: isTransientError(err) };
      }
    };

    // Execute in parallel via Promise.allSettled
    await Promise.allSettled([
      fetchAlumniTask().then(r => fetchMentorshipTask(r.mentors)),
      fetchEventsTask(),
      fetchDonationsTask(),
      fetchNotificationsTask()
    ]);

    setLoading(false);

    // Bounded automatic retry if any service failed due to cold start
    if (hasTransientFailure && retryCountRef.current < 3) {
      retryCountRef.current += 1;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryTimerRef.current = setTimeout(() => {
        fetchBackendData(true);
      }, 4000);
    } else if (!hasTransientFailure) {
      retryCountRef.current = 0;
    }
  }, []);

  const markNotificationAsRead = async (notifId) => {
    try {
      const res = await api.get(`/notification/get/${notifId}`);
      const notifObj = res.data;
      if (notifObj && notifObj.status !== 'READ') {
        notifObj.status = 'READ';
        await api.put('/notification/update', notifObj);
        await fetchBackendData();
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllNotificationsAsRead = async (notifsList) => {
    try {
      const unread = (notifsList || []).filter(n => !n.read);
      for (const n of unread) {
        try {
          const res = await api.get(`/notification/get/${n.id}`);
          const notifObj = res.data;
          if (notifObj && notifObj.status !== 'READ') {
            notifObj.status = 'READ';
            await api.put('/notification/update', notifObj);
          }
        } catch (e) {
          console.error('Error updating notification:', e);
        }
      }
      await fetchBackendData();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
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
      studentNotifications, setStudentNotifications,
      alumniRequests, setAlumniRequests,
      alumniDonations, setAlumniDonations,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      translations,
      loading,
      refreshData: fetchBackendData
    }}>
      {children}
    </AppContext.Provider>
  );
};
