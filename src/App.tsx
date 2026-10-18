import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { PartnerMatcher } from './components/PartnerMatcher.tsx';
import { SubjectCompareModal } from './components/SubjectCompareModal.tsx';
import { ImageLab } from './components/ImageLab.tsx';
import { MnemonicStudio } from './components/MnemonicStudio.tsx';
import { StudyHub } from './components/StudyHub.tsx';
import { ProfileEditor } from './components/ProfileEditor.tsx';
import { DirectMessaging } from './components/DirectMessaging.tsx';
import { SafetyModal } from './components/SafetyModal.tsx';
import { MessagesBar } from './components/MessagesBar.tsx';
import { HomePage } from './components/HomePage.tsx';
import { LoginPage } from './components/LoginPage.tsx';
import { SignupPage, NewUserRegistrationData } from './components/SignupPage.tsx';
import {
  INITIAL_USER_MALE,
  INITIAL_USER_FEMALE,
  MOCK_ALL_PROFILES,
} from './data/mockProfiles.ts';
import {
  MedicalProfile,
  matchesGenderCriteria,
  createDefaultStudyStreak,
} from './utils/partnerMatching.ts';
import { InAppNotification, INITIAL_NOTIFICATIONS } from './utils/notificationSystem.ts';
import { X, Sparkles } from 'lucide-react';
import { auth } from './firebase/config.ts';
import { signOut } from 'firebase/auth';

