/**
 * Centralized Route Map for Admin Notifications.
 * Maps notification types/categories/actions/titles to exact React Router paths.
 */
const ADMIN_NOTIFICATION_ROUTES = {
  // Student Registration & Student Management
  STUDENT_REGISTRATION: '/admin/students',
  NEW_STUDENT_REGISTRATION: '/admin/students',

  // Alumni Registration & Alumni Management
  ALUMNI_REGISTRATION: '/admin/alumni',
  NEW_ALUMNI_REGISTRATION: '/admin/alumni',

  // Mentorship Requests & Management
  MENTORSHIP_REQUEST: '/admin/mentorship',
  NEW_MENTORSHIP_REQUEST: '/admin/mentorship',

  // Events & Event Management
  EVENT_CREATED: '/admin/events',
  NEW_EVENT_CREATED: '/admin/events',
  NEW_EVENT: '/admin/events',
  EVENT_UPDATED: '/admin/events',
  EVENT_CANCELLED: '/admin/events',

  // Fundraising & Donations
  FUNDRAISING_CAMPAIGN: '/admin/fundraising',
  NEW_FUNDRAISING_CAMPAIGN: '/admin/fundraising',
  DONATION_RECEIVED: '/admin/fundraising',
  NEW_DONATION: '/admin/fundraising',

  // Reports & Analytics
  REPORTS: '/admin/reports',
  CAREER_ANALYTICS: '/admin/reports'
};

/**
 * Utility function to handle role-aware navigation for clicked notifications.
 * Inspects existing notification type/category/action/title/message and returns target route and state.
 */
