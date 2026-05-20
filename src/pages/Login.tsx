import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  BuildingOffice2Icon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Call resend-otp API to send OTP to email
      const response = await api.post('/user/resend-otp', { email });
      
      if (response.data.success) {
        setSuccess('OTP sent to your email! Redirecting...');
        // Redirect to OTP verification page after 1.5 seconds
        setTimeout(() => {
          navigate('/verify-otp', { state: { email } });
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-fadeIn">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block p-5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl mb-4 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <BuildingOffice2Icon className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Move Well
            </h1>
            <p className="text-gray-600 font-semibold text-lg">Admin Dashboard</p>
            <div className="mt-4 h-1 w-20 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full"></div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-xl animate-fadeIn">
              <div className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl animate-fadeIn">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                <EnvelopeIcon className="h-5 w-5 mr-2" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none text-gray-700 font-medium"
                placeholder="admin@movewell.com"
              />
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold py-5 px-6 rounded-2xl hover:shadow-2xl focus:ring-4 focus:ring-emerald-200 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                <span className="flex items-center justify-center text-lg">
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  Send OTP to Email
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Powered by <span className="font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">Move Well</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;
