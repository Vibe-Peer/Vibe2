import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Users,
  CheckCircle2,
  Coffee,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Bell,
  Award,
} from 'lucide-react';
import { MedicalProfile } from '../utils/partnerMatching.ts';

interface SyncedPomodoroTimerProps {
  currentUser: MedicalProfile;
  activePartner: MedicalProfile;
  onSessionComplete?: (durationMinutes: number) => void;
  onSendPartnerInvite?: (mode: string) => void;
}

export type PomodoroMode = 'focus25' | 'deep50' | 'break5' | 'break15';

interface ModeConfig {
  label: string;
  minutes: number;
  type: 'focus' | 'break';
  color: string;
}

const MODES: Record<PomodoroMode, ModeConfig> = {
  focus25: {
    label: '25m Focus Block',
    minutes: 25,
    type: 'focus',
    color: 'emerald',
  },
  deep50: {
    label: '50m Deep MCQ Sprint',
    minutes: 50,
    type: 'focus',
    color: 'cyan',
  },
  break5: {
    label: '5m Quick Chai Break',
    minutes: 5,
    type: 'break',
    color: 'amber',
  },
  break15: {
    label: '15m Brain Reset Break',
    minutes: 15,
    type: 'break',
    color: 'purple',
  },
};

export const SyncedPomodoroTimer: React.FC<SyncedPomodoroTimerProps> = ({
  currentUser,
  activePartner,
  onSessionComplete,
  onSendPartnerInvite,
}) => {
  const [mode, setMode] = useState<PomodoroMode>('focus25');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSyncedWithPartner, setIsSyncedWithPartner] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(3);
  const [subjectFocus, setSubjectFocus] = useState<string>(currentUser.weakSubjects[0] || 'Pathology');
  const [syncAlert, setSyncAlert] = useState<string | null>(
    `Synchronized with ${activePartner.name.split(' ')[1]} (${activePartner.college.split(',')[0]})`
  );

  const totalTimeForMode = MODES[mode].minutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalTimeForMode - timeLeft) / totalTimeForMode) * 100));

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Play web audio chime if sound enabled
      if (soundEnabled && typeof window !== 'undefined' && window.AudioContext) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        } catch (e) {
          // audio fallback
        }
      }

      // If it was a focus session, increment counter
      if (MODES[mode].type === 'focus') {
        const completedMinutes = MODES[mode].minutes;
        setCompletedSessionsCount((c) => c + 1);
        if (onSessionComplete) {
          onSessionComplete(completedMinutes);
        }
        setSyncAlert(`🎉 Session complete! Logged +50 XP to Shared Leaderboard with ${activePartner.name.split(' ')[1]}`);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, soundEnabled, activePartner, onSessionComplete]);

  const handleSelectMode = (newMode: PomodoroMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(MODES[newMode].minutes * 60);
    if (isSyncedWithPartner && onSendPartnerInvite) {
      onSendPartnerInvite(MODES[newMode].label);
    }
  };

  const handleTogglePlay = () => {
    const nextRunning = !isRunning;
    setIsRunning(nextRunning);
    if (nextRunning && isSyncedWithPartner) {
      setSyncAlert(`🟢 Broadcasting study timer state to ${activePartner.name.split(' ')[1]}...`);
      setTimeout(() => {
        setSyncAlert(`🟢 ${activePartner.name.split(' ')[1]} joined your focus session on ${subjectFocus}!`);
      }, 1200);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].minutes * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header & Synchronization Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md">
            <Timer className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Synced Peer Pomodoro
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/80 text-[10px] font-bold">
                {completedSessionsCount} Blocks Today
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Synchronize study intervals with <strong>{activePartner.name}</strong>
            </p>
          </div>
        </div>

        {/* Sync Toggle & Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSyncedWithPartner(!isSyncedWithPartner)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              isSyncedWithPartner
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800 shadow-sm'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle real-time timer sync with your partner"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSyncedWithPartner ? 'Partner Sync: ON' : 'Partner Sync: OFF'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title={soundEnabled ? 'Chime sound enabled' : 'Muted'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Sync Status Alert Banner */}
      {syncAlert && (
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/60 flex items-center justify-between text-xs text-slate-300 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium">{syncAlert}</span>
          </div>
          <button
            onClick={() => setSyncAlert(null)}
            className="text-slate-500 hover:text-slate-300 text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Mode Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(MODES) as PomodoroMode[]).map((modeKey) => {
          const cfg = MODES[modeKey];
          const isSelected = mode === modeKey;
          return (
            <button
              key={modeKey}
              onClick={() => handleSelectMode(modeKey)}
              className={`p-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-800 to-slate-900 text-white border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              <span>{cfg.label}</span>
              <span className="text-[10px] font-normal text-slate-400">
                {cfg.type === 'focus' ? '🎯 High-Yield' : '☕ Rest & Hydrate'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Study Subject Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
        <label className="text-slate-300 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Subject Focus:</span>
        </label>
        <div className="flex items-center gap-2">
          <select
            value={subjectFocus}
            onChange={(e) => setSubjectFocus(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {currentUser.strongSubjects.concat(currentUser.weakSubjects).map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            (Both peers tracking {subjectFocus})
          </span>
        </div>
      </div>

      {/* Main Big Circular Display & Controls */}
      <div className="flex flex-col items-center justify-center py-4">
        {/* Progress Circle Container */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
          {/* SVG Progress Ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-800"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={MODES[mode].type === 'focus' ? 'text-emerald-400' : 'text-amber-400'}
              strokeWidth="6"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>

          {/* Inner Content */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
              {MODES[mode].label.split(' ')[0]} {MODES[mode].type === 'focus' ? 'Focus' : 'Break'}
            </span>
            <span className="text-[11px] text-cyan-400 font-medium mt-0.5">
              {isRunning ? '🟢 Active with Partner' : '⏸️ Paused'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className={`px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl transition cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/25'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-slate-950" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950" />
                <span>Start Focus Sprint</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
