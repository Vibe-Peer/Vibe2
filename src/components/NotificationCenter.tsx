import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  BookOpen,
  HeartHandshake,
  Timer,
  Youtube,
  Flame,
  X,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { InAppNotification } from '../utils/notificationSystem.ts';

interface NotificationCenterProps {
  notifications: InAppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onActionClick: (notification: InAppNotification) => void;
  onSimulatePartnerAlert?: (type: 'milestone' | 'request' | 'pomodoro' | 'youtube') => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onActionClick,
  onSimulatePartnerAlert,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getIcon = (type: InAppNotification['type']) => {
    switch (type) {
      case 'milestone_added':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'study_request':
        return <HeartHandshake className="w-4 h-4 text-rose-400" />;
      case 'pomodoro_invite':
        return <Timer className="w-4 h-4 text-amber-400" />;
      case 'lecture_shared':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'streak_alert':
        return <Flame className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
        aria-label="Open notifications"
        title="In-App Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 shadow-2xl z-50 overflow-hidden text-slate-100 animate-fade-in">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Partner Alerts</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs & Simulation Shortcuts */}
          <div className="px-3 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  filter === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {onSimulatePartnerAlert && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSimulatePartnerAlert('milestone')}
                  className="text-[10px] bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/80 transition cursor-pointer"
                  title="Simulate partner adding a new syllabus milestone"
                >
                  + Milestone
                </button>
                <button
                  onClick={() => onSimulatePartnerAlert('request')}
                  className="text-[10px] bg-rose-950/80 hover:bg-rose-900 text-rose-300 px-2 py-0.5 rounded border border-rose-800/80 transition cursor-pointer"
                  title="Simulate partner sending a study request"
                >
                  + Request
                </button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs">No notifications right now.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  You'll be alerted when your study partner logs milestones or invites you to study!
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read) onMarkAsRead(notif.id);
                    onActionClick(notif);
                    setIsOpen(false);
                  }}
                  className={`p-3.5 hover:bg-slate-800/60 transition cursor-pointer flex gap-3 items-start ${
                    !notif.read ? 'bg-emerald-950/20' : ''
                  }`}
                >
                  {/* Avatar / Icon */}
                  <div className="relative shrink-0">
                    <img
                      src={notif.fromUserAvatar}
                      alt={notif.fromUserName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900 border border-slate-800">
                      {getIcon(notif.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-white truncate">{notif.title}</h4>
                      <span className="text-[10px] text-slate-500 shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                        <span>Take Action</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
