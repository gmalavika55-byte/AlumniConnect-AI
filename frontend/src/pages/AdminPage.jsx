import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Users, Award, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const AdminPage = () => {
  const [verificationQueue, setVerificationQueue] = useState([
    {
      id: "ver-1",
      name: "Marcus Vance",
      email: "marcus@stripe.com",
      role: "Alumnus",
      batch: "2016",
      department: "Software Engineering",
      company: "Stripe",
      submittedDate: "Today, 09:40 AM",
      status: "Pending Verification"
    },
    {
      id: "ver-2",
      name: "Elena Rostova",
      email: "elena@figma.com",
      role: "Alumnus",
      batch: "2019",
      department: "UI/UX Design",
      company: "Figma",
      submittedDate: "Yesterday, 04:15 PM",
      status: "Pending Verification"
    }
  ]);

  const handleAction = (id, action) => {
    setVerificationQueue((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Institutional Governance Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin & Verification Dashboard</h1>
          <p className="text-sm text-slate-600">Authenticate alumni records, manage system access, and view network growth</p>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Verifications</span>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{verificationQueue.length} Queue</div>
          <p className="text-[11px] text-amber-700 font-semibold">Requires degree audit check</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Verified Users</span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">15,420</div>
          <p className="text-[11px] text-emerald-600 font-semibold">+12% growth this month</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Mentorship Sessions</span>
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">1,250+</div>
          <p className="text-[11px] text-indigo-600 font-semibold">98.4% Satisfaction score</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Referrals Granted</span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">3,810</div>
          <p className="text-[11px] text-emerald-600 font-semibold">89% callback success</p>
        </div>

      </div>

      {/* Verification Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">Alumni Identity Verification Queue</h2>
          <Badge variant="warning" size="sm">
            {verificationQueue.length} Action Needed
          </Badge>
        </div>

        {verificationQueue.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No pending verifications in queue! All alumni accounts are verified.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-50/80">
                  <th className="p-3.5 rounded-l-xl">Alumnus Name & Email</th>
                  <th className="p-3.5">Batch / Dept</th>
                  <th className="p-3.5">Company</th>
                  <th className="p-3.5">Submitted</th>
                  <th className="p-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {verificationQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>{item.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{item.email}</div>
                    </td>
                    <td className="p-3.5">{item.department} ('{item.batch})</td>
                    <td className="p-3.5 font-semibold text-indigo-600">{item.company}</td>
                    <td className="p-3.5 text-slate-500">{item.submittedDate}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAction(item.id, 'approve')}
                        icon={CheckCircle2}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleAction(item.id, 'reject')}
                        icon={XCircle}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
