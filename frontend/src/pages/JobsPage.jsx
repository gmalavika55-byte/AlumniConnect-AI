import React, { useState } from 'react';
import { Briefcase, Building2, MapPin, DollarSign, Send, Plus, CheckCircle2, UserCheck, Sparkles, Search, X } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedJobModal, setSelectedJobModal] = useState(null);
  const [referralSent, setReferralSent] = useState(false);
  const [postJobOpen, setPostJobOpen] = useState(false);

  const mockJobs = [
    {
      id: "job-1",
      title: "AI Research Engineer (LLM Infrastructure)",
      company: "Google DeepMind",
      logo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
      location: "San Francisco, CA (Hybrid)",
      salary: "$180,000 - $240,000 / yr",
      type: "Full-Time",
      postedBy: "Dr. Sarah Jenkins (Class of '18)",
      postedTime: "1 day ago",
      skills: ["PyTorch", "Distributed Training", "CUDA", "C++"],
      description: "Join our foundational models group to build sub-millisecond inference pipelines for frontier LLMs."
    },
    {
      id: "job-2",
      title: "Backend Engineer - Payments Infrastructure",
      company: "Stripe",
      logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      location: "New York, NY (Remote)",
      salary: "$165,000 - $210,000 / yr",
      type: "Full-Time",
      postedBy: "Marcus Vance (Class of '16)",
      postedTime: "3 days ago",
      skills: ["Go", "Distributed Systems", "PostgreSQL", "Kafka"],
      description: "Scale high-throughput ledger services processing billions of global transactions."
    },
    {
      id: "job-3",
      title: "UI/UX Product Design Intern (Summer 2027)",
      company: "Figma",
      logo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
      location: "San Francisco, CA / Remote",
      salary: "$55 / hr",
      type: "Internship",
      postedBy: "Elena Rostova (Class of '19)",
      postedTime: "4 days ago",
      skills: ["Figma Design", "Design Systems", "Prototyping"],
      description: "Design next-generation collaborative canvas tools alongside industry leaders."
    }
  ];

  const filteredJobs = mockJobs.filter((j) => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || j.type === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleSendReferral = (e) => {
    e.preventDefault();
    setReferralSent(true);
    setTimeout(() => {
      setSelectedJobModal(null);
      setReferralSent(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Alumni Referral Network</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Jobs & Referral Board</h1>
          <p className="text-sm text-slate-600">Bypass ATS screeners with direct internal alumni referrals</p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setPostJobOpen(true)}
          icon={Plus}
        >
          Post an Opening
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, company, or skill..."
              className="w-full text-sm pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200/80 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Job Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                    <Badge variant={job.type === 'Internship' ? 'purple' : 'accent'} size="sm">
                      {job.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5" />
                    {job.company} • {job.location}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-sm font-extrabold text-slate-900">{job.salary}</div>
                <div className="text-[11px] text-slate-400">{job.postedTime}</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {job.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-slate-600 font-medium">Referral by: <strong className="text-slate-900">{job.postedBy}</strong></span>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedJobModal(job)}
                icon={Send}
              >
                Request Alumni Referral
              </Button>
            </div>

          </div>
        ))}
      </div>

      {/* Referral Request Drawer / Modal */}
      {selectedJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedJobModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-900">Request Referral for {selectedJobModal.title}</h3>
              <p className="text-xs text-slate-500">{selectedJobModal.company} • Referral contact: {selectedJobModal.postedBy}</p>
            </div>

            {referralSent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Referral Request Sent!</h4>
                <p className="text-xs text-slate-600">The alumnus will review your profile & attached resume.</p>
              </div>
            ) : (
              <form onSubmit={handleSendReferral} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Attach Resume Link / Pitch Note
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Briefly state why you are a strong fit for this role and provide your LinkedIn / Portfolio link..."
                    className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedJobModal(null)}>Cancel</Button>
                  <Button type="submit" variant="primary" size="md" icon={Send}>Submit Referral Request</Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {postJobOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setPostJobOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Post a Job or Internship</h3>

            <form onSubmit={(e) => { e.preventDefault(); setPostJobOpen(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Role Title</label>
                <input type="text" placeholder="e.g. Senior Frontend Engineer" className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Company Name</label>
                <input type="text" placeholder="e.g. Apple, Meta, OpenAI" className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200" required />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setPostJobOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="md">Post & Offer Referrals</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
