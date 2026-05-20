import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, userAPI } from '../services/api';
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  ArrowPathIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  LinkIcon,
  SparklesIcon,
  CalendarIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { HandRaisedIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';

interface Stats {
  totalClinics: number;
  pendingClinics: number;
  totalDoctors: number;
  pendingDoctors: number;
  totalUsers: number;
  pendingUsers: number;
}

interface JoinRequest {
  userId?: string;
  fullName?: string;
  email?: string;
  role?: string | string[];
  clinicId: string;
  clinicName: string;
  address?: string;
  businessLink?: string;
  mobileNumber?: string;
  isApproved: boolean | null;
  status: 'pending' | 'approved' | 'rejected';
  addedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  approvedBy?: { fullName: string; email: string } | null;
}

interface JoinSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalClinics: 0,
    pendingClinics: 0,
    totalDoctors: 0,
    pendingDoctors: 0,
    totalUsers: 0,
    pendingUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Join requests state
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [joinSummary, setJoinSummary] = useState<JoinSummary>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [joinLoading, setJoinLoading] = useState(true);
  const [joinFilter, setJoinFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchStats();
    fetchJoinRequests();
  }, []);

  useEffect(() => {
    fetchJoinRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinFilter]);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.data);
    } catch (err: any) {
      setError('Could not load stats. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinRequests = async () => {
    setJoinLoading(true);
    try {
      const params: any = { limit: 5 };
      if (joinFilter !== 'all') params.status = joinFilter;
      // Owner/Admin sees requests made TO their clinics
      const response = await userAPI.getOwnerJoinRequests(params);
      const data = response.data.data;
      setJoinRequests(data.requests || []);
      setJoinSummary(data.summary || { total: 0, pending: 0, approved: 0, rejected: 0 });
    } catch {
      setJoinRequests([]);
    } finally {
      setJoinLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Clinics',
      value: stats.totalClinics,
      pending: stats.pendingClinics,
      pendingLabel: 'Pending Approval',
      icon: <BuildingOffice2Icon className="h-6 w-6 text-white" />,
      color: 'from-blue-500 to-indigo-600 shadow-blue-100',
      link: '/clinics',
    },
    {
      title: 'Pending Users',
      value: stats.pendingUsers,
      pending: 0,
      pendingLabel: '',
      icon: <ClockIcon className="h-6 w-6 text-white" />,
      color: 'from-emerald-500 to-teal-600 shadow-emerald-100',
      link: '/doctors',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      pending: 0,
      pendingLabel: '',
      icon: <UserGroupIcon className="h-6 w-6 text-white" />,
      color: 'from-purple-500 to-pink-600 shadow-purple-100',
      link: '/doctors',
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 animate-fadeIn">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-400 text-xs font-semibold tracking-wide animate-pulse">Loading dashboard environment...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto relative">
      {/* Dynamic Keyframes Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes waveHand {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes bgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        @keyframes subtleSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .anim-wave {
          animation: waveHand 2s ease-in-out infinite;
          transform-origin: bottom right;
        }
        .anim-bg-shift {
          background-size: 200% 200%;
          animation: bgShift 12s ease infinite;
        }
        .anim-float-orb {
          animation: floatOrb 6s ease-in-out infinite;
        }
        .anim-subtle-spin {
          animation: subtleSpin 20s linear infinite;
        }
        .hover-lift {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08);
        }
      `}} />

      {/* Header Banner - Sleek Center Gradient Overlay */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 rounded-[2.5rem] p-10 text-white shadow-xl shadow-emerald-100/50 relative overflow-hidden anim-bg-shift">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:20px_20px]" />
        
        {/* Floating background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl anim-float-orb" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/15 rounded-full blur-2xl anim-float-orb [animation-delay:2s]" />

        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none flex flex-wrap items-center gap-3">
            Welcome Back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!
            <HandRaisedIcon className="h-10 w-10 text-yellow-300 anim-wave shrink-0" />
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg font-semibold max-w-xl">
            Platform operations are running smoothly. Here is what requires your administrative attention today.
          </p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4.5 bg-rose-50 border-l-4 border-rose-500 rounded-2xl text-rose-800 text-sm font-semibold shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircleIcon className="h-5 w-5 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchStats}
            className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-rose-600 hover:text-rose-800 transition-all cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-rose-100"
          >
            <ArrowPathIcon className="h-4.5 w-4.5" /> Retry
          </button>
        </div>
      )}

      {/* Stats Cards Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <Link key={index} to={card.link} className="group cursor-pointer">
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg hover-lift transition-all duration-300 flex flex-col justify-between h-full min-h-[140px] relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${card.color} rounded-2xl shadow-lg flex items-center justify-center shrink-0`}>
                  {card.icon}
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs font-extrabold uppercase tracking-widest">{card.title}</p>
                  <p className="text-3.5xl font-black text-slate-800 tracking-tight mt-1">{card.value}</p>
                </div>
              </div>

              {card.pending > 0 ? (
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                  <span className="text-xs font-bold text-slate-500">{card.pendingLabel}</span>
                  <span className="px-2.5 py-0.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-extrabold border border-orange-100">
                    {card.pending} pending
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 pt-4 border-t border-slate-100 mt-2 text-emerald-600 text-xs font-bold">
                  <CheckCircleIcon className="h-4 w-4" /> Operations Complete
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg">
        <h2 className="text-2.5xl font-black text-slate-800 tracking-tight mb-6 flex items-center gap-2">
          Quick Actions <SparklesIcon className="h-6 w-6 text-emerald-500 anim-subtle-spin" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/clinics"
            className="flex items-center p-5 bg-gradient-to-br from-blue-50/40 via-white to-blue-50/10 border border-blue-100 rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all group"
          >
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mr-4 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
              <BuildingOffice2Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Review Clinic Approvals</h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold">
                {stats.pendingClinics > 0
                  ? `${stats.pendingClinics} clinic registrations waiting for inspection`
                  : 'All clinics have been verified'}
              </p>
            </div>
          </Link>

          <Link
            to="/doctors"
            className="flex items-center p-5 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/10 border border-emerald-100 rounded-2xl hover:border-emerald-200 hover:shadow-lg transition-all group"
          >
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mr-4 shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Review User Approvals</h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold">
                {stats.pendingUsers > 0
                  ? `${stats.pendingUsers} practitioner accounts pending administrative review`
                  : 'All doctor credentials verified'}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Clinic Join Requests Panel */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2.5xl font-black text-slate-800 tracking-tight">Clinic Join Requests</h2>
            <p className="text-slate-500 text-sm font-semibold mt-0.5">Doctor & staff requests requesting practice affiliations</p>
          </div>
        </div>

        {/* Summary Filter Badges - Modern grid pill design */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { key: 'all',      label: 'Total Requests',   value: joinSummary.total,    color: 'bg-slate-50 text-slate-600 border-slate-100' },
            { key: 'pending',  label: 'Pending Review',   value: joinSummary.pending,  color: 'bg-orange-50 text-orange-700 border-orange-100' },
            { key: 'approved', label: 'Approved Actions', value: joinSummary.approved, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { key: 'rejected', label: 'Rejected Actions', value: joinSummary.rejected, color: 'bg-rose-50 text-rose-700 border-rose-100' },
          ].map(({ key, label, value, color }) => (
            <button
              key={key}
              onClick={() => setJoinFilter(key as any)}
              className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                joinFilter === key
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-inner'
                  : 'border-transparent ' + color + ' hover:border-slate-200'
              }`}
            >
              <span className="text-2xl font-black">{value}</span>
              <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">{label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Lists */}
        {joinLoading ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-2">
            <div className="w-8 h-8 border-3 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-[10px] font-bold tracking-wider animate-pulse">Retrieving requests...</p>
          </div>
        ) : joinRequests.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-3xl border border-slate-100/50">
            <LinkIcon className="h-10 w-10 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-700 font-extrabold text-base">No join requests found</p>
            <p className="text-slate-400 text-xs mt-1">
              {joinFilter === 'all' ? 'No practitioners have submitted affiliation requests yet' : `No ${joinFilter} practice affiliation records located`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {joinRequests.map((req, idx) => (
              <div
                key={req.clinicId || idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl hover:shadow-md transition-all duration-300 relative overflow-hidden gap-4"
              >
                {/* Accent border */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-400 to-indigo-500" />

                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow text-white shrink-0">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-extrabold text-slate-800 text-sm truncate tracking-tight">
                        {req.fullName || 'Unknown Practitioner'}
                      </p>
                      {req.role && (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase rounded border border-indigo-100 shrink-0">
                          {Array.isArray(req.role) ? req.role[0] : req.role}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1 font-semibold mt-1">
                      <BuildingOffice2Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      Applied to: <span className="text-slate-700 font-extrabold">{req.clinicName || 'Unknown Practice'}</span>
                    </p>
                    {req.email && (
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5 flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" /> {req.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pl-1">
                  {/* Requested On Date */}
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Submitted</p>
                    <p className="text-xs font-bold text-slate-600 flex items-center gap-1 mt-0.5">
                      <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                      {req.addedAt ? new Date(req.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </p>
                  </div>

                  {/* Status Badges */}
                  {req.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-xl text-xs font-black uppercase tracking-wider border border-orange-100 shadow-sm">
                      <ClockIcon className="h-3.5 w-3.5" /> Pending
                    </span>
                  )}
                  {req.status === 'approved' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-wider border border-emerald-100 shadow-sm">
                      <CheckCircleIcon className="h-3.5 w-3.5" /> Approved
                    </span>
                  )}
                  {req.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-black uppercase tracking-wider border border-rose-100 shadow-sm">
                      <XCircleIcon className="h-3.5 w-3.5" /> Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
