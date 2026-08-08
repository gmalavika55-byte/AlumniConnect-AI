# AlumniConnect AI — AI-Powered Alumni Network & Mentorship Platform

A modern, production-ready frontend built with **React 18**, **Vite**, **Tailwind CSS**, and **React Router DOM**, matching the Figma design specifications.

---

## 🌟 Key Features & Pages

1. **Public Landing Page (`/`)**:
   - Hero section with ambient glow backdrops & live v2.4 AI intelligence badge.
   - Interactive AI Match preview card (98% compatibility with Dr. Sarah Jenkins).
   - Live platform stats counter bar (15,400+ Alumni, 1,250+ Mentors, 3,800+ Referrals, 96.4% AI Accuracy).
   - Core capabilities grid & featured alumni carousel.
   - Featured event cards with RSVP triggers.

2. **Authentication System**:
   - **Sign In (`/login`)**: Role selector for Student, Alumnus, and Admin with remember-me checkbox and password reset navigation.
   - **Register (`/register`)**: Account creation with role selection, batch year picker, department dropdown, company info, and terms verification.
   - **Forgot Password (`/forgot-password`)**: Email password reset dispatch interface.

3. **Student & Alumni Feed Dashboard (`/dashboard`)**:
   - Sidebar navigation & user profile summary.
   - AI recommendation spotlight banner.
   - Rich post creation box with photo and resume attachments.
   - Interactive activity feed with likes, comments, and referral tags.
   - Right sidebar widgets for recommended mentors & upcoming events.

4. **Alumni Directory & Network (`/directory`)**:
   - Real-time search by name, company, or skills.
   - Filter controls by industry and graduation batch.
   - Grid and List view toggle modes.
   - AI match percentage indicators (98%, 94%, 91%, 89%).
   - Direct Mentorship Request Modal.

5. **AI Mentorship & Career Hub (`/mentorship`)**:
   - AI target goal selector (Machine Learning, System Design, Product Strategy, Cloud Architecture).
   - Recommended mentor cards with AI match scores & skill tags.
   - Active 1-on-1 sessions tracker with Google Meet video call room launcher.
   - Interactive session booking modal with date & time slot selection.

6. **Events & Reunions Hub (`/events`)**:
   - Featured summit banner with live attendee counter.
   - Category filters (All, Summits, Mentorship, Reunions).
   - Interactive RSVP state toggle buttons.
   - Host an Event modal.

7. **Jobs & Referral Board (`/jobs`)**:
   - Filterable job listings with salary ranges, location tags, and alumni referral badges.
   - Direct Alumni Referral request modal drawer.
   - Post a Job / Internship modal form.

8. **User Profile & Settings (`/profile`)**:
   - Header cover banner, avatar, and verification badge.
   - Education and research experience timeline.
   - Edit Profile modal & Account Settings tab for notifications and privacy controls.

9. **Admin & Verification Portal (`/admin`)**:
   - Governance metric cards (Pending verifications, Active users, Satisfaction score).
   - Alumni Identity Verification Queue table with one-click **Approve** and **Reject** actions.

---

## 🛠️ Technology Stack

- **Framework**: React 18+ (Vite builder)
- **Styling**: Tailwind CSS (with Glassmorphic utilities & custom micro-animations)
- **Routing**: `react-router-dom` (v6+)
- **Icons**: `lucide-react` & `react-icons/fa6`
- **HTTP Client**: Axios (configured in `src/services/api.js` for REST API integration)

---

## 📂 Folder Structure

```
alumni-connect-ai/
├── src/
│   ├── assets/              # Static media & brand assets
│   ├── components/
│   │   ├── common/          # Button, Input, Badge
│   │   └── layout/          # Navbar, Sidebar, Footer
│   ├── pages/               # LandingPage, LoginPage, RegisterPage, ForgotPasswordPage,
│   │                        # DashboardPage, DirectoryPage, MentorshipPage, EventsPage,
│   │                        # JobsPage, ProfilePage, AdminPage
│   ├── layouts/             # PublicLayout, DashboardLayout
│   ├── routes/              # AppRoutes.jsx
│   ├── services/            # api.js (Axios base instance & service endpoints)
│   ├── data/                # mockAlumni.js, mockEvents.js
│   ├── index.css            # Tailwind directives & glassmorphism utilities
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Quick Start / Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://127.0.0.1:5173/`.

3. **Build Production Bundle**:
   ```bash
   npm run build
   ```
