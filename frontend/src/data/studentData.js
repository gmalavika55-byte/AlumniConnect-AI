export const initialMentors = [
  {
    id: 1,
    name: 'Priya Sankar',
    avatar: 'PS',
    match: '98% match',
    role: 'Senior Software Engineer',
    company: 'Google India',
    skills: ['React', 'System Design', 'Cloud', 'Bangalore'],
    batch: '2015',
    rating: 4.9,
    bio: 'Ex-KCE alumni (Class of 2019). Specialized in Distributed Systems, React architecture, and big tech interview strategies.'
  },
  {
    id: 2,
    name: 'Arun Kumar',
    avatar: 'AK',
    match: '92% match',
    role: 'Staff ML Scientist',
    company: 'Amazon AWS',
    skills: ['Python', 'Deep Learning', 'NLP', 'Chennai'],
    batch: '2017',
    rating: 4.8,
    bio: 'Alumni Class of 2018. Passionate about guiding students in Natural Language Processing, Machine Learning, and Python optimization.'
  },
  {
    id: 3,
    name: 'Divya Rajan',
    avatar: 'DR',
    match: '87% match',
    role: 'Lead Cloud Architect',
    company: 'Flipkart',
    skills: ['AWS', 'Kubernetes', 'Go', 'DevOps', 'Hyderabad'],
    batch: '2018',
    rating: 4.7,
    bio: 'Alumni Class of 2020. Helps mentees master AWS microservices, DevOps automation, and scalable backend design.'
  }
];

export const initialEvents = [
  {
    id: 1,
    title: 'Tech Careers Panel 2026',
    category: 'Career',
    dayNum: '10',
    monthStr: 'AUG',
    time: '04:00 PM - 06:00 PM',
    venue: 'Main Auditorium & Zoom',
    registered: false,
    speaker: 'Priya Sankar (Google), Arun Kumar (Amazon)',
    description: 'Interact with industry leaders sharing strategies for tech campus placement, system design interviews, and AI careers.'
  },
  {
    id: 2,
    title: 'Alumni Networking Night',
    category: 'Networking',
    dayNum: '18',
    monthStr: 'AUG',
    time: '05:30 PM - 08:00 PM',
    venue: 'Campus Lawn & Alumni Hall',
    registered: true,
    speaker: 'Various Alumni Mentors',
    description: 'Exclusive informal networking event connecting current 3rd and 4th year engineering students with distinguished alumni.'
  },
  {
    id: 3,
    title: 'Build for India Hackathon 2026',
    category: 'Hackathon',
    dayNum: '25',
    monthStr: 'AUG',
    time: '09:00 AM - 06:00 PM',
    venue: 'Innovation Lab, Block C',
    registered: false,
    speaker: 'KCE Innovation Council',
    description: '24-hour hackathon building scalable technology solutions for Indian urban logistics, healthcare, and education.'
  },
  {
    id: 4,
    title: 'Cloud Architecture & DevOps Masterclass',
    category: 'Workshop',
    dayNum: '05',
    monthStr: 'SEP',
    time: '10:00 AM - 01:00 PM',
    venue: 'Lab 4 & Online',
    registered: false,
    speaker: 'Divya Rajan (Flipkart)',
    description: 'Hands-on workshop covering Docker containers, Kubernetes clusters, and AWS deployment pipelines.'
  }
];

export const initialRequests = [
  {
    id: 501,
    mentorId: 1,
    mentorName: 'Priya Sankar',
    role: 'Senior Software Engineer',
    company: 'Google India',
    date: 'Aug 5, 2026',
    status: 'Pending'
  },
  {
    id: 502,
    mentorId: 2,
    mentorName: 'Arun Kumar',
    role: 'Staff ML Scientist',
    company: 'Amazon AWS',
    date: 'Aug 2, 2026',
    status: 'Accepted'
  }
];

export const initialActiveMentorships = [
  {
    id: 601,
    mentorId: 2,
    mentorName: 'Arun Kumar',
    role: 'Staff ML Scientist',
    company: 'Amazon AWS',
    status: 'Active',
    startDate: 'Aug 3, 2026',
    nextMeeting: 'Aug 12, 2026 (05:00 PM)'
  }
];

export const initialMeetingsHistory = [
  {
    id: 701,
    mentorId: 1,
    mentorName: 'Priya Sankar',
    topic: 'Career Guidance Session',
    date: 'Aug 02, 2026',
    status: 'Completed'
  },
  {
    id: 702,
    mentorId: 2,
    mentorName: 'Arun Kumar',
    topic: 'Resume Review Session',
    date: 'July 24, 2026',
    status: 'Completed'
  }
];
