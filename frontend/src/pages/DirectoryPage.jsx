import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  MessageSquare, 
  Send,
  X,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { message } from 'antd';
import { authService } from '../services/authService';
import api from '../services/api';

export const DirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMentorModal, setSelectedMentorModal] = useState(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const res = await api.get('/alumni/getall');
      const data = res.data || [];
      const mapped = data.map(a => ({
        id: a.alumniId,
        name: a.name,
        role: a.designation || 'Software Engineer',
        company: a.currentCompany || 'Independent',
        batch: a.batch || 'N/A',
        department: a.department || 'General',
        location: a.location || 'India',
        matchScore: 95,
        skills: a.skills ? a.skills.split(',').map(s => s.trim()) : [],
        avatar: a.profilePhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        bio: a.bio || 'Alumni connect verified profile.',
        verified: true,
        availableForMentorship: a.availableForMentorship === 'Yes'
      }));
      setAlumniList(mapped);
    } catch (err) {
      console.error("Error loading alumni directory", err);
      message.error("Failed to load alumni directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const filteredAlumni = alumniList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesBatch = selectedBatch === 'All' || item.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  const handleOpenModal = (alumnus) => {
    setSelectedMentorModal(alumnus);
    setRequestSent(false);
    setRequestNotes('');
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    const student = authService.getCurrentUser();
    if (!student) {
      message.error("You must be logged in as a student to connect.");
      return;
    }

    try {
      const payload = {
        studentId: student.studentId,
        alumniId: selectedMentorModal.id,
        status: 'PENDING',
        remarks: requestNotes,
        requestDate: new Date().toISOString()
      };
      await api.post('/mentorship/add', payload);
      setRequestSent(true);
      setTimeout(() => {
        setSelectedMentorModal(null);
      }, 1800);
    } catch (err) {
      console.error("Error sending connection request:", err);
      message.error("Failed to send mentorship request.");
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Directory Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Verified Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Alumni Network Directory</h1>
          <p className="text-sm text-slate-600">Connect with 15,400+ verified alumni across global industries</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-all ${
              viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-all ${
              viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, company, skill (e.g. PyTorch, Stripe)..."
              className="w-full text-sm pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200/80 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Industries</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Fintech">Fintech</option>
              <option value="Product & Design">Product & Design</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200/80 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Batches</option>
              <option value="2018">Class of 2018</option>
              <option value="2016">Class of 2016</option>
              <option value="2019">Class of 2019</option>
              <option value="2012">Class of 2012</option>
            </select>
          </div>

        </div>
      </div>

      {/* Alumni Directory Grid / List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alumnus) => (
            <div
              key={alumnus.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={alumnus.avatar}
                      alt={alumnus.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                        {alumnus.name}
                        <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                      </h3>
                      <p className="text-xs text-indigo-600 font-semibold">{alumnus.role}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {alumnus.company} • Class of '{alumnus.batch}
                      </p>
                    </div>
                  </div>
                </div>

                <Badge variant="brand" size="sm">
                  {alumnus.matchScore}% AI Compatibility
                </Badge>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed italic">
                  "{alumnus.bio}"
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {alumnus.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 text-slate-700 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {alumnus.location}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenModal(alumnus)}
                  icon={MessageSquare}
                >
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {filteredAlumni.map((alumnus) => (
            <div key={alumnus.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src={alumnus.avatar}
                  alt={alumnus.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {alumnus.name}
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  </h3>
                  <p className="text-xs text-indigo-600 font-semibold">{alumnus.role} @ {alumnus.company}</p>
                  <p className="text-[11px] text-slate-400">{alumnus.department} • Batch '{alumnus.batch} • {alumnus.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <Badge variant="brand" size="sm">
                  {alumnus.matchScore}% Match
                </Badge>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenModal(alumnus)}
                  icon={MessageSquare}
                >
                  Request Mentorship
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connect & Mentorship Request Modal */}
      {selectedMentorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative">
            
            <button
              onClick={() => setSelectedMentorModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={selectedMentorModal.avatar}
                alt={selectedMentorModal.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedMentorModal.name}</h3>
                <p className="text-xs font-semibold text-indigo-600">{selectedMentorModal.role} @ {selectedMentorModal.company}</p>
                <Badge variant="brand" size="sm" className="mt-1">
                  {selectedMentorModal.matchScore}% AI Match
                </Badge>
              </div>
            </div>

            {requestSent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Request Sent Successfully!</h4>
                <p className="text-xs text-slate-600">The mentor has been notified. Check your inbox for scheduling availability.</p>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mentorship Goal / Discussion Topic
                  </label>
                  <textarea
                    rows="4"
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    placeholder="Introduce yourself and explain what guidance you are seeking (e.g. resume review, career transition into AI)..."
                    className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedMentorModal(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md" icon={Send}>
                    Send Request
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
