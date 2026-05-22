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
  DocumentTextIcon,
  ExclamationCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface ClinicUpdate {
  _id: string;
  clinicId: {
    _id: string;
    clinicName: string;
    businessLink: string;
    ownerId: string;
  };
  requestedBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  updateData: any;
  status: string;
  createdAt: string;
  rejectionReason?: string;
}

const ClinicUpdateApprovals: React.FC = () => {
  const [updates, setUpdates] = useState<ClinicUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUpdate, setSelectedUpdate] = useState<ClinicUpdate | null>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  useEffect(() => {
    fetchUpdates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUpdates = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await clinicAPI.getPendingClinicUpdates({ page, limit: 10 });
      const data = response.data;
      setUpdates(data.data || []);
      if (data.pagination) {
        setPagination({
          total: data.pagination.total,
          page: data.pagination.page,
          pages: data.pagination.pages,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch clinic updates');
      setUpdates([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (update: ClinicUpdate, action: 'approve' | 'reject') => {
    setSelectedUpdate(update);
    setModalAction(action);
    setRejectionReason('');
    setError('');
  };

  const closeModal = () => {
    setSelectedUpdate(null);
    setModalAction(null);
    setRejectionReason('');
    setError('');
  };

  const handleApprove = async () => {
    if (!selectedUpdate) return;
    setActionLoading(true);
    setError('');
    try {
      await clinicAPI.approveClinicUpdate(selectedUpdate._id);
      setSuccessMsg(`Update for ${selectedUpdate.clinicId?.clinicName} approved successfully`);
      closeModal();
      fetchUpdates();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve update');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedUpdate) return;
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }
    setActionLoading(true);
    setError('');
    try {
      await clinicAPI.rejectClinicUpdate(selectedUpdate._id, rejectionReason);
      setSuccessMsg(`Update for ${selectedUpdate.clinicId?.clinicName} rejected`);
      closeModal();
      fetchUpdates();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject update');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUpdates = search.trim()
    ? updates.filter(
        (u) =>
          u.clinicId?.clinicName?.toLowerCase().includes(search.toLowerCase()) ||
          u.requestedBy?.fullName?.toLowerCase().includes(search.toLowerCase())
      )
    : updates;

  const renderUpdateData = (data: any) => {
    if (!data) return null;
    return (
      <div className="mt-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 max-h-48 overflow-y-auto">
        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide mb-2">Requested Changes:</p>
        <ul className="space-y-1">
          {Object.entries(data).map(([key, value]) => (
            <li key={key} className="text-xs text-slate-700">
              <span className="font-semibold">{key}: </span>
              <span className="text-slate-500 break-all">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtleSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes breathHalo {
          0%, 100% { box-shadow: 0 4px 15px -3px rgba(20, 184, 166, 0.2); }
          50% { box-shadow: 0 10px 25px -3px rgba(13, 148, 136, 0.4); }
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

      <div className="border-b border-slate-100 pb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 bg-clip-text text-transparent">
            Clinic Updates
          </h1>
          <div className="p-1 bg-teal-50 text-teal-600 rounded-xl anim-subtle-spin">
            <SparklesIcon className="h-6 w-6" />
          </div>
        </div>
        <p className="text-slate-500 mt-2.5 text-base font-medium">Review and approve changes to clinic profiles</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-2xl text-emerald-800 font-bold shadow-sm shadow-emerald-50/50 animate-slideDown flex items-center gap-2">
          <CheckIcon className="h-5 w-5 text-emerald-600" />
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-[2rem] p-5 shadow-xl shadow-slate-100/40 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex flex-wrap gap-2">
           <button className="px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md shadow-teal-100">
             Pending Updates
           </button>
        </div>
        
        <div className="relative w-full md:max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by clinic or user..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 focus:bg-white border-2 border-slate-100 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all outline-none rounded-2xl text-sm font-semibold text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-80 space-y-3">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 text-xs font-semibold tracking-wide animate-pulse">Fetching pending updates...</p>
        </div>
      ) : filteredUpdates.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-xl shadow-slate-100/35">
          <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-center text-slate-300 mx-auto shadow-inner mb-5">
            <DocumentTextIcon className="h-10 w-10" />
          </div>
          <p className="text-slate-700 text-lg font-black tracking-tight">No pending updates found</p>
          <p className="text-slate-400 text-sm mt-1.5 max-w-sm mx-auto font-medium">
            Hooray! There are no clinic profile updates waiting for your approval.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredUpdates.map((update) => (
            <div
              key={update._id}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg hover-elevate transition-all duration-300 relative overflow-hidden flex flex-col lg:flex-row lg:items-start justify-between gap-6"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-teal-400 to-cyan-500" />
              
              <div className="flex-1 min-w-0 space-y-3 w-full">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="p-3 bg-gradient-to-tr from-teal-500 to-cyan-500 rounded-2xl text-white shadow-lg shadow-teal-100/50 shrink-0 anim-breath-halo">
                    <ArrowPathIcon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight truncate leading-tight">
                      Update for {update.clinicId?.clinicName || 'Unknown Clinic'}
                    </h3>
                    <p className="text-xs font-bold text-teal-600 mt-1 flex items-center gap-1">
                      <ClockIcon className="h-3.5 w-3.5" /> Requested on {new Date(update.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="shrink-0 lg:ml-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-xl text-xs font-black uppercase tracking-wider border border-amber-100 shadow-sm">
                      <ClockIcon className="h-4 w-4" /> Pending
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                  <UserIcon className="h-4 w-4 text-slate-400" /> 
                  Requested by <span className="font-semibold text-slate-800">{update.requestedBy?.fullName}</span> ({update.requestedBy?.email})
                </div>

                {renderUpdateData(update.updateData)}
              </div>

              <div className="flex flex-row lg:flex-col sm:flex-row gap-2 shrink-0 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-48">
                <button
                  onClick={() => openModal(update, 'approve')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md shadow-emerald-50 cursor-pointer transform hover:scale-105 active:scale-95"
                >
                  <CheckIcon className="h-4 w-4" /> Approve
                </button>
                <button
                  onClick={() => openModal(update, 'reject')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:from-rose-600 hover:to-rose-700 transition-all shadow-md shadow-rose-50 cursor-pointer transform hover:scale-105 active:scale-95"
                >
                  <XMarkIcon className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchUpdates(p)}
              className={`w-10 h-10 rounded-2xl font-black text-xs transition-all shadow-sm cursor-pointer ${
                p === pagination.page
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow shadow-teal-100'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {selectedUpdate && modalAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 relative overflow-hidden animate-scaleUp">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
              {modalAction === 'approve' ? 'Approve Update' : 'Reject Update'}
            </h2>
            <p className="text-slate-500 text-sm font-semibold mb-6">
              Are you sure you want to {modalAction === 'approve' ? 'approve and apply the updates for ' : 'reject the updates for '}
              <strong className="text-slate-800">{selectedUpdate.clinicId?.clinicName}</strong>?
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
                  placeholder="Provide precise rejection details..."
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

export default ClinicUpdateApprovals;
