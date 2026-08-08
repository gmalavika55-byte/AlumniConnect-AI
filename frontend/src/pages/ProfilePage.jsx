import React, { useState } from 'react';
import { User, Mail, Building2, GraduationCap, MapPin, Edit3, ShieldCheck, CheckCircle2, Award, Settings, Bell, Lock, X } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'settings'
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    role: "AI & Machine Learning Scholar",
    department: "Computer Science & Artificial Intelligence",
    batch: "2026",
    university: "Global Tech University",
    location: "Boston, MA",
    bio: "Undergraduate researcher passionate about transformer architectures, agentic systems, and high-performance computing. Seeking full-time AI engineering opportunities.",
    skills: ["Python", "PyTorch", "React.js", "Tailwind CSS", "LLMs", "Vector DBs"],
  });

  return (
    <div className="space-y-8">
      
      {/* Profile Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden relative">
        <div className="h-44 gradient-bg relative">
          <button
            onClick={() => setEditModalOpen(true)}
            className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Cover & Profile
          </button>
        </div>

        <div className="p-6 sm:p-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 mb-6">
            <div className="flex items-end gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                alt={profile.name}
                className="w-28 h-28 rounded-3xl object-cover ring-4 ring-white shadow-lg"
              />
              <div className="pb-1">
                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  {profile.name}
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                </h1>
                <p className="text-sm font-semibold text-indigo-600">{profile.role}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {profile.department} • Batch '{profile.batch}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="success" size="lg" icon={ShieldCheck}>
                Verified Member
              </Badge>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {profile.bio}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-t border-slate-100 flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Profile Overview
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Account Settings
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Skills & Expertise */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Skills & Core Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Timeline Experience */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Education & Projects</h3>
              
              <div className="space-y-6 border-l-2 border-slate-100 pl-4 ml-2">
                <div className="relative space-y-1">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
                  <h4 className="text-sm font-bold text-slate-900">B.S. in Computer Science & AI</h4>
                  <p className="text-xs text-indigo-600 font-semibold">{profile.university}</p>
                  <p className="text-[11px] text-slate-400">2022 - 2026 • GPA: 3.92 / 4.0</p>
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                    Lead researcher at Autonomous Agents Lab. Published 2 workshop papers on multi-agent collaboration frameworks.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Contact & Info</h3>
              
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>alex.morgan@university.edu</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Verified Student Record</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Settings Tab */
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900">Account & Security Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Email Notifications</h4>
                <p className="text-[11px] text-slate-500">Receive alerts when alumni accept your mentorship request</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Public Profile Visibility</h4>
                <p className="text-[11px] text-slate-500">Allow verified alumni to view your resume pitch</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>

            <form onSubmit={(e) => { e.preventDefault(); setEditModalOpen(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Headline Bio</label>
                <textarea
                  rows="3"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="md">Save Profile Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
