export interface InAppNotification {
  id: string;
  userId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  type: 'milestone_added' | 'study_request' | 'pomodoro_invite' | 'lecture_shared' | 'streak_alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionType?: 'studyhub' | 'messages' | 'syllabus' | 'pomodoro';
  actionPayload?: any;
}

// Clean initial notifications: no pre-seeded dummy notifications
export const INITIAL_NOTIFICATIONS: InAppNotification[] = [];
