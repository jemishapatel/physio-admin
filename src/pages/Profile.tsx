import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/api';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  SparklesIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Define theme colors and their corresponding CSS shades for global override
const THEME_PALETTES: Record<string, Record<number, string>> = {
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
  },
  purple: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
  },
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
  },
};

const generateThemeCSS = (colorKey: string): string => {
  const palette = THEME_PALETTES[colorKey];
  if (!palette) return '';

  return `
    /* Dynamic Application Theme Overrides for ${colorKey} */
    
    /* Backgrounds */
    .bg-blue-50 { background-color: ${palette[50]} !important; }
    .bg-blue-100 { background-color: ${palette[100]} !important; }
    .bg-blue-200 { background-color: ${palette[200]} !important; }
    .bg-blue-300 { background-color: ${palette[300]} !important; }
    .bg-blue-400 { background-color: ${palette[400]} !important; }
    .bg-blue-500 { background-color: ${palette[500]} !important; }
    .bg-blue-600 { background-color: ${palette[600]} !important; }
    .bg-blue-700 { background-color: ${palette[700]} !important; }
    .bg-blue-800 { background-color: ${palette[800]} !important; }

    /* Texts */
    .text-blue-50 { color: ${palette[50]} !important; }
    .text-blue-100 { color: ${palette[100]} !important; }
    .text-blue-200 { color: ${palette[200]} !important; }
    .text-blue-300 { color: ${palette[300]} !important; }
    .text-blue-400 { color: ${palette[400]} !important; }
    .text-blue-500 { color: ${palette[500]} !important; }
    .text-blue-600 { color: ${palette[600]} !important; }
    .text-blue-700 { color: ${palette[700]} !important; }
    .text-blue-800 { color: ${palette[800]} !important; }

    /* Borders */
    .border-blue-50 { border-color: ${palette[50]} !important; }
    .border-blue-100 { border-color: ${palette[100]} !important; }
    .border-blue-200 { border-color: ${palette[200]} !important; }
    .border-blue-300 { border-color: ${palette[300]} !important; }
    .border-blue-400 { border-color: ${palette[400]} !important; }
    .border-blue-500 { border-color: ${palette[500]} !important; }
    .border-blue-600 { border-color: ${palette[600]} !important; }
    .border-blue-700 { border-color: ${palette[700]} !important; }

    /* Border top (loader custom styling) */
    .border-t-blue-500 { border-top-color: ${palette[500]} !important; }
    .border-t-blue-600 { border-top-color: ${palette[600]} !important; }

    /* Rings & Focus */
    .focus\\:border-blue-500:focus { border-color: ${palette[500]} !important; }
    .focus\\:ring-blue-100:focus { --tw-ring-color: ${palette[100]} !important; }
    .focus\\:ring-blue-50:focus { --tw-ring-color: ${palette[50]} !important; }
    .focus\\:ring-blue-400:focus { --tw-ring-color: ${palette[400]} !important; }
    .focus\\:ring-blue-500:focus { --tw-ring-color: ${palette[500]} !important; }

    /* Gradients */
    .from-blue-400 {
      --tw-gradient-from: ${palette[400]} !important;
      --tw-gradient-to: rgba(0, 0, 0, 0) !important;
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
    }
    .from-blue-500 {
      --tw-gradient-from: ${palette[500]} !important;
      --tw-gradient-to: rgba(0, 0, 0, 0) !important;
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
    }
    .from-blue-600 {
      --tw-gradient-from: ${palette[600]} !important;
      --tw-gradient-to: rgba(0, 0, 0, 0) !important;
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
    }
    .from-blue-700 {
      --tw-gradient-from: ${palette[700]} !important;
      --tw-gradient-to: rgba(0, 0, 0, 0) !important;
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
    }

    .to-blue-500 { --tw-gradient-to: ${palette[500]} !important; }
    .to-blue-600 { --tw-gradient-to: ${palette[600]} !important; }
    .to-blue-700 { --tw-gradient-to: ${palette[700]} !important; }

    .via-blue-600 {
      --tw-gradient-to: rgba(0, 0, 0, 0) !important;
      --tw-gradient-stops: var(--tw-gradient-from), ${palette[600]} !important;
    }

    /* Hovers */
    .hover\\:bg-blue-50:hover { background-color: ${palette[50]} !important; }
    .hover\\:bg-blue-100:hover { background-color: ${palette[100]} !important; }
    .hover\\:text-blue-700:hover { color: ${palette[700]} !important; }
    .hover\\:from-blue-500:hover { --tw-gradient-from: ${palette[500]} !important; }
    .hover\\:from-blue-600:hover { --tw-gradient-from: ${palette[600]} !important; }
    .hover\\:to-blue-600:hover { --tw-gradient-to: ${palette[600]} !important; }
    .hover\\:to-blue-700:hover { --tw-gradient-to: ${palette[700]} !important; }
    .hover\\:border-blue-200:hover { border-color: ${palette[200]} !important; }

    /* Shadow Colors */
    .shadow-blue-100 { --tw-shadow-color: ${palette[100]} !important; }
    .shadow-blue-200 { --tw-shadow-color: ${palette[200]} !important; }
    .shadow-blue-300 { --tw-shadow-color: ${palette[300]} !important; }
  `;
};

