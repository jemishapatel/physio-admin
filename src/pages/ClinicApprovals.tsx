import React, { useEffect, useState } from 'react';
import { clinicAPI } from '../services/api';
import {
  BuildingOffice2Icon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon,
  MapPinIcon,
  CalendarIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface Clinic {
  _id: string;
  clinicName: string;
  address: string;
  mobileNumber: string;
  countryCode?: string;
  businessLink: string;
  isApproved: boolean | null;
  createdAt: string;
  ownerId?: {
    _id: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    role: string[];
  };
  rejectionReason?: string;
}

type FilterType = 'pending' | 'approved' | 'rejected' | 'all';

const ClinicApprovals: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('pending');
  const [search, setSearch] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  useEffect(() => {
    fetchClinics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchClinics = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (filter === 'pending') {
        response = await clinicAPI.getPendingClinics({ page, limit: 10 });
      } else if (filter === 'approved') {
        response = await clinicAPI.getAllClinics({ isApproved: true, page, limit: 10 });
      } else if (filter === 'rejected') {
        response = await clinicAPI.getAllClinics({ isApproved: false, page, limit: 10 });
      } else {
        response = await clinicAPI.getAllClinics({ page, limit: 10 });
      }

      const data = response.data;
      setClinics(data.data || []);
      if (data.pagination) {
        setPagination({
          total: data.pagination.total,
          page: data.pagination.page,
          pages: data.pagination.pages,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch clinics');
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (clinic: Clinic, action: 'approve' | 'reject') => {
    setSelectedClinic(clinic);
    setModalAction(action);
    setRejectionReason('');
    setError('');
  };

  const closeModal = () => {
    setSelectedClinic(null);
    setModalAction(null);
    setRejectionReason('');
    setError('');
  };

  const handleApprove = async () => {
    if (!selectedClinic) return;
    setActionLoading(true);
    setError('');
    try {
      await clinicAPI.approveClinic(selectedClinic._id);
      setSuccessMsg(`${selectedClinic.clinicName} approved successfully`);
      closeModal();
      fetchClinics();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve clinic');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedClinic) return;
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }
    setActionLoading(true);
    setError('');
    try {
      await clinicAPI.rejectClinic(selectedClinic._id, rejectionReason);
      setSuccessMsg(`${selectedClinic.clinicName} rejected`);
      closeModal();
      fetchClinics();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject clinic');
    } finally {
      setActionLoading(false);
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
          <CheckIcon className="h-4 w-4" /> Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-xl text-xs font-black uppercase tracking-wider border border-rose-100 shadow-sm">
        <XMarkIcon className="h-4 w-4" /> Rejected
      </span>
    );
  };

  const filterCounts: Record<FilterType, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    all: 'All Clinics',
  };

  const filteredClinics = search.trim()
    ? clinics.filter(
        (c) =>
          c.clinicName.toLowerCase().includes(search.toLowerCase()) ||
          c.address.toLowerCase().includes(search.toLowerCase()) ||
          c.businessLink.toLowerCase().includes(search.toLowerCase())
      )
    : clinics;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto relative">
      {/* Dynamic animations injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtleSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes breathHalo {
          0%, 100% { box-shadow: 0 4px 15px -3px rgba(16, 185, 129, 0.2); }
          50% { box-shadow: 0 10px 25px -3px rgba(6, 182, 212, 0.4); }
        }
        .anim-subtle-spin {
          animation: subtleSpin 20s linear infinite;
        }
        .anim-breath-halo {
          animation: breathHalo 4s ease-in-out infinite;
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
            Clinic Approvals
          </h1>
          <div className="p-1 bg-blue-50 text-blue-600 rounded-xl anim-subtle-spin">
            <SparklesIcon className="h-6 w-6" />
          </div>
        </div>
        <p className="text-slate-500 mt-2.5 text-base font-medium">Review, inspect and authorize medical practice registrations</p>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-2xl text-emerald-800 font-bold shadow-sm shadow-emerald-50/50 animate-slideDown flex items-center gap-2">
          <CheckIcon className="h-5 w-5 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Filters + Integrated Modern Search */}
      <div className="bg-white rounded-[2rem] p-5 shadow-xl shadow-slate-100/40 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(filterCounts) as FilterType[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-100'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100/50'
              }`}
            >
              {filterCounts[status]}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, website..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 focus:bg-white border-2 border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none rounded-2xl text-sm font-semibold text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Dynamic Loader, Empty States and Lists */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-80 space-y-3">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 text-xs font-semibold tracking-wide animate-pulse">Fetching clinic registry...</p>
        </div>
      ) : filteredClinics.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-xl shadow-slate-100/35">
          <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-center text-slate-300 mx-auto shadow-inner mb-5">
            <BuildingOffice2Icon className="h-10 w-10" />
          </div>
          <p className="text-slate-700 text-lg font-black tracking-tight">No clinic registrations found</p>
          <p className="text-slate-400 text-sm mt-1.5 max-w-sm mx-auto font-medium">
            {filter === 'pending' ? 'Hooray! No clinics are currently pending administrative authorization' : `There are no ${filter} practice requests registered`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredClinics.map((clinic) => (
            <div
              key={clinic._id}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg hover-elevate transition-all duration-300 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Decorative accent top/left border gradient */}
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-400 to-teal-500" />
              
              <div className="flex-1 min-w-0 space-y-5">
                {/* Clinic Core Title and Identification Header */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="p-3 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl text-white shadow-lg shadow-emerald-100/50 shrink-0 anim-breath-halo">
                    <BuildingOffice2Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight truncate leading-tight">{clinic.clinicName}</h3>
                    <a
                      href={`https://${clinic.businessLink}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-800 inline-flex items-center gap-1 mt-1 transition-all"
                    >
                      <LinkIcon className="h-3.5 w-3.5" /> {clinic.businessLink} &rarr;
                    </a>
                  </div>
                  <div className="shrink-0 lg:ml-2">{getStatusBadge(clinic.isApproved)}</div>
                </div>

                {/* Information Grid Rows */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-sky-50 text-sky-600 rounded-xl shrink-0">
                      <MapPinIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Practice Address</p>
                      <p className="text-slate-700 text-xs font-bold mt-0.5 truncate">{clinic.address}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-xl shrink-0">
                      <PhoneIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Contact Number</p>
                      <p className="text-slate-700 text-xs font-bold mt-0.5 truncate">
                        {clinic.countryCode || '+91'} {clinic.mobileNumber}
                      </p>
                    </div>
                  </div>

                  {clinic.ownerId && (
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3 col-span-1">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                        <BuildingOffice2Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Owner / Partner</p>
                        <p className="text-slate-700 text-xs font-bold mt-0.5 truncate">{clinic.ownerId.fullName}</p>
                        <p className="text-slate-400 text-[10px] truncate">{clinic.ownerId.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Registered Date</p>
                      <p className="text-slate-700 text-xs font-bold mt-0.5 truncate">
                        {new Date(clinic.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Display rejection reason if present */}
                {clinic.rejectionReason && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5">
                    <ExclamationCircleIcon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase text-rose-800 tracking-wider">Reason for Rejection</p>
                      <p className="text-rose-700 text-xs font-semibold mt-1 leading-relaxed">{clinic.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Container */}
              <div className="flex flex-row lg:flex-col sm:flex-row gap-2 shrink-0 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                {(clinic.isApproved === null || clinic.isApproved === undefined) ? (
                  <>
                    <button
                      onClick={() => openModal(clinic, 'approve')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md shadow-emerald-50 cursor-pointer transform hover:scale-105 active:scale-95"
                    >
                      <CheckIcon className="h-4 w-4" /> Approve
                    </button>
                    <button
                      onClick={() => openModal(clinic, 'reject')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-rose-600 hover:to-rose-700 transition-all shadow-md shadow-rose-50 cursor-pointer transform hover:scale-105 active:scale-95"
                    >
                      <XMarkIcon className="h-4 w-4" /> Reject
                    </button>
                  </>
                ) : clinic.isApproved === true ? (
                  <button
                    onClick={() => openModal(clinic, 'reject')}
                    className="w-full flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-rose-600 hover:to-rose-700 transition-all shadow-md shadow-rose-50 cursor-pointer transform hover:scale-105 active:scale-95"
                  >
                    <XMarkIcon className="h-4 w-4" /> Reject
                  </button>
                ) : (
                  <button
                    onClick={() => openModal(clinic, 'approve')}
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

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchClinics(p)}
              className={`w-10 h-10 rounded-2xl font-black text-xs transition-all shadow-sm cursor-pointer ${
                p === pagination.page
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow shadow-emerald-100'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Premium Glassmorphic Confirmation Modal */}
      {selectedClinic && modalAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 relative overflow-hidden animate-scaleUp">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
              {modalAction === 'approve' ? 'Approve Registration' : 'Reject Registration'}
            </h2>
            <p className="text-slate-500 text-sm font-semibold mb-6">
              Are you sure you want to {modalAction === 'approve' ? 'approve and active ' : 'reject '}
              <strong className="text-slate-800">{selectedClinic.clinicName}</strong> in the platform?
            </p>

            {error && (
              <div className="mb-4 p-3.5 bg-rose-50 border-l-4 border-rose-500 rounded-xl text-rose-800 text-xs font-bold">
                {error}
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
                  {actionLoading ? <ArrowPathIcon className="animate-spin h-5 w-5" /> : <><CheckIcon className="h-5 w-5" /> Approve</>}
                </button>
              ) : (
                <button
                  onClick={handleReject}
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

export default ClinicApprovals;
