import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Youtube,
  Video,
  Phone,
  Paperclip,
  X,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ExternalLink,
  BookOpen,
  Timer,
  CheckCheck,
} from 'lucide-react';
import { MedicalProfile } from '../utils/partnerMatching.ts';

interface MessagesBarProps {
  currentUser: MedicalProfile;
  activePartner: MedicalProfile;
  onOpenFullChat: () => void;
  onLaunchCall?: (type: 'audio' | 'video') => void;
  onSendNotification?: (title: string, message: string, type: any) => void;
}

interface QuickMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  youtubeUrl?: string;
  youtubeId?: string;
}

// Helper to extract YouTube video ID
export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const SUGGESTED_LECTURES = [
  {
    title: 'High-Yield ECG & Arrhythmias',
    url: 'https://www.youtube.com/watch?v=k1t6FqQ2y3I',
    tag: 'Medicine / Cardiology',
  },
  {
    title: 'Cranial Nerves & Cavernous Sinus Anatomy',
    url: 'https://www.youtube.com/watch?v=FjKxR32eJ7k',
    tag: 'Anatomy / Surgery',
  },
  {
    title: 'Acid-Base Disorders & Blood Gas Analysis',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tag: 'Physiology / ICU',
  },
  {
    title: 'Robbins Pathology: Hemodynamics & Shock',
    url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    tag: 'Pathology High-Yield',
  },
];

export const MessagesBar: React.FC<MessagesBarProps> = ({
  currentUser,
  activePartner,
  onOpenFullChat,
  onLaunchCall,
  onSendNotification,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [youtubeInput, setYoutubeInput] = useState<string>('');
  const [showYoutubeDrawer, setShowYoutubeDrawer] = useState<boolean>(false);

  const [messages, setMessages] = useState<QuickMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Check if input text contains a YouTube URL
    const detectedYtId = extractYouTubeId(inputText);

    const newMsg: QuickMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      youtubeUrl: detectedYtId ? inputText.trim() : undefined,
      youtubeId: detectedYtId || undefined,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    if (onSendNotification && detectedYtId) {
      onSendNotification(
        'YouTube Lecture Shared',
        `${currentUser.name} shared a medical lecture video with you!`,
        'lecture_shared'
      );
    }
  };

  const handleShareSuggestedLecture = (lecture: (typeof SUGGESTED_LECTURES)[0]) => {
    const ytid = extractYouTubeId(lecture.url);
    const newMsg: QuickMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: `Let's watch this together: "${lecture.title}" (${lecture.tag})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      youtubeUrl: lecture.url,
      youtubeId: ytid || undefined,
    };
    setMessages((prev) => [...prev, newMsg]);
    setShowYoutubeDrawer(false);

    if (onSendNotification) {
      onSendNotification(
        'YouTube Lecture Shared',
        `${currentUser.name} shared: "${lecture.title}"`,
        'lecture_shared'
      );
    }
  };

  return (
    <div className="fixed bottom-0 right-4 sm:right-8 z-40 w-full max-w-md shadow-2xl transition-all duration-300">
      {/* Top Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950/90 border-t border-x border-slate-700/80 rounded-t-2xl px-4 py-2.5 flex items-center justify-between cursor-pointer shadow-lg backdrop-blur-md select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={activePartner.avatarUrl}
              alt={activePartner.name}
              className="w-8 h-8 rounded-full object-cover border border-emerald-500"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900"></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white truncate">{activePartner.name}</h4>
              <span className="text-[10px] text-emerald-400 font-semibold">• Online</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {activePartner.targetPgBranch.split(' ')[0]} • Tap to chat &amp; share lectures
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenFullChat();
            }}
            className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-750 transition cursor-pointer"
            title="Open Full Screen Chat & Video Calls"
          >
            Full View
          </button>
          <div className="p-1 text-slate-400 hover:text-white">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expandable Chat Body */}
      {isExpanded && (
        <div className="bg-slate-900/98 backdrop-blur-xl border-x border-b border-slate-700 rounded-b-none p-3 shadow-2xl flex flex-col h-96">
          {/* Quick Shortcuts: Call Buttons & YouTube Picker */}
          <div className="flex items-center justify-between gap-1 pb-2 border-b border-slate-800 text-xs">
            <button
              onClick={() => setShowYoutubeDrawer(!showYoutubeDrawer)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 font-bold transition cursor-pointer text-[11px]"
            >
              <Youtube className="w-3.5 h-3.5 text-red-400" />
              <span>Share YouTube Lecture</span>
            </button>

            <div className="flex items-center gap-1">
              {onLaunchCall && (
                <>
                  <button
                    onClick={() => onLaunchCall('audio')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Start Voice Call"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                  <button
                    onClick={() => onLaunchCall('video')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Start Video Study Room"
                  >
                    <Video className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Suggested YouTube Lectures Drawer */}
          {showYoutubeDrawer && (
            <div className="my-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-fade-in text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">High-Yield Medical Lectures:</span>
                <button
                  onClick={() => setShowYoutubeDrawer(false)}
                  className="text-slate-400 hover:text-white text-[11px]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {SUGGESTED_LECTURES.map((lec) => (
                  <button
                    key={lec.title}
                    onClick={() => handleShareSuggestedLecture(lec)}
                    className="w-full text-left p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between transition cursor-pointer group"
                  >
                    <div className="truncate mr-2">
                      <p className="font-semibold text-slate-200 truncate group-hover:text-red-400 text-[11px]">
                        {lec.title}
                      </p>
                      <span className="text-[10px] text-slate-500">{lec.tag}</span>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold text-red-400 bg-red-950 px-1.5 py-0.5 rounded border border-red-900">
                      Send
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-2.5 py-2 pr-1">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500">
                <MessageSquare className="w-6 h-6 mb-1.5 text-slate-600" />
                <p className="text-xs font-semibold text-slate-400">No messages in this lounge yet.</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Send a message or share a lecture below to start collaborating!</p>
              </div>
            ) : (
              messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/80 shadow-md'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* YouTube Embedded Player / Preview */}
                    {msg.youtubeId && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-slate-700/80 shadow-lg bg-black">
                        <iframe
                          className="w-full aspect-video"
                          src={`https://www.youtube.com/embed/${msg.youtubeId}`}
                          title="Medical Lecture Video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    <div
                      className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                        isMe ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form with YouTube URL Detection */}
          <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-800 flex gap-1.5">
            <input
              type="text"
              placeholder="Message or paste YouTube lecture link..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
