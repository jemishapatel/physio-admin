import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import {
  UserIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  LinkIcon,
  SparklesIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  IdentificationIcon,
  ExclamationCircleIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';

interface Degree {
  degreeId: string;
  degreeName: string;
  universityName: string;
  passingYear: number;
  isApproved?: boolean;
}

interface ClinicEntry {
  clinicId?: { clinicName?: string };
  isApproved: boolean | null;
}

interface PendingUser {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  countryCode: string;
  gender: string;
  role: string[] | null;
  experience?: number;
  degrees?: Degree[];
  clinics?: ClinicEntry[];
  isApproved: boolean | null;
  createdAt: string;
}

type FilterRole = 'all' | 'owner' | 'sr_doctor' | 'jr_doctor';
type FilterStatus = 'pending' | 'approved' | 'rejected' | 'all';

const ROLE_LABELS: Record<string, string> = {
  sr_doctor: 'Senior Doctor',
  jr_doctor: 'Junior Doctor',
  owner: 'Clinic Owner',
};

const ROLE_COLORS: Record<string, string> = {
  sr_doctor: 'bg-purple-50 text-purple-700 border border-purple-100/50 shadow-sm shadow-purple-50/50',
  jr_doctor: 'bg-blue-50 text-blue-700 border border-blue-100/50 shadow-sm shadow-blue-50/50',
  owner: 'bg-amber-50 text-amber-700 border border-amber-100/50 shadow-sm shadow-amber-50/50',
};

const DoctorApprovals: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<FilterRole>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('pending');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, statusFilter]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, limit: 10 };
      if (roleFilter !== 'all') params.role = roleFilter;
      if (search.trim()) params.search = search.trim();

      let response;
      if (statusFilter === 'pending') {
        response = await userAPI.getPendingUsers(params);
      } else {
        if (statusFilter === 'approved') params.isApproved = true;
        if (statusFilter === 'rejected') params.isApproved = false;
        params.isVerified = true;
        response = await userAPI.getAllUsers(params);
      }

      const data = response.data;
      setUsers(data.data || []);
      if (data.pagination) {
        setPagination({
          total: data.pagination.total,
          page: data.pagination.page,
          pages: data.pagination.pages,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const getUserId = (user: PendingUser): string => user.id || user._id || '';

  const openModal = (user: PendingUser, action: 'approve' | 'reject') => {
    setSelectedUser(user);
    setModalAction(action);
    setRejectionReason('');
    setSelectedRoles(user.role && user.role.length > 0 ? [...user.role] : []);
    setError('');
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalAction(null);
    setRejectionReason('');
    setSelectedRoles([]);
    setError('');
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleApprove = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setError('');
    try {
      const userId = getUserId(selectedUser);
      await userAPI.approveUser(userId, selectedRoles.length > 0 ? selectedRoles : undefined);
      setSuccessMsg(`${selectedUser.fullName} approved successfully`);
      closeModal();
      fetchUsers();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }
    setActionLoading(true);
    setError('');
    try {
      const userId = getUserId(selectedUser);
      await userAPI.rejectUser(userId, rejectionReason);
      setSuccessMsg(`${selectedUser.fullName} rejected`);
      closeModal();
      fetchUsers();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleDegreeApproval = async (userId: string, degreeId: string, approve: boolean) => {
    try {
      await userAPI.toggleUserDegreeApproval(userId, degreeId, approve);
      fetchUsers(pagination.page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update degree status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusBadge = (isApproved: boolean | null) => {
    if (isApproved === null || isApproved === undefined) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-xl text-xs font-black uppercase tracking-wider border border-amber-100 shadow-sm">
          <ClockIcon className="h-4 w-4" /> Pending Approval
        </span>
      );
    }
    if (isApproved) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-wider border border-emerald-100 shadow-sm">
          <CheckIcon className="h-4 w-4" /> Approved User
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-xl text-xs font-black uppercase tracking-wider border border-rose-100 shadow-sm">
        <XMarkIcon className="h-4 w-4" /> Rejected
      </span>
    );
  };

  const getRoleBadges = (roles: string[] | null | undefined) =>
    (roles || []).map((r) => (
      <span
        key={r}
        className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${ROLE_COLORS[r] || 'bg-gray-50 text-gray-600 border-gray-100'}`}
      >
        {ROLE_LABELS[r] || r}
      </span>
    ));

  const filterTabs: { key: FilterRole; label: string }[] = [
    { key: 'all', label: 'All Roles' },
    { key: 'owner', label: 'Owners' },
    { key: 'sr_doctor', label: 'Sr. Doctors' },
    { key: 'jr_doctor', label: 'Jr. Doctors' },
  ];

  const statusTabs: { key: FilterStatus; label: string }[] = [
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all', label: 'All Users' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto relative">
      {/* Custom keyframe styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes flowGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slowSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes breathingGlow {
          0%, 100% { box-shadow: 0 4px 15px -3px rgba(139, 92, 246, 0.2); }
          50% { box-shadow: 0 10px 25px -3px rgba(99, 102, 241, 0.4); }
        }
        .anim-slow-spin {
          animation: slowSpin 20s linear infinite;
        }
        .anim-breathing-glow {
          animation: breathingGlow 4s ease-in-out infinite;
        }
        .hover-elevate {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-elevate:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08);
        }
      `}} />

      {/* Header section with modern title card */}
      <div className="border-b border-slate-100 pb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 bg-clip-text text-transparent">
            User Approvals
          </h1>
          <div className="p-1 bg-purple-50 text-purple-600 rounded-xl anim-slow-spin">
            <SparklesIcon className="h-6 w-6" />
          </div>
        </div>
        <p className="text-slate-500 mt-2.5 text-base font-medium">Review and verify professional credentials of doctors and clinic owners</p>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-2xl text-emerald-800 font-bold shadow-sm shadow-emerald-50/50 animate-slideDown flex items-center gap-2">
          <CheckIcon className="h-5 w-5 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Dynamic Filters and Roles Selection Header */}
      <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-100/40 border border-slate-100 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {statusTabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${statusFilter === key
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-100'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100/50'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              placeholder="Search by name, email..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 focus:bg-white border-2 border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none rounded-2xl text-sm font-semibold text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Roles tab selectors */}
        <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest self-center mr-2">Roles:</span>
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setRoleFilter(key)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer border ${roleFilter === key
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                : 'bg-transparent text-slate-500 hover:bg-slate-50 border-slate-200'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* error banner */}
      {error && !selectedUser && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-2xl text-rose-800 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Users grid list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-80 space-y-3">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 text-xs font-semibold tracking-wide animate-pulse">Fetching verification queue...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-xl shadow-slate-100/35">
          <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-center text-slate-300 mx-auto shadow-inner mb-5">
            <UserIcon className="h-10 w-10" />
          </div>
          <p className="text-slate-700 text-lg font-black tracking-tight">No matching user registrations found</p>
          <p className="text-slate-400 text-sm mt-1.5 max-w-sm mx-auto font-medium">
            {statusFilter === 'pending' ? 'Fantastic! No doctors or clinic owners are pending administrative verification' : `No ${statusFilter} accounts found for the current filter criteria`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {users.map((user) => (
            <div
              key={getUserId(user)}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg hover-elevate transition-all duration-300 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Decorative side accent tag */}
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-400 to-indigo-500" />

              <div className="flex-1 min-w-0 space-y-5">
                {/* Doctor Avatar Name Header */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="p-3 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-100/50 shrink-0 anim-breathing-glow">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{user.fullName}</h3>
                      {getStatusBadge(user.isApproved)}
                    </div>
                    <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
                      <EnvelopeIcon className="h-4 w-4" /> {user.email}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 shrink-0 lg:ml-2">
                    {getRoleBadges(user.role)}
                  </div>
                </div>

                {/* Details Grid Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-xl shrink-0">
                      <PhoneIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Contact Number</p>
                      <p className="text-slate-700 text-xs font-bold mt-0.5 truncate">
                        {user.countryCode} {user.mobileNumber}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                      <IdentificationIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Gender</p>
                      <p className="text-slate-700 text-xs font-bold mt-0.5 truncate">{user.gender}</p>
                    </div>
                  </div>

                  {user.experience !== undefined && user.experience !== null && (
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                        <AcademicCapIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Experience</p>
                        <p className="text-slate-700 text-xs font-bold mt-0.5 truncate">{user.experience} years</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-sky-50 text-sky-600 rounded-xl shrink-0">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Registered On</p>
                      <p className="text-slate-700 text-xs font-bold mt-0.5 truncate">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Clinics Associated */}
                {user.clinics && user.clinics.length > 0 && (
                  <div className="p-4 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl flex items-center gap-3">
                    {/* <div className="p-2.5 bg-indigo-500 text-white rounded-xl shadow shrink-0">
                      <BuildingOffice2Icon className="h-5 w-5" />
                    </div> */}
                    {/* <div className="min-w-0">
                      <p className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-wider">Associated Medical Clinic</p>
                      <p className="text-slate-800 text-sm font-extrabold truncate">{user.clinics[0]?.clinicId?.clinicName || 'Clinic Practice'}</p>
                    </div> */}
                  </div>
                )}

                {/* Degrees List */}
                {user.degrees && user.degrees.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                      <AcademicCapIcon className="h-5 w-5" /> Degrees & Board Qualifications
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {user.degrees.map((d) => {
                        const degreeApproved = d.isApproved === true;
                        const userId = getUserId(user);
                        return (
                          <div
                            key={d.degreeId}
                            className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${degreeApproved
                                ? 'bg-emerald-50/60 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-50'
                                : 'bg-orange-50/50 text-orange-700 border-orange-100/70'
                              }`}
                          >
                            <AcademicCapIcon className={`h-4 w-4 shrink-0 ${degreeApproved ? 'text-emerald-500' : 'text-orange-400'}`} />
                            <span className="min-w-0 truncate">
                              {d.degreeName} — {d.universityName} ({d.passingYear})
                            </span>
                            {degreeApproved ? (
                              <>
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-wide shadow-sm shadow-emerald-200 shrink-0">
                                  <CheckIcon className="h-2.5 w-2.5 stroke-[3]" /> Verified
                                </span>
                                {/* Quick Action Button for Super Admin to Revoke Degree Verification */}
                                <button
                                  onClick={() => handleToggleDegreeApproval(userId, d.degreeId, false)}
                                  className="ml-1.5 p-1 rounded-lg transition-all cursor-pointer shadow-sm hover:scale-115 active:scale-90 bg-rose-500 text-white hover:bg-rose-600 shadow-rose-100 shrink-0"
                                  title="Revoke Degree Verification"
                                >
                                  <XMarkIcon className="h-3 w-3 stroke-[3]" />
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-orange-500 text-white rounded-lg text-[9px] font-black uppercase tracking-wide shadow-sm shadow-orange-200 shrink-0">
                                  <ClockIcon className="h-2.5 w-2.5 stroke-[3]" /> Pending
                                </span>
                                <div className="flex items-center gap-1 ml-1.5 shrink-0">
                                  {/* Quick Action Button to Approve Degree */}
                                  <button
                                    onClick={() => handleToggleDegreeApproval(userId, d.degreeId, true)}
                                    className="p-1 rounded-lg transition-all cursor-pointer shadow-sm hover:scale-115 active:scale-90 bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-100"
                                    title="Verify and Approve Degree"
                                  >
                                    <CheckIcon className="h-3 w-3 stroke-[3]" />
                                  </button>
                                  {/* Quick Action Button to Reject Degree */}
                                  <button
                                    onClick={() => handleToggleDegreeApproval(userId, d.degreeId, false)}
                                    className="p-1 rounded-lg transition-all cursor-pointer shadow-sm hover:scale-115 active:scale-90 bg-rose-500 text-white hover:bg-rose-600 shadow-rose-100"
                                    title="Reject Degree"
                                  >
                                    <XMarkIcon className="h-3 w-3 stroke-[3]" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row lg:flex-col sm:flex-row gap-2 shrink-0 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                {(user.isApproved === null || user.isApproved === undefined || user.isApproved === false) && (
                  <button
                    onClick={() => openModal(user, 'approve')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md shadow-emerald-50 cursor-pointer transform hover:scale-105 active:scale-95"
                  >
                    <CheckIcon className="h-4 w-4" /> Approve
                  </button>
                )}
                {(user.isApproved === null || user.isApproved === undefined || user.isApproved === true) && (
                  <button
                    onClick={() => openModal(user, 'reject')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-rose-600 hover:to-rose-700 transition-all shadow-md shadow-rose-50 cursor-pointer transform hover:scale-105 active:scale-95"
                  >
                    <XMarkIcon className="h-4 w-4" /> Reject
                  </button>
                )}
                {user.clinics && user.clinics.length > 0 && (
                  <button
                    onClick={() => navigate(`/join-requests/${getUserId(user)}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-blue-600 hover:to-blue-700 transition-all shadow-md shadow-blue-50 cursor-pointer transform hover:scale-105 active:scale-95"
                  >
                    <LinkIcon className="h-4 w-4" /> View Join Requests
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchUsers(p)}
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

      {/* Modal Dialog */}
      {selectedUser && modalAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative overflow-hidden animate-scaleUp">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">
              {modalAction === 'approve' ? 'Verify Credentials' : 'Reject Practitioner'}
            </h2>
            <p className="text-slate-500 text-sm font-semibold mb-2">
              Reviewing account verification for <strong className="text-slate-800">{selectedUser.fullName}</strong>.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {getRoleBadges(selectedUser.role)}
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-rose-50 border-l-4 border-rose-500 rounded-xl text-rose-800 text-xs font-bold animate-fadeIn">
                {error}
              </div>
            )}

            {/* Role configuration list */}
            {modalAction === 'approve' && (
              <div className="mb-6 space-y-3">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                  Assign Administrative Roles <span className="text-slate-400 font-normal">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'owner', label: 'Clinic Owner' },
                    { value: 'sr_doctor', label: 'Senior Doctor' },
                    { value: 'jr_doctor', label: 'Junior Doctor' },
                    { value: 'receptionist', label: 'Receptionist' },
                    { value: 'driver', label: 'Driver' },
                    { value: 'patient', label: 'Patient' },
                  ].map(({ value, label }) => {
                    const checked = selectedRoles.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleRole(value)}
                        className={`flex items-center gap-2.5 px-3 py-3 rounded-2xl border-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${checked
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 shadow-inner'
                          : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                          }`}
                      >
                        <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${checked ? 'bg-emerald-500' : 'border-2 border-slate-300'
                          }`}>
                          {checked && <CheckIcon className="h-3 w-3 text-white" />}
                        </span>
                        {label}
                      </button>
                    );
                  })}
                </div>
                {selectedRoles.length === 0 && (
                  <p className="text-[10px] text-amber-600 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100/50">
                    No roles selected — the account will retain its default roles.
                  </p>
                )}
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
                  placeholder="Provide precise cancellation or rejection details..."
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {modalAction === 'approve' ? (
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-emerald-600 hover:to-emerald-700 transition-all shadow shadow-emerald-50 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <ArrowPathIcon className="animate-spin h-5 w-5" />
                  ) : (
                    <><CheckIcon className="h-5 w-5" /> Approve Account</>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-rose-600 hover:to-rose-700 transition-all shadow shadow-rose-50 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <ArrowPathIcon className="animate-spin h-5 w-5" />
                  ) : (
                    <><XMarkIcon className="h-5 w-5" /> Reject Practitioner</>
                  )}
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

export default DoctorApprovals;
