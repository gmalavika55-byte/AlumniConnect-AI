import { mockMentors, mockEvents, mockNotifications, mockUserProfiles, mockUserTableData } from '../data/mockData';

export const dashboardService = {
  getStudentDashboardData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      profile: mockUserProfiles.student,
      mentors: mockMentors,
      events: mockEvents,
      notifications: mockNotifications,
    };
  },

  getAlumniDashboardData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      profile: mockUserProfiles.alumni,
      events: mockEvents,
      notifications: mockNotifications,
      menteesRequests: [
        { id: 'req1', name: 'Sophia Martinez', degree: 'B.Tech CS 2027', topic: 'AI & Machine Learning Guidance', date: 'Yesterday' },
        { id: 'req2', name: 'David Kim', degree: 'B.Tech Software Eng 2026', topic: 'Resume Review & Interview Prep', date: '3 days ago' },
      ]
    };
  },

  getAdminDashboardData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      profile: mockUserProfiles.admin,
      stats: mockUserProfiles.admin.stats,
      usersTable: mockUserTableData,
      notifications: mockNotifications,
      systemMetrics: {
        activeMentorships: 142,
        upcomingEvents: 12,
        verifiedAlumniRate: '94.2%',
        platformGrowth: '+18.5%'
      }
    };
  }
};