const applySavedTheme = () => {
  if (typeof window === 'undefined') return;
  const savedTheme = localStorage.getItem('movewell-theme-color');
  if (!savedTheme || savedTheme === 'blue') {
    const styleEl = document.getElementById('dynamic-app-theme');
    if (styleEl) styleEl.remove();
    return;
  }
  const css = generateThemeCSS(savedTheme);
  let styleEl = document.getElementById('dynamic-app-theme');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'dynamic-app-theme';
    document.head.appendChild(styleEl);
  }
  styleEl.innerHTML = css;
};

applySavedTheme();

interface Degree {
  degreeId: string;
  degreeName: string;
  universityName: string;
  passingYear: number;
}

interface ClinicEntry {
  clinicId?: { _id: string; clinicName: string; address?: string; businessLink?: string; isApproved?: boolean };
  isApproved: boolean | null;
  addedAt?: string;
}

interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  countryCode: string;
  gender: string;
  experience?: number;
  role: string[];
  activeRole?: string;
  degrees?: Degree[];
  clinics?: ClinicEntry[];
  isVerified: boolean;
  isActive: boolean;
  isApproved: boolean | null;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-red-50 text-red-700 border border-red-200 shadow-sm shadow-red-100/50',
  owner: 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm shadow-amber-100/50',
  sr_doctor: 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm shadow-purple-100/50',
  jr_doctor: 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm shadow-blue-100/50',
  receptionist: 'bg-teal-50 text-teal-700 border border-teal-200 shadow-sm shadow-teal-100/50',
  driver: 'bg-slate-50 text-slate-700 border border-slate-200 shadow-sm shadow-slate-100/50',
  patient: 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm shadow-emerald-100/50',
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  owner: 'Clinic Owner',
  sr_doctor: 'Senior Doctor',
  jr_doctor: 'Junior Doctor',
  receptionist: 'Receptionist',
  driver: 'Driver',
  patient: 'Patient',
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'personal' | 'qualifications' | 'clinics' | 'theme'>('personal');
  const [themeColor, setThemeColor] = useState(localStorage.getItem('movewell-theme-color') || 'blue');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editForm, setEditForm] = useState({
    fullName: '',
    countryCode: '',
    mobileNumber: '',
    gender: '',
  });

  const handleThemeChange = (color: string) => {
    setThemeColor(color);
    localStorage.setItem('movewell-theme-color', color);
    applySavedTheme();
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!editModalOpen) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setEditModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [editModalOpen]);

  const openEditModal = () => {
    if (!profile) return;
    
    let normalizedGender = profile.gender || '';
    if (normalizedGender) {
      const lower = normalizedGender.toLowerCase().trim();
      if (lower === 'male') normalizedGender = 'Male';
      else if (lower === 'female') normalizedGender = 'Female';
      else if (lower === 'other') normalizedGender = 'Other';
    }

    setEditForm({
      fullName: profile.fullName || '',
      countryCode: profile.countryCode || '',
      mobileNumber: profile.mobileNumber || '',
      gender: normalizedGender,
    });
    setEditError('');
    setEditModalOpen(true);
  };

  const saveEditProfile = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!profile) return;
    setEditSaving(true);
    setEditError('');
    try {
      await userAPI.updateProfile({
        fullName: editForm.fullName.trim(),
        countryCode: editForm.countryCode.trim(),
        mobileNumber: editForm.mobileNumber.trim(),
        gender: editForm.gender.trim(),
      });
      const res = await userAPI.getProfile();
      setProfile(res.data.data);
      setEditModalOpen(false);
    } catch (err: any) {
      setEditError(err.response?.data?.message || 'Could not save profile changes');
    } finally {
      setEditSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 animate-fadeIn">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute w-8 h-8 border-4 border-cyan-100 border-t-cyan-500 rounded-full animate-spin animate-reverse"></div>
        </div>
        <p className="text-gray-500 text-sm font-semibold tracking-wide animate-pulse">Loading profile data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-red-50/50 border border-red-100 rounded-3xl text-center space-y-4 shadow-xl shadow-red-50/20 animate-fadeIn">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <XCircleIcon className="h-10 w-10" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Something went wrong</h3>
          <p className="text-gray-600 mt-1 text-sm">{error}</p>
        </div>
        <button
          onClick={fetchProfile}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-rose-700 transition-all shadow-lg shadow-red-200/50 transform hover:scale-105"
        >
          <ArrowPathIcon className="h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto relative">
      {/* Dynamic Style Block for gorgeous, high-end visual animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes flowGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatEffect1 {
          0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
          50% { transform: translateY(-15px) scale(1.08) rotate(3deg); }
        }
        @keyframes floatEffect2 {
          0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
          50% { transform: translateY(12px) scale(0.95) rotate(-3deg); }
        }
        @keyframes slowSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes breatheGlow {
          0%, 100% { box-shadow: 0 10px 30px -10px rgba(16, 185, 129, 0.3), 0 0 15px rgba(6, 182, 212, 0.1); }
          50% { box-shadow: 0 15px 45px -5px rgba(16, 185, 129, 0.5), 0 0 25px rgba(6, 182, 212, 0.3); }
        }
        @keyframes textReveal {
          from { opacity: 0; transform: translateY(-12px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .anim-gradient-shift {
          background-size: 200% 200%;
          animation: flowGradient 10s ease infinite;
        }
        .anim-float-shape-1 {
          animation: floatEffect1 7s ease-in-out infinite;
        }
        .anim-float-shape-2 {
          animation: floatEffect2 9s ease-in-out infinite;
        }
        .anim-slow-spin {
          animation: slowSpin 16s linear infinite;
        }
        .anim-breathe-glow {
          animation: breatheGlow 4s ease-in-out infinite;
        }
        .anim-text-reveal {
          animation: textReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hover-card-trigger {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-card-trigger:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08);
        }
        .hover-avatar-ring {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-card-trigger:hover .hover-avatar-ring {
          transform: rotate(180deg) scale(1.05);
          background: linear-gradient(to top right, #34d399, #06b6d4, #6366f1);
        }
        @keyframes softPulse {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.03); }
        }
        .ambient-orb-pulse {
          animation: softPulse 8s ease-in-out infinite;
        }
        .profile-tab-active {
          background: linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 10px 40px -10px rgb(13 148 136 / 0.45);
        }
        .profile-tab-active span svg {
          color: rgba(255,255,255,0.95) !important;
        }
      `}} />

      {/* Ambient backdrop — depth without distracting from content */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 -right-24 w-[min(520px,55vw)] h-[520px] rounded-full bg-gradient-to-br from-emerald-200/40 via-teal-100/25 to-transparent blur-3xl ambient-orb-pulse" />
        <div className="absolute bottom-[-20%] -left-32 w-[min(480px,50vw)] h-[480px] rounded-full bg-gradient-to-tr from-sky-200/35 via-violet-100/20 to-transparent blur-3xl ambient-orb-pulse [animation-delay:-3s]" />
        <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
      </div>

      {/* Header */}
      <div className="border-b border-slate-200/60 pb-2 anim-text-reveal">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/90 text-emerald-700 border border-emerald-100 shadow-sm shadow-emerald-500/10">
            <ShieldCheckIcon className="h-3.5 w-3.5" /> Secure profile
          </span>
          <span className="text-slate-300 text-xs hidden sm:inline">·</span>
          <span className="text-xs font-semibold text-slate-500">Move Well workspace</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900/90 bg-clip-text text-transparent">
            Account Management
          </h1>
          <div className="p-1.5 bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 rounded-2xl border border-emerald-100/80 shadow-inner anim-slow-spin">
            <SparklesIcon className="h-6 w-6" />
          </div>
        </div>
        <p className="text-slate-600 mt-3 text-base font-medium max-w-2xl leading-relaxed">
          View credentials, clinics, and theme — all in one refined dashboard built for admins.
        </p>
      </div>

      {/* Profile hero */}
      <div className="bg-white rounded-[2.5rem] ring-1 ring-white/70 border border-slate-200/80 shadow-[0_25px_80px_-12px_rgba(15,23,42,0.12)] overflow-hidden relative hover-card-trigger anim-text-reveal [animation-delay:150ms]">
        {/* Banner */}
        <div className="h-16 sm:h-20 w-full bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 relative overflow-hidden anim-gradient-shift">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_-10%,rgba(255,255,255,0.9),transparent_55%)]" />
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10 z-0" />

          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/25 rounded-full blur-2xl anim-float-shape-1 z-0" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-cyan-200/35 rounded-full blur-3xl anim-float-shape-2 z-0" />
          <div className="absolute top-10 right-[18%] w-40 h-40 bg-emerald-200/35 rounded-full blur-2xl anim-float-shape-1 [animation-delay:2s] z-0" />
          {/* Glass strip */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/15 to-transparent z-[1]" />
        </div>

        {/* Profile Avatar, Info & Badges Section */}
        <div className="px-6 sm:px-8 pb-4 pt-4 sm:pt-4 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex flex-col gap-0 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{profile.fullName}</h2>
                  {profile.isApproved === true && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100/60 shadow-sm shadow-emerald-50/50">
                      <ShieldCheckIcon className="h-4 w-4" /> Approved Partner
                    </span>
                  )}
                </div>

                <p className="text-slate-500 text-sm font-semibold flex items-center gap-2 mt-5 sm:mt-6">
                  <EnvelopeIcon className="h-5 w-5 text-slate-400 shrink-0" />
                  {profile.email}
                </p>

                <div className="flex flex-wrap gap-2 pt-3">
                  {(profile.role || []).map(r => (
                    <span key={r} className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${ROLE_COLORS[r] || 'bg-gray-100 text-gray-700'}`}>
                      {ROLE_LABELS[r] || r}
                    </span>
                  ))}
                </div>
              </div>

            {/* Status + edit */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 lg:items-start shrink-0">
              <button
                type="button"
                onClick={openEditModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-blue-800 transition-all border border-blue-500/30"
              >
                <PencilSquareIcon className="h-5 w-5 shrink-0" />
                Edit profile
              </button>
              <div className="flex flex-wrap gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider ${profile.isVerified
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm shadow-emerald-50/50'
                  : 'bg-amber-50 text-amber-700 border border-amber-100 shadow-sm shadow-amber-50/50'
                }`}>
                {profile.isVerified ? <CheckCircleIcon className="h-5 w-5" /> : <ClockIcon className="h-5 w-5" />}
                {profile.isVerified ? 'Verified' : 'Pending Verification'}
              </span>

              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider ${profile.isActive
                  ? 'bg-sky-50 text-sky-700 border border-sky-100 shadow-sm shadow-sky-50/50'
                  : 'bg-rose-50 text-rose-700 border border-rose-100 shadow-sm shadow-rose-50/50'
                }`}>
                {profile.isActive ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
                {profile.isActive ? 'Active Status' : 'Suspended'}
              </span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-3 pt-3 border-t border-slate-100/90">
            {[
              { label: 'Experience', icon: BriefcaseIcon, iconClass: 'text-emerald-600 bg-emerald-50', display: profile.experience !== undefined && profile.experience !== null ? `${profile.experience} Yrs` : '—' },
              { label: 'Clinics linked', icon: BuildingOffice2Icon, iconClass: 'text-blue-600 bg-blue-50', display: String(profile.clinics?.length || 0) },
              { label: 'Credentials', icon: AcademicCapIcon, iconClass: 'text-violet-600 bg-violet-50', display: `${profile.degrees?.length || 0} degrees` },
              { label: 'Primary role', icon: IdentificationIcon, iconClass: 'text-teal-600 bg-teal-50', display: ROLE_LABELS[profile.role[0]] || profile.role[0] || 'Member', displaySmall: true },
            ].map((stat, i) => (
              <div
                key={i}
                className="relative p-4 rounded-2xl bg-gradient-to-b from-white to-slate-50/90 border border-slate-100/90 text-center space-y-2 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/60 hover:border-emerald-100/90 transition-all duration-300 overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{stat.label}</p>
                <p className={`font-extrabold text-slate-800 flex items-center justify-center gap-2 ${stat.displaySmall ? 'text-xs sm:text-sm uppercase tracking-wide text-emerald-700' : 'text-lg sm:text-xl'}`}>
                  <span className={`inline-flex p-2 rounded-xl border border-white shadow-sm ${stat.iconClass}`}>
                    <stat.icon className="h-5 w-5" />
                  </span>
                  <span className="tabular-nums">{stat.display}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Tabs sidebar + Content detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-[2rem] p-3 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.1)] border border-slate-200/60 space-y-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 mb-1">Sections</h3>
            {[
              { id: 'personal', label: 'Personal Information', icon: <UserIcon className="h-5 w-5" /> },
              { id: 'qualifications', label: 'Degrees & Education', icon: <AcademicCapIcon className="h-5 w-5" /> },
              { id: 'clinics', label: 'Associated Clinics', icon: <BuildingOffice2Icon className="h-5 w-5" /> },
              { id: 'theme', label: 'Theme Settings', icon: <SparklesIcon className="h-5 w-5" /> },
            ].map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 group cursor-pointer border ${
                    isSelected
                      ? 'profile-tab-active scale-[1.01]'
                      : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-800 hover:border-slate-100'
                  }`}
                >
                  <span className={`transition-transform duration-300 shrink-0 ${isSelected ? 'scale-110' : 'text-slate-400 group-hover:scale-110 group-hover:text-slate-600'}`}>
                    {tab.icon}
                  </span>
                  <span className="text-left leading-snug">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="relative rounded-[2rem] p-[1px] bg-gradient-to-br from-emerald-200/70 via-slate-100 to-cyan-200/60 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.12)] min-h-[200px] flex flex-col">
            <div className="relative flex flex-col flex-1 rounded-[calc(2rem-1px)] bg-gradient-to-b from-white via-white to-slate-50/80 p-4 sm:p-5 border border-white/80 overflow-visible">
              <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-emerald-100/35 blur-3xl" />
              <div className="pointer-events-none absolute bottom-[-30%] left-[-10%] w-72 h-72 rounded-full bg-cyan-100/25 blur-3xl" />
            {/* Personal */}
            {activeTab === 'personal' && (
              <div className="relative space-y-4 flex-1 animate-fadeIn z-[1]">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Personal information</h3>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium max-w-xl">Identifiers and contact details associated with your admin profile.</p>
                  </div>
                  <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                    Read-only overview
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <InfoGridRow
                    icon={<UserIcon className="h-5 w-5" />}
                    iconColor="bg-emerald-50 text-emerald-600 border border-emerald-100"
                    label="Full Registered Name"
                    value={profile.fullName}
                  />
                  <InfoGridRow
                    icon={<EnvelopeIcon className="h-5 w-5" />}
                    iconColor="bg-sky-50 text-sky-600 border border-sky-100"
                    label="Email Address"
                    value={profile.email}
                  />
                  <InfoGridRow
                    icon={<PhoneIcon className="h-5 w-5" />}
                    iconColor="bg-teal-50 text-teal-600 border border-teal-100"
                    label="Mobile Contact"
                    value={`${profile.countryCode} ${profile.mobileNumber}`}
                  />
                  <InfoGridRow
                    icon={<IdentificationIcon className="h-5 w-5" />}
                    iconColor="bg-amber-50 text-amber-600 border border-amber-100"
                    label="Gender Identity"
                    value={profile.gender}
                  />
                  {profile.experience !== undefined && profile.experience !== null && (
                    <InfoGridRow
                      icon={<BriefcaseIcon className="h-5 w-5" />}
                      iconColor="bg-indigo-50 text-indigo-600 border border-indigo-100"
                      label="Professional Experience"
                      value={`${profile.experience} Years`}
                    />
                  )}
                  <InfoGridRow
                    icon={<CalendarIcon className="h-5 w-5" />}
                    iconColor="bg-purple-50 text-purple-600 border border-purple-100"
                    label="Registered Date"
                    value={new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'qualifications' && (
              <div className="relative space-y-6 flex-1 animate-fadeIn z-[1]">
                <div className="border-b border-slate-100 pb-5">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Degrees & qualifications</h3>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">Education and credentials on file.</p>
                </div>

                {profile.degrees && profile.degrees.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {profile.degrees.map((d, i) => (
                      <div
                        key={d.degreeId || i}
                        className="relative overflow-hidden p-5 rounded-2xl border border-violet-100/90 bg-white/90 shadow-sm hover:shadow-md hover:border-violet-200/90 transition-all duration-300 group"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-fuchsia-500 opacity-70 group-hover:opacity-100 transition-opacity rounded-l-2xl" />
                        <div className="flex items-start gap-4 pl-2">
                          <div className="relative">
                            <div className="p-3 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl shadow-lg shadow-violet-200/80 text-white shrink-0 group-hover:scale-105 transition-transform">
                              <AcademicCapIcon className="h-6 w-6" />
                            </div>
                            <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full bg-slate-900 text-white text-[9px] font-black">
                              {i + 1}
                            </span>
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <p className="font-extrabold text-slate-900 text-sm tracking-tight leading-snug">{d.degreeName}</p>
                            <p className="text-violet-600/95 text-xs font-semibold truncate">{d.universityName}</p>
                            <div className="inline-flex items-center gap-1 mt-2.5 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-800 text-[10px] font-bold border border-violet-100/80">
                              <CalendarIcon className="h-3.5 w-3.5" /> Class of {d.passingYear}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                    <div className="w-20 h-20 bg-white rounded-[1.5rem] border border-slate-100 flex items-center justify-center text-violet-300 shadow-inner ring-4 ring-violet-50">
                      <AcademicCapIcon className="h-10 w-10" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-black text-lg">No qualifications yet</p>
                      <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed">Degrees and certificates you add will appear here as polished cards.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Associated Clinics */}
            {activeTab === 'clinics' && (
              <div className="relative space-y-6 flex-1 animate-fadeIn z-[1]">
                <div className="border-b border-slate-100 pb-5">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Associated clinics</h3>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">Practice locations linked to your profile.</p>
                </div>

                {profile.clinics && profile.clinics.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {profile.clinics.map((c, i) => (
                      <div
                        key={i}
                        className="relative overflow-hidden p-5 rounded-2xl border border-sky-100/90 bg-white/90 shadow-sm hover:shadow-md hover:border-sky-200/90 transition-all duration-300 flex items-start gap-4 min-w-0 group"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-500 to-blue-600 opacity-70 group-hover:opacity-100 transition-opacity rounded-l-2xl" />
                        <div className="p-3 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-lg shadow-sky-200/70 text-white shrink-0 group-hover:scale-105 transition-transform ml-2">
                          <BuildingOffice2Icon className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="font-extrabold text-slate-800 text-sm truncate leading-tight tracking-tight">
                            {c.clinicId?.clinicName || 'Unknown Clinic'}
                          </p>
                          {c.clinicId?.address && (
                            <p className="text-slate-500 text-xs truncate flex items-center gap-1 font-medium">
                              <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              {c.clinicId.address}
                            </p>
                          )}

                          {c.clinicId?.businessLink && (
                            <a
                              href={`https://${c.clinicId.businessLink}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 mt-1"
                            >
                              Visit practice website &rarr;
                            </a>
                          )}

                          <div className="pt-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${c.isApproved === true
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                              {c.isApproved === true ? 'Approved Status' : 'Approval Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                    <div className="w-20 h-20 bg-white rounded-[1.5rem] border border-slate-100 flex items-center justify-center text-sky-300 shadow-inner ring-4 ring-sky-50">
                      <BuildingOffice2Icon className="h-10 w-10" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-black text-lg">No clinics linked</p>
                      <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed">Linked clinics will show here with approval status.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="relative space-y-6 flex-1 animate-fadeIn z-[1]">
                <div className="border-b border-slate-100 pb-5">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Theme & branding</h3>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">Choose a palette for the admin dashboard layout.</p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-inner space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Theme Color Choices</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'blue', label: 'Classic Blue', desc: 'Trust, safety & clinical precision', from: 'from-blue-500', to: 'to-blue-600', activeRing: 'ring-blue-400' },
                        { id: 'emerald', label: 'Emerald Green', desc: 'Healing, physical recovery & vitality', from: 'from-emerald-500', to: 'to-emerald-600', activeRing: 'ring-emerald-400' },
                        { id: 'purple', label: 'Amethyst Purple', desc: 'Luxury care, intelligence & prestige', from: 'from-violet-500', to: 'to-violet-600', activeRing: 'ring-violet-400' },
                        { id: 'rose', label: 'Sunset Red', desc: 'Active energy, dynamic power & force', from: 'from-rose-500', to: 'to-rose-600', activeRing: 'ring-rose-400' },
                        { id: 'amber', label: 'Amber Gold', desc: 'Comforting warmth, patient care & friendship', from: 'from-amber-500', to: 'to-amber-600', activeRing: 'ring-amber-400' },
                      ].map((theme) => {
                        const isCurrent = themeColor === theme.id;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                            type="button"
                            className={`p-5 rounded-2xl bg-white border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-4 shadow-sm hover:translate-y-[-2px] hover:shadow-md ${
                              isCurrent
                                ? `border-blue-500 ring-4 ${theme.activeRing}/20`
                                : 'border-slate-100 hover:border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`h-10 w-10 bg-gradient-to-br ${theme.from} ${theme.to} rounded-xl shadow shrink-0 flex items-center justify-center text-white font-bold`}>
                                {theme.label.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">{theme.label}</h4>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{theme.desc}</p>
                              </div>
                            </div>
                            
                            {isCurrent && (
                              <CheckCircleIcon className="h-6 w-6 text-blue-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-5 border border-dashed border-emerald-200/70 rounded-3xl bg-emerald-50/30 text-xs font-semibold flex gap-3.5 items-start">
                    <SparklesIcon className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <p className="font-extrabold text-slate-800">Dynamic UI Theme Injection Technology</p>
                      <p className="mt-1 leading-relaxed text-slate-400">Selecting a color theme instantly rewrites the application CSS tokens at runtime. Your selection is immediately applied to all pages, navigation nodes, active visual badges, gradients, and custom layouts, persisting smoothly across sessions.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit profile modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-default"
            aria-label="Close dialog"
            onClick={() => setEditModalOpen(false)}
          />
          <div
            className="relative w-full max-w-lg rounded-[1.75rem] bg-white shadow-2xl shadow-slate-900/20 border border-slate-100 overflow-hidden animate-fadeIn"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
          >
            <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div>
                <h2 id="edit-profile-title" className="text-xl font-black text-slate-900 tracking-tight">
                  Edit profile
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">Update your name and contact details</p>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={saveEditProfile} className="px-6 py-5 space-y-4">
              {editError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-semibold">
                  {editError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Full name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Country code</label>
                  <input
                    type="text"
                    value={editForm.countryCode}
                    onChange={(e) => setEditForm((f) => ({ ...f, countryCode: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="+91"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Mobile</label>
                  <input
                    type="text"
                    value={editForm.mobileNumber}
                    onChange={(e) => setEditForm((f) => ({ ...f, mobileNumber: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Gender</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm((f) => ({ ...f, gender: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {profile?.email != null && (
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm font-medium cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Email cannot be changed here.</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 min-w-[120px] py-3 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="flex-1 min-w-[120px] py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {editSaving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable elegant Row element for detailed info grid
const InfoGridRow: React.FC<{
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  value: string;
}> = ({ icon, iconColor, label, value }) => (
  <div className="group relative p-4 rounded-2xl border border-slate-100/80 bg-white/60 hover:bg-white hover:border-emerald-200/60 hover:shadow-[0_12px_40px_-14px_rgba(15,23,42,0.12)] transition-all duration-300 flex items-center gap-4 overflow-hidden">
    <div className="pointer-events-none absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-90 transition-opacity" />
    <div className={`p-2.5 rounded-xl shrink-0 shadow-sm ring-1 ring-black/[0.04] transition-transform duration-300 group-hover:scale-105 ${iconColor}`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.15em]">{label}</p>
      <p className="text-slate-900 text-sm font-bold mt-1 leading-snug break-words">{value || '—'}</p>
    </div>
  </div>
);

export default Profile;
