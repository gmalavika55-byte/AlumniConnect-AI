import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';

// Student Module Pages
import { StudentDashboard } from '../pages/StudentDashboard';
import { StudentProfilePage } from '../pages/StudentProfilePage';
import { StudentEventsPage } from '../pages/StudentEventsPage';
import { StudentMentorshipPage } from '../pages/StudentMentorshipPage';
import { StudentSettingsPage } from '../pages/StudentSettingsPage';
import { MentorProfilePage } from '../pages/MentorProfilePage';

// Alumni Module Pages
import { AlumniDashboard } from '../pages/AlumniDashboard';
import { AlumniProfilePage } from '../pages/AlumniProfilePage';
import { AlumniMentorshipPage } from '../pages/AlumniMentorshipPage';
import { AlumniStudentProfilePage } from '../pages/AlumniStudentProfilePage';
import { AlumniEventsPage } from '../pages/AlumniEventsPage';
import { AlumniFundraisingPage } from '../pages/AlumniFundraisingPage';
import { AlumniSettingsPage } from '../pages/AlumniSettingsPage';

// Admin Module Pages
import { AdminDashboard } from '../pages/AdminDashboard';
import { AdminStudentsPage } from '../pages/AdminStudentsPage';
import { AdminAlumniPage } from '../pages/AdminAlumniPage';
import { AdminEventsPage } from '../pages/AdminEventsPage';
import { AdminReportsPage } from '../pages/AdminReportsPage';
import { AdminSettingsPage } from '../pages/AdminSettingsPage';
import { AdminMentorshipPage } from '../pages/AdminMentorshipPage';
import { AdminFundraisingPage } from '../pages/AdminFundraisingPage';

import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Register Page */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Forgot Password Page */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Student Module Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfilePage />} />
        <Route path="/student/events" element={<StudentEventsPage />} />
        <Route path="/student/mentorship" element={<StudentMentorshipPage />} />
        <Route path="/student/mentor/:id" element={<MentorProfilePage />} />
        <Route path="/student/settings" element={<StudentSettingsPage />} />

        {/* Alumni Module Routes */}
        <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
        <Route path="/alumni/profile" element={<AlumniProfilePage />} />
        <Route path="/alumni/mentorship" element={<AlumniMentorshipPage />} />
        <Route path="/alumni/student/:id" element={<AlumniStudentProfilePage />} />
        <Route path="/alumni/events" element={<AlumniEventsPage />} />
        <Route path="/alumni/fundraising" element={<AlumniFundraisingPage />} />
        <Route path="/alumni/settings" element={<AlumniSettingsPage />} />

        {/* Admin Module Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudentsPage />} />
        <Route path="/admin/alumni" element={<AdminAlumniPage />} />
        <Route path="/admin/mentorship" element={<AdminMentorshipPage />} />
        <Route path="/admin/events" element={<AdminEventsPage />} />
        <Route path="/admin/fundraising" element={<AdminFundraisingPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Catch-all Fallback Redirect to Landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
