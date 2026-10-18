import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckSquare,
  Square,
  Plus,
  Send,
  Sparkles,
  HelpCircle,
  MessageSquare,
  Award,
  ShieldCheck,
  CheckCircle2,
  BrainCircuit,
  Image as ImageIcon,
  TrendingUp,
  BarChart3,
  Calendar,
  Trophy,
  BookOpen,
  Flame,
  LayoutGrid,
} from 'lucide-react';
import { MedicalProfile } from '../utils/partnerMatching.ts';
import { SyllabusTrackerView } from './SyllabusTrackerView.tsx';
import { ExamCountdownWidget } from './ExamCountdownWidget.tsx';
import { SyncedPomodoroTimer } from './SyncedPomodoroTimer.tsx';
import { SharedLeaderboard } from './SharedLeaderboard.tsx';

interface StudyHubProps {
  currentUser: MedicalProfile;
  activePartner: MedicalProfile;
  sharedAssets: any[];
  onOpenImageLab: () => void;
  onOpenMnemonicStudio: () => void;
  onTriggerNotification?: (title: string, message: string, type: any) => void;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  assignedTo: 'both' | 'me' | 'partner';
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  type?: 'text' | 'mcq' | 'image';
  payload?: any;
}

export const StudyHub: React.FC<StudyHubProps> = ({
  currentUser,
  activePartner,
  sharedAssets,
  onOpenImageLab,
  onOpenMnemonicStudio,
  onTriggerNotification,
}) => {
  // StudyHub views: 'tracker' (Syllabus milestones) | 'timer' (Synced Pomodoro) | 'leaderboard' (Gamified Leaderboard) | 'lounge' (Checklist & Q-Bank)
  const [hubSubTab, setHubSubTab] = useState<'tracker' | 'timer' | 'leaderboard' | 'lounge'>('timer');

  // Daily checklist state
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: '1',
      text: `Solve 50 ${currentUser.studyPartnerPreferences?.qBankPlatform || 'Marrow'} MCQs in ${currentUser.weakSubjects[0] || 'Pathology'} (Partner Mentorship)`,
      completed: true,
      assignedTo: 'me',
    },
    {
      id: '2',
      text: `Review ${activePartner.weakSubjects[0] || 'Pharmacology'} High-Yield Pearls with ${activePartner.name.split(' ')[1]}`,
      completed: false,
      assignedTo: 'both',
    },
    {
      id: '3',
      text: 'Analyze 5 Clinical Image Based Questions (IBQs) in AI Image Lab',
      completed: false,
      assignedTo: 'both',
    },
    {
      id: '4',
      text: 'Review Sunday Grand Test (GT) unattempted and negative marking questions',
      completed: false,
      assignedTo: 'both',
    },
  ]);
  const [newTaskText, setNewTaskText] = useState<string>('');

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      senderId: activePartner.id,
      senderName: activePartner.name,
      text: `Hey ${currentUser.name.split(' ')[1]}! Ready for our ${currentUser.targetExam.replace('_', ' ')} session today. I just finished my custom module on ${activePartner.strongSubjects[0] || 'Pathology'}. Let me know whenever you want to test each other!`,
      timestamp: '09:05 AM',
      type: 'text',
    },
    {
      id: 'msg-2',
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: `Hey ${activePartner.name.split(' ')[1]}! Starting a 25-minute Pomodoro focus block now. Let's hit our 100 MCQ target!`,
      timestamp: '09:07 AM',
      type: 'text',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Handle incoming shared assets from ImageLab or MnemonicStudio
  useEffect(() => {
    if (sharedAssets.length > 0) {
      const latest = sharedAssets[sharedAssets.length - 1];
      if (latest.type === 'mcq') {
        const mcqMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text: `Here is a high-yield IBQ clinical vignette case for us to quiz:`,
          timestamp: 'Just now',
          type: 'mcq',
          payload: latest.payload,
        };
        setMessages((prev) => [...prev, mcqMsg]);
      } else if (latest.type === 'image') {
        const imgMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text: `Shared mnemonic study card: "${latest.payload.title}"`,
          timestamp: 'Just now',
          type: 'image',
          payload: latest.payload,
        };
        setMessages((prev) => [...prev, imgMsg]);
      }
    }
  }, [sharedAssets, currentUser]);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newItem: ChecklistItem = {
      id: `task-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false,
      assignedTo: 'both',
    };
    setChecklist((prev) => [...prev, newItem]);
    setNewTaskText('');

    if (onTriggerNotification) {
      onTriggerNotification(
        'New Target Task Added',
        `New study target: "${newTaskText.trim()}" added to daily checklist.`,
        'study_request'
      );
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: chatInput.trim(),
      timestamp: 'Just now',
      type: 'text',
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  const handleSendQuizChallenge = () => {
    const quizCases = [
      {
        question:
          '34-year-old male with recurrent syncope and exertional dyspnea. Auscultation reveals a harsh crescendo-decrescendo systolic murmur increasing with Valsalva maneuver. What is the next most appropriate step in management?',
        options: [
          'A. Prescribe Digoxin to improve contractility',
          'B. Beta-blockers (e.g. Metoprolol) as first-line therapy',
          'C. Start high-dose loop diuretics immediately',
          'D. Urgent aortic valve replacement',
        ],
        answer: 'B',
        explanation:
          'Hypertrophic Cardiomyopathy (HOCM) murmur increases with Valsalva (decreased preload). Beta-blockers or Verapamil are first-line to increase ventricular filling time and reduce dynamic LVOT obstruction.',
      },
    ];

    const pick = quizCases[0];
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: 'Peer IBQ Challenge for us to crack:',
      timestamp: 'Just now',
      type: 'mcq',
      payload: pick,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="space-y-6">
      {/* 1. Customizable Target Exam Countdown Widget at top of StudyHub */}
      <ExamCountdownWidget currentUser={currentUser} activePartner={activePartner} />

      {/* Connected Study Partner Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <img
              src={activePartner.avatarUrl}
              alt={activePartner.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Study Room with {activePartner.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[10px] font-bold">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {activePartner.college} • Target NEET SS: <strong className="text-cyan-300">{activePartner.targetPgBranch}</strong>
            </p>
          </div>
        </div>

        {/* StudyHub Sub-Tabs: Pomodoro, Leaderboard, Syllabus, Lounge */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setHubSubTab('timer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              hubSubTab === 'timer'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Pomodoro</span>
          </button>

          <button
            onClick={() => setHubSubTab('leaderboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              hubSubTab === 'leaderboard'
                ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => setHubSubTab('tracker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              hubSubTab === 'tracker'
                ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Syllabus</span>
          </button>

          <button
            onClick={() => setHubSubTab('lounge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              hubSubTab === 'lounge'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Lounge Chat</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-VIEW: SYNCED POMODORO TIMER */}
      {/* ========================================================================= */}
      {hubSubTab === 'timer' && (
        <SyncedPomodoroTimer
          currentUser={currentUser}
          activePartner={activePartner}
          onSessionComplete={(mins) => {
            if (onTriggerNotification) {
              onTriggerNotification(
                'Pomodoro Session Finished! 🍅',
                `You and ${activePartner.name.split(' ')[1]} completed a ${mins}-minute focus sprint! +50 XP added.`,
                'pomodoro_invite'
              );
            }
          }}
          onSendPartnerInvite={(mode) => {
            if (onTriggerNotification) {
              onTriggerNotification(
                'Pomodoro Sync Broadcasted',
                `Invited ${activePartner.name} to join your ${mode} session!`,
                'pomodoro_invite'
              );
            }
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-VIEW: SHARED LEADERBOARD */}
      {/* ========================================================================= */}
      {hubSubTab === 'leaderboard' && (
        <SharedLeaderboard currentUser={currentUser} activePartner={activePartner} />
      )}

      {/* ========================================================================= */}
      {/* 4. SUB-VIEW: VISUAL SYLLABUS TRACKER */}
      {/* ========================================================================= */}
      {hubSubTab === 'tracker' && (
        <SyllabusTrackerView
          currentUser={currentUser}
          activePartner={activePartner}
        />
      )}

      {/* ========================================================================= */}
      {/* 5. SUB-VIEW: DAILY CHECKLIST & LIVE PEER CHAT LOUNGE */}
      {/* ========================================================================= */}
      {hubSubTab === 'lounge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Daily Checklist */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  <span>Daily Mutual Targets</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {checklist.filter((i) => i.completed).length} / {checklist.length} Completed
                </span>
              </div>

              <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className={`p-3 rounded-xl border flex items-start gap-2.5 transition cursor-pointer ${
                      item.completed
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-400'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 text-emerald-400">
                      {item.completed ? (
                        <CheckSquare className="w-4 h-4 fill-emerald-500/20" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <span
                      className={`text-xs leading-relaxed ${
                        item.completed ? 'line-through text-slate-500' : 'font-medium'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddChecklistItem} className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Add daily study target..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>

          {/* Peer Chat & Quiz Arena */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[450px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Study Room Discussion</span>
              </span>
              <button
                onClick={handleSendQuizChallenge}
                className="text-xs bg-cyan-950 hover:bg-cyan-900 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-800 font-bold transition cursor-pointer flex items-center gap-1"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Quiz Each Other</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 mb-1">
                      {msg.senderName} • {msg.timestamp}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.type === 'mcq' && msg.payload && (
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-950/80 border border-cyan-800/80 space-y-2 text-slate-200">
                          <p className="font-bold text-cyan-300">{msg.payload.question}</p>
                          <div className="space-y-1">
                            {msg.payload.options.map((opt: string, i: number) => (
                              <div
                                key={i}
                                className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-850 cursor-pointer text-[11px]"
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Coordinate study topic or ask question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
