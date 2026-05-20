import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
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
        otp: otpValue,
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

  // Progress indicator: how many digits filled
  const filled = otp.filter(Boolean).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-red-50">

      {/* Soft background blobs matching logo colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-red-200/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-blob animation-delay-4000" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="w-full max-w-sm relative z-10 animate-fadeIn">

        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white shadow-2xl shadow-blue-200/60 mb-5 ring-4 ring-white p-2">
            <img src="/logo.png" alt="Move Well" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Verify OTP</h1>
          <p className="text-slate-500 text-sm mt-1">
            Code sent to{' '}
            <span className="text-blue-600 font-semibold">{email}</span>
          </p>
          {/* Accent line using logo colors */}
          <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-blue-600 to-red-500" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200/80 border border-slate-100">

          {/* Success Message */}
          {success && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl animate-fadeIn">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <p className="text-green-700 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl animate-fadeIn">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-7">

            {/* OTP Input Boxes */}
            <div>
              <div className="flex justify-between gap-2">
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
                    className={`
                      w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 outline-none
                      text-slate-800 bg-slate-50
                      ${digit
                        ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                        : 'border-slate-200 hover:border-slate-300'
                      }
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-blue-50
                    `}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-red-500 rounded-full transition-all duration-300"
                  style={{ width: `${(filled / 6) * 100}%` }}
                />
              </div>
              <p className="text-right text-xs text-slate-400 mt-1">{filled}/6 digits</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || filled !== 6}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-200 hover:shadow-blue-300 focus:ring-2 focus:ring-blue-300 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Verify & Continue
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-slate-100" />

          {/* Resend OTP */}
          <div className="text-center">
            <p className="text-slate-400 text-xs mb-3">Didn't receive the code?</p>
            {canResend ? (
              <button
                onClick={handleResendOTP}
                disabled={resending}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="h-4 w-4" />
                    Resend OTP
                  </>
                )}
              </button>
            ) : (
              <p className="text-slate-400 text-sm">
                Resend in{' '}
                <span className="text-blue-600 font-bold tabular-nums">{countdown}s</span>
              </p>
            )}
          </div>
        </div>

        {/* Back to Login */}
        <button
          onClick={() => navigate('/login')}
          className="mt-5 w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Login
        </button>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default OTPVerification;
