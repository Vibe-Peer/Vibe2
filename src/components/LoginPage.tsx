import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  X,
} from 'lucide-react';
import { VibeLogo } from './VibeLogo.tsx';
import { auth } from '../firebase/config.ts';
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
  onGoToSignup: () => void;
  onGoToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onGoToSignup,
  onGoToHome,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      onLoginSuccess(email);
    } catch (err: any) {
      setIsLoading(false);
      let errMsg = err.message || 'Failed to sign in. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-email') {
        errMsg = 'Invalid email or password. Please check or sign up.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Authentication provider is not enabled in Firebase Console. Please go to Firebase Console -> Authentication -> Sign-in method and enable Email/Password and Google.';
      }
      setErrors({ general: errMsg });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setIsLoading(false);
      onLoginSuccess(result.user.email || 'google.user@vibe.app');
    } catch (err: any) {
      setIsLoading(false);
      let errMsg = err.message || 'Google Sign-In failed.';
      if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Google authentication is not enabled in Firebase Console. Please go to Firebase Console -> Authentication -> Sign-in method and enable Google.';
      }
      setErrors({ general: errMsg });
    }
  };

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      return;
    }
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotSent(true);
    } catch (err: any) {
      setForgotSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-[#22D3EE] selection:text-[#020617] overflow-hidden">
      {/* Midnight Navy Subtle Radial Glow Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.95)_0%,rgba(14,165,233,0.12)_35%,rgba(2,6,23,0.95)_70%)] blur-2xl" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06)_0%,transparent_60%)] blur-3xl" />
      </div>

      {/* Top Header Link to Home */}
      <div className="relative z-10 max-w-md w-full mx-auto mb-6 flex items-center justify-between">
        <button
          onClick={onGoToHome}
          className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#22D3EE] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </button>
        <div className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>Firebase Auth</span>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 max-w-md w-full mx-auto bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl shadow-[#020617] p-8 sm:p-10 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <VibeLogo size="lg" showTagline={false} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
            Welcome Back to Vibe
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1.5">
            Sign in with Firebase Authentication to access your dashboard.
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Medical Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="doctor@aiims.edu"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#020617] border text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none transition-all ${
                  errors.email
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-[#1E293B] focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/50'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotSent(false);
                  setShowForgotModal(true);
                }}
                className="text-xs text-[#22D3EE] hover:text-[#67E8F9] transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-3 rounded-xl bg-[#020617] border text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none transition-all ${
                  errors.password
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-[#1E293B] focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#94A3B8] select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#020617] border-[#1E293B] text-[#22D3EE] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#22D3EE]"
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#22D3EE] text-[#020617] hover:bg-[#67E8F9] transition-all shadow-lg shadow-[#22D3EE]/25 hover:shadow-[#22D3EE]/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#020617] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Log In with Firebase</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#1E293B]"></div>
            <span className="flex-shrink mx-4 text-[11px] text-[#94A3B8] uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-[#1E293B]"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#0F172A] border border-[#1E293B] hover:border-[#22D3EE]/60 text-[#F8FAFC] hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In with Google</span>
          </button>
        </form>

        {/* Switch to Signup */}
        <div className="mt-8 pt-6 border-t border-[#1E293B] text-center">
          <p className="text-xs text-[#94A3B8]">
            Don&apos;t have an account?{' '}
            <button
              onClick={onGoToSignup}
              className="text-[#22D3EE] hover:text-[#67E8F9] font-bold transition-colors cursor-pointer ml-1"
            >
              Sign Up Free
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1E293B] text-[#22D3EE] flex items-center justify-center mx-auto mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Reset Your Password</h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                Enter your registered medical email address to receive a password reset link via Firebase.
              </p>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-300">Reset Email Dispatched!</h4>
                <p className="text-xs text-slate-300">
                  Password reset email has been sent to <strong className="text-white">{forgotEmail}</strong>.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-emerald-500 text-[#020617] text-xs font-bold hover:bg-emerald-400 transition cursor-pointer"
                >
                  Return to Log In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendResetLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="doctor@aiims.edu"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#020617] border border-[#1E293B] text-sm text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#22D3EE] text-[#020617] font-bold text-xs hover:bg-[#67E8F9] transition cursor-pointer shadow-md shadow-[#22D3EE]/20"
                >
                  Send Password Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
