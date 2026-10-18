import React from 'react';
import { X, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Stethoscope, ShieldCheck, Flame } from 'lucide-react';
import { MedicalProfile, MBBS_SUBJECTS, calculateCompatibility } from '../utils/partnerMatching.ts';

interface SubjectCompareModalProps {
  currentUser: MedicalProfile;
  partner: MedicalProfile;
  onClose: () => void;
  onConnect: () => void;
}

export const SubjectCompareModal: React.FC<SubjectCompareModalProps> = ({
  currentUser,
  partner,
  onClose,
  onConnect,
}) => {
  const compatibility = calculateCompatibility(currentUser, partner);
  const userStreak = currentUser.studyStreak?.currentStreakDays || 0;
  const partnerStreak = partner.studyStreak?.currentStreakDays || 0;
  const totalMomentum = userStreak + partnerStreak;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                MBBS 19-Subject Academic Synergy Matrix
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {compatibility.overallScore}% Match
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Comparing {currentUser.name} ({currentUser.gender === 'male' ? '♂ Male' : '♀ Female'}) &amp; {partner.name} ({partner.gender === 'female' ? '♀ Female' : '♂ Male'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Synergy Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-800/60 to-cyan-950/60 border border-emerald-800/40">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Complementary Advantage Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="font-semibold text-emerald-400 block mb-1">
                  How {partner.name.split(' ')[1]} Boosts Your Rank:
                </span>
                {compatibility.mutualComplements.partnerHelpsUserWith.length > 0 ? (
                  <p>
                    She/He excels in{' '}
                    <strong className="text-emerald-300">
                      {compatibility.mutualComplements.partnerHelpsUserWith.join(', ')}
                    </strong>{' '}
                    which are your designated high-priority weak subjects.
                  </p>
                ) : (
                  <p className="text-slate-400">Shared revision across syllabus subjects.</p>
                )}
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="font-semibold text-cyan-400 block mb-1">
                  How You Boost {partner.name.split(' ')[1]}:
                </span>
                {compatibility.mutualComplements.userHelpsPartnerWith.length > 0 ? (
                  <p>
                    You excel in{' '}
                    <strong className="text-cyan-300">
                      {compatibility.mutualComplements.userHelpsPartnerWith.join(', ')}
                    </strong>{' '}
                    which complements their key focus areas.
                  </p>
                ) : (
                  <p className="text-slate-400">Mutual active recall on difficult PYQ topics.</p>
                )}
              </div>
            </div>
          </div>

          {/* Mutual Daily Study Streak Momentum Banner */}
          <div className="p-3.5 rounded-xl bg-orange-950/40 border border-orange-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Flame className="w-5 h-5 fill-orange-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-orange-300 block">
                  Collaborative Study Streak Momentum: {totalMomentum} Days
                </span>
                <span className="text-[11px] text-slate-400">
                  You ({userStreak}d) + {partner.name.split(' ')[1]} ({partnerStreak}d) = Unbroken daily revision momentum
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
              High Accountability
            </span>
          </div>

          {/* Side by side subject grid */}
          <div>
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>MBBS Subject</span>
              <div className="flex items-center gap-12 sm:gap-24">
                <span className="text-cyan-400">{currentUser.name.split(' ')[1]} (You)</span>
                <span className="text-emerald-400">{partner.name.split(' ')[1]}</span>
              </div>
            </div>

            <div className="divide-y divide-slate-800/60 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
              {MBBS_SUBJECTS.map((subject) => {
                const userStrong = currentUser.strongSubjects.includes(subject);
                const userWeak = currentUser.weakSubjects.includes(subject);
                const partnerStrong = partner.strongSubjects.includes(subject);
                const partnerWeak = partner.weakSubjects.includes(subject);

                const isComplementary =
                  (userWeak && partnerStrong) || (userStrong && partnerWeak);
                const isBothStrong = userStrong && partnerStrong;

                return (
                  <div
                    key={subject}
                    className={`px-4 py-2.5 flex items-center justify-between text-xs transition ${
                      isComplementary
                        ? 'bg-emerald-950/20'
                        : isBothStrong
                        ? 'bg-cyan-950/20'
                        : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200">{subject}</span>
                      {isComplementary && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                          Synergy Match
                        </span>
                      )}
                      {isBothStrong && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                          Joint Mastery
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-12 sm:gap-24">
                      {/* Current user status */}
                      <div className="w-24 text-center">
                        {userStrong ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded text-[11px]">
                            <CheckCircle2 className="w-3 h-3" /> Strong
                          </span>
                        ) : userWeak ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded text-[11px]">
                            <AlertCircle className="w-3 h-3" /> Weak
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Average</span>
                        )}
                      </div>

                      {/* Partner status */}
                      <div className="w-24 text-center">
                        {partnerStrong ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded text-[11px]">
                            <CheckCircle2 className="w-3 h-3" /> Strong
                          </span>
                        ) : partnerWeak ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded text-[11px]">
                            <AlertCircle className="w-3 h-3" /> Weak
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Average</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Safe, verified study partner matching</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onConnect();
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-lg shadow-lg shadow-emerald-600/20 transition cursor-pointer"
            >
              <span>Start Study Lounge with {partner.name.split(' ')[1]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
