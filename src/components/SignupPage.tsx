import React, { useState, useMemo } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { VibeLogo } from './VibeLogo.tsx';
import { MedicalExam, Gender } from '../utils/partnerMatching.ts';
import { auth } from '../firebase/config.ts';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export interface NewUserRegistrationData {
  name: string;
  email: string;
  targetExam: MedicalExam;
  gender: Gender;
  targetPgBranch: string;
}

interface SignupPageProps {
  onSignupSuccess: (data: NewUserRegistrationData) => void;
  onGoToLogin: () => void;
  onGoToHome: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onSignupSuccess,
  onGoToLogin,
  onGoToHome,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetExam, setTargetExam] = useState<MedicalExam>('NEET_PG');
  const [gender, setGender] = useState<Gender>('female');
  const [targetPgBranch, setTargetPgBranch] = useState('MD Radiodiagnosis');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});

  // Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'None', color: 'bg-slate-700', text: 'text-slate-400' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 3) return { score: 2, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-400' };
    return { score: 3, label: 'Strong', color: 'bg-[#22D3EE]', text: 'text-[#22D3EE]' };
  }, [password]);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Doctor name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Please enter your full name or title';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = 'Please accept the Medical Community Standards';
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
      await createUserWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      onSignupSuccess({
        name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
        email,
        targetExam,
        gender,
        targetPgBranch,
      });
    } catch (err: any) {
      setIsLoading(false);
      let errMsg = err.message || 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'Email already in use. Please log in instead.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Authentication provider is not enabled in Firebase Console. Please go to Firebase Console -> Authentication -> Sign-in method and enable Email/Password and Google.';
      }
      setErrors({ general: errMsg });
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setIsLoading(false);
      onSignupSuccess({
        name: user.displayName || 'Dr. Google User',
        email: user.email || 'google.user@vibe.app',
        targetExam,
        gender,
        targetPgBranch,
      });
    } catch (err: any) {
      setIsLoading(false);
      let errMsg = err.message || 'Google Sign-Up failed.';
      if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Google authentication is not enabled in Firebase Console. Please go to Firebase Console -> Authentication -> Sign-in method and enable Google.';
      }
      setErrors({ general: errMsg });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-[#22D3EE] selection:text-[#020617] overflow-hidden">
      {/* Midnight Navy Subtle Radial Glow Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.95)_0%,rgba(14,165,233,0.12)_35%,rgba(2,6,23,0.95)_70%)] blur-2xl" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06)_0%,transparent_60%)] blur-3xl" />
      </div>

      {/* Top Header Link to Home */}
      <div className="relative z-10 max-w-lg w-full mx-auto mb-6 flex items-center justify-between">
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

      {/* Signup Card */}
      <div className="relative z-10 max-w-lg w-full mx-auto bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl shadow-[#020617] p-8 sm:p-10 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <VibeLogo size="lg" showTagline={false} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
            Create Your Vibe Account
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Register with Firebase Authentication to find your vibing study partner.
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Doctor Name Field */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Doctor Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Dr. Priya Verma"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#020617] border text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none transition-all ${
                  errors.name
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-[#1E293B] focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/50'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
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
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#020617] border text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none transition-all ${
                  errors.email
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-[#1E293B] focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/50'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Personalized Metadata Selectors (Target Exam & Gender) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Target Exam
              </label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value as MedicalExam)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#020617] border border-[#1E293B] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE]"
              >
                <option value="NEET_PG">NEET PG 2026</option>
                <option value="INICET">INICET 2026</option>
                <option value="FMGE">FMGE 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Your Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#020617] border border-[#1E293B] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE]"
              >
                <option value="female">♀ Female Doctor</option>
                <option value="male">♂ Male Doctor</option>
              </select>
            </div>
          </div>

          {/* Target PG Branch */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Dream PG Specialty / Branch
            </label>
            <input
              type="text"
              value={targetPgBranch}
              onChange={(e) => setTargetPgBranch(e.target.value)}
              placeholder="e.g. MD Radiodiagnosis, MS General Surgery"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#020617] border border-[#1E293B] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE]"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Password
            </label>
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
                placeholder="At least 8 characters"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#020617] border text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none transition-all ${
                  errors.password
                    ? 'border-rose-500/80 focus:border-rose-500'
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

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#94A3B8]">Password Strength:</span>
                  <span className={`font-bold ${passwordStrength.text}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'
                    }`}
                  />
                </div>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                placeholder="Repeat password"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#020617] border text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none transition-all ${
                  errors.confirmPassword
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-[#1E293B] focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/50'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#94A3B8] select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
                className="w-4 h-4 mt-0.5 rounded bg-[#020617] border-[#1E293B] text-[#22D3EE] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#22D3EE]"
              />
              <span>
                I commit to respectful, academic collaboration under Vibe Community Guidelines and verified medical conduct.
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.terms}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-sm bg-[#22D3EE] text-[#020617] hover:bg-[#67E8F9] transition-all shadow-lg shadow-[#22D3EE]/25 hover:shadow-[#22D3EE]/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#020617] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign Up with Firebase &bull; Dashboard</span>
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

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
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
            <span>Sign Up with Google</span>
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 pt-5 border-t border-[#1E293B] text-center">
          <p className="text-xs text-[#94A3B8]">
            Already have an account?{' '}
            <button
              onClick={onGoToLogin}
              className="text-[#22D3EE] hover:text-[#67E8F9] font-bold transition-colors cursor-pointer ml-1"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
