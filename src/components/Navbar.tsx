import React from 'react';
import {
  Users,
  BrainCircuit,
  Sparkles,
  Timer,
  UserCheck,
  ShieldCheck,
  Flame,
  ArrowRightLeft,
  MessageSquare,
  LogOut,
  Home,
} from 'lucide-react';
import { MedicalProfile } from '../utils/partnerMatching.ts';
import { InAppNotification } from '../utils/notificationSystem.ts';
import { NotificationCenter } from './NotificationCenter.tsx';
import { VibeLogo } from './VibeLogo.tsx';

interface NavbarProps {
  activeTab: 'matches' | 'messages' | 'imagelab' | 'mnemonic' | 'studyhub' | 'profile';
  setActiveTab: (tab: 'matches' | 'messages' | 'imagelab' | 'mnemonic' | 'studyhub' | 'profile') => void;
  currentUser: MedicalProfile;
  onSwitchUser: () => void;
  onOpenSafetyModal: () => void;
  notifications: InAppNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onNotificationAction: (notification: InAppNotification) => void;
  onSimulatePartnerAlert?: (type: 'milestone' | 'request' | 'pomodoro' | 'youtube') => void;
  onLogout?: () => void;
  onGoToHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchUser,
  onOpenSafetyModal,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onNotificationAction,
  onSimulatePartnerAlert,
  onLogout,
  onGoToHome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-[#1E293B] text-[#F8FAFC] shadow-xl">
      {/* Top micro banner for exam countdown and NEET SS super-specialty track */}
      <div className="bg-gradient-to-r from-[#020617] via-[#0F172A] to-[#020617] px-4 py-1.5 text-xs border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-[#1E293B] text-[#22D3EE] font-semibold px-2.5 py-0.5 rounded-full border border-[#22D3EE]/30">
            <Flame className="w-3.5 h-3.5 text-[#22D3EE] animate-pulse" />
            {currentUser.targetExam.replace('_', ' ')} {currentUser.targetYear}
          </span>
          <span className="text-[#94A3B8] hidden sm:inline">
            • Target PG Branch: <strong className="text-[#22D3EE]">{currentUser.targetPgBranch}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Notification Center */}
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={onMarkNotificationAsRead}
            onMarkAllAsRead={onMarkAllNotificationsAsRead}
            onActionClick={onNotificationAction}
            onSimulatePartnerAlert={onSimulatePartnerAlert}
          />

          <button
            onClick={onOpenSafetyModal}
            className="flex items-center gap-1 text-[#94A3B8] hover:text-[#22D3EE] transition cursor-pointer text-xs"
            title="Read Community Guidelines & Safety"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span className="hidden md:inline">Safe Space</span>
          </button>

          <button
            onClick={onSwitchUser}
            className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-slate-700 text-[#F8FAFC] px-2.5 py-0.5 rounded-lg border border-[#1E293B] hover:border-[#22D3EE]/40 transition cursor-pointer text-xs"
            title="Switch demo persona between male and female doctor to test opposite-gender matching"
          >
            <ArrowRightLeft className="w-3 h-3 text-[#22D3EE]" />
            <span>Switch: <strong>{currentUser.name.replace('Dr. ', '')}</strong> ({currentUser.gender === 'male' ? '♂' : '♀'})</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-[#94A3B8] hover:text-rose-400 bg-[#020617] hover:bg-rose-950/30 px-2 py-0.5 rounded-lg border border-[#1E293B] hover:border-rose-500/40 transition cursor-pointer text-xs"
              title="Sign Out of Vibe"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Main navigation with Vibe branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand: Vibe */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => {
              if (onGoToHome) onGoToHome();
              else setActiveTab('matches');
            }}
            title="Vibe - Let's Vibe Together."
          >
            <VibeLogo size="md" showTagline={false} />
            <div className="hidden lg:block border-l border-[#1E293B] pl-2.5 ml-0.5">
              <span className="text-[11px] text-[#94A3B8] font-medium block leading-tight">
                Let&apos;s Vibe Together.
              </span>
              <span className="text-[10px] text-[#22D3EE] font-semibold block leading-tight">
                Study Partner Match
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'matches'
                  ? 'bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/40 shadow-sm shadow-[#22D3EE]/10'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Partner Match</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/40'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#22D3EE]" />
              <span>Chat &amp; Calls</span>
            </button>

            <button
              onClick={() => setActiveTab('studyhub')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'studyhub'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              }`}
            >
              <Timer className="w-4 h-4 text-amber-400" />
              <span>Study Room</span>
            </button>

            <button
              onClick={() => setActiveTab('imagelab')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'imagelab'
                  ? 'bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/40'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              }`}
            >
              <BrainCircuit className="w-4 h-4 text-[#22D3EE]" />
              <span className="hidden md:inline">AI Image Lab</span>
              <span className="md:hidden">IBQ</span>
            </button>

            <button
              onClick={() => setActiveTab('mnemonic')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'mnemonic'
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="hidden md:inline">Mnemonic Studio</span>
              <span className="md:hidden">Mnemonics</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#1E293B] text-[#F8FAFC] border border-[#22D3EE]/40 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#22D3EE]" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
