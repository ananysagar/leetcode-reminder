import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  LeetCodeProfile,
  LeetCodeSubmission,
  EmailReminder,
  StreakData,
  LeetCodeUserStats,
} from "../../types/leetcode";

interface LeetCodeState {
  profile: LeetCodeProfile | null;
  recentSubmissions: LeetCodeSubmission[];
  todaySubmissions: LeetCodeSubmission[];
  hasSolvedToday: boolean;
  streakData: StreakData | null;
  emailReminders: EmailReminder[];
  userStats: LeetCodeUserStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LeetCodeState = {
  profile: null,
  recentSubmissions: [],
  todaySubmissions: [],
  hasSolvedToday: false,
  streakData: null,
  emailReminders: [],
  userStats: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const connectLeetCode = createAsyncThunk(
  "leetcode/connect",
  async (leetcodeUsername: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/leetcode/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ leetcodeUsername }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to connect LeetCode account");
    }

    return response.json();
  },
);

export const fetchLeetCodeProfile = createAsyncThunk(
  "leetcode/fetchProfile",
  async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/leetcode/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch profile");
    }

    return response.json();
  },
);

export const fetchRecentSubmissions = createAsyncThunk(
  "leetcode/fetchSubmissions",
  async (limit: number = 50) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/leetcode/submissions?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch submissions");
    }

    return response.json();
  },
);

export const checkTodaySubmissions = createAsyncThunk(
  "leetcode/checkToday",
  async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/leetcode/check-today", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to check today submissions");
    }

    return response.json();
  },
);

export const fetchReminderSettings = createAsyncThunk(
  "leetcode/fetchReminderSettings",
  async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/reminders/settings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch reminder settings");
    }

    return response.json();
  },
);

export const updateReminderSettings = createAsyncThunk(
  "leetcode/updateReminderSettings",
  async (settings: {
    isReminderEnabled?: boolean;
    reminderTimes?: string[];
  }) => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/reminders/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update reminder settings");
    }

    return response.json();
  },
);

export const fetchUserStats = createAsyncThunk(
  "leetcode/fetchUserStats",
  async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/leetcode/user-stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user stats");
    }

    return response.json();
  },
);

const leetcodeSlice = createSlice({
  name: "leetcode",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLeetCodeData: (state) => {
      state.profile = null;
      state.recentSubmissions = [];
      state.todaySubmissions = [];
      state.hasSolvedToday = false;
      state.streakData = null;
      state.emailReminders = [];
      state.userStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Connect LeetCode
      .addCase(connectLeetCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(connectLeetCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.profile;
      })
      .addCase(connectLeetCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Failed to connect LeetCode account";
      })
      // Fetch Profile
      .addCase(fetchLeetCodeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeetCodeProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.profile;
      })
      .addCase(fetchLeetCodeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch profile";
      })
      // Fetch Submissions
      .addCase(fetchRecentSubmissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentSubmissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentSubmissions = action.payload.submissions;
      })
      .addCase(fetchRecentSubmissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch submissions";
      })
      // Check Today
      .addCase(checkTodaySubmissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkTodaySubmissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasSolvedToday = action.payload.hasSolvedToday;
        state.todaySubmissions = action.payload.todaySubmissions;
      })
      .addCase(checkTodaySubmissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Failed to check today submissions";
      })
      // Fetch Reminder Settings
      .addCase(fetchReminderSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReminderSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.streakData = action.payload.streakData;
        state.emailReminders = action.payload.emailReminders;
      })
      .addCase(fetchReminderSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Failed to fetch reminder settings";
      })
      // Update Reminder Settings
      .addCase(updateReminderSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateReminderSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.streakData = action.payload.streakData;
        state.emailReminders = action.payload.streakData.emailReminders;
      })
      .addCase(updateReminderSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Failed to update reminder settings";
      })
      // Fetch User Stats
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userStats = action.payload.userStats;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch user stats";
      });
  },
});

export const { clearError, clearLeetCodeData } = leetcodeSlice.actions;
export default leetcodeSlice.reducer;