export default function App() {
  // Authentication & View Flow State
  // Unauthenticated users start on the Home Page, with Login and Signup views.
  // Dashboard routes are strictly protected at the UI level.
  const [authStatus, setAuthStatus] = useState<'unauthenticated' | 'authenticated'>('unauthenticated');
  const [authView, setAuthView] = useState<'home' | 'login' | 'signup'>('home');

  // Current user state (defaults to Dr. Aarav or personalized post-signup/login profile)
  const [currentUser, setCurrentUser] = useState<MedicalProfile>(INITIAL_USER_MALE);
  const [allProfiles, setAllProfiles] = useState<MedicalProfile[]>(MOCK_ALL_PROFILES);

  // Active connected study partner in the Study Lounge & Direct Messaging
  const [activePartner, setActivePartner] = useState<MedicalProfile>(INITIAL_USER_FEMALE);

  // Active navigation tab: 'matches' | 'messages' | 'imagelab' | 'mnemonic' | 'studyhub' | 'profile'
  const [activeTab, setActiveTab] = useState<
    'matches' | 'messages' | 'imagelab' | 'mnemonic' | 'studyhub' | 'profile'
  >('matches');

  // In-App Notifications State
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);
  const [toastNotification, setToastNotification] = useState<InAppNotification | null>(null);

  // Modals
  const [comparingPartner, setComparingPartner] = useState<MedicalProfile | null>(null);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState<boolean>(false);

  // Shared assets between ImageLab, MnemonicStudio, and StudyHub
  const [sharedAssets, setSharedAssets] = useState<any[]>([]);

  // Avatar pools for personalized profiles
  const femaleAvatars = [
    'https://images.unsplash.com/photo-1594824813570-82a8b9818cb4?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
  ];

  const maleAvatars = [
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80',
  ];

  // Handle successful signup with personalized placeholder data
  const handleSignupSuccess = (data: NewUserRegistrationData) => {
    const avatar =
      data.gender === 'female'
        ? femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)]
        : maleAvatars[Math.floor(Math.random() * maleAvatars.length)];

    const personalizedUser: MedicalProfile = {
      id: `doc-${Date.now()}`,
      name: data.name,
      gender: data.gender,
      targetPgBranch: data.targetPgBranch || (data.gender === 'female' ? 'MD Radiodiagnosis' : 'MS General Surgery'),
      academicInterests: [
        'High-Yield 20th Notebook Revision',
        'Clinical Case Vignettes',
        'Marrow Q-Bank Drilling',
      ],
      targetExam: data.targetExam,
      targetYear: 2026,
      studyPartnerPreferences: {
        preferredGender: 'opposite',
        targetStudyHoursPerDay: 8,
        studyRhythm: 'flexible',
        complementarySubjectsNeeded:
          data.gender === 'female' ? ['General Medicine', 'Pathology'] : ['OBGYN', 'Pediatrics'],
        qBankPlatform: 'Marrow',
      },
      college: 'AIIMS / GMC New Delhi',
      stage: 'Post-Intern',
      strongSubjects:
        data.gender === 'female'
          ? ['OBGYN', 'Pediatrics', 'Biochemistry']
          : ['General Medicine', 'Pathology', 'Pharmacology'],
      weakSubjects:
        data.gender === 'female'
          ? ['General Surgery', 'Orthopedics', 'Anaesthesia']
          : ['OBGYN', 'Dermatology', 'Psychiatry'],
      dailyTargetMCQs: 120,
      bio: `Medical resident preparing for ${data.targetExam.replace('_', ' ')} 2026. Target Specialty: ${data.targetPgBranch}. Looking for a dedicated opposite-gender study partner for daily Q-bank drilling and mutual accountability.`,
      verifiedStudent: true,
      avatarUrl: avatar,
      isOnline: true,
      studyStreak: createDefaultStudyStreak(0, 0, false),
    };

    // Find opposite-gender partner to connect
    const defaultPartner =
      allProfiles.find((p) => matchesGenderCriteria(personalizedUser, p)) ||
      (data.gender === 'female' ? INITIAL_USER_MALE : INITIAL_USER_FEMALE);

    setCurrentUser(personalizedUser);
    setActivePartner(defaultPartner);
    setAllProfiles((prev) => [personalizedUser, ...prev]);
    setAuthStatus('authenticated');
    setActiveTab('matches');
  };

  // Handle Login Success (handles custom medical email or persona)
  const handleLoginSuccess = (email: string, persona?: 'male' | 'female') => {
    if (persona === 'female') {
      setCurrentUser(INITIAL_USER_FEMALE);
      setActivePartner(INITIAL_USER_MALE);
    } else if (persona === 'male') {
      setCurrentUser(INITIAL_USER_MALE);
      setActivePartner(INITIAL_USER_FEMALE);
    } else {
      // Custom user logging in with email: personalize if not matched
      const cleanName = email.split('@')[0].replace(/[._-]/g, ' ');
      const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      const doctorName = capitalized.startsWith('Dr') ? capitalized : `Dr. ${capitalized}`;

      const customLoggedInUser: MedicalProfile = {
        ...INITIAL_USER_MALE,
        id: `user-${Date.now()}`,
        name: doctorName,
        bio: `Logged in via ${email}. Preparing for NEET PG 2026. Looking for focused partner revision.`,
        studyStreak: createDefaultStudyStreak(0, 0, false),
      };
      setCurrentUser(customLoggedInUser);
      setActivePartner(INITIAL_USER_FEMALE);
    }

    setAuthStatus('authenticated');
    setActiveTab('matches');
  };

  // Log Out Handler
  const handleLogout = () => {
    setAuthStatus('unauthenticated');
    setAuthView('home');
    setActiveTab('matches');
  };

  // Toggle user persona to test opposite gender matching from both male & female viewpoints
  const handleSwitchUserPersona = () => {
    if (currentUser.id === INITIAL_USER_MALE.id) {
      setCurrentUser(INITIAL_USER_FEMALE);
      setActivePartner(INITIAL_USER_MALE);
    } else {
      setCurrentUser(INITIAL_USER_MALE);
      setActivePartner(INITIAL_USER_FEMALE);
    }
  };

  const handleSelectPartner = (partner: MedicalProfile) => {
    setActivePartner(partner);
    setActiveTab('studyhub');
  };

  const handleStartDirectMessage = (partner: MedicalProfile) => {
    setActivePartner(partner);
    setActiveTab('messages');
  };

  const handleSendChallenge = (partner: MedicalProfile) => {
    setActivePartner(partner);
    setActiveTab('imagelab');
  };

  const handleShareMcqToHub = (mcqCase: any) => {
    setSharedAssets((prev) => [...prev, { type: 'mcq', payload: mcqCase }]);
    setActiveTab('studyhub');
  };

  const handleShareImageToHub = (imageObj: { title: string; imageUrl: string }) => {
    setSharedAssets((prev) => [...prev, { type: 'image', payload: imageObj }]);
    setActiveTab('studyhub');
  };

  const handleUpdateProfile = (updated: MedicalProfile) => {
    setCurrentUser(updated);
    setAllProfiles((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  // Notification Handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationAction = (notif: InAppNotification) => {
    if (
      notif.actionType === 'studyhub' ||
      notif.actionType === 'syllabus' ||
      notif.actionType === 'pomodoro'
    ) {
      setActiveTab('studyhub');
    } else if (notif.actionType === 'messages') {
      setActiveTab('messages');
    }
  };

  const handleTriggerNotification = (title: string, message: string, type: any) => {
    const newNotif: InAppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      fromUserId: activePartner.id,
      fromUserName: activePartner.name,
      fromUserAvatar: activePartner.avatarUrl,
      type: type || 'study_request',
      title,
      message,
      timestamp: 'Just now',
      read: false,
      actionType: 'studyhub',
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setToastNotification(newNotif);

    // Auto-dismiss toast after 6 seconds
    setTimeout(() => {
      setToastNotification((current) => (current?.id === newNotif.id ? null : current));
    }, 6000);
  };

  const handleSimulatePartnerAlert = (type: 'milestone' | 'request' | 'pomodoro' | 'youtube') => {
    if (type === 'milestone') {
      handleTriggerNotification(
        'New Syllabus Milestone Added 📚',
        `${activePartner.name} added "Shock & Hemodynamics Management" to the shared syllabus!`,
        'milestone_added'
      );
    } else if (type === 'request') {
      handleTriggerNotification(
        'Study Request: 50 MCQs Review 🩺',
        `${activePartner.name} sent a request: "Let's review 50 Marrow questions in ${activePartner.strongSubjects[0]}!"`,
        'study_request'
      );
    } else if (type === 'pomodoro') {
      handleTriggerNotification(
        'Pomodoro Sprint Invitation 🍅',
        `${activePartner.name} started a 25-minute Pomodoro focus block on ${currentUser.weakSubjects[0]}! Join now!`,
        'pomodoro_invite'
      );
    } else {
      handleTriggerNotification(
        'YouTube Lecture Shared 📹',
        `${activePartner.name} shared a high-yield medical lecture: "Dr. Najeeb Neuroanatomy"`,
        'lecture_shared'
      );
    }
  };

  // Matched opposite-gender candidates for direct messaging
  const matchedOppositePartners = allProfiles.filter((p) =>
    matchesGenderCriteria(currentUser, p)
  );

  // --------------------------------------------------------------------------
  // UI-LEVEL ROUTE PROTECTION:
  // If user is not authenticated, strictly show Home Page, Login Page, or Signup Page.
  // --------------------------------------------------------------------------
  if (authStatus === 'unauthenticated') {
    if (authView === 'login') {
      return (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onGoToSignup={() => setAuthView('signup')}
          onGoToHome={() => setAuthView('home')}
        />
      );
    }

    if (authView === 'signup') {
      return (
        <SignupPage
          onSignupSuccess={handleSignupSuccess}
          onGoToLogin={() => setAuthView('login')}
          onGoToHome={() => setAuthView('home')}
        />
      );
    }

    // Default unauthenticated view: Home Page
    return (
      <HomePage
        onGoToSignup={() => setAuthView('signup')}
        onGoToLogin={() => setAuthView('login')}
        featuredProfiles={allProfiles}
      />
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED DASHBOARD:
  // Visible exclusively to authenticated users with personalized data.
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#22D3EE] selection:text-[#020617] relative">
      {/* Top Navbar with Notification Center & Vibe Branding */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUserPersona}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onNotificationAction={handleNotificationAction}
        onSimulatePartnerAlert={handleSimulatePartnerAlert}
        onLogout={handleLogout}
        onGoToHome={() => {
          // Returning to home switches view or logs out safely
          setAuthStatus('unauthenticated');
          setAuthView('home');
        }}
      />

      {/* Floating In-App Toast Notification */}
      {toastNotification && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full bg-[#0F172A]/95 backdrop-blur-xl border border-[#22D3EE]/80 rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-fade-in text-xs">
          <img
            src={toastNotification.fromUserAvatar}
            alt={toastNotification.fromUserName}
            className="w-10 h-10 rounded-full object-cover border border-[#22D3EE] shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#F8FAFC] truncate">{toastNotification.title}</h4>
              <button
                onClick={() => setToastNotification(null)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[#94A3B8] mt-0.5 line-clamp-2 leading-relaxed">
              {toastNotification.message}
            </p>
            <button
              onClick={() => {
                handleNotificationAction(toastNotification);
                setToastNotification(null);
              }}
              className="mt-2 text-[#22D3EE] hover:text-[#67E8F9] font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Open in Study Room</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {activeTab === 'matches' && (
          <PartnerMatcher
            currentUser={currentUser}
            allProfiles={allProfiles}
            onSelectPartner={handleSelectPartner}
            onComparePartner={(partner) => setComparingPartner(partner)}
            onSendChallenge={handleSendChallenge}
            onStartDirectMessage={handleStartDirectMessage}
            onSwitchUser={handleSwitchUserPersona}
            onOpenProfileEditor={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'messages' && (
          <DirectMessaging
            currentUser={currentUser}
            matchedPartners={matchedOppositePartners}
            initialPartner={activePartner}
            onOpenImageLab={() => setActiveTab('imagelab')}
            onOpenMnemonicStudio={() => setActiveTab('mnemonic')}
          />
        )}

        {activeTab === 'imagelab' && (
          <ImageLab
            currentUser={currentUser}
            activePartner={activePartner}
            onShareToPartnerChat={handleShareMcqToHub}
          />
        )}

        {activeTab === 'mnemonic' && (
          <MnemonicStudio
            currentUser={currentUser}
            activePartner={activePartner}
            onShareToHub={handleShareImageToHub}
          />
        )}

        {activeTab === 'studyhub' && (
          <StudyHub
            currentUser={currentUser}
            activePartner={activePartner}
            sharedAssets={sharedAssets}
            onOpenImageLab={() => setActiveTab('imagelab')}
            onOpenMnemonicStudio={() => setActiveTab('mnemonic')}
            onTriggerNotification={handleTriggerNotification}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileEditor
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Persistent Docked Messages Bar (with YouTube Lecture Embedding) */}
      {activeTab !== 'messages' && (
        <MessagesBar
          currentUser={currentUser}
          activePartner={activePartner}
          onOpenFullChat={() => setActiveTab('messages')}
          onLaunchCall={(_type) => {
            setActiveTab('messages');
          }}
          onSendNotification={handleTriggerNotification}
        />
      )}

      {/* Subject Comparison Modal */}
      {comparingPartner && (
        <SubjectCompareModal
          currentUser={currentUser}
          partner={comparingPartner}
          onClose={() => setComparingPartner(null)}
          onConnect={() => {
            handleSelectPartner(comparingPartner);
            setComparingPartner(null);
          }}
        />
      )}

      {/* Safety & Community Standards Modal */}
      {isSafetyModalOpen && (
        <SafetyModal onClose={() => setIsSafetyModalOpen(false)} />
      )}

      {/* Footer */}
      <footer className="border-t border-[#1E293B] bg-[#0F172A]/70 py-6 px-4 text-center text-xs text-[#94A3B8]">
        <p className="font-medium text-[#F8FAFC]/80">
          Vibe &bull; Academic Opposite-Gender Study Partner Engine &bull; Let&apos;s Vibe Together.
        </p>
        <p className="mt-1 text-[11px] text-[#94A3B8]">
          Target Exams: NEET PG 2026, INICET 2026, FMGE 2026 &bull; Prioritized Matching by Complementary Subject Synergy
        </p>
      </footer>
    </div>
  );
}
