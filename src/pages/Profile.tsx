import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
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
  ArrowRightOnRectangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

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
  const { logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'personal' | 'qualifications' | 'clinics'>('personal');

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const initials = profile.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

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
      `}} />

      {/* Header Title with Subtitle - Clean & Fully Centered without the Refresh button */}
      <div className="border-b border-slate-100 pb-2 anim-text-reveal">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 bg-clip-text text-transparent">
            Account Management
          </h1>
          <div className="p-1 bg-emerald-50 text-emerald-600 rounded-xl anim-slow-spin">
            <SparklesIcon className="h-6 w-6" />
          </div>
        </div>
        <p className="text-slate-500 mt-2.5 text-base font-medium">View and manage your professional credentials and clinic details</p>
      </div>

      {/* Modern High-End Profile Card - Animated Dynamic Styling */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-100/50 overflow-hidden relative hover-card-trigger anim-text-reveal [animation-delay:150ms]">
        {/* Animated fluid banner gradient with shifting colors & floating glass ornaments */}
        <div className="h-56 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 relative overflow-hidden anim-gradient-shift">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:20px_20px]" />

          {/* Shimmer overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-0" />

          {/* Glass Orbs */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/20 rounded-full blur-2xl anim-float-shape-1 z-0" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl anim-float-shape-2 z-0" />
          <div className="absolute top-8 right-1/4 w-32 h-32 bg-cyan-200/25 rounded-full blur-xl anim-float-shape-1 [animation-delay:2s] z-0" />
        </div>

        {/* Profile Avatar, Info & Badges Section */}
        <div className="px-8 sm:px-12 pb-10 -mt-20 sm:-mt-16 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Halos surrounding the Avatar - Interactive Rotation on Card Hover */}
              <div className="p-1.5 bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 rounded-[1.85rem] shadow-xl shadow-emerald-100/70 shrink-0 hover-avatar-ring anim-breathe-glow">
                <div className="w-32 h-32 rounded-[1.65rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center text-white text-4xl font-black border-4 border-white shadow-2xl shadow-black/20 transition-all duration-300 transform group-hover:scale-98">
                  {initials}
                </div>
              </div>

              <div className="mb-2 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{profile.fullName}</h2>
                  {profile.isApproved === true && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100/60 shadow-sm shadow-emerald-50/50">
                      <ShieldCheckIcon className="h-4 w-4" /> Approved Partner
                    </span>
                  )}
                </div>

                <p className="text-slate-500 text-sm font-semibold flex items-center gap-2">
                  <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                  {profile.email}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {(profile.role || []).map(r => (
                    <span key={r} className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${ROLE_COLORS[r] || 'bg-gray-100 text-gray-700'}`}>
                      {ROLE_LABELS[r] || r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Elite Status Pills */}
            <div className="flex flex-wrap gap-3 self-start lg:self-end mb-2">
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

          {/* Quick Statistics Bar - Dashboard Pill Design */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-center space-y-0.5 hover:bg-slate-50 hover:shadow-inner transition-all">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Experience</p>
              <p className="text-xl font-extrabold text-slate-800 flex items-center justify-center gap-1">
                <BriefcaseIcon className="h-5 w-5 text-emerald-500" />
                {profile.experience !== undefined && profile.experience !== null ? `${profile.experience} Yrs` : '—'}
              </p>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-center space-y-0.5 hover:bg-slate-50 hover:shadow-inner transition-all">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Clinics Linked</p>
              <p className="text-xl font-extrabold text-slate-800 flex items-center justify-center gap-1">
                <BuildingOffice2Icon className="h-5 w-5 text-blue-500" />
                {profile.clinics?.length || 0}
              </p>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-center space-y-0.5 hover:bg-slate-50 hover:shadow-inner transition-all">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Credentials</p>
              <p className="text-xl font-extrabold text-slate-800 flex items-center justify-center gap-1">
                <AcademicCapIcon className="h-5 w-5 text-purple-500" />
                {profile.degrees?.length || 0} Degrees
              </p>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-center space-y-0.5 hover:bg-slate-50 hover:shadow-inner transition-all">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Primary Role</p>
              <p className="text-sm font-black text-emerald-600 flex items-center justify-center h-7 uppercase tracking-wide">
                {ROLE_LABELS[profile.role[0]] || profile.role[0] || 'Member'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Tabs sidebar + Content detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar & Account History Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Navigation Controls */}
          <div className="bg-white rounded-[2rem] p-5 shadow-xl shadow-slate-100/50 border border-slate-100/70 space-y-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-3 mb-3">Navigation</h3>
            {[
              { id: 'personal', label: 'Personal Information', icon: <UserIcon className="h-5 w-5" />, color: 'emerald' },
              { id: 'qualifications', label: 'Degrees & Education', icon: <AcademicCapIcon className="h-5 w-5" />, color: 'purple' },
              { id: 'clinics', label: 'Associated Clinics', icon: <BuildingOffice2Icon className="h-5 w-5" />, color: 'blue' },
            ].map(tab => {
              const isSelected = activeTab === tab.id;
              let iconTheme = 'text-slate-400 group-hover:text-slate-600';
              if (isSelected) {
                if (tab.color === 'emerald') iconTheme = 'text-emerald-500';
                if (tab.color === 'purple') iconTheme = 'text-purple-500';
                if (tab.color === 'blue') iconTheme = 'text-blue-500';
              }
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group cursor-pointer border ${isSelected
                      ? 'bg-slate-50 text-slate-800 border-slate-100 shadow-sm'
                      : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-50/50 hover:text-slate-700'
                    }`}
                >
                  <span className={`transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'} ${iconTheme}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Metadata Card & Logout */}
          <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-100/50 border border-slate-100/70 space-y-5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Account Metadata</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 px-1">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Member Since</p>
                  <p className="text-sm font-bold text-slate-700">
                    {new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
                  <ShieldCheckIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Account ID</p>
                  <p className="text-xs font-mono font-bold text-slate-500 truncate w-48" title={profile.id}>
                    {profile.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl font-bold hover:from-red-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl shadow-red-200/40 hover:shadow-red-300/40 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Sign Out Account
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Detail Card */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-100/50 border border-slate-100/70 min-h-[400px] flex flex-col">

            {/* TAB CONTENT: Personal Information */}
            {activeTab === 'personal' && (
              <div className="space-y-6 flex-1 animate-fadeIn">
                <div className="border-b border-slate-100 pb-5">
                  <h3 className="text-xl font-black text-slate-800">Personal Information</h3>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">General identifiers and contact information linked to your profile</p>
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

            {/* TAB CONTENT: Qualifications */}
            {activeTab === 'qualifications' && (
              <div className="space-y-6 flex-1 animate-fadeIn">
                <div className="border-b border-slate-100 pb-5">
                  <h3 className="text-xl font-black text-slate-800">Degrees & Qualifications</h3>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Educational degrees, academic credentials, and certificates</p>
                </div>

                {profile.degrees && profile.degrees.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {profile.degrees.map((d, i) => (
                      <div
                        key={d.degreeId || i}
                        className="relative overflow-hidden p-5 bg-gradient-to-br from-purple-50/40 via-white to-purple-50/10 rounded-2xl border border-purple-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 group flex items-start gap-4"
                      >
                        <div className="p-3 bg-purple-500 rounded-2xl shadow-md shadow-purple-100 text-white shrink-0 group-hover:scale-110 transition-transform">
                          <AcademicCapIcon className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-extrabold text-slate-800 text-sm tracking-tight leading-tight">{d.degreeName}</p>
                          <p className="text-purple-600 text-xs font-semibold">{d.universityName}</p>
                          <div className="inline-flex items-center gap-1 mt-2.5 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-100/50">
                            <CalendarIcon className="h-3 w-3" /> Passing Year: {d.passingYear}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-center text-slate-300 shadow-inner">
                      <AcademicCapIcon className="h-10 w-10" />
                    </div>
                    <div>
                      <p className="text-slate-700 font-extrabold text-base">No qualifications registered</p>
                      <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">There are currently no degrees or diplomas added to your user account profile.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Associated Clinics */}
            {activeTab === 'clinics' && (
              <div className="space-y-6 flex-1 animate-fadeIn">
                <div className="border-b border-slate-100 pb-5">
                  <h3 className="text-xl font-black text-slate-800">Associated Clinics</h3>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Clinics and corporate practices linked to your practitioner profile</p>
                </div>

                {profile.clinics && profile.clinics.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {profile.clinics.map((c, i) => (
                      <div
                        key={i}
                        className="relative overflow-hidden p-5 bg-gradient-to-br from-blue-50/40 via-white to-blue-50/10 rounded-2xl border border-blue-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex items-start gap-4 min-w-0 group"
                      >
                        <div className="p-3 bg-blue-500 rounded-2xl shadow-md shadow-blue-100 text-white shrink-0 group-hover:scale-110 transition-transform">
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
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-center text-slate-300 shadow-inner">
                      <BuildingOffice2Icon className="h-10 w-10" />
                    </div>
                    <div>
                      <p className="text-slate-700 font-extrabold text-base">No associated practices</p>
                      <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">This account profile is not currently linked to any physical clinics or practices.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
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
  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/70 hover:bg-slate-50/80 hover:shadow-sm transition-all duration-300 flex items-center gap-4">
    <div className={`p-2.5 rounded-xl shrink-0 ${iconColor}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{label}</p>
      <p className="text-slate-800 text-sm font-bold mt-0.5 truncate">{value || '—'}</p>
    </div>
  </div>
);

export default Profile;
