import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  Image, 
  Paperclip, 
  Heart, 
  MessageSquare, 
  Share2, 
  Building2, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { mockAlumni } from '../data/mockAlumni';
import { mockEvents } from '../data/mockEvents';

export const DashboardPage = () => {
  const [postText, setPostText] = useState('');
  const [likedPosts, setLikedPosts] = useState({});

  const toggleLike = (id) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const feedPosts = [
    {
      id: "post-1",
      author: "Dr. Sarah Jenkins",
      avatar: mockAlumni[0].avatar,
      role: "Senior AI Research Scientist",
      company: "Google DeepMind",
      time: "2 hours ago",
      content: "Excited to share that our team at Google DeepMind is opening 3 summer internship spots for AI & Machine Learning undergrads! Reach out through AlumniConnect AI for direct referral support. 🚀 #AI #DeepMind #Mentorship",
      likes: 42,
      comments: 18,
      isReferralPost: true,
    },
    {
      id: "post-2",
      author: "Marcus Vance",
      avatar: mockAlumni[1].avatar,
      role: "Staff Software Engineer",
      company: "Stripe",
      time: "5 hours ago",
      content: "Just hosted an amazing system design prep session with 12 university seniors. Key takeaway: Always clarify scale parameters and latency constraints before diving into database schemas! Keep pushing!",
      likes: 89,
      comments: 24,
      isReferralPost: false,
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Main Feed Column */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* AI Spotlight Match Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>AI Recommendation Engine</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">Your Top Mentor Match Today: Dr. Sarah Jenkins</h2>
              <p className="text-xs text-indigo-200">Matched 98% based on your interest in Machine Learning & PyTorch.</p>
            </div>
            
            <Link to="/mentorship">
              <Button variant="secondary" size="md" className="bg-white text-indigo-900 hover:bg-slate-100 shrink-0" icon={ArrowRight}>
                Request Session
              </Button>
            </Link>
          </div>
        </div>

        {/* Create Post Box */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Alex Morgan"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
            />
            <textarea
              rows="3"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Ask for career advice, share a project, or request job referrals..."
              className="w-full text-sm p-3 rounded-2xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-colors">
                <Image className="w-4 h-4 text-indigo-600" />
                <span>Photo</span>
              </button>
              <button className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-colors">
                <Paperclip className="w-4 h-4 text-cyan-600" />
                <span>Attach Resume</span>
              </button>
            </div>
            <Button variant="primary" size="sm" icon={Send} disabled={!postText.trim()}>
              Post
            </Button>
          </div>
        </div>

        {/* Feed Posts List */}
        <div className="space-y-5">
          {feedPosts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              
              {/* Post Author Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                      {post.author}
                      <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    </h3>
                    <p className="text-xs text-indigo-600 font-semibold">{post.role}</p>
                    <p className="text-[11px] text-slate-400">{post.company} • {post.time}</p>
                  </div>
                </div>

                {post.isReferralPost && (
                  <Badge variant="accent" size="sm">
                    Job Referral Open
                  </Badge>
                )}
              </div>

              {/* Post Content */}
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {post.content}
              </p>

              {/* Post Reactions & Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 font-semibold transition-colors ${
                      likedPosts[post.id] ? 'text-rose-600' : 'hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedPosts[post.id] ? 'fill-current' : ''}`} />
                    <span>{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                  </button>

                  <button className="flex items-center gap-1.5 font-semibold hover:text-indigo-600 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments} Comments</span>
                  </button>

                  <button className="flex items-center gap-1.5 font-semibold hover:text-slate-900 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Right Sidebar Column */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Recommended Mentors Widget */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Recommended Mentors</h3>
            <Link to="/directory" className="text-xs text-indigo-600 font-bold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {mockAlumni.slice(1, 3).map((alumnus) => (
              <div key={alumnus.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={alumnus.avatar}
                    alt={alumnus.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{alumnus.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{alumnus.role}</p>
                    <span className="text-[10px] font-semibold text-indigo-600">{alumnus.matchScore}% Match</span>
                  </div>
                </div>

                <Link to="/mentorship">
                  <Button variant="outline" size="sm" className="px-2.5 py-1 text-xs">
                    Connect
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Widget */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Upcoming Events</h3>
            <Link to="/events" className="text-xs text-indigo-600 font-bold hover:underline">
              Calendar
            </Link>
          </div>

          <div className="space-y-3">
            {mockEvents.slice(0, 2).map((evt) => (
              <div key={evt.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{evt.category} • {evt.date}</span>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{evt.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{evt.attendees} RSVP'd</span>
                  <Link to="/events" className="text-indigo-600 font-bold hover:underline">
                    RSVP →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
