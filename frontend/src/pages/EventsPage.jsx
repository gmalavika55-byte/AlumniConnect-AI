import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, CheckCircle2, Sparkles, X, Share2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { mockEvents } from '../data/mockEvents';

export const EventsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [rsvpState, setRsvpState] = useState({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');

  const toggleRsvp = (id) => {
    setRsvpState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredEvents = mockEvents.filter((evt) => {
    return selectedCategory === 'All' || evt.category === selectedCategory;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Alumni Reunions & Summits</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Events Hub</h1>
          <p className="text-sm text-slate-600">Join virtual webinars, homecoming galas, and regional meetups</p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setCreateModalOpen(true)}
          icon={Plus}
        >
          Host an Event
        </Button>
      </div>

      {/* Featured Event Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
        <img
          src={mockEvents[0].image}
          alt={mockEvents[0].title}
          className="w-full h-80 object-cover group-hover:scale-102 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-6 sm:p-10 flex flex-col justify-end text-white space-y-3">
          <Badge variant="gradient" size="sm" className="w-fit">
            Featured Summit • {mockEvents[0].date}
          </Badge>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-2xl">{mockEvents[0].title}</h2>
          
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl line-clamp-2 leading-relaxed">
            {mockEvents[0].description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-indigo-400" /> {mockEvents[0].time}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-rose-400" /> {mockEvents[0].location}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4 text-emerald-400" /> {mockEvents[0].attendees} Registered</span>
          </div>

          <div className="pt-3">
            <Button
              variant={rsvpState[mockEvents[0].id] ? 'accent' : 'primary'}
              size="md"
              onClick={() => toggleRsvp(mockEvents[0].id)}
              icon={CheckCircle2}
            >
              {rsvpState[mockEvents[0].id] ? 'RSVP Confirmed ✓' : 'Register for Summit'}
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
        {['All', 'Summit', 'Mentorship', 'Reunion'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {cat} {cat === 'All' ? `(${mockEvents.length})` : ''}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all space-y-4 flex flex-col justify-between">
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="purple" size="sm">
                    {evt.category}
                  </Badge>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{evt.date} • {evt.time}</div>
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{evt.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{evt.description}</p>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {evt.location}
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">{evt.attendees + (rsvpState[evt.id] ? 1 : 0)} Attending</span>
              <Button
                variant={rsvpState[evt.id] ? 'accent' : 'outline'}
                size="sm"
                onClick={() => toggleRsvp(evt.id)}
              >
                {rsvpState[evt.id] ? "RSVP'd ✓" : 'RSVP Now'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Host Event Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Host an Alumni Event</h3>

            <form onSubmit={(e) => { e.preventDefault(); setCreateModalOpen(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. AI Startup Founders Panel 2026"
                  className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Category</label>
                  <select className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <option>Webinar</option>
                    <option>Summit</option>
                    <option>Reunion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Date</label>
                  <input type="date" className="w-full text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200" required />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="md">Publish Event</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
