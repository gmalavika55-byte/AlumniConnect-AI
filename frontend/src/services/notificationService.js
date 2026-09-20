import api from './api';

export const notificationService = {
  getAdminNotifications: async () => {
    try {
      const response = await api.get('/admin/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      return [];
    }
  },

  getAdminUnreadCount: async () => {
    try {
      const response = await api.get('/admin/notifications/unread-count');
      return response.data?.unreadCount || 0;
    } catch (error) {
      console.error('Error fetching admin unread count:', error);
      return 0;
    }
  },

  getUserNotifications: async (userType, userId) => {
    try {
      const response = await api.get(`/notification/user/${userType}/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notifications for ${userType} ${userId}:`, error);
      return [];
    }
  },

  getUserUnreadCount: async (userType, userId) => {
    try {
      const response = await api.get(`/notification/user/${userType}/${userId}/unread-count`);
      return response.data?.unreadCount || 0;
    } catch (error) {
      console.error(`Error fetching unread count for ${userType} ${userId}:`, error);
      return 0;
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.put(`/notification/${id}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put('/admin/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  markUserAllAsRead: async (userType, userId) => {
    try {
      const response = await api.put(`/notification/user/${userType}/${userId}/read-all`);
      return response.data;
    } catch (error) {
      console.error(`Error marking all notifications as read for ${userType} ${userId}:`, error);
      throw error;
    }
  }
};
