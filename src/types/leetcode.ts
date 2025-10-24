export interface LeetCodeUser {
  username: string;
  submitStats: {
    acSubmissionNum: Array<{
      difficulty: string;
      count: number;
      submissions: number;
    }>;
  };
}

export interface LeetCodeSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

export interface LeetCodeProfile {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  ranking: number;
  reputation: number;
}

export interface LeetCodeRecentSubmission {
  id: string;
  userId: string;
  problemId: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  status: string;
  language: string;
  submittedAt: Date;
  createdAt: Date;
}

export interface EmailReminder {
  id: string;
  userId: string;
  time: string; // HH:MM format
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StreakData {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastSolvedDate: Date | null;
  isReminderEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  emailReminders: EmailReminder[];
}
