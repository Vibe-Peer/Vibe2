import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
  Send,
  HelpCircle,
  Eye,
  MessageSquare,
  Phone,
  Video,
  Flame,
  X,
  Heart,
  RotateCcw,
  Star,
  LayoutGrid,
  CreditCard,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  MapPin,
  GraduationCap,
  Sparkle,
  ArrowRightLeft,
  SlidersHorizontal,
  Zap,
  TrendingUp,
  Target,
} from 'lucide-react';
import {
  MedicalProfile,
  MedicalExam,
  getRecommendedPartners,
  MBBS_SUBJECTS,
  NEET_SS_BRANCHES,
  createDefaultStudyStreak,
  getStreakMilestone,
} from '../utils/partnerMatching.ts';

interface PartnerMatcherProps {
  currentUser: MedicalProfile;
  allProfiles: MedicalProfile[];
  onSelectPartner: (partner: MedicalProfile) => void;
  onComparePartner: (partner: MedicalProfile) => void;
  onSendChallenge: (partner: MedicalProfile) => void;
  onStartDirectMessage: (partner: MedicalProfile) => void;
  onSwitchUser?: () => void;
  onOpenProfileEditor?: () => void;
}

export const PartnerMatcher: React.FC<PartnerMatcherProps> = ({
  currentUser,
  allProfiles,
  onSelectPartner,
  onComparePartner,
  onSendChallenge,
  onStartDirectMessage,
  onSwitchUser,
  onOpenProfileEditor,
}) => {
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe');
  const [selectedExam, setSelectedExam] = useState<MedicalExam | 'ALL'>('ALL');
  const [selectedSsBranch, setSelectedSsBranch] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Swipe Deck State
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState<number>(0);
  const [swipeHistory, setSwipeHistory] = useState<number[]>([]);
  const [matchedModalPartner, setMatchedModalPartner] = useState<MedicalProfile | null>(null);
  const [swipeStamp, setSwipeStamp] = useState<'like' | 'pass' | 'super' | null>(null);

  // User's own streak info
  const userStreak = currentUser.studyStreak || createDefaultStudyStreak(0, 0, false);
  const userMilestone = getStreakMilestone(userStreak.currentStreakDays);

  // Ranked candidates by 3-tier algorithm: 1. Exam, 2. Interests, 3. NEET SS branch
  const rankedPartners = getRecommendedPartners(currentUser, allProfiles, selectedExam);

  // Filtered candidates
  const filteredPartners = rankedPartners.filter(({ profile }) => {
    if (selectedSsBranch !== 'ALL' && profile.targetPgBranch !== selectedSsBranch) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = profile.name.toLowerCase().includes(q);
      const matchCollege = profile.college.toLowerCase().includes(q);
      const matchBranch = (profile.targetPgBranch || '').toLowerCase().includes(q);
      const matchInterests = profile.academicInterests.some((i) => i.toLowerCase().includes(q));
      if (!matchName && !matchCollege && !matchBranch && !matchInterests) {
        return false;
      }
    }
    return true;
  });

  const currentCandidate = filteredPartners[currentSwipeIndex];
  const candidateStreak =
    currentCandidate?.profile.studyStreak || createDefaultStudyStreak(0, 0, false);
  const candidateMilestone = getStreakMilestone(candidateStreak.currentStreakDays);

  // Combined Study Streak Power
  const combinedStreakDays = userStreak.currentStreakDays + candidateStreak.currentStreakDays;

  // Handle Swipe Actions
  const handleSwipe = (direction: 'right' | 'left' | 'super') => {
    if (!currentCandidate) return;

    if (direction === 'left') {
      setSwipeStamp('pass');
    } else if (direction === 'super') {
      setSwipeStamp('super');
    } else {
      setSwipeStamp('like');
    }

    setTimeout(() => {
      setSwipeStamp(null);
      setSwipeHistory((prev) => [...prev, currentSwipeIndex]);

      if (direction === 'right' || direction === 'super') {
        // Trigger Match celebration modal!
        setMatchedModalPartner(currentCandidate.profile);
      }

      setCurrentSwipeIndex((prev) => prev + 1);
    }, 320);
  };

  const handleRewind = () => {
    if (swipeHistory.length === 0) return;
    const lastIndex = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, -1));
    setCurrentSwipeIndex(lastIndex);
  };

  const handleResetDeck = () => {
    setCurrentSwipeIndex(0);
    setSwipeHistory([]);
  };

  // Keyboard controls for swipe
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'swipe' || matchedModalPartner) return;
      if (e.key === 'ArrowLeft') handleSwipe('left');
      if (e.key === 'ArrowRight') handleSwipe('right');
      if (e.key === 'ArrowUp') handleSwipe('super');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, matchedModalPartner, currentCandidate]);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* TOP HERO SECTION: YOUR IDENTITY + DATING-APP STYLE BIG PHOTO SWIPE CARD */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Your Identity & Profile Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Your Profile &amp; Identity</span>
              </span>
              {onSwitchUser && (
                <button
                  onClick={onSwitchUser}
                  className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
                  title="Switch between Male and Female demo persona"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Switch Persona</span>
                </button>
              )}
            </div>

            {/* Big Photo & Identity Details */}
            <div className="mt-4 flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-3 border-emerald-500 shadow-xl"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
              </div>

              <div className="mt-3">
                <h3 className="text-base sm:text-lg font-black text-white flex items-center justify-center gap-1.5">
                  <span>{currentUser.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {currentUser.gender === 'male' ? '♂ Intern' : '♀ Resident'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentUser.college.split(',')[0]}</span>
                </p>
              </div>

              {/* DAILY STUDY STREAK CARD IN YOUR PROFILE */}
              <div className="mt-4 w-full p-3 rounded-2xl bg-gradient-to-r from-orange-950/50 via-slate-950/80 to-amber-950/50 border border-orange-500/40 text-left shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 fill-orange-400 text-orange-400 animate-pulse" />
                    <span className="text-xs font-black text-orange-300">
                      {userStreak.currentStreakDays}-Day Study Streak
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-900/60 text-orange-200 border border-orange-700/60">
                    {userMilestone.tier}
                  </span>
                </div>

                {/* 7-Day Mini Flame Dots */}
                <div className="flex items-center justify-between gap-1 py-1.5 px-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  {userStreak.weeklyActivity.map((day, idx) => {
                    const isToday = idx === userStreak.weeklyActivity.length - 1;
                    return (
                      <div
                        key={day.dayLabel + idx}
                        className="flex flex-col items-center"
                        title={`${day.dayLabel}: ${day.studied ? `${day.hours}h studied` : 'Rest day'}`}
                      >
                        <span className={`text-[9px] font-bold ${isToday ? 'text-amber-400' : 'text-slate-500'}`}>
                          {day.dayLabel[0]}
                        </span>
                        <div className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5">
                          {day.studied ? (
                            <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-500" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700 block" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Status: {userStreak.todayCheckedIn ? '✅ Active Today' : '⚡ Pending Today'}
                  </span>
                  {onOpenProfileEditor && (
                    <button
                      onClick={onOpenProfileEditor}
                      className="text-orange-400 hover:text-orange-300 font-bold underline cursor-pointer"
                    >
                      Log / Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Target Exam & NEET SS PG Branch */}
              <div className="mt-3 w-full space-y-2 text-left">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-900/40">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-0.5">
                    1. Target Exam (Priority 1)
                  </span>
                  <span className="text-xs font-bold text-white">
                    🎯 {currentUser.targetExam.replace('_', ' ')} {currentUser.targetYear}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-cyan-900/40">
                  <span className="text-[10px] font-bold uppercase text-cyan-400 block mb-0.5">
                    3. NEET SS PG Branch (Priority 3)
                  </span>
                  <span className="text-xs font-bold text-cyan-200 block truncate">
                    🩺 {currentUser.targetPgBranch}
                  </span>
                </div>
              </div>

              {/* Quick Academic Interests Pills */}
              <div className="mt-3 w-full text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  2. Academic Interests (Priority 2)
                </span>
                <div className="flex flex-wrap gap-1">
                  {currentUser.academicInterests.slice(0, 3).map((interest) => (
                    <span
                      key={interest}
                      className="px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/80 text-[10px] font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Filters Card */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Filter Study Matches</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {filteredPartners.length} Available
              </span>
            </div>

            {/* Exam selector */}
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'NEET_PG', 'INICET', 'FMGE'] as const).map((exam) => (
                <button
                  key={exam}
                  onClick={() => {
                    setSelectedExam(exam);
                    setCurrentSwipeIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedExam === exam
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {exam === 'ALL' ? 'All Exams' : exam.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative pt-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search specialty, name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentSwipeIndex(0);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Mode Switcher */}
            <div className="pt-2 flex items-center gap-2 border-t border-slate-800">
              <button
                onClick={() => setViewMode('swipe')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'swipe'
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Swipe Deck</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Browse All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: THE DATING-APP SWIPE CARD AT TOP (BIG PHOTO!) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {viewMode === 'swipe' ? (
            <div className="w-full max-w-xl">
              {!currentCandidate ? (
                // Empty Deck View
                <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 text-center space-y-4 shadow-2xl animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">All Profiles Reviewed!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    You’ve swiped through all available study partner cards for this filter. Reset your deck or switch filters to find more peers.
                  </p>
                  <div className="pt-3">
                    <button
                      onClick={handleResetDeck}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Start Deck Over</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* THE BIG DATING APP SWIPE CARD */
                <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-700/80 shadow-2xl transition-all duration-300 group">
                  {/* Swipe Stamp Overlays */}
                  {swipeStamp === 'like' && (
                    <div className="absolute top-12 right-8 z-30 transform rotate-12 border-4 border-emerald-400 bg-emerald-950/90 text-emerald-300 px-6 py-2 rounded-2xl font-black text-2xl tracking-widest shadow-2xl animate-bounce">
                      STUDY MATCH ❤️
                    </div>
                  )}
                  {swipeStamp === 'pass' && (
                    <div className="absolute top-12 left-8 z-30 transform -rotate-12 border-4 border-rose-500 bg-rose-950/90 text-rose-300 px-6 py-2 rounded-2xl font-black text-2xl tracking-widest shadow-2xl animate-bounce">
                      PASS ✕
                    </div>
                  )}
                  {swipeStamp === 'super' && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 border-4 border-cyan-400 bg-cyan-950/90 text-cyan-300 px-6 py-2 rounded-2xl font-black text-2xl tracking-widest shadow-2xl animate-pulse">
                      SUPER LIKE ⭐
                    </div>
                  )}

                  {/* BIG HERO PHOTO CONTAINER (Dating App style) */}
                  <div className="relative w-full h-[520px] sm:h-[580px] bg-slate-950 overflow-hidden">
                    <img
                      src={currentCandidate.profile.avatarUrl}
                      alt={currentCandidate.profile.name}
                      className="w-full h-full object-cover object-top filter brightness-[0.95] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Dark gradient overlay at bottom for high text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />

                    {/* Top Floating Badges: Compatibility Score + Target Exam + DAILY STUDY STREAK */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 pointer-events-none gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/40 text-xs font-extrabold flex items-center gap-1.5 shadow-lg">
                        <Flame className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                        <span>{currentCandidate.compatibility.overallScore}% Vibing Match</span>
                      </span>

                      {/* CANDIDATE STUDY STREAK BADGE */}
                      <span className="px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md text-orange-400 border border-orange-500/40 text-xs font-black flex items-center gap-1.5 shadow-lg animate-pulse">
                        <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
                        <span>{candidateStreak.currentStreakDays}d Streak</span>
                      </span>

                      <span className="px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md text-cyan-300 border border-cyan-500/40 text-xs font-bold shadow-lg">
                        {currentCandidate.profile.targetExam.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Content Overlaid on the Lower Half of the Big Photo */}
                    <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-20 space-y-2.5">
                      {/* Name, Stage & Online Badge */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                              {currentCandidate.profile.name}
                            </h2>
                            <span className="text-emerald-400" title="Verified Medical Student">
                              <ShieldCheck className="w-6 h-6 fill-emerald-500/30 stroke-emerald-400" />
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>{currentCandidate.profile.college}</span>
                            <span>• {currentCandidate.profile.stage}</span>
                          </p>
                        </div>

                        <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          <span>Online</span>
                        </span>
                      </div>

                      {/* DAILY STUDY STREAK & COLLABORATION SYNERGY BANNER */}
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-950/80 via-slate-900/90 to-amber-950/80 backdrop-blur-md border border-orange-500/40 shadow-md space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-orange-400 flex items-center gap-1.5">
                            <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
                            <span>{candidateStreak.currentStreakDays}-Day Active Study Streak</span>
                            <span className="text-slate-400 font-normal">({candidateMilestone.title})</span>
                          </span>

                          <span className="text-[10px] font-bold text-amber-300">
                            {candidateStreak.totalHoursStudied}h logged
                          </span>
                        </div>

                        {/* Partner Consistency Dots */}
                        <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800">
                          <span className="text-[10px] text-slate-300 font-medium">
                            Weekly Rhythm:
                          </span>
                          <div className="flex items-center gap-1.5">
                            {candidateStreak.weeklyActivity.map((day, idx) => (
                              <div
                                key={day.dayLabel + idx}
                                className="flex items-center gap-0.5"
                                title={`${day.dayLabel}: ${day.studied ? 'Studied' : 'Rest'}`}
                              >
                                <span className="text-[9px] text-slate-400 font-bold">{day.dayLabel[0]}</span>
                                <span
                                  className={`w-2 h-2 rounded-full block ${
                                    day.studied ? 'bg-orange-400' : 'bg-slate-700'
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Combined Study Momentum Callout */}
                        <div className="pt-1 text-[10px] text-orange-200 font-medium flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                          <span>
                            <strong>Mutual Power:</strong> Together you hold a combined <strong>{combinedStreakDays}-Day</strong> study streak! Both target ~{currentCandidate.profile.studyPartnerPreferences?.targetStudyHoursPerDay || 8}h/day.
                          </span>
                        </div>
                      </div>

                      {/* NEET SS PG Branch Block (Priority 3) */}
                      <div className="p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-800/80 shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Target NEET SS PG Branch:</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {currentCandidate.compatibility.neetSsSynergyType}
                          </span>
                        </div>
                        <p className="text-xs font-extrabold text-white mt-0.5 truncate">
                          🩺 {currentCandidate.profile.targetPgBranch}
                        </p>
                      </div>

                      {/* Bio Quote */}
                      <p className="text-xs text-slate-200 line-clamp-2 italic leading-relaxed bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                        "{currentCandidate.profile.bio}"
                      </p>

                      {/* Academic Interests & Subject Synergy Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {currentCandidate.profile.academicInterests.slice(0, 3).map((interest) => (
                          <span
                            key={interest}
                            className="px-2 py-0.5 rounded-lg bg-purple-950/80 text-purple-200 border border-purple-800/80 text-[10px] font-semibold"
                          >
                            {interest}
                          </span>
                        ))}
                        {currentCandidate.compatibility.mutualComplements.partnerHelpsUserWith.slice(0, 2).map((sub) => (
                          <span
                            key={sub}
                            className="px-2 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-200 border border-emerald-800/80 text-[10px] font-bold"
                          >
                            + Teaches {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* DATING APP ACTION BUTTONS BAR */}
                  <div className="bg-slate-950/95 backdrop-blur-md p-4 sm:p-5 border-t border-slate-800 flex items-center justify-center gap-4 sm:gap-6">
                    {/* Rewind Button */}
                    <button
                      onClick={handleRewind}
                      disabled={swipeHistory.length === 0}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-yellow-500 text-yellow-400 flex items-center justify-center shadow-lg transition transform hover:scale-110 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Rewind previous card"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>

                    {/* Pass (Swipe Left) */}
                    <button
                      onClick={() => handleSwipe('left')}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900 border-2 border-rose-500/80 hover:bg-rose-500/10 text-rose-500 flex items-center justify-center shadow-xl shadow-rose-500/10 transition transform hover:scale-115 active:scale-95 cursor-pointer"
                      title="Pass / Swipe Left (or press ← Arrow)"
                    >
                      <X className="w-7 h-7 stroke-[2.5]" />
                    </button>

                    {/* Super Like (Star) */}
                    <button
                      onClick={() => handleSwipe('super')}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900 border-2 border-cyan-400 hover:bg-cyan-400/10 text-cyan-400 flex items-center justify-center shadow-xl shadow-cyan-400/10 transition transform hover:scale-115 active:scale-95 cursor-pointer"
                      title="Super Study Like (or press ↑ Arrow)"
                    >
                      <Star className="w-6 h-6 fill-cyan-400" />
                    </button>

                    {/* Like & Study Match (Swipe Right) */}
                    <button
                      onClick={() => handleSwipe('right')}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/30 transition transform hover:scale-115 active:scale-95 cursor-pointer"
                      title="Study Match / Swipe Right (or press → Arrow)"
                    >
                      <Heart className="w-7 h-7 fill-slate-950" />
                    </button>

                    {/* Direct Message */}
                    <button
                      onClick={() => onStartDirectMessage(currentCandidate.profile)}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-purple-500 text-purple-400 flex items-center justify-center shadow-lg transition transform hover:scale-110 cursor-pointer"
                      title="Message Dr. Directly"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>

                    {/* Compare Subjects */}
                    <button
                      onClick={() => onComparePartner(currentCandidate.profile)}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-emerald-400 flex items-center justify-center shadow-lg transition transform hover:scale-110 cursor-pointer"
                      title="Compare 19 MBBS Subjects Synergy"
                    >
                      <BookOpen className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* GRID / BROWSE MODE */
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPartners.map(({ profile, compatibility }) => {
                const partnerStreak =
                  profile.studyStreak || createDefaultStudyStreak(0, 0, false);
                return (
                  <div
                    key={profile.id}
                    className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl hover:border-emerald-500/60 transition flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-white truncate">{profile.name}</h4>
                          <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                            {compatibility.overallScore}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{profile.college}</p>
                        <span className="text-[11px] font-bold text-cyan-300 block truncate mt-0.5">
                          🩺 {profile.targetPgBranch}
                        </span>

                        {/* Streak Badge */}
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded-md border border-orange-800/80 flex items-center gap-1">
                            <Flame className="w-3 h-3 fill-orange-400" />
                            <span>{partnerStreak.currentStreakDays}d Streak</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {partnerStreak.todayCheckedIn ? 'Active Today' : 'Consistent'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      "{profile.bio}"
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onComparePartner(profile)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
                      >
                        Compare
                      </button>
                      <button
                        onClick={() => onSelectPartner(profile)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-xs font-bold text-white shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>Study Together</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CELEBRATION DATING-APP STYLE STUDY MATCH MODAL */}
      {/* ========================================================================= */}
      {matchedModalPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="max-w-md w-full rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 border-2 border-emerald-500/80 p-6 sm:p-8 text-center shadow-2xl relative">
            <button
              onClick={() => setMatchedModalPartner(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 flex items-center justify-center mx-auto mb-3 animate-pulse">
              <Heart className="w-8 h-8 fill-emerald-400" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">
              It’s a Study Match! 🎉
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              You and <strong>{matchedModalPartner.name}</strong> both target {matchedModalPartner.targetExam.replace('_', ' ')} with complementary NEET SS tracks!
            </p>

            {/* Two Profile Avatars Colliding / Connecting */}
            <div className="my-6 flex items-center justify-center gap-4">
              <div className="relative">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-2xl object-cover border-3 border-emerald-500 shadow-xl"
                />
                <span className="text-[10px] font-bold text-emerald-300 block mt-1">You</span>
                <span className="text-[10px] font-bold text-orange-400 block">
                  🔥 {userStreak.currentStreakDays}d streak
                </span>
              </div>

              <div className="p-2 rounded-full bg-emerald-500 text-slate-950 font-black shadow-lg">
                ⚡
              </div>

              <div className="relative">
                <img
                  src={matchedModalPartner.avatarUrl}
                  alt={matchedModalPartner.name}
                  className="w-20 h-20 rounded-2xl object-cover border-3 border-cyan-400 shadow-xl"
                />
                <span className="text-[10px] font-bold text-cyan-300 block mt-1">
                  {matchedModalPartner.name.split(' ')[1]}
                </span>
                <span className="text-[10px] font-bold text-orange-400 block">
                  🔥 {matchedModalPartner.studyStreak?.currentStreakDays || 12}d streak
                </span>
              </div>
            </div>

            {/* Mutual Momentum Callout */}
            <div className="mb-4 p-3 rounded-2xl bg-orange-950/60 border border-orange-500/40 text-xs text-orange-200">
              <span className="font-bold block text-orange-300">
                🔥 Combined Study Discipline: {userStreak.currentStreakDays + (matchedModalPartner.studyStreak?.currentStreakDays || 12)} Days!
              </span>
              <span>Collaborate on daily revisions to maintain your streaks together!</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  onSelectPartner(matchedModalPartner);
                  setMatchedModalPartner(null);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-sm shadow-xl transition cursor-pointer"
              >
                Enter Study Room &amp; Sync Pomodoro
              </button>

              <button
                onClick={() => {
                  onStartDirectMessage(matchedModalPartner);
                  setMatchedModalPartner(null);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Chat &amp; Share Lectures</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
