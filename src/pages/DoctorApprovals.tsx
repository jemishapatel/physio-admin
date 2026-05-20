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
} from '@heroicons/react/24/outline';

interface Degree {
  degreeId: string;
  degreeName: string;
  universityName: string;
  passingYear: number;
  isApproved?: boolean | null;
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
  sr_doctor: 'bg-purple-100 text-purple-700',
  jr_doctor: 'bg-blue-100 text-blue-700',
  owner: 'bg-amber-100 text-amber-700',
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
        // GET /api/user/pending-users — isApproved: null only
        response = await userAPI.getPendingUsers(params);
      } else {
        // GET /api/user/all — with isVerified filter + optional isApproved
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

  const getUserId = (user: PendingUser): string =>
    user.id || user._id || '';

  const openModal = (user: PendingUser, action: 'approve' | 'reject') => {
    setSelectedUser(user);
    setModalAction(action);
    setRejectionReason('');
    // Pre-fill roles with user's existing roles
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

  const handleDegreeApproval = async (userId: string, degreeId: string, isApproved: boolean) => {
    try {
      await userAPI.toggleUserDegreeApproval(userId, degreeId, isApproved);
      setSuccessMsg(`Degree status updated successfully`);
      
      // Update local state reactively
      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (getUserId(u) === userId) {
            return {
              ...u,
              degrees: u.degrees?.map((d) =>
                d.degreeId === degreeId ? { ...d, isApproved } : d
              ),
            };
          }
          return u;
        })
      );
      
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update degree status');
      setTimeout(() => setError(''), 4000);
    }
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

  const getStatusBadge = (isApproved: boolean | null) => {
    if (isApproved === null || isApproved === undefined) {
      return (
        <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
          <ClockIcon className="h-4 w-4 mr-1" /> Pending
        </span>
      );
    }
    if (isApproved) {
      return (
        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
          <CheckIcon className="h-4 w-4 mr-1" /> Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
        <XMarkIcon className="h-4 w-4 mr-1" /> Rejected
      </span>
    );
  };

  const getRoleBadges = (roles: string[] | null | undefined) =>
    (roles || []).map((r) => (
      <span
        key={r}
        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${ROLE_COLORS[r] || 'bg-gray-100 text-gray-700'}`}
      >
        {ROLE_LABELS[r] || r}
      </span>
    ));

  const filterTabs: { key: FilterRole; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'owner', label: 'Owners' },
    { key: 'sr_doctor', label: 'Sr. Doctors' },
    { key: 'jr_doctor', label: 'Jr. Doctors' },
  ];

  const statusTabs: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto" >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Doctor & User Approvals</h1>
        <p className="text-gray-600 mt-1">Review and approve pending users</p>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-xl text-green-700 font-medium">
          {successMsg}
        </div>
      )}

      {/* Filters + Search */}
      <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col gap-4">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {statusTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-5 py-2 rounded-xl font-semibold transition-all text-sm ${
                statusFilter === key
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Role + Search row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setRoleFilter(key)}
                className={`px-4 py-1.5 rounded-xl font-semibold transition-all text-xs ${
                  roleFilter === key
                    ? 'bg-gray-800 text-white shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              placeholder="Search by name, email..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && !selectedUser && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <ArrowPathIcon className="animate-spin h-10 w-10 text-blue-600" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <UserIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg font-medium">No users found</p>
          <p className="text-gray-400 text-sm mt-1">
            {statusFilter === 'pending' ? 'No users are pending approval' : `No ${statusFilter} users`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <div
              key={getUserId(user)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Name + roles + status */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shrink-0">
                      <UserIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-gray-800">{user.fullName}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getRoleBadges(user.role)}
                      </div>
                    </div>
                    <div className="shrink-0">{getStatusBadge(user.isApproved)}</div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Contact</p>
                      <p className="text-gray-700 text-sm mt-0.5">
                        {user.countryCode} {user.mobileNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Gender</p>
                      <p className="text-gray-700 text-sm mt-0.5">{user.gender}</p>
                    </div>
                    {user.experience !== undefined && user.experience !== null && (
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Experience</p>
                        <p className="text-gray-700 text-sm mt-0.5">{user.experience} years</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Registered</p>
                      <p className="text-gray-700 text-sm mt-0.5">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {user.clinics && user.clinics.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Clinic</p>
                        <p className="text-gray-700 text-sm mt-0.5">
                          {user.clinics[0]?.clinicId?.clinicName || 'N/A'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Degrees */}
                  {user.degrees && user.degrees.length > 0 && (
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center">
                        <AcademicCapIcon className="h-4 w-4 mr-1 text-slate-400" /> Education & Qualifications
                      </p>
                      <div className="flex flex-col gap-2">
                        {user.degrees.map((d) => {
                          const userId = getUserId(user);
                          return (
                            <div
                              key={d.degreeId}
                              className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all gap-4"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-slate-800 text-sm">{d.degreeName}</span>
                                  {d.isApproved === true && (
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded border border-emerald-100 flex items-center gap-0.5 shrink-0">
                                      <CheckIcon className="h-3 w-3" /> Approved
                                    </span>
                                  )}
                                  {d.isApproved === false && (
                                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-black uppercase rounded border border-rose-100 flex items-center gap-0.5 shrink-0">
                                      <XMarkIcon className="h-3 w-3" /> Rejected
                                    </span>
                                  )}
                                  {(d.isApproved === null || d.isApproved === undefined) && (
                                    <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] font-black uppercase rounded border border-orange-100 flex items-center gap-0.5 shrink-0">
                                      <ClockIcon className="h-3.5 w-3.5 animate-pulse" /> Pending
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 font-semibold mt-1">
                                  {d.universityName} • Graduated in <span className="text-slate-600 font-extrabold">{d.passingYear}</span>
                                </p>
                              </div>

                              {/* Action buttons — hidden once degree is approved */}
                              {d.isApproved !== true && (
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    onClick={() => handleDegreeApproval(userId, d.degreeId, true)}
                                    title="Approve Degree"
                                    type="button"
                                    className="p-2 border rounded-xl transition-all shadow-sm bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border-emerald-100 hover:scale-105 active:scale-95 cursor-pointer"
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => d.isApproved !== false && handleDegreeApproval(userId, d.degreeId, false)}
                                    title="Reject Degree"
                                    type="button"
                                    className={`p-2 border rounded-xl transition-all shadow-sm ${
                                      d.isApproved === false
                                        ? 'bg-rose-500 text-white border-rose-500 scale-100 cursor-default'
                                        : 'bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border-rose-100 hover:scale-105 active:scale-95 cursor-pointer'
                                    }`}
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions — pending: both, approved: reject only, rejected: approve only */}
                <div className="flex flex-col gap-2 shrink-0">
                  {(user.isApproved === null || user.isApproved === undefined || user.isApproved === false) && (
                    <button
                      onClick={() => openModal(user, 'approve')}
                      className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow hover:shadow-lg transform hover:scale-105 text-sm"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" /> Approve
                    </button>
                  )}
                  {(user.isApproved === null || user.isApproved === undefined || user.isApproved === true) && (
                    <button
                      onClick={() => openModal(user, 'reject')}
                      className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow hover:shadow-lg transform hover:scale-105 text-sm"
                    >
                      <XMarkIcon className="h-4 w-4 mr-1" /> Reject
                    </button>
                  )}
                  {/* View clinic join requests for this user — always visible */}
                  <button
                    onClick={() => navigate(`/join-requests/${getUserId(user)}`)}
                    className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow hover:shadow-lg transform hover:scale-105 text-sm"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" /> Clinics
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchUsers(p)}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                p === pagination.page
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      {selectedUser && modalAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {modalAction === 'approve' ? 'Approve User' : 'Reject User'}
            </h2>
            <p className="text-gray-600 mb-1">
              {modalAction === 'approve' ? 'Approve ' : 'Reject '}
              <strong>{selectedUser.fullName}</strong>?
            </p>
            <div className="flex flex-wrap gap-1 mb-6">
              {getRoleBadges(selectedUser.role)}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Role selection — only shown when approving */}
            {modalAction === 'approve' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Assign Roles <span className="text-gray-400 font-normal">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'owner', label: 'Clinic Owner', color: 'amber' },
                    { value: 'sr_doctor', label: 'Senior Doctor', color: 'purple' },
                    { value: 'jr_doctor', label: 'Junior Doctor', color: 'blue' },
                    { value: 'receptionist', label: 'Receptionist', color: 'teal' },
                    { value: 'driver', label: 'Driver', color: 'gray' },
                    { value: 'patient', label: 'Patient', color: 'green' },
                  ].map(({ value, label, color }) => {
                    const checked = selectedRoles.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleRole(value)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                          checked
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          checked ? 'bg-blue-600' : 'border-2 border-gray-300'
                        }`}>
                          {checked && <CheckIcon className="h-3 w-3 text-white" />}
                        </span>
                        {label}
                      </button>
                    );
                  })}
                </div>
                {selectedRoles.length === 0 && (
                  <p className="text-xs text-amber-600 mt-2">No role selected — user will keep their existing roles</p>
                )}
              </div>
            )}

            {modalAction === 'reject' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all outline-none resize-none"
                  rows={3}
                  placeholder="Enter reason for rejection..."
                />
              </div>
            )}

            <div className="flex gap-3">
              {modalAction === 'approve' ? (
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
                >
                  {actionLoading ? (
                    <ArrowPathIcon className="animate-spin h-5 w-5" />
                  ) : (
                    <><CheckIcon className="h-5 w-5 mr-1" /> Approve</>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
                >
                  {actionLoading ? (
                    <ArrowPathIcon className="animate-spin h-5 w-5" />
                  ) : (
                    <><XMarkIcon className="h-5 w-5 mr-1" /> Reject</>
                  )}
                </button>
              )}
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
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
