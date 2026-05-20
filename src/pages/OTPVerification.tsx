import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  ShieldCheckIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  CheckIcon, 
  ArrowPathIcon, 
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  // Track whether OTP was just verified so we only redirect after actual verification
  const justVerified = useRef(false);
  // Prevent duplicate submissions
  const isSubmitting = useRef(false);
  const { setCredentials, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  // Navigate to dashboard only after OTP verification sets credentials
  useEffect(() => {
    if (isAuthenticated && justVerified.current) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting.current) return;

    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    setLoading(true);
    isSubmitting.current = true;

    try {
      const response = await api.post('/user/verify-otp', {
        email,
        otp: otpValue
      });

      if (response.data.success) {
        setSuccess('OTP verified successfully! Redirecting...');
        // Token is nested inside response.data.data.token
        const token = response.data.data?.token;
        const userData = response.data.data;
        if (token) {
          justVerified.current = true;
          setCredentials(token, userData);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      isSubmitting.current = false; // Allow retry on error
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setResending(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/user/resend-otp', { email });
      
      if (response.data.success) {
        setSuccess('OTP sent successfully! Check your email.');
        setCountdown(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
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
        {/* OTP Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl mb-4 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <ShieldCheckIcon className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Verify OTP
            </h1>
            <p className="text-gray-600 font-medium text-base">
              Enter the 6-digit code sent to
            </p>
            <p className="text-emerald-600 font-bold text-lg mt-1">{email}</p>
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

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-16 text-center text-2xl font-bold border-3 border-gray-300 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none bg-white shadow-lg hover:shadow-xl"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold py-5 px-6 rounded-2xl hover:shadow-2xl focus:ring-4 focus:ring-emerald-200 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center text-lg">
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Verify & Continue
                </span>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the code?
            </p>
            {canResend ? (
              <button
                onClick={handleResendOTP}
                disabled={resending}
                className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {resending ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="h-5 w-5 mr-2" />
                    Resend OTP
                  </>
                )}
              </button>
            ) : (
              <p className="text-gray-500 font-medium">
                Resend OTP in <span className="text-emerald-600 font-bold">{countdown}s</span>
              </p>
            )}
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors flex items-center justify-center mx-auto"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Login
            </button>
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default OTPVerification;
