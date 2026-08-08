import React, { createContext, useContext, useState, useEffect } from 'react';

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
  eventManagement: { english: 'Event Management', tamil: 'நிகழ்வு மேலாண்மை' },
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
    () => localStorage.getItem('ac_theme') || 'Light'
  );
  const [language, setLanguageState] = useState(
    () => localStorage.getItem('ac_language') || 'English'
  );

  const setTheme = (val) => {
    setThemeState(val);
    localStorage.setItem('ac_theme', val);
  };

  const setLanguage = (val) => {
    setLanguageState(val);
    localStorage.setItem('ac_language', val);
  };

  // Apply dark / light class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'Dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [theme]);

  return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage, translations }}>
      {children}
    </AppContext.Provider>
  );
};
