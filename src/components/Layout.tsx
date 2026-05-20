import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ChartBarIcon,
  BuildingOffice2Icon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  LinkIcon,
} from '@heroicons/react/24/outline';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const userRoles = Array.isArray(user?.role) ? user.role : [user?.role || ''];
  const isSuperAdmin = userRoles.includes('super_admin');

  const navigation = [
    { name: 'Dashboard', path: '/', icon: <ChartBarIcon className="w-8 h-8" />, gradient: 'from-blue-500 to-cyan-500' },
    ...(isSuperAdmin ? [
      { name: 'Clinic Approvals', path: '/clinics', icon: <BuildingOffice2Icon className="w-8 h-8" />, gradient: 'from-emerald-500 to-teal-500' },
      { name: 'Doctor Approvals', path: '/doctors', icon: <UserIcon className="w-8 h-8" />, gradient: 'from-purple-500 to-pink-500' },
      // { name: 'Join Requests', path: '/join-requests', icon: <LinkIcon className="w-8 h-8" />, gradient: 'from-orange-500 to-amber-500' },
    ] : [
      { name: 'Join Requests', path: '/join-requests', icon: <LinkIcon className="w-8 h-8" />, gradient: 'from-orange-500 to-amber-500' },
    ]),
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'
          }`}
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center p-6 border-b border-gray-700">
            <div className="text-center">
              <div className="inline-block p-3 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl mb-2 shadow-lg">
                <BuildingOffice2Icon className="w-10 h-10 text-white" />
              </div>
              {sidebarOpen && (
                <>
                  <h1 className="text-2xl font-bold text-white mt-2">Move Well</h1>
                  <p className="text-emerald-300 text-sm font-medium">Admin Portal</p>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center p-4 rounded-2xl transition-all duration-300 ${isActive(item.path)
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl scale-105`
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
              >
                <span className={`transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <span className="ml-4 font-semibold text-base">{item.name}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-700">
            <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} bg-gray-700/50 rounded-2xl p-3`}>
              {sidebarOpen ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {user?.fullName?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user?.fullName || 'Admin'}</p>
                      <p className="text-xs text-gray-400">{user?.email || 'admin@movewell.com'}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-xl hover:bg-red-500/20 transition-colors group"
                    title="Logout"
                  >
                    <span className="group-hover:scale-110 inline-block transition-transform"><ArrowRightOnRectangleIcon className="w-6 h-6 text-gray-300 group-hover:text-red-400" /></span>
                  </button>
                </>
              ) : (
                <button
                  onClick={logout}
                  className="p-2 rounded-xl hover:bg-red-500/20 transition-colors"
                  title="Logout"
                >
                  <span className="inline-block"><ArrowRightOnRectangleIcon className="w-6 h-6 text-gray-300 hover:text-red-400" /></span>
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 rounded-xl hover:bg-gray-100 transition-all hover:shadow-md active:scale-95"
            >
              <span className="text-gray-600"><Bars3Icon className="w-6 h-6" /></span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="relative" ref={dropdownRef}>
                {/* Avatar button */}
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                >
                  {user?.fullName?.charAt(0) || 'A'}
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                    {/* User info header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {user?.fullName?.charAt(0) || 'A'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{user?.fullName || 'Admin'}</p>
                          <p className="text-gray-400 text-xs truncate">{user?.email || ''}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <UserIcon className="h-4 w-4 shrink-0" />
                        My Profile
                      </button>
                      <div className="border-t border-gray-100 mx-3" />
                      <button
                        onClick={() => { setDropdownOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 shrink-0" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
