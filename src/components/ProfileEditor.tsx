import React, { useState } from 'react';
import {
  UserCheck,
  Award,
  Sparkles,
  BookOpen,
  Save,
  CheckCircle2,
  Clock,
  Layers,
  Check,
  Plus,
  X,
  HeartHandshake,
  Stethoscope,
  Flame,
  ShieldCheck,
  Calendar,
  Zap,
  TrendingUp,
  RotateCcw,
  Sparkle,
  Target,
  Trophy,
} from 'lucide-react';
import {
  MedicalProfile,
  MedicalExam,
  Gender,
  PartnerGenderPref,
  StudyRhythm,
  MBBS_SUBJECTS,
  Subject,
  POPULAR_ACADEMIC_INTERESTS,
  NEET_SS_BRANCHES,
  NeetSsBranch,
  StudyStreakInfo,
  createDefaultStudyStreak,
  getStreakMilestone,
} from '../utils/partnerMatching.ts';

interface ProfileEditorProps {
  currentUser: MedicalProfile;
  onUpdateProfile: (updated: MedicalProfile) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  currentUser,
  onUpdateProfile,
}) => {
  const [profile, setProfile] = useState<MedicalProfile>({
    ...currentUser,
    studyStreak: currentUser.studyStreak || createDefaultStudyStreak(0, 0, false),
  });
  const [newInterestInput, setNewInterestInput] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [streakCelebration, setStreakCelebration] = useState<string | null>(null);

  // Daily Study Session Logger Form State
  const [logHours, setLogHours] = useState<number>(8);
  const [logMcqs, setLogMcqs] = useState<number>(100);
  const [logSubject, setLogSubject] = useState<string>(
    profile.strongSubjects[0] || 'Pathology'
  );
  const [showLogDrawer, setShowLogDrawer] = useState<boolean>(false);

  const streak = profile.studyStreak || createDefaultStudyStreak(0, 0, false);
  const milestone = getStreakMilestone(streak.currentStreakDays);
  const milestoneProgress = Math.min(
    100,
    Math.round((streak.currentStreakDays / milestone.nextGoal) * 100)
  );

  const handleAddInterest = (interest: string) => {
    if (!interest.trim()) return;
    if (profile.academicInterests.includes(interest.trim())) return;
    const updated = {
      ...profile,
      academicInterests: [...profile.academicInterests, interest.trim()],
    };
    setProfile(updated);
    setNewInterestInput('');
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    const updated = {
      ...profile,
      academicInterests: profile.academicInterests.filter((i) => i !== interestToRemove),
    };
    setProfile(updated);
  };

  const toggleComplementaryNeeded = (subject: Subject) => {
    const current = profile.studyPartnerPreferences?.complementarySubjectsNeeded || [];
    const exists = current.includes(subject);
    const updatedSubjects = exists ? current.filter((s) => s !== subject) : [...current, subject];
    const updatedProfile = {
      ...profile,
      studyPartnerPreferences: {
        ...profile.studyPartnerPreferences,
        complementarySubjectsNeeded: updatedSubjects,
      },
    };
    setProfile(updatedProfile);
  };

  // -------------------------------------------------------------
  // Daily Study Streak Handlers
  // -------------------------------------------------------------
  const handleLogDailyStudy = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const currentStreak = profile.studyStreak || createDefaultStudyStreak(14, 24, false);

    const isFirstTimeToday = !currentStreak.todayCheckedIn;
    const newStreakDays = isFirstTimeToday
      ? currentStreak.currentStreakDays + 1
      : currentStreak.currentStreakDays;
    const newLongest = Math.max(currentStreak.longestStreakDays, newStreakDays);

    // Update today's weekly activity log (last day of weeklyActivity)
    const updatedWeekly = currentStreak.weeklyActivity.map((day, idx) => {
      if (idx === currentStreak.weeklyActivity.length - 1) {
        return {
          ...day,
          studied: true,
          hours: logHours,
          mcqsSolved: logMcqs,
          subject: logSubject,
        };
      }
      return day;
    });

    const updatedStreak: StudyStreakInfo = {
      ...currentStreak,
      currentStreakDays: newStreakDays,
      longestStreakDays: newLongest,
      todayCheckedIn: true,
      lastStudyDate: new Date().toISOString().split('T')[0],
      weeklyActivity: updatedWeekly,
      totalHoursStudied: currentStreak.totalHoursStudied + (isFirstTimeToday ? logHours : 0),
      totalMcqsSolved: currentStreak.totalMcqsSolved + (isFirstTimeToday ? logMcqs : 0),
    };

    const updatedProfile = {
      ...profile,
      studyStreak: updatedStreak,
    };

    setProfile(updatedProfile);
    onUpdateProfile(updatedProfile);

    // Celebration message
    setStreakCelebration(
      `🔥 Boom! Streak extended to ${newStreakDays} Days! Logged ${logHours}h & ${logMcqs} MCQs in ${logSubject}.`
    );
    setShowLogDrawer(false);
    setTimeout(() => setStreakCelebration(null), 5000);
  };

  const handleToggleDayActivity = (dayIndex: number) => {
    const currentStreak = profile.studyStreak || createDefaultStudyStreak(14, 24, true);
    const updatedWeekly = currentStreak.weeklyActivity.map((item, idx) => {
      if (idx === dayIndex) {
        const nextStudied = !item.studied;
        return {
          ...item,
          studied: nextStudied,
          hours: nextStudied ? 7 : 0,
          mcqsSolved: nextStudied ? 90 : 0,
        };
      }
      return item;
    });

    const isToday = dayIndex === currentStreak.weeklyActivity.length - 1;
    const todayStatus = isToday ? updatedWeekly[dayIndex].studied : currentStreak.todayCheckedIn;

    const updatedStreak: StudyStreakInfo = {
      ...currentStreak,
      weeklyActivity: updatedWeekly,
      todayCheckedIn: todayStatus,
    };

    const updatedProfile = {
      ...profile,
      studyStreak: updatedStreak,
    };

    setProfile(updatedProfile);
    onUpdateProfile(updatedProfile);
  };

  const handleToggleStreakFreeze = () => {
    const currentStreak = profile.studyStreak || createDefaultStudyStreak(14, 24, true);
    const nextUsed = !currentStreak.streakFreezeUsed;
    const updatedStreak: StudyStreakInfo = {
      ...currentStreak,
      streakFreezeUsed: nextUsed,
      streakFreezeAvailable: nextUsed ? 0 : 1,
    };

    const updatedProfile = {
      ...profile,
      studyStreak: updatedStreak,
    };

    setProfile(updatedProfile);
    onUpdateProfile(updatedProfile);
  };

  const handleSetStreakGoal = (targetDays: number) => {
    const currentStreak = profile.studyStreak || createDefaultStudyStreak(14, 24, true);
    const updatedStreak: StudyStreakInfo = {
      ...currentStreak,
      targetStreakGoalDays: targetDays,
    };

    const updatedProfile = {
      ...profile,
      studyStreak: updatedStreak,
    };

    setProfile(updatedProfile);
    onUpdateProfile(updatedProfile);
  };

  const handleResetTodayCheckin = () => {
    const currentStreak = profile.studyStreak || createDefaultStudyStreak(14, 24, true);
    const updatedWeekly = currentStreak.weeklyActivity.map((day, idx) => {
      if (idx === currentStreak.weeklyActivity.length - 1) {
        return {
          ...day,
          studied: false,
          hours: 0,
          mcqsSolved: 0,
        };
      }
      return day;
    });

    const updatedStreak: StudyStreakInfo = {
      ...currentStreak,
      currentStreakDays: Math.max(0, currentStreak.currentStreakDays - 1),
      todayCheckedIn: false,
      weeklyActivity: updatedWeekly,
    };

    const updatedProfile = {
      ...profile,
      studyStreak: updatedStreak,
    };

    setProfile(updatedProfile);
    onUpdateProfile(updatedProfile);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast Alert for Streak Celebration */}
      {streakCelebration && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-2xl border border-orange-400 flex items-center gap-3 animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h4 className="text-sm font-black">Daily Streak Extended!</h4>
            <p className="text-xs text-orange-100">{streakCelebration}</p>
          </div>
          <button
            onClick={() => setStreakCelebration(null)}
            className="text-white/80 hover:text-white p-1 rounded-lg ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: DAILY STUDY STREAK TRACKER & ACCOUNTABILITY DASHBOARD */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-orange-500/40 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-slate-950 font-bold shadow-lg shadow-orange-500/30">
              <Flame className="w-7 h-7 fill-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Daily Study Streak Tracker
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-950/80 text-orange-300 border border-orange-700/80 text-xs font-bold">
                  Accountability Engine
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Build study consistency for {profile.targetExam.replace('_', ' ')} &amp; display your streak on your PartnerMatcher card!
              </p>
            </div>
          </div>

          {/* Quick Check-in CTA Button */}
          <div className="flex items-center gap-2">
            {!streak.todayCheckedIn ? (
              <button
                type="button"
                onClick={() => setShowLogDrawer(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-orange-500/25 transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Check In Today’s Session</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-700/80 text-xs font-black flex items-center gap-1.5 shadow">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Streak Safe Today!</span>
                </span>
                <button
                  type="button"
                  onClick={handleResetTodayCheckin}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[11px] font-bold transition cursor-pointer"
                  title="Toggle check-in state for testing"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
          {/* Current Streak */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-orange-500/30 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block mb-0.5">
                Current Streak
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {streak.currentStreakDays}
                </span>
                <span className="text-xs text-slate-400 font-bold">Days</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Flame className="w-6 h-6 fill-orange-400 animate-pulse" />
            </div>
          </div>

          {/* Longest Streak Record */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                Best Record
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {streak.longestStreakDays}
                </span>
                <span className="text-xs text-slate-400 font-bold">Days</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5 fill-amber-400" />
            </div>
          </div>

          {/* Total MCQs Solved */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                MCQs Solved
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {streak.totalMcqsSolved}
                </span>
                <span className="text-xs text-slate-400 font-bold">Q-Bank</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Target className="w-5 h-5" />
            </div>
          </div>

          {/* Streak Shield / Freeze */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                Streak Shield
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">
                  {streak.streakFreezeUsed ? '🛡️ In Use' : '1 Freeze Ready'}
                </span>
                <button
                  type="button"
                  onClick={handleToggleStreakFreeze}
                  className="text-[10px] underline text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                >
                  {streak.streakFreezeUsed ? 'Deactivate' : 'Equip'}
                </button>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5 fill-emerald-500/20" />
            </div>
          </div>
        </div>

        {/* Interactive 7-Day Weekly Calendar Row */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>Past 7-Day Consistency Rhythm</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Click any day dot to toggle or adjust hours
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {streak.weeklyActivity.map((day, idx) => {
              const isToday = idx === streak.weeklyActivity.length - 1;
              return (
                <button
                  key={day.dayLabel + idx}
                  type="button"
                  onClick={() => handleToggleDayActivity(idx)}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 relative ${
                    day.studied
                      ? 'bg-orange-950/40 border-orange-500/60 text-white shadow-lg shadow-orange-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                  } ${isToday ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950' : ''}`}
                >
                  {isToday && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                      Today
                    </span>
                  )}
                  <span className="text-[11px] font-bold block">{day.dayLabel}</span>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center">
                    {day.studied ? (
                      <Flame className="w-5 h-5 fill-orange-400 text-orange-500 animate-pulse" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700 block"></span>
                    )}
                  </div>
                  <span className="text-[10px] font-extrabold text-orange-300">
                    {day.studied ? `${day.hours}h` : 'Rest'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Milestone Progression Bar & Goal Selector */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <span>{milestone.icon}</span>
                <span className={milestone.color}>{milestone.title}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Tier: {milestone.tier}</span>
              </span>
              <span className="font-bold text-orange-400">
                {streak.currentStreakDays} / {milestone.nextGoal} Days ({milestoneProgress}%)
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 rounded-full transition-all duration-700 shadow-lg shadow-orange-500/50"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {milestone.nextGoal - streak.currentStreakDays > 0
                ? `🚀 ${milestone.nextGoal - streak.currentStreakDays} consecutive study days to unlock the ${milestone.nextGoal}-Day Badge!`
                : '🏆 Next highest consistency milestone achieved!'}
            </p>
          </div>

          {/* Goal Selector */}
          <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Set Target Streak Goal
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[14, 21, 30, 60].map((goalDays) => (
                <button
                  key={goalDays}
                  type="button"
                  onClick={() => handleSetStreakGoal(goalDays)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    streak.targetStreakGoalDays === goalDays
                      ? 'bg-orange-500 text-slate-950 shadow'
                      : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {goalDays}d Goal
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Partner Accountability Note */}
        <div className="mt-4 p-3 rounded-xl bg-orange-950/20 border border-orange-900/40 flex items-start gap-2.5 text-xs text-orange-200">
          <Sparkle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <p>
            <strong>PartnerMatcher Collaboration Guarantee:</strong> Your active streak ({streak.currentStreakDays} days) and weekly study rhythm are publicly visible on your top swipe card and profile badge in the PartnerMatcher, helping you match with study partners who match your daily discipline.
          </p>
        </div>

        {/* LOG TODAY'S STUDY SESSION DRAWER / MODAL */}
        {showLogDrawer && (
          <div className="mt-5 p-5 rounded-2xl bg-slate-950 border-2 border-orange-500/60 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400 fill-orange-400" />
                <h3 className="text-sm font-bold text-white">
                  Log Today’s Study Session &amp; Extend Streak
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLogDrawer(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Study Hours */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Hours Studied Today:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={logHours}
                    onChange={(e) => setLogHours(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:border-orange-500 focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 font-bold">Hours</span>
                </div>
              </div>

              {/* MCQs Solved */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  MCQs Solved:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="10"
                    max="500"
                    step="10"
                    value={logMcqs}
                    onChange={(e) => setLogMcqs(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:border-orange-500 focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 font-bold">MCQs</span>
                </div>
              </div>

              {/* Subject Studied */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Primary Subject / Module:
                </label>
                <select
                  value={logSubject}
                  onChange={(e) => setLogSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:border-orange-500 focus:outline-none cursor-pointer"
                >
                  {MBBS_SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogDrawer(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogDailyStudy}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-orange-500/30 transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Flame className="w-4 h-4 fill-slate-950" />
                <span>Save Session &amp; Keep Streak Alive!</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION: MEDICAL PROFILE, TARGET EXAM & NEET SS SETUP */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Stethoscope className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Vibing Peer • Medical Profile &amp; NEET SS Setup
              </h2>
              <p className="text-xs text-slate-400">
                Configure your Target Exam, NEET SS Super-Specialty PG Branch, and Academic Interests
              </p>
            </div>
          </div>

          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-800 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> Profile Updated!
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Basic Identity (Name, Gender, College) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Name:
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Gender:
              </label>
              <select
                value={profile.gender}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value as Gender })
                }
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="male">♂ Male Doctor / Intern</option>
                <option value="female">♀ Female Doctor / Intern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Medical College / University:
              </label>
              <input
                type="text"
                value={profile.college}
                onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Section 2: TARGET EXAM (PRIORITY 1) */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>Priority 1: Target Medical Exam</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Primary filter for finding matching study buddies
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['NEET_PG', 'INICET', 'FMGE'] as const).map((exam) => (
                <button
                  key={exam}
                  type="button"
                  onClick={() => setProfile({ ...profile, targetExam: exam })}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    profile.targetExam === exam
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">
                      {exam.replace('_', ' ')}
                    </span>
                    {profile.targetExam === exam && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">
                    {exam === 'NEET_PG'
                      ? 'National Eligibility cum Entrance Test (All India)'
                      : exam === 'INICET'
                      ? 'AIIMS, JIPMER, PGIMER, NIMHANS'
                      : 'Foreign Medical Graduate Examination'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: NEET SS SUPER-SPECIALTY & TARGET PG BRANCH BLOCK (PRIORITY 3) */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4" />
                <span>Priority 3: Target NEET SS Super-Specialty / PG Branch</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Select your intended DM / MCh super-specialty track
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Your NEET SS Super-Specialty / PG Track:
              </label>
              <select
                value={profile.targetPgBranch}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    targetPgBranch: e.target.value as NeetSsBranch,
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-semibold cursor-pointer"
              >
                {NEET_SS_BRANCHES.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 4: ACADEMIC INTERESTS (PRIORITY 2) */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-purple-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Priority 2: Academic Interests &amp; Study Topics</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Topics you want to review together with your partner
              </span>
            </div>

            {/* Current Selected Interests */}
            <div className="flex flex-wrap gap-1.5">
              {profile.academicInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/80 text-purple-200 border border-purple-800/80 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="hover:text-rose-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Popular Suggested Interests to add with one click */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Popular High-Yield Interests (Click to Add):
              </span>
              <div className="flex flex-wrap gap-1">
                {POPULAR_ACADEMIC_INTERESTS.filter(
                  (i) => !profile.academicInterests.includes(i)
                )
                  .slice(0, 8)
                  .map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleAddInterest(interest)}
                      className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[10px] transition cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-2.5 h-2.5 text-purple-400" />
                      <span>{interest}</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Or type a custom academic topic..."
                value={newInterestInput}
                onChange={(e) => setNewInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest(newInterestInput);
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => handleAddInterest(newInterestInput)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Section 5: Study Partner Preferences & Q-Bank */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Study Partner Preferences &amp; Mentorship
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Q-Bank Platform:
                </label>
                <select
                  value={profile.studyPartnerPreferences?.qBankPlatform || 'Marrow'}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      studyPartnerPreferences: {
                        ...profile.studyPartnerPreferences,
                        qBankPlatform: e.target.value as any,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Marrow">Marrow (Plan C / Plan B)</option>
                  <option value="PrepLadder">PrepLadder (Rapid Revision)</option>
                  <option value="Cerebellum">Cerebellum Academy</option>
                  <option value="DAMS">DAMS e-Medicoz</option>
                  <option value="Bhatia">DBMCI Bhatia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Study Hours:
                </label>
                <select
                  value={profile.studyPartnerPreferences?.targetStudyHoursPerDay || 8}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      studyPartnerPreferences: {
                        ...profile.studyPartnerPreferences,
                        targetStudyHoursPerDay: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="6">6 Hours / Day (Clinical Duty)</option>
                  <option value="8">8 Hours / Day (Standard)</option>
                  <option value="10">10 Hours / Day (Intensive)</option>
                  <option value="12">12+ Hours / Day (Crash Mode)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Study Rhythm:
                </label>
                <select
                  value={profile.studyPartnerPreferences?.studyRhythm || 'night_owl'}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      studyPartnerPreferences: {
                        ...profile.studyPartnerPreferences,
                        studyRhythm: e.target.value as StudyRhythm,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="night_owl">🌙 Night Owl (Late Night Sprint)</option>
                  <option value="early_bird">🌅 Early Bird (5 AM Club)</option>
                  <option value="flexible">⚡ Flexible Working Hours</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                About Your Study Strategy &amp; Schedule (Bio):
              </label>
              <textarea
                rows={2}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Complementary subjects partner needs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Preferred Partner Subject Mentorship:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {MBBS_SUBJECTS.map((subj) => {
                  const isChecked =
                    profile.studyPartnerPreferences?.complementarySubjectsNeeded?.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleComplementaryNeeded(subj)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
                        isChecked
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                      <span>{subj}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile &amp; Re-run Prioritized Matching</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
