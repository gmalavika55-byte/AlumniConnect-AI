export const mockMentors = [
  {
    id: 'm1',
    name: 'Dr. Sarah Jenkins',
    title: 'Senior AI Research Scientist',
    company: 'Google DeepMind',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    graduationYear: 2016,
    department: 'Computer Science',
    skills: ['Machine Learning', 'Python', 'AI Ethics', 'Research'],
    location: 'San Francisco, CA',
    availableSlots: 3,
    rating: 4.9,
    bio: 'Passionate about mentoring the next generation of AI researchers and engineers.'
  },
  {
    id: 'm2',
    name: 'Alex Rivera',
    title: 'Principal Software Engineer',
    company: 'Microsoft',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    graduationYear: 2018,
    department: 'Software Engineering',
    skills: ['Distributed Systems', 'Cloud Architecture', 'React', 'Go'],
    location: 'Seattle, WA',
    availableSlots: 2,
    rating: 4.8,
    bio: 'Helping students bridge the gap between academia and production engineering.'
  },
  {
    id: 'm3',
    name: 'Priya Sharma',
    title: 'Product Lead',
    company: 'Stripe',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    graduationYear: 2017,
    department: 'Business & Management',
    skills: ['Product Strategy', 'FinTech', 'UX Leadership', 'Agile'],
    location: 'New York, NY',
    availableSlots: 4,
    rating: 5.0,
    bio: 'Experienced product leader eager to guide aspiring product managers and entrepreneurs.'
  },
  {
    id: 'm4',
    name: 'David Chen',
    title: 'Cybersecurity Director',
    company: 'Palo Alto Networks',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    graduationYear: 2015,
    department: 'Information Security',
    skills: ['Cloud Security', 'Penetration Testing', 'Incident Response', 'Network Safety'],
    location: 'Austin, TX',
    availableSlots: 1,
    rating: 4.9,
    bio: 'Securing global infrastructure and mentoring future security leaders.'
  }
];

export const mockEvents = [
  {
    id: 'e1',
    title: 'Annual Global Alumni Tech Summit 2026',
    date: 'Aug 24, 2026',
    time: '10:00 AM - 4:00 PM EST',
    location: 'Main Campus Auditorium & Online Virtual Stream',
    category: 'Conference',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
    speaker: 'Dr. Sarah Jenkins & Panelists',
    attendeesCount: 340,
    status: 'Upcoming',
    tags: ['Tech', 'Networking', 'Keynote']
  },
  {
    id: 'e2',
    title: 'Alumni-Student Career Speed Mentoring',
    date: 'Sep 02, 2026',
    time: '5:30 PM - 7:30 PM EST',
    location: 'Student Activity Center - Hall B',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80',
    speaker: 'Alumni Mentors Group',
    attendeesCount: 120,
    status: 'Registration Open',
    tags: ['Mentorship', 'Career', 'Interactive']
  },
  {
    id: 'e3',
    title: 'FinTech & AI Innovations Webinar',
    date: 'Sep 15, 2026',
    time: '6:00 PM - 7:30 PM EST',
    location: 'Zoom Virtual Interactive Session',
    category: 'Webinar',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&auto=format&fit=crop&q=80',
    speaker: 'Priya Sharma (Stripe)',
    attendeesCount: 215,
    status: 'Upcoming',
    tags: ['FinTech', 'AI', 'Online']
  }
];

export const mockNotifications = [
  {
    id: 'n1',
    title: 'Mentorship Request Accepted',
    message: 'Dr. Sarah Jenkins accepted your mentorship request for Artificial Intelligence guidance.',
    timestamp: '10 mins ago',
    type: 'success',
    read: false
  },
  {
    id: 'n2',
    title: 'New Event Announcement',
    message: 'Registration is now open for Annual Global Alumni Tech Summit 2026.',
    timestamp: '2 hours ago',
    type: 'info',
    read: false
  },
  {
    id: 'n3',
    title: 'Profile Verification Updated',
    message: 'Your alumni batch degree credentials have been verified by Campus Admin.',
    timestamp: '1 day ago',
    type: 'warning',
    read: true
  },
  {
    id: 'n4',
    title: 'Monthly Alumni Digest',
    message: 'Check out the August edition of the Alumni Connect newsletter.',
    timestamp: '3 days ago',
    type: 'info',
    read: true
  }
];

export const mockUserProfiles = {
  student: {
    name: 'Marcus Vance',
    email: 'student@alumni.edu',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech CS (Final Year)',
    graduationYear: 2027,
    bio: 'Passionate computer science senior specializing in Full Stack & AI systems.',
    stats: {
      mentorsConnected: 4,
      eventsAttended: 8,
      applicationsSubmitted: 12,
      savedResources: 19
    }
  },
  alumni: {
    name: 'Dr. Sarah Jenkins',
    email: 'alumni@alumni.edu',
    role: 'Alumni',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    company: 'Google DeepMind',
    title: 'Senior AI Research Scientist',
    graduationYear: 2016,
    department: 'Computer Science',
    location: 'San Francisco, CA',
    bio: 'Alumni class of 2016. Actively mentoring students and giving back to the institution.',
    stats: {
      activeMentees: 6,
      eventsHosted: 5,
      networkSize: 340,
      contributions: '$5,000+'
    }
  },
  admin: {
    name: 'Elena Rostova',
    email: 'admin@alumni.edu',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Alumni Relations & Career Development',
    title: 'System Administrator',
    stats: {
      totalStudents: 3420,
      totalAlumni: 8950,
      pendingVerifications: 14,
      totalEvents: 42
    }
  }
};

export const mockUserTableData = [
  {
    key: '1',
    name: 'Liam Neeson',
    email: 'liam.n@alumni.edu',
    role: 'Alumni',
    department: 'Mechanical Engineering',
    gradYear: '2019',
    status: 'Verified',
    joinedDate: '2026-01-12'
  },
  {
    key: '2',
    name: 'Sophia Martinez',
    email: 'sophia.m@student.edu',
    role: 'Student',
    department: 'Computer Science',
    gradYear: '2027',
    status: 'Verified',
    joinedDate: '2026-02-04'
  },
  {
    key: '3',
    name: 'James Wilson',
    email: 'j.wilson@alumni.edu',
    role: 'Alumni',
    department: 'Electrical Engineering',
    gradYear: '2021',
    status: 'Pending',
    joinedDate: '2026-08-01'
  },
  {
    key: '4',
    name: 'Emma Watson',
    email: 'e.watson@student.edu',
    role: 'Student',
    department: 'Business & Finance',
    gradYear: '2026',
    status: 'Verified',
    joinedDate: '2026-03-15'
  },
  {
    key: '5',
    name: 'Michael Chang',
    email: 'm.chang@alumni.edu',
    role: 'Alumni',
    department: 'Data Science',
    gradYear: '2020',
    status: 'Pending',
    joinedDate: '2026-08-04'
  }
];
