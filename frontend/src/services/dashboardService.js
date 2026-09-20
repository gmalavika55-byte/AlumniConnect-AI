import { mockMentors, mockEvents, mockUserProfiles, mockUserTableData } from '../data/mockData';
import { notificationService } from './notificationService';

export const dashboardService = {
  getStudentDashboardData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      profile: mockUserProfiles.student,
      mentors: mockMentors,
      events: mockEvents,
      notifications: [],
    };
  },

  getAlumniDashboardData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      profile: mockUserProfiles.alumni,
      events: mockEvents,
      notifications: [],
      menteesRequests: [
        { id: 'req1', name: 'Sophia Martinez', degree: 'B.Tech CS 2027', topic: 'AI & Machine Learning Guidance', date: 'Yesterday' },
        { id: 'req2', name: 'David Kim', degree: 'B.Tech Software Eng 2026', topic: 'Resume Review & Interview Prep', date: '3 days ago' },
      ]
    };
  },

  getAdminDashboardData: async () => {
    let liveNotifs = [];
    try {
      liveNotifs = await notificationService.getAdminNotifications();
    } catch (e) {
      console.error('Failed to load admin notifications:', e);
    }

    return {
      profile: mockUserProfiles.admin,
      stats: mockUserProfiles.admin.stats,
      usersTable: mockUserTableData,
      notifications: liveNotifs,
      systemMetrics: {
        activeMentorships: 142,
        upcomingEvents: 12,
        verifiedAlumniRate: '94.2%',
        platformGrowth: '+18.5%'
      }
    };
  }
};
