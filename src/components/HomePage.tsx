import React from 'react';
import {
  Users,
  Flame,
  BrainCircuit,
  Sparkles,
  Timer,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  Heart,
  BookOpen,
  Zap,
  Award,
} from 'lucide-react';
import { VibeLogo } from './VibeLogo.tsx';
import { MedicalProfile } from '../utils/partnerMatching.ts';

interface HomePageProps {
  onGoToSignup: () => void;
  onGoToLogin: () => void;
  featuredProfiles: MedicalProfile[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onGoToSignup,
  onGoToLogin,
  featuredProfiles,
}) => {
  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex flex-col relative selection:bg-[#22D3EE] selection:text-[#020617] overflow-x-hidden">
      {/* Background Subtle Midnight Navy Radial Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.12)_0%,rgba(15,23,42,0.8)_45%,transparent_70%)] blur-3xl opacity-90" />
        <div className="absolute top-1/3 -left-48 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-20 -right-48 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.07)_0%,transparent_60%)] blur-3xl" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-20 border-b border-[#1E293B] bg-[#020617]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="cursor-pointer">
            <VibeLogo size="md" showTagline={true} />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors rounded-xl hover:bg-[#0F172A] border border-transparent hover:border-[#1E293B] cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={onGoToSignup}
              className="px-4 py-2 text-sm font-bold text-[#020617] bg-[#22D3EE] hover:bg-[#67E8F9] transition-all rounded-xl shadow-lg shadow-[#22D3EE]/25 hover:shadow-[#22D3EE]/40 cursor-pointer flex items-center gap-1.5"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-[#1E293B] mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
            <span className="text-xs font-semibold text-[#22D3EE] tracking-wide uppercase">
              Find Your Vibing Study Partner
            </span>
            <span className="text-xs text-[#94A3B8]">• Exams &bull; Academics &bull; Goals</span>
          </div>

          {/* Vibe Logo Hero Feature */}
          <div className="flex justify-center mb-6">
            <VibeLogo size="xl" showTagline={false} />
          </div>

          {/* Main Headline & Tagline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.1] mb-5">
            Let&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#38BDF8] to-[#818CF8]">Vibe</span> Together.
          </h1>

          <p className="text-lg sm:text-xl text-[#94A3B8] leading-relaxed mb-10 max-w-2xl mx-auto">
            The premier academic and study partner platform. Pair with complementary peers to drill high-yield Q-Banks, host synchronized Pomodoro sessions, master challenging topics, and conquer your goals together.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={onGoToSignup}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base bg-[#22D3EE] text-[#020617] hover:bg-[#67E8F9] transition-all shadow-xl shadow-[#22D3EE]/25 hover:shadow-[#22D3EE]/40 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Get Started &bull; Sign Up Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-base bg-[#0F172A] hover:bg-[#1E293B] text-[#F8FAFC] border border-[#1E293B] hover:border-[#22D3EE]/40 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Log In to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] text-center hover:border-[#22D3EE]/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#22D3EE] mb-1">19 Subjects</div>
            <div className="text-xs text-[#94A3B8]">MBBS Curriculum &amp; NEET SS Branches</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] text-center hover:border-[#22D3EE]/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mb-1">98.4%</div>
            <div className="text-xs text-[#94A3B8]">Complementary Weak/Strong Synergy</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] text-center hover:border-[#22D3EE]/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#22D3EE] mb-1">25 Min</div>
            <div className="text-xs text-[#94A3B8]">Synchronized Pomodoro Sprint Cycles</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] text-center hover:border-[#22D3EE]/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mb-1">100% Safe</div>
            <div className="text-xs text-[#94A3B8]">Verified Doctors &amp; Aspirants Community</div>
          </div>
        </div>
      </section>

      {/* Cyber-Slate Card Showcase - Interactive Preview */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
            Curated Study Partner Matching
          </h2>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Built with an interactive swipe interface, paired with advanced academic compatibility algorithms.
          </p>
        </div>

        {/* Featured Profiles Teaser Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {featuredProfiles.slice(0, 3).map((profile) => (
            <div
              key={profile.id}
              className="bg-[#0F172A] rounded-2xl border border-[#1E293B] overflow-hidden hover:border-[#22D3EE]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#22D3EE]/10 flex flex-col group"
            >
              {/* Profile Image with subtle badge */}
              <div className="relative h-64 overflow-hidden bg-slate-950">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
                
                {/* Floating streak badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#020617]/85 backdrop-blur-md border border-orange-500/40 text-[11px] font-bold text-orange-300 flex items-center gap-1 shadow-md">
                  <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
                  <span>{profile.studyStreak?.currentStreakDays || 7} Day Streak</span>
                </div>

                {/* Exam pill */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#020617]/85 backdrop-blur-md border border-[#22D3EE]/40 text-[10px] font-bold text-[#22D3EE]">
                  {profile.targetExam.replace('_', ' ')}
                </div>

                {/* Identity Overlaid */}
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-[#F8FAFC] truncate">{profile.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-[#22D3EE] shrink-0" />
                  </div>
                  <p className="text-xs text-[#22D3EE] font-medium truncate">{profile.targetPgBranch}</p>
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {profile.bio}
                  </p>

                  <div className="pt-2 border-t border-[#1E293B]">
                    <div className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                      Strong In (Can Teach You)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.strongSubjects.slice(0, 3).map((sub) => (
                        <span
                          key={sub}
                          className="px-2 py-0.5 rounded bg-[#1E293B] text-emerald-400 text-[11px] font-medium"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                      Seeking Partner Strong In
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.weakSubjects.slice(0, 2).map((sub) => (
                        <span
                          key={sub}
                          className="px-2 py-0.5 rounded bg-[#1E293B] text-cyan-300 text-[11px] font-medium"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#1E293B]">
                  <button
                    onClick={onGoToSignup}
                    className="w-full py-2 px-3 rounded-xl bg-[#1E293B] hover:bg-[#22D3EE] hover:text-[#020617] text-xs font-bold text-[#F8FAFC] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Connect &amp; Match</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-[#1E293B]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#22D3EE] uppercase tracking-wider bg-black">
            ENGINEERED FOR HIGH-ACHIEVERS
          </span>
          <h2 className="text-3xl font-extrabold text-[#F8FAFC] mt-2 tracking-tight">
            Everything You Need To Vibe &amp; Rank Top 1%
          </h2>
          <p className="mt-3 text-sm text-[#94A3B8]">
            Study fatigue ends when you have a dedicated peer keeping you accountable daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-[#22D3EE]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center text-[#22D3EE] mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC] mb-2">Partner Synergy</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Matches are computed based on complementary subjects: pair your weak subjects with your partner&apos;s master subjects to eliminate revision gaps.
              </p>
            </div>
            <div className="mt-4 text-[11px] font-semibold text-[#22D3EE] flex items-center gap-1">
              <span>Smart Subject Matching</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-[#22D3EE]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center text-[#22D3EE] mb-4">
                <Timer className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC] mb-2">Synced Study Room</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Shared Pomodoro sprint timers, synchronized syllabus checklists, real-time Grand Test reviews, and YouTube lecture sync in the lounge.
              </p>
            </div>
            <div className="mt-4 text-[11px] font-semibold text-[#22D3EE] flex items-center gap-1">
              <span>Focus Sprints &amp; Video</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-[#22D3EE]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center text-[#22D3EE] mb-4">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC] mb-2">AI Image Lab &amp; IBQs</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Review high-yield radiology CT/MRI, ECG tracings, dermatological lesions, and histopathology slides together with instant diagnostic keys.
              </p>
            </div>
            <div className="mt-4 text-[11px] font-semibold text-[#22D3EE] flex items-center gap-1">
              <span>Image-Based Mastery</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-[#22D3EE]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center text-orange-400 mb-4">
                <Flame className="w-5 h-5 fill-orange-400" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC] mb-2">Daily Study Streak Tracker</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Keep the momentum hot with consecutive daily check-ins, study freeze shields, weekly consistency heatmaps, and habit milestones.
              </p>
            </div>
            <div className="mt-4 text-[11px] font-semibold text-[#22D3EE] flex items-center gap-1">
              <span>Daily Consistency Engine</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#020617] border border-[#1E293B] shadow-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15)_0%,transparent_60%)]" />
          <div className="relative z-10">
            <VibeLogo size="lg" className="justify-center mb-4" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mb-3">
              Ready to Vibe With Your Study Partner?
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto mb-8">
              Join thousands of resident aspirants preparing for NEET PG, INICET, and FMGE. Experience academic collaboration that actually works.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGoToSignup}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-[#22D3EE] text-[#020617] hover:bg-[#67E8F9] transition-all shadow-lg shadow-[#22D3EE]/25 cursor-pointer"
              >
                Create Account Now
              </button>
              <button
                onClick={onGoToLogin}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold bg-[#1E293B] text-[#F8FAFC] hover:bg-slate-700 transition-colors border border-[#1E293B] cursor-pointer"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1E293B] bg-[#020617] py-8 px-4 text-center text-xs text-[#94A3B8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <VibeLogo size="sm" />
            <span className="text-[#94A3B8]">&copy; {new Date().getFullYear()} Vibe Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#94A3B8]">
            <span>Community Safety</span>
            <span>&bull;</span>
            <span>Verification Guidelines</span>
            <span>&bull;</span>
            <span>NEET PG / INICET Aspirants</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
