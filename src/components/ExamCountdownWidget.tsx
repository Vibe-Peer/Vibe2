import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  Flame,
  Award,
  Edit3,
  Check,
  RotateCcw,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';
import { MedicalExam, MedicalProfile } from '../utils/partnerMatching.ts';

interface ExamCountdownWidgetProps {
  currentUser: MedicalProfile;
  activePartner: MedicalProfile;
}

interface ExamPreset {
  id: MedicalExam | 'CUSTOM';
  label: string;
  name: string;
  targetDate: string; // ISO string
  description: string;
}

const DEFAULT_PRESETS: Record<MedicalExam, ExamPreset> = {
  NEET_PG: {
    id: 'NEET_PG',
    label: 'NEET PG 2026',
    name: 'National Eligibility Entrance Test (Postgraduate)',
    targetDate: '2026-07-12T09:00:00',
    description: '19 Subjects • 200 Questions • 800 Marks',
  },
  INICET: {
    id: 'INICET',
    label: 'INICET Nov 2026',
    name: 'Institute of National Importance Combined Entrance Test (AIIMS, PGI, JIPMER)',
    targetDate: '2026-11-15T09:00:00',
    description: 'AIIMS New Delhi, PGI Chandigarh, JIPMER & NIMHANS',
  },
  FMGE: {
    id: 'FMGE',
    label: 'FMGE / NExT Dec 2026',
    name: 'Foreign Medical Graduates Examination Screening Test',
    targetDate: '2026-12-20T09:00:00',
    description: '300 MCQs • Clinical Case Vignettes & High-Yield Image Recall',
  },
};

const MOTIVATIONAL_QUOTES = [
  '“The harder you work for something, the greater you’ll feel when you achieve that dream PG seat.”',
  '“19 MBBS subjects, 1 target exam, 1 study partner by your side. Stay consistent!”',
  '“Every Grand Test mistake today is a rank saved on exam day.”',
  '“Active recall with your peer turns weak subjects into clinical reflexes.”',
  '“Your future patients are waiting for the doctor you are studying to become.”',
];

export const ExamCountdownWidget: React.FC<ExamCountdownWidgetProps> = ({
  currentUser,
  activePartner,
}) => {
  const currentExam = currentUser.targetExam;
  const initialPreset = DEFAULT_PRESETS[currentExam] || DEFAULT_PRESETS.NEET_PG;

  const [targetDateStr, setTargetDateStr] = useState<string>(initialPreset.targetDate);
  const [examName, setExamName] = useState<string>(initialPreset.label);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // Time remaining calculation
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(targetDateStr).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, totalMs: diff });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  // Rotate motivational quote
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 12000);
    return () => clearInterval(quoteInterval);
  }, []);

  const handleSelectPreset = (exam: MedicalExam) => {
    const preset = DEFAULT_PRESETS[exam];
    setTargetDateStr(preset.targetDate);
    setExamName(preset.label);
    setIsEditing(false);
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-5 sm:p-6 border border-emerald-800/40 shadow-xl overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 shadow-md">
            <Calendar className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                {examName} Countdown
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[10px] font-bold uppercase tracking-wider">
                Target: {currentUser.targetPgBranch.split(' ')[0]}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Exam Date: <strong className="text-cyan-300">{new Date(targetDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong> • Synchronized with {activePartner.name.split(' ')[1]}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isEditing ? 'Close Setup' : 'Customize Exam Date'}</span>
        </button>
      </div>

      {/* Editing Drawer */}
      {isEditing && (
        <div className="relative z-10 my-4 p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 animate-fade-in">
          <h4 className="text-xs font-bold text-slate-200">Select Exam Preset or Custom Target Date:</h4>
          <div className="flex flex-wrap gap-2">
            {(['NEET_PG', 'INICET', 'FMGE'] as MedicalExam[]).map((examKey) => (
              <button
                key={examKey}
                onClick={() => handleSelectPreset(examKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  examName.includes(examKey.replace('_', ' '))
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {DEFAULT_PRESETS[examKey].label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="text-xs text-slate-400 font-semibold">Custom Date &amp; Time:</label>
            <input
              type="datetime-local"
              value={targetDateStr.slice(0, 16)}
              onChange={(e) => {
                setTargetDateStr(e.target.value);
                setExamName('Custom Target Goal');
              }}
              className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      )}

      {/* 4 Big Countdown Cards */}
      <div className="relative z-10 mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Days */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-emerald-900/40 shadow-inner">
          <span className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 via-emerald-400 to-cyan-400 tracking-tight font-mono">
            {timeLeft.days.toString().padStart(2, '0')}
          </span>
          <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-widest mt-1">
            Days
          </span>
        </div>

        {/* Hours */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-cyan-900/40 shadow-inner">
          <span className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-teal-400 tracking-tight font-mono">
            {timeLeft.hours.toString().padStart(2, '0')}
          </span>
          <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-widest mt-1">
            Hours
          </span>
        </div>

        {/* Minutes */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-purple-900/40 shadow-inner">
          <span className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-300 to-pink-400 tracking-tight font-mono">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-widest mt-1">
            Minutes
          </span>
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-amber-900/40 shadow-inner">
          <span className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-orange-400 tracking-tight font-mono">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-widest mt-1">
            Seconds
          </span>
        </div>
      </div>

      {/* Motivational Quote Banner */}
      <div className="relative z-10 mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
          {MOTIVATIONAL_QUOTES[quoteIndex]}
        </p>
      </div>
    </div>
  );
};
