"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchReminderSettings,
  updateReminderSettings,
  clearError,
} from "../store/slices/leetcodeSlice";
import styles from "./EmailReminderSettings.module.css";

export default function EmailReminderSettings() {
  const [isReminderEnabled, setIsReminderEnabled] = useState(true);
  const [reminderTimes, setReminderTimes] = useState<string[]>(["21:00"]);
  const [newTime, setNewTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { streakData, emailReminders, isLoading, error } = useAppSelector(
    (state) => state.leetcode,
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchReminderSettings());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (streakData) {
      setIsReminderEnabled(streakData.isReminderEnabled);
    }
  }, [streakData]);

  useEffect(() => {
    if (emailReminders.length > 0) {
      setReminderTimes(emailReminders.map((reminder) => reminder.time));
    }
  }, [emailReminders]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await dispatch(
        updateReminderSettings({
          isReminderEnabled,
          reminderTimes,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Failed to update reminder settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addReminderTime = () => {
    if (newTime && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newTime)) {
      if (!reminderTimes.includes(newTime)) {
        setReminderTimes([...reminderTimes, newTime].sort());
        setNewTime("");
      }
    }
  };

  const removeReminderTime = (timeToRemove: string) => {
    setReminderTimes(reminderTimes.filter((time) => time !== timeToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addReminderTime();
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading && !streakData) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading reminder settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Email Reminder Settings</h3>
        <div className={styles.toggle}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isReminderEnabled}
              onChange={(e) => setIsReminderEnabled(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
          <span className={styles.toggleLabel}>
            {isReminderEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      {isReminderEnabled && (
        <>
          <p className={styles.description}>
            Set multiple reminder times to receive email notifications when you
            haven't solved a LeetCode problem today.
          </p>

          <div className={styles.reminderTimes}>
            <h4 className={styles.sectionTitle}>Reminder Times</h4>

            <div className={styles.timeList}>
              {reminderTimes.map((time, index) => (
                <div key={index} className={styles.timeItem}>
                  <span className={styles.timeDisplay}>{formatTime(time)}</span>
                  <button
                    onClick={() => removeReminderTime(time)}
                    className={styles.removeButton}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.addTime}>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.timeInput}
                placeholder="HH:MM"
              />
              <button
                onClick={addReminderTime}
                disabled={!newTime || reminderTimes.includes(newTime)}
                className={styles.addButton}
                type="button"
              >
                Add Time
              </button>
            </div>

            {reminderTimes.length === 0 && (
              <p className={styles.noTimes}>
                No reminder times set. Add at least one time to receive
                reminders.
              </p>
            )}
          </div>

          {error && (
            <div className={styles.error}>
              {error}
              <button
                type="button"
                onClick={() => dispatch(clearError())}
                className={styles.clearError}
              >
                ✕
              </button>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={
              isSaving || !isReminderEnabled || reminderTimes.length === 0
            }
            className={styles.saveButton}
          >
            {isSaving ? (
              <>
                <div className={styles.spinner}></div>
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </button>
        </>
      )}

      {!isReminderEnabled && (
        <div className={styles.disabledMessage}>
          <p>
            Email reminders are currently disabled. Enable them above to set
            reminder times.
          </p>
        </div>
      )}

      <div className={styles.help}>
        <h4>How it works:</h4>
        <ul>
          <li>We check your LeetCode submissions daily</li>
          <li>
            If you haven't solved a problem by your reminder time, you'll
            receive an email
          </li>
          <li>You can set multiple reminder times throughout the day</li>
          <li>
            Reminders are only sent if you haven't solved any problem that day
          </li>
        </ul>
      </div>
    </div>
  );
}
