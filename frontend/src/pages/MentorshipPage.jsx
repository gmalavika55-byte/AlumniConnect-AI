import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  UserCheck, 
  MessageSquare,
  ArrowRight,
  BookOpen,
  X
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { mockAlumni } from '../data/mockAlumni';

export const MentorshipPage = () => {
  const [activeTab, setActiveTab] = useState('find'); // 'find', 'sessions'
  const [selectedGoal, setSelectedGoal] = useState('Machine Learning & AI');
  const [bookingModal, setBookingModal] = useState(null);
  const [bookingDate, setBookingDate] = useState('2026-08-28');
  const [bookingTime, setBookingTime] = useState('15:00');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const activeSessions = [
    {
      id: "sess-1",
      mentor: "Dr. Sarah Jenkins",
      avatar: mockAlumni[0].avatar,
      role: "Senior AI Research Scientist @ Google DeepMind",
      date: "Aug 28, 2026",
      time: "3:00 PM EST",
      status: "Confirmed",
      topic: "PhD Research Pathways & PyTorch Optimization",
      meetingLink: "https://meet.google.com/abc-defg-hij"
    }
  ];

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingModal(null);
      setBookingConfirmed(false);
      setActiveTab('sessions');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-2">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Smart Vector Matching v2.4</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Mentorship & Career Hub</h1>
          <p className="text-sm text-slate-600">Get personalized career guidance and 1-on-1 mentorship sessions</p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('find')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'find' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Find AI Mentors
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'sessions' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Sessions ({activeSessions.length})
          </button>
        </div>
      </div>

      {activeTab === 'find' ? (
        <div className="space-y-8">
          
          {/* AI Goal Selector Box */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Sparkles className="w-4 h-4" />
              Select Target Career Domain
            </div>
            
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">What career domain do you want guidance on?</h2>

            <div className="flex flex-wrap gap-2 pt-2">
              {['Machine Learning & AI', 'System Design & Distributed Systems', 'Product Strategy', 'Cloud Architecture', 'Executive Coaching'].map((goal) => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    selectedGoal === goal
                      ? 'bg-white text-indigo-900 shadow-md scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* AI Recommended Mentors List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Recommended Mentors for "{selectedGoal}"</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockAlumni.map((alumnus) => (
                <div key={alumnus.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-lg transition-all">
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={alumnus.avatar}
                        alt={alumnus.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                      />
                      <div>
                        <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                          {alumnus.name}
                          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                        </h4>
                        <p className="text-xs text-indigo-600 font-semibold">{alumnus.role}</p>
                        <p className="text-xs text-slate-500">{alumnus.company} • Batch '{alumnus.batch}</p>
                      </div>
                    </div>
                    <Badge variant="brand" size="sm">
                      {alumnus.matchScore}% Match
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{alumnus.bio}"
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {alumnus.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 text-slate-700 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      Available for Mentorship
                    </span>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setBookingModal(alumnus)}
                      icon={Calendar}
                    >
                      Book 1-on-1 Session
                    </Button>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Active Mentorship Sessions View */
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Your Scheduled Mentorship Sessions</h3>

          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div key={session.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <img
                    src={session.avatar}
                    alt={session.mentor}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">{session.mentor}</h4>
                      <Badge variant="success" size="sm">{session.status}</Badge>
                    </div>
                    <p className="text-xs text-indigo-600 font-semibold">{session.role}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {session.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {session.time}</span>
                    </p>
                  </div>
                </div>

                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="accent" size="sm" icon={Video}>
                    Join Video Room
                  </Button>
                </a>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative">
            
            <button
              onClick={() => setBookingModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={bookingModal.avatar}
                alt={bookingModal.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">Schedule Session with {bookingModal.name}</h3>
                <p className="text-xs text-slate-500">{bookingModal.role} @ {bookingModal.company}</p>
              </div>
            </div>

            {bookingConfirmed ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Session Confirmed!</h4>
                <p className="text-xs text-slate-600">Calendar invitation & Google Meet link sent to your email address.</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Time Slot (EST)
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="10:00">10:00 AM EST</option>
                    <option value="13:00">1:00 PM EST</option>
                    <option value="15:00">3:00 PM EST</option>
                    <option value="17:00">5:00 PM EST</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setBookingModal(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md" icon={CheckCircle2}>
                    Confirm Reservation
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
