import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BuildingOffice2Icon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  UserIcon,
  PhoneIcon,
  CheckIcon,
  XMarkIcon,
  AcademicCapIcon,
  SparklesIcon,
  EnvelopeIcon,
  CalendarIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface JoinRequest {
  userId: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  countryCode?: string;
  gender?: string;
  role?: string[];
  experience?: number;
  clinicId: string;
  clinicName: string;
  isApproved: boolean | null;
  approvedBy?: { id: string; fullName: string; email: string } | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  addedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Summary {
  total: number;
  pending: number;
  approved: number;
}

type FilterStatus = 'all' | 'pending' | 'approved';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    badge: 'bg-orange-50 text-orange-700 border border-orange-100 shadow-sm',
    icon: <ClockIcon className="h-4 w-4 shrink-0" />,
  },
  approved: {
    label: 'Approved',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm',
    icon: <CheckCircleIcon className="h-4 w-4 shrink-0" />,
  },
  rejected: {
    label: 'Rejected',
    badge: 'bg-rose-50 text-rose-700 border border-rose-100 shadow-sm',
    icon: <XCircleIcon className="h-4 w-4 shrink-0" />,
  },
};

const OwnerJoinRequests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [error, setError] = useState('');

  // Approve / Reject modal state
  const [selectedReq, setSelectedReq] = useState<JoinRequest | null>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const openModal = (req: JoinRequest, action: 'approve' | 'reject') => {
    setSelectedReq(req);
    setModalAction(action);
    setRejectionReason('');
    setSelectedRoles([]);
    setActionError('');
  };

  const closeModal = () => {
    setSelectedReq(null);
    setModalAction(null);
    setRejectionReason('');
    setSelectedRoles([]);
    setActionError('');
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchRequests = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, limit: 10 };
      if (filter !== 'all') params.status = filter;

      const response = await userAPI.getOwnerJoinRequests(params);
      const data = response.data.data;

      const loggedInUserId = user?.id || user?._id;
      const filteredRequests = (data.requests || []).filter((r: any) => r.userId !== loggedInUserId);
      const ownerRequests = (data.requests || []).filter((r: any) => r.userId === loggedInUserId);

      let pendingAdjust = 0;
      let approvedAdjust = 0;
      let totalAdjust = ownerRequests.length;

      ownerRequests.forEach((r: any) => {
        if (r.status === 'pending') pendingAdjust++;
        if (r.status === 'approved') approvedAdjust++;
      });

      const mapped = filteredRequests.map((r: any) => ({
        userId: r.userId,
        fullName: r.fullName,
        email: r.email,
        mobileNumber: r.mobileNumber,
        countryCode: r.countryCode,
        gender: r.gender,
        role: Array.isArray(r.role) ? r.role : [r.role || ''],
        experience: r.experience,
        clinicId: r.clinicId,
        clinicName: r.clinicName || '—',
        isApproved: r.isApproved,
        approvedBy: r.approvedBy || null,
        approvedAt: r.approvedAt || null,
        rejectionReason: r.rejectionReason || null,
        addedAt: r.addedAt,
        status: r.status,
      }));

      setRequests(mapped);
      setSummary({
        total: Math.max(0, (data.summary?.total || 0) - totalAdjust),
        pending: Math.max(0, (data.summary?.pending || 0) - pendingAdjust),
        approved: Math.max(0, (data.summary?.approved || 0) - approvedAdjust),
      });
      if (data.pagination) {
        setPagination({
          total: Math.max(0, data.pagination.total - totalAdjust),
          page: data.pagination.page,
          pages: data.pagination.pages || data.pagination.totalPages || 1,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch join requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedReq || !modalAction) return;
    if (modalAction === 'reject' && !rejectionReason.trim()) {
      setActionError('Please provide a rejection reason');
      return;
    }
    if (modalAction === 'approve' && selectedRoles.length === 0) {
      setActionError('Please select at least one role for this practitioner');
      return;
    }
    setActionLoading(true);
    setActionError('');
    try {
      await userAPI.approveRejectJoinRequest(
        selectedReq.userId,
        selectedReq.clinicId,
        modalAction,
        modalAction === 'reject' ? rejectionReason : undefined,
        modalAction === 'approve' ? selectedRoles : undefined
      );
      setSuccessMsg(
        modalAction === 'approve'
          ? `${selectedReq.fullName}'s request to join ${selectedReq.clinicName} approved`
          : `${selectedReq.fullName}'s request to join ${selectedReq.clinicName} rejected`
      );
      closeModal();
      fetchRequests();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setActionError(err.response?.data?.message || `Failed to ${modalAction} request`);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRequests = search.trim()
    ? requests.filter(
      (r) =>
        r.clinicName?.toLowerCase().includes(search.toLowerCase()) ||
        r.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        r.email?.toLowerCase().includes(search.toLowerCase())
    )
    : requests;

  const getRoleBadge = (roles?: string[]) =>
    (roles || []).map((r) => (
      <span key={r} className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100/50 shadow-sm">
        {r.replace('_', ' ')}
      </span>
    ));

  const getStatusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    if (!cfg) return null;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${cfg.badge}`}>
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  const filterTabs: { key: FilterStatus; label: string; count: number; color: string }[] = [
    { key: 'all', label: 'Total Requests', count: summary.total, color: 'from-slate-700 to-slate-900 shadow-slate-200' },
    { key: 'pending', label: 'Pending Approval', count: summary.pending, color: 'from-orange-500 to-amber-500 shadow-orange-100' },
    { key: 'approved', label: 'Approved Requests', count: summary.approved, color: 'from-emerald-500 to-teal-500 shadow-emerald-100' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto relative">
      {/* Dynamic Keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes floatEffect {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes rotatingSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ringBreath {
          0%, 100% { box-shadow: 0 4px 15px -3px rgba(16, 185, 129, 0.2); }
          50% { box-shadow: 0 10px 25px -3px rgba(6, 182, 212, 0.4); }
        }
        .anim-float {
          animation: floatEffect 5s ease-in-out infinite;
        }
        .anim-rotating {
          animation: rotatingSpin 20s linear infinite;
        }
        .anim-ring-breath {
          animation: ringBreath 4s ease-in-out infinite;
        }
        .hover-lift-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-lift-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08);
        }
      `}} />

      {/* Header section with modern title card */}
      <div className="border-b border-slate-100 pb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 bg-clip-text text-transparent">
            Practice Affiliations
          </h1>
          <div className="p-1 bg-emerald-50 text-emerald-600 rounded-xl anim-rotating">
            <SparklesIcon className="h-6 w-6" />
          </div>
        </div>
        <p className="text-slate-500 mt-2.5 text-base font-medium">Review and manage join requests sent by practitioners targeting your clinics</p>
      </div>

      {/* Quick Statistics Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {filterTabs.map(({ key, label, count, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`bg-white rounded-[2.5rem] p-6 shadow-xl transition-all duration-300 text-left border-2 flex items-center justify-between cursor-pointer ${filter === key ? 'border-emerald-500 scale-102 shadow-emerald-50/50' : 'border-transparent hover:border-slate-200'
              }`}
          >
            <div className="space-y-1.5">
              <p className="text-sm text-slate-400 font-extrabold uppercase tracking-wider">{label}</p>
              <p className="text-4xl font-black text-slate-800 tracking-tight">{count}</p>
            </div>
            <div className={`p-4 bg-gradient-to-br ${color} rounded-2xl text-white shadow-lg shrink-0`}>
              <BuildingOffice2Icon className="h-6 w-6" />
            </div>
          </button>
        ))}
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-2xl text-emerald-800 font-bold shadow-sm shadow-emerald-50/50 flex items-center gap-2">
          <CheckIcon className="h-5 w-5 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Error Card */}
      {error && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-2xl text-rose-800 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Interactive Tabs and Searches */}
      <div className="bg-white rounded-[2rem] p-5 shadow-xl shadow-slate-100/40 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex flex-wrap gap-2">
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${filter === key
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-100'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100/50'
                }`}
            >
              {label.split(' ')[0]} Requests
            </button>
          ))}
        </div>

        <div className="relative w-full md:max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor or clinic..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 focus:bg-white border-2 border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none rounded-2xl text-sm font-semibold text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Requests details map */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-80 space-y-3">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 text-xs font-semibold tracking-wide animate-pulse">Loading join requests queue...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-xl shadow-slate-100/35">
          <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-center text-slate-300 mx-auto shadow-inner mb-5">
            <UserIcon className="h-10 w-10" />
          </div>
          <p className="text-slate-700 text-lg font-black tracking-tight">No affiliation requests found</p>
          <p className="text-slate-400 text-sm mt-1.5 max-w-sm mx-auto font-medium">
            {filter === 'all' ? 'No practitioners have submitted affiliation requests to join this clinic yet' : `No ${filter} affiliation join records located`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredRequests.map((req, idx) => (
            <div
              key={`${req.userId}-${req.clinicId}-${idx}`}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg hover-lift-card transition-all duration-300 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Accent indicator line */}
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-sky-400 to-blue-500" />

              <div className="flex-1 min-w-0 space-y-5">
                {/* Header detail with doctor avatar */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="p-3 bg-gradient-to-tr from-sky-500 to-blue-500 rounded-2xl text-white shadow-lg shadow-sky-100/50 shrink-0 anim-ring-breath">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none truncate">{req.fullName || 'Practitioner User'}</h3>
                      {getStatusBadge(req.status)}
                    </div>
                    <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
                      <EnvelopeIcon className="h-4 w-4" /> {req.email}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 shrink-0 lg:ml-2">
                    {getRoleBadge(req.role)}
                  </div>
                </div>

                {/* Details list rows in grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                      <BuildingOffice2Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Target Clinic</p>
                      <p className="text-slate-700 text-xs font-bold mt-0.5 truncate">{req.clinicName || '—'}</p>
                    </div>
                  </div>

                  {req.mobileNumber && (
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <div className="p-2 bg-teal-50 text-teal-600 rounded-xl shrink-0">
                        <PhoneIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Mobile Number</p>
                        <p className="text-slate-700 text-xs font-bold mt-0.5 truncate">
                          {req.countryCode || '+91'} {req.mobileNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {req.experience !== undefined && req.experience !== null && (
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                        <AcademicCapIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Experience</p>
                        <p className="text-slate-700 text-xs font-bold mt-0.5 truncate">{req.experience} yrs experience</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                      <ClockIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Requested Date</p>
                      <p className="text-slate-700 text-xs font-bold mt-0.5 truncate">
                        {req.addedAt ? new Date(req.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Display rejection reason if applicable */}
                {req.rejectionReason && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5">
                    <ExclamationCircleIcon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase text-rose-800 tracking-wider">Reason for Rejection</p>
                      <p className="text-rose-700 text-xs font-semibold mt-1 leading-relaxed">{req.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-row lg:flex-col sm:flex-row gap-2 shrink-0 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                {req.status === 'pending' && (
                  <>
                    <button
                      onClick={() => openModal(req, 'approve')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md shadow-emerald-50 cursor-pointer transform hover:scale-105 active:scale-95"
                    >
                      <CheckIcon className="h-4 w-4" /> Approve
                    </button>
                    <button
                      onClick={() => openModal(req, 'reject')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-rose-600 hover:to-rose-700 transition-all shadow-md shadow-rose-50 cursor-pointer transform hover:scale-105 active:scale-95"
                    >
                      <XMarkIcon className="h-4 w-4" /> Reject
                    </button>
                  </>
                )}
                {req.status === 'approved' && (
                  <button
                    onClick={() => openModal(req, 'reject')}
                    className="w-full flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-rose-600 hover:to-rose-700 transition-all shadow-md shadow-rose-50 cursor-pointer transform hover:scale-105 active:scale-95"
                  >
                    <XMarkIcon className="h-4 w-4" /> Reject
                  </button>
                )}
                {req.status === 'rejected' && (
                  <button
                    onClick={() => openModal(req, 'approve')}
                    className="w-full flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md shadow-emerald-50 cursor-pointer transform hover:scale-105 active:scale-95"
                  >
                    <CheckIcon className="h-4 w-4" /> Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination list */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchRequests(p)}
              className={`w-10 h-10 rounded-2xl font-black text-xs transition-all shadow-sm cursor-pointer ${p === pagination.page
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow shadow-emerald-100'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Modal confirmations */}
      {selectedReq && modalAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 relative overflow-hidden animate-scaleUp">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
              {modalAction === 'approve' ? 'Approve Affiliation' : 'Cancel Affiliation'}
            </h2>
            <p className="text-slate-500 text-sm font-semibold mb-6">
              Confirm {modalAction === 'approve' ? 'authorization of ' : 'rejection of '}
              <strong className="text-slate-800">{selectedReq.fullName}</strong> to join practice{' '}
              <strong className="text-slate-800">{selectedReq.clinicName}</strong>?
            </p>

            {actionError && (
              <div className="mb-4 p-3.5 bg-rose-50 border-l-4 border-rose-500 rounded-xl text-rose-800 text-xs font-bold">
                {actionError}
              </div>
            )}

            {modalAction === 'reject' && (
              <div className="mb-6 space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                  Reason for Rejection <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-100 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all outline-none resize-none rounded-2xl text-sm font-semibold text-slate-700"
                  rows={3}
                  placeholder="Provide precise rejection description..."
                />
              </div>
            )}

            {modalAction === 'approve' && (
              <div className="mb-6 space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                  Assign Role <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'sr_doctor', label: 'Sr. Doctor' },
                    { value: 'jr_doctor', label: 'Jr. Doctor' },
                    { value: 'doctor', label: 'Doctor' },
                    { value: 'receptionist', label: 'Receptionist' },
                    { value: 'driver', label: 'Driver' },
                    { value: 'patient', label: 'Patient' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedRoles(prev =>
                        prev.includes(value) ? prev.filter(r => r !== value) : [...prev, value]
                      )}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                        selectedRoles.includes(value)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center ${
                        selectedRoles.includes(value) ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                      }`}>
                        {selectedRoles.includes(value) && <CheckIcon className="h-2.5 w-2.5 text-white" />}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {modalAction === 'approve' ? (
                <button
                  onClick={handleAction}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-emerald-600 hover:to-emerald-700 transition-all shadow shadow-emerald-50 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? <ArrowPathIcon className="animate-spin h-5 w-5" /> : <><CheckIcon className="h-5 w-5" /> Authorize</>}
                </button>
              ) : (
                <button
                  onClick={handleAction}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-rose-600 hover:to-rose-700 transition-all shadow shadow-rose-50 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? <ArrowPathIcon className="animate-spin h-5 w-5" /> : <><XMarkIcon className="h-5 w-5" /> Reject</>}
                </button>
              )}
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerJoinRequests;
