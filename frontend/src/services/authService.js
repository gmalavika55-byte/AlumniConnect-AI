import api from './api';


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

  if (data.user && data.role) {
    data.user.role = data.role;
  }

  localStorage.setItem(
    "alumni_user_data",
    JSON.stringify(data.user)
  );

  localStorage.setItem(
    "alumni_auth_token",
    data.token
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
  register: async (registerPayload) => {
    const isAlumni = registerPayload.role === 'alumni';
    const endpoint = isAlumni ? "/auth/alumni/register" : "/auth/student/register";
    
    const payload = isAlumni ? {
      registerNo: registerPayload.regNumber,
      name: registerPayload.fullName,
      email: registerPayload.email,
      password: registerPayload.password,
      department: registerPayload.department,
      batch: registerPayload.batch,
      availableForMentorship: "Yes"
    } : {
      registerNo: registerPayload.regNumber,
      name: registerPayload.fullName,
      email: registerPayload.email,
      password: registerPayload.password,
      department: registerPayload.department,
      course: registerPayload.course || "B.E.",
      yearOfStudy: registerPayload.yearOfStudy ? parseInt(registerPayload.yearOfStudy) : (registerPayload.year ? parseInt(registerPayload.year) : 3),
      batch: registerPayload.batch
    };

    const response = await api.post(endpoint, payload);
    
    const loginResponse = await api.post("/auth/login", {
      email: registerPayload.email,
      password: registerPayload.password
    });
    
    const data = loginResponse.data;
    if (data.user && data.role) {
      data.user.role = data.role;
    }
    localStorage.setItem("alumni_user_data", JSON.stringify(data.user));
    localStorage.setItem("alumni_auth_token", data.token);

    return {
      success: true,
      token: data.token,
      user: data.user,
      role: data.role
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
    return user && user.role ? user.role.toLowerCase() : null;
  }
};
