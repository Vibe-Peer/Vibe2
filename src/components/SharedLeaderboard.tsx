import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Flame,
  CheckCircle2,
  Timer,
  BookOpen,
  Zap,
  TrendingUp,
  ShieldCheck,
  Plus,
  Users,
  Sparkles,
} from 'lucide-react';
import { MedicalProfile } from '../utils/partnerMatching.ts';

interface SharedLeaderboardProps {
  currentUser: MedicalProfile;
  activePartner: MedicalProfile;
}

export const SharedLeaderboard: React.FC<SharedLeaderboardProps> = ({
  currentUser,
  activePartner,
}) => {
  // Stats state (clean start without dummy numbers)
  const [userMilestones, setUserMilestones] = useState<number>(0);
  const [partnerMilestones, setPartnerMilestones] = useState<number>(0);

  const [userPomodoros, setUserPomodoros] = useState<number>(0);
  const [partnerPomodoros, setPartnerPomodoros] = useState<number>(0);

  const [userMcqs, setUserMcqs] = useState<number>(currentUser.studyStreak?.totalMcqsSolved || 0);
  const [partnerMcqs, setPartnerMcqs] = useState<number>(activePartner.studyStreak?.totalMcqsSolved || 0);

  const userStreak = currentUser.studyStreak?.currentStreakDays || 0;
  const partnerStreak = activePartner.studyStreak?.currentStreakDays || 0;
  const mutualStreak = Math.min(userStreak, partnerStreak);

  // Calculate XP: Milestone = 100 XP, Pomodoro = 50 XP, MCQ = 2 XP
  const userXP = userMilestones * 100 + userPomodoros * 50 + userMcqs * 2;
  const partnerXP = partnerMilestones * 100 + partnerPomodoros * 50 + partnerMcqs * 2;

  const totalXP = userXP + partnerXP;
  const userPercent = totalXP > 0 ? Math.round((userXP / totalXP) * 100) : 50;
  const partnerPercent = 100 - userPercent;

  const getRankBadge = (xp: number) => {
    if (xp >= 4000) return { title: 'AIIMS Gold Medalist', color: 'from-amber-400 to-yellow-500', tier: 'Grandmaster' };
    if (xp >= 3000) return { title: 'Resident Chief', color: 'from-purple-400 to-indigo-500', tier: 'Diamond' };
    if (xp >= 2000) return { title: 'Senior Registrar', color: 'from-cyan-400 to-blue-500', tier: 'Platinum' };
    return { title: 'Clinical Ace', color: 'from-emerald-400 to-teal-500', tier: 'Gold' };
  };

  const userRank = getRankBadge(userXP);
  const partnerRank = getRankBadge(partnerXP);

  const handleBoostStat = (type: 'milestone' | 'pomodoro' | 'mcq') => {
    if (type === 'milestone') setUserMilestones((prev) => prev + 1);
    if (type === 'pomodoro') setUserPomodoros((prev) => prev + 1);
    if (type === 'mcq') setUserMcqs((prev) => prev + 25);
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-950 font-bold shadow-md">
            <Trophy className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Shared Peer Leaderboard
              </h3>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{mutualStreak}d Mutual Streak</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Gamified accountability duel: <strong>{currentUser.name}</strong> vs <strong>{activePartner.name}</strong>
            </p>
          </div>
        </div>

        {/* Quick XP Boost Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleBoostStat('pomodoro')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-bold transition cursor-pointer"
            title="Log 1 Pomodoro session (+50 XP)"
          >
            <Plus className="w-3 h-3" />
            <span>1 Pomodoro (+50 XP)</span>
          </button>
          <button
            onClick={() => handleBoostStat('mcq')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-bold transition cursor-pointer"
            title="Log 25 Solved MCQs (+50 XP)"
          >
            <Plus className="w-3 h-3" />
            <span>25 MCQs (+50 XP)</span>
          </button>
          <button
            onClick={() => handleBoostStat('milestone')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 text-xs font-bold transition cursor-pointer"
            title="Log 1 Syllabus Milestone (+100 XP)"
          >
            <Plus className="w-3 h-3" />
            <span>Milestone (+100 XP)</span>
          </button>
        </div>
      </div>

      {/* Head-to-Head XP Duel Bar */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-emerald-500"
            />
            <span className="text-emerald-400">{currentUser.name.split(' ')[1]} ({userPercent}%)</span>
          </div>

          <span className="text-slate-400 font-mono text-[11px]">
            {userXP} XP vs {partnerXP} XP
          </span>

          <div className="flex items-center gap-2">
            <span className="text-cyan-400">{activePartner.name.split(' ')[1]} ({partnerPercent}%)</span>
            <img
              src={activePartner.avatarUrl}
              alt={activePartner.name}
              className="w-7 h-7 rounded-full object-cover border border-cyan-500"
            />
          </div>
        </div>

        {/* Duel Bar */}
        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
            style={{ width: `${userPercent}%` }}
          />
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
            style={{ width: `${partnerPercent}%` }}
          />
        </div>

        <p className="text-center text-[11px] text-slate-400 font-medium">
          {userXP >= partnerXP
            ? `🏆 You are currently leading by ${userXP - partnerXP} XP! Keep the pace high!`
            : `⚡ ${activePartner.name.split(' ')[1]} is leading by ${partnerXP - userXP} XP! Log a Pomodoro to catch up!`}
        </p>
      </div>

      {/* Side-by-Side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Card */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-slate-950 to-emerald-950/20 border border-emerald-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{currentUser.name}</h4>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">
                  {userRank.tier} • {userRank.title}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-emerald-400 font-mono">{userXP}</span>
              <span className="text-[10px] text-slate-500 block uppercase">Total XP</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="block font-black text-white text-sm">{userMilestones}</span>
              <span className="text-[10px] text-slate-400">Milestones</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="block font-black text-amber-400 text-sm">{userPomodoros}</span>
              <span className="text-[10px] text-slate-400">Pomodoros</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="block font-black text-cyan-400 text-sm">{userMcqs}</span>
              <span className="text-[10px] text-slate-400">MCQs Solved</span>
            </div>
          </div>
        </div>

        {/* Partner Card */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-slate-950 to-cyan-950/20 border border-cyan-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={activePartner.avatarUrl}
                alt={activePartner.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{activePartner.name}</h4>
                <span className="text-[10px] font-bold text-cyan-400 uppercase">
                  {partnerRank.tier} • {partnerRank.title}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-cyan-400 font-mono">{partnerXP}</span>
              <span className="text-[10px] text-slate-500 block uppercase">Total XP</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="block font-black text-white text-sm">{partnerMilestones}</span>
              <span className="text-[10px] text-slate-400">Milestones</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="block font-black text-amber-400 text-sm">{partnerPomodoros}</span>
              <span className="text-[10px] text-slate-400">Pomodoros</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="block font-black text-cyan-400 text-sm">{partnerMcqs}</span>
              <span className="text-[10px] text-slate-400">MCQs Solved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