export const getNotificationDestination = (notif, role = 'student') => {
  if (!notif) return null;

  const roleLower = (role || '').toLowerCase();

  // Extract type / category / action / title
  const rawType = (notif.type || notif.category || notif.action || notif.title || '').toUpperCase().trim();
  const titleLower = (notif.title || '').toLowerCase().trim();
  const msgLower = (notif.message || notif.desc || '').toLowerCase().trim();
  const text = `${titleLower} ${msgLower}`;

  // ── Helper to extract ID from text if present ──
  const extractId = (str) => {
    if (!str) return null;
    const match = str.match(/#(?:id[:\s]*)?(\d+)/i) || str.match(/mentorship\s*(?:id)?\s*#?(\d+)/i) || str.match(/session\s*#?(\d+)/i);
    return match ? Number(match[1]) : null;
  };

  const detectedMentorshipId = notif.mentorshipId || notif.requestId || notif.raw?.mentorshipId || extractId(text);
  const isChatMessage = text.includes('message') || text.includes('chat');

  // ── 1. ADMIN ROLE NAVIGATION ──
  if (roleLower === 'admin') {
    // 1A. Check exact type/category/action/title key mapping first
    for (const key in ADMIN_NOTIFICATION_ROUTES) {
      if (rawType.includes(key) || key.includes(rawType)) {
        return { path: ADMIN_NOTIFICATION_ROUTES[key] };
      }
    }

    // 1B. Student Registration (Must evaluate BEFORE general event keywords)
    if (
      text.includes('student registration') ||
      text.includes('new student') ||
      text.includes('student account') ||
      titleLower.includes('student registration')
    ) {
      return { path: '/admin/students' };
    }

    // 1C. Mentorship Requests
    if (
      text.includes('mentorship request') ||
      text.includes('new mentorship') ||
      titleLower.includes('mentorship')
    ) {
      return { path: '/admin/mentorship' };
    }

    // 1D. Alumni Registration & Approvals
    if (
      text.includes('alumni registration') ||
      text.includes('alumni approval') ||
      text.includes('new alumni') ||
      titleLower.includes('alumni')
    ) {
      return { path: '/admin/alumni', state: { filter: 'Pending' } };
    }

    // 1E. Event Notifications (Check specific event terms without matching student registration)
    if (
      text.includes('event created') ||
      text.includes('event updated') ||
      text.includes('event cancelled') ||
      text.includes('new event') ||
      text.includes('event registration') ||
      titleLower.includes('event') ||
      text.includes('webinar') ||
      text.includes('workshop') ||
      text.includes('hackathon')
    ) {
      return { path: '/admin/events', state: { tab: 'All' } };
    }

    // 1F. Fundraising & Donations
    if (
      text.includes('fundraising') ||
      text.includes('donation') ||
      text.includes('campaign') ||
      text.includes('donated') ||
      titleLower.includes('fundraising') ||
      titleLower.includes('donation')
    ) {
      return { path: '/admin/fundraising' };
    }

    // 1G. Reports & Career Analytics
    if (
      text.includes('career outcome') ||
      text.includes('analytics report') ||
      text.includes('ml trend') ||
      titleLower.includes('reports')
    ) {
      return { path: '/admin/reports' };
    }

    // 1H. Settings
    if (text.includes('setting') || text.includes('permission') || text.includes('system admin')) {
      return { path: '/admin/settings' };
    }

    // General fallback for admin
    if (text.includes('student')) return { path: '/admin/students' };
    if (text.includes('event')) return { path: '/admin/events' };
    if (text.includes('mentor')) return { path: '/admin/mentorship' };

    return { path: '/admin/dashboard' };
  }

  // ── 2. STUDENT ROLE NAVIGATION ──
  if (roleLower === 'student') {
    if (text.includes('mentorship') || text.includes('mentor') || text.includes('session')) {
      if (isChatMessage || text.includes('accepted') || text.includes('confirmed')) {
        return {
          path: '/student/mentorship',
          state: { tab: 'Active Mentorships', openChat: true, mentorshipId: detectedMentorshipId, rawText: text }
        };
      }
      if (text.includes('request') || text.includes('pending') || text.includes('submitted')) {
        return { path: '/student/mentorship', state: { tab: 'Mentorship Requests' } };
      }
      return { path: '/student/mentorship', state: { tab: 'Available Mentors' } };
    }

    if (text.includes('event') || text.includes('webinar') || text.includes('workshop') || text.includes('hackathon')) {
      if (text.includes('registered') || text.includes('my event')) {
        return { path: '/student/events', state: { tab: 'My Registered Events' } };
      }
      return { path: '/student/events', state: { tab: 'Upcoming Events' } };
    }

    if (text.includes('donation') || text.includes('fundraising')) {
      return { path: '/student/dashboard' };
    }

    if (text.includes('setting') || text.includes('password') || text.includes('security')) {
      return { path: '/student/settings' };
    }

    if (text.includes('certificate') || text.includes('resume') || text.includes('skill') || text.includes('profile')) {
      return { path: '/student/profile' };
    }

    return { path: '/student/dashboard' };
  }

  // ── 3. ALUMNI ROLE NAVIGATION ──
  if (roleLower === 'alumni') {
    if (text.includes('mentorship') || text.includes('mentor') || text.includes('session')) {
      if (isChatMessage || text.includes('accepted') || text.includes('active')) {
        return {
          path: '/alumni/mentorship',
          state: { tab: 'ACCEPTED', openChat: true, mentorshipId: detectedMentorshipId, rawText: text }
        };
      }
      return { path: '/alumni/mentorship', state: { tab: 'PENDING' } };
    }

    if (text.includes('event') || text.includes('webinar') || text.includes('workshop') || text.includes('hackathon')) {
      if (text.includes('organized') || text.includes('created') || text.includes('speaker')) {
        return { path: '/alumni/events', state: { tab: 'My Organized Events' } };
      }
      return { path: '/alumni/events', state: { tab: 'Available' } };
    }

    if (text.includes('donation') || text.includes('fundraising') || text.includes('campaign') || text.includes('donated')) {
      return { path: '/alumni/fundraising' };
    }

    if (text.includes('setting') || text.includes('password') || text.includes('security')) {
      return { path: '/alumni/settings' };
    }

    if (text.includes('profile') || text.includes('resume') || text.includes('skill')) {
      return { path: '/alumni/profile' };
    }

    return { path: '/alumni/dashboard' };
  }

  return { path: `/${roleLower}/dashboard` };
};

/**
 * Handles marking notification read AND performing route/tab navigation.
 */
export const handleNotificationNavigation = async (notif, role, navigate, markAsReadFn) => {
  if (!notif) return;

  try {
    if (markAsReadFn && typeof markAsReadFn === 'function') {
      const notifId = notif.id || notif.notificationId;
      if (notifId && (!notif.read && notif.status !== 'READ')) {
        await markAsReadFn(notifId);
      }
    }
  } catch (err) {
    console.warn('Error marking notification as read:', err);
  }

  const dest = getNotificationDestination(notif, role);
  if (dest && dest.path && navigate) {
    navigate(dest.path, { state: dest.state });
  }
};

