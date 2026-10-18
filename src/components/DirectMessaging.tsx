import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Video,
  PhoneOff,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Share2,
  Send,
  Sparkles,
  Timer,
  FileText,
  CheckCircle2,
  BrainCircuit,
  MessageSquare,
  Search,
  Maximize2,
  Minimize2,
  Paperclip,
  Check,
  CheckCheck,
  HelpCircle,
  Youtube,
} from 'lucide-react';
import { MedicalProfile } from '../utils/partnerMatching.ts';
import { extractYouTubeId } from './MessagesBar.tsx';

interface DirectMessagingProps {
  currentUser: MedicalProfile;
  matchedPartners: MedicalProfile[];
  initialPartner?: MedicalProfile;
  onOpenImageLab: () => void;
  onOpenMnemonicStudio: () => void;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
  attachmentType?: 'ibq' | 'mnemonic' | 'pomodoro';
  attachmentData?: any;
}

export const DirectMessaging: React.FC<DirectMessagingProps> = ({
  currentUser,
  matchedPartners,
  initialPartner,
  onOpenImageLab,
  onOpenMnemonicStudio,
}) => {
  const [selectedPartner, setSelectedPartner] = useState<MedicalProfile>(
    initialPartner || matchedPartners[0]
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');

  // Call states
  const [callType, setCallType] = useState<'none' | 'audio' | 'video'>('none');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [callNotes, setCallNotes] = useState<string>('');
  const [showCallNotes, setShowCallNotes] = useState<boolean>(false);

  // Chat conversation history per partner (clean start without dummy messages)
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistories, selectedPartner.id]);

  // Call timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (callType !== 'none') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callType]);

  const currentMessages = chatHistories[selectedPartner.id] || [];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    setChatHistories((prev) => ({
      ...prev,
      [selectedPartner.id]: [...(prev[selectedPartner.id] || []), newMsg],
    }));

    const textToSend = inputText;
    setInputText('');

    // Simulate smart medical peer reply
    setTimeout(() => {
      const partnerReplies = [
        `Totally agree! For ${selectedPartner.targetPgBranch}, this is considered a classical high-yield point.`,
        `Nice question! Let's quiz each other on this during our call.`,
        `Checked off my daily 50 MCQs. How is your revision going in ${currentUser.weakSubjects[0] || 'Pathology'}?`,
        `Good catch! Let me know if you want to hop on audio or video to do a rapid-fire review.`,
      ];
      const randomReply = partnerReplies[Math.floor(Math.random() * partnerReplies.length)];

      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedPartner.id,
        senderName: selectedPartner.name,
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };

      setChatHistories((prev) => ({
        ...prev,
        [selectedPartner.id]: [...(prev[selectedPartner.id] || []), replyMsg],
      }));
    }, 1200);
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setIsMicMuted(false);
    setIsCameraOff(false);
    setIsScreenSharing(false);
  };

  const handleEndCall = () => {
    const durationFormatted = formatSeconds(callDuration);
    setCallType('none');

    // Post call summary message to the thread
    const callSummaryMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: `📞 Study Call Ended • Duration: ${durationFormatted}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    };

    setChatHistories((prev) => ({
      ...prev,
      [selectedPartner.id]: [...(prev[selectedPartner.id] || []), callSummaryMsg],
    }));
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredPartners = matchedPartners.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.targetPgBranch.toLowerCase().includes(q) ||
      p.targetExam.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Container Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[720px] relative">
        {/* Left Column: Matched Study Partners List (1/3 width) */}
        <div className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-900/60 shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Study Partner Chats
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Vibing Partners Active
              </span>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search matched partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Partners List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
            {filteredPartners.map((partner) => {
              const isSelected = partner.id === selectedPartner.id;
              const lastMsg =
                chatHistories[partner.id]?.[chatHistories[partner.id].length - 1]?.text ||
                'Tap to coordinate study session...';

              return (
                <button
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className={`w-full p-3.5 flex items-start gap-3 text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/20 border-l-4 border-emerald-500'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={partner.avatarUrl}
                      alt={partner.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-700"
                    />
                    {partner.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-100 truncate">
                        {partner.name}
                      </h4>
                      <span className="text-[10px] text-emerald-400 font-semibold shrink-0">
                        {partner.targetExam.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-cyan-400 font-medium truncate">
                      🩺 {partner.targetPgBranch}
                    </p>

                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{lastMsg}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Direct Messaging & Calling View (2/3 width) */}
        <div className="flex-1 flex flex-col bg-slate-950/60 overflow-hidden relative">
          {/* Active Chat Header */}
          <div className="p-3.5 px-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={selectedPartner.avatarUrl}
                  alt={selectedPartner.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
                />
                {selectedPartner.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{selectedPartner.name}</h3>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300">
                    {selectedPartner.gender === 'female' ? '♀ Female' : '♂ Male'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  🩺 {selectedPartner.targetPgBranch} • {selectedPartner.college.split(',')[0]} •{' '}
                  <span className="text-emerald-400 font-semibold">
                    {selectedPartner.targetExam.replace('_', ' ')}
                  </span>
                </p>
              </div>
            </div>

            {/* Direct Calling Buttons: Audio Call & Video Call */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStartCall('audio')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 hover:border-emerald-500 transition cursor-pointer shadow-sm"
                title="Start Audio Call"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 hover:text-white" />
                <span className="hidden sm:inline">Voice Call</span>
              </button>

              <button
                onClick={() => handleStartCall('video')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                title="Start Video Call"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Call</span>
              </button>
            </div>
          </div>

          {/* Academic Profile & Interests Banner in Thread */}
          <div className="bg-slate-900/60 px-5 py-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              <span className="font-semibold text-slate-300 shrink-0">Interests:</span>
              {selectedPartner.academicInterests.slice(0, 3).map((interest, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 shrink-0 border border-slate-700/60"
                >
                  {interest}
                </span>
              ))}
            </div>
            <span className="text-emerald-400 font-medium shrink-0 ml-2 hidden sm:inline">
              Daily Goal: {selectedPartner.dailyTargetMCQs} MCQs
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {currentMessages.length === 0 ? (
              <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 text-cyan-400 flex items-center justify-center mb-3 shadow-md">
                  <MessageSquare className="w-6 h-6 text-cyan-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">
                  No messages yet with {selectedPartner.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Start collaborating! Discuss high-yield questions, schedule a Pomodoro sprint, or share a clinical case.
                </p>
              </div>
            ) : (
              currentMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 px-1">
                    <span>{isMe ? 'You' : msg.senderName.split(' ')[1]}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>

                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>

                    {/* YouTube Video Lecture Embedded Player */}
                    {(() => {
                      const ytId = extractYouTubeId(msg.text);
                      if (!ytId) return null;
                      return (
                        <div className="mt-2 rounded-xl overflow-hidden border border-slate-700/80 shadow-lg bg-black">
                          <iframe
                            className="w-full aspect-video"
                            src={`https://www.youtube.com/embed/${ytId}`}
                            title="Medical Lecture Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      );
                    })()}

                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-75">
                      {isMe && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3 h-3 text-cyan-200" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Study Prompt Chips */}
          <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-500 font-semibold shrink-0">Quick Study:</span>
            {[
              'Let’s start a 25-minute Pomodoro sprint!',
              'Can we review Sunday’s Grand Test (GT)?',
              'Check this high-yield IBQ clinical slide',
              'Ready for 20 rapid-fire Pharma MCQs?',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(chip)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 border border-slate-700/80 transition cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={onOpenImageLab}
              className="p-2 text-cyan-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Attach Clinical IBQ from Image Lab"
            >
              <BrainCircuit className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenMnemonicStudio}
              className="p-2 text-purple-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Attach Mnemonic from Studio"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setInputText('https://www.youtube.com/watch?v=k1t6FqQ2y3I')}
              className="p-2 text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Share High-Yield YouTube Medical Lecture"
            >
              <Youtube className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={`Message ${selectedPartner.name.split(' ')[1]} or paste YouTube lecture link...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl transition cursor-pointer shadow-md shadow-emerald-600/20"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* ========================================================= */}
          {/* AUDIO CALL OVERLAY */}
          {/* ========================================================= */}
          {callType === 'audio' && (
            <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-6 animate-fade-in">
              {/* Call Top Header */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-white">Vibing Peer Encrypted Voice Lounge</span>
                </div>
                <div className="font-mono text-sm font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                  {formatSeconds(callDuration)}
                </div>
              </div>

              {/* Call Center: Partner info & Audio pulse */}
              <div className="text-center space-y-4 my-auto">
                <div className="relative inline-block">
                  <img
                    src={selectedPartner.avatarUrl}
                    alt={selectedPartner.name}
                    className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-emerald-500 shadow-2xl shadow-emerald-500/20"
                  />
                  {/* Waveform Pulse ring */}
                  <div className="absolute -inset-2 rounded-full border-2 border-emerald-400/40 animate-pulse pointer-events-none" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white">{selectedPartner.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    🩺 {selectedPartner.targetPgBranch} • {selectedPartner.college}
                  </p>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    Targeting {selectedPartner.targetExam.replace('_', ' ')} • Audio Study Stream Active
                  </p>
                </div>

                {/* Animated Voice Visualizer Bars */}
                <div className="flex items-center justify-center gap-1.5 h-8">
                  {[24, 40, 16, 48, 32, 54, 20, 44, 30, 52, 18, 36].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${isMicMuted ? 4 : h}px` }}
                      className="w-1.5 bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-full transition-all duration-300"
                    />
                  ))}
                </div>
              </div>

              {/* Call Bottom Controls */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-4">
                  {/* Mute Mic */}
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`p-3.5 rounded-full border transition cursor-pointer ${
                      isMicMuted
                        ? 'bg-red-600/20 border-red-500 text-red-400'
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    }`}
                    title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                  >
                    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  {/* Speaker Mute */}
                  <button
                    onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                    className={`p-3.5 rounded-full border transition cursor-pointer ${
                      isSpeakerMuted
                        ? 'bg-red-600/20 border-red-500 text-red-400'
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    }`}
                    title="Toggle Speaker"
                  >
                    {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  {/* Switch to Video */}
                  <button
                    onClick={() => setCallType('video')}
                    className="p-3.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition cursor-pointer"
                    title="Switch to Video Call"
                  >
                    <Video className="w-5 h-5 text-cyan-400" />
                  </button>

                  {/* Hang Up */}
                  <button
                    onClick={handleEndCall}
                    className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/30 transition cursor-pointer"
                    title="End Call"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIDEO CALL OVERLAY */}
          {/* ========================================================= */}
          {callType === 'video' && (
            <div className="absolute inset-0 z-30 bg-slate-950 flex flex-col justify-between p-4 animate-fade-in">
              {/* Video Call Header */}
              <div className="flex items-center justify-between text-xs text-slate-200 z-10 bg-slate-900/80 px-4 py-2 rounded-xl backdrop-blur border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold">
                    Studying with {selectedPartner.name} • 🩺 {selectedPartner.targetPgBranch}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                    {formatSeconds(callDuration)}
                  </span>
                  <button
                    onClick={() => setShowCallNotes(!showCallNotes)}
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition"
                    title="Toggle Call Notes"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Video View Area */}
              <div className="relative flex-1 rounded-2xl overflow-hidden my-3 border border-slate-800 bg-slate-900 flex items-center justify-center">
                {isScreenSharing ? (
                  // Shared Slide / Diagnostic Screen View
                  <div className="w-full h-full bg-slate-950 p-6 flex flex-col items-center justify-center text-center space-y-3">
                    <BrainCircuit className="w-16 h-16 text-cyan-400 animate-pulse" />
                    <h3 className="text-base font-bold text-white">
                      Screen Sharing: High-Yield Clinical Case Review
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md">
                      Displaying active ECG &amp; Histology review slides for {currentUser.targetExam.replace('_', ' ')}.
                    </p>
                  </div>
                ) : (
                  // Partner video feed
                  <div className="relative w-full h-full">
                    <img
                      src={selectedPartner.avatarUrl}
                      alt={selectedPartner.name}
                      className="w-full h-full object-cover filter brightness-95"
                    />
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 px-3 py-1 rounded-lg text-xs font-semibold text-white border border-slate-700 flex items-center gap-2">
                      <span>{selectedPartner.name}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        (🩺 {selectedPartner.targetPgBranch})
                      </span>
                    </div>
                  </div>
                )}

                {/* Picture in Picture: User local camera */}
                <div className="absolute top-4 right-4 w-32 h-24 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-950">
                  {isCameraOff ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-slate-400 bg-slate-900">
                      <VideoOff className="w-5 h-5 mb-1" />
                      Camera Off
                    </div>
                  ) : (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-1 right-1 text-[9px] bg-slate-900/80 text-slate-200 px-1 rounded">
                    You
                  </span>
                </div>

                {/* Side Notes Drawer if opened */}
                {showCallNotes && (
                  <div className="absolute inset-y-0 right-0 w-72 bg-slate-900/95 border-l border-slate-800 p-4 flex flex-col shadow-2xl animate-fade-in z-20">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <h4 className="text-xs font-bold text-white">Live High-Yield Notes</h4>
                      <button
                        onClick={() => setShowCallNotes(false)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <textarea
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      placeholder="Jot down key points discussed during the session..."
                      className="flex-1 mt-3 p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Video Call Controls Toolbar */}
              <div className="flex items-center justify-center gap-3 z-10 bg-slate-900/90 py-3 px-6 rounded-2xl border border-slate-800 max-w-md mx-auto">
                <button
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`p-3 rounded-full border transition cursor-pointer ${
                    isMicMuted
                      ? 'bg-red-600/20 border-red-500 text-red-400'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  }`}
                  title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsCameraOff(!isCameraOff)}
                  className={`p-3 rounded-full border transition cursor-pointer ${
                    isCameraOff
                      ? 'bg-red-600/20 border-red-500 text-red-400'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  }`}
                  title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isCameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3 rounded-full border transition cursor-pointer ${
                    isScreenSharing
                      ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  }`}
                  title="Share Clinical Slides"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={handleEndCall}
                  className="p-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/30 transition cursor-pointer"
                  title="End Video Call"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
