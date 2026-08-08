import api from './api';
import { mockUserProfiles } from '../data/mockData';

export const authService = {
  // login service
login: async ({ email, password, remember }) => {

  const response = await api.post("/auth/login", {
    email,
    password
  });

  console.log(response.data);

  const data = response.data;
  console.log(data.user);

  localStorage.setItem(
    "alumni_user_data",
    JSON.stringify(data.user)
  );

  localStorage.setItem(
    "alumni_auth_token",
    "demo-token"
  );

  if (remember) {
    localStorage.setItem("alumni_remember_email", email);
  } else {
    localStorage.removeItem("alumni_remember_email");
  }

  return {
    success: true,
    role: data.role,
    user: data.user
  };
},
  // Fake register service
  register: async (registerPayload) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const userRole = registerPayload.role || 'student';
    const userData = {
      name: registerPayload.fullName || 'New Member',
      email: registerPayload.email,
      role: userRole.charAt(0).toUpperCase() + userRole.slice(1),
      graduationYear: registerPayload.graduationYear || 2026,
      department: registerPayload.department || 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      stats: userRole === 'alumni' 
        ? { activeMentees: 0, eventsHosted: 0, networkSize: 10, contributions: '$0' }
        : { mentorsConnected: 0, eventsAttended: 0, applicationsSubmitted: 0, savedResources: 0 }
    };

    const token = `fake-jwt-token-${userRole}-${Date.now()}`;
    localStorage.setItem('alumni_auth_token', token);
    localStorage.setItem('alumni_user_data', JSON.stringify(userData));

    return {
      success: true,
      token,
      user: userData,
      role: userRole,
    };
  },

  logout: () => {
    localStorage.removeItem('alumni_auth_token');
    localStorage.removeItem('alumni_user_data');
  },

  getCurrentUser: () => {
    try {
      const data = localStorage.getItem('alumni_user_data');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('alumni_auth_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('alumni_auth_token');
  },

  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user ? user.role.toLowerCase() : null;
  }
};
