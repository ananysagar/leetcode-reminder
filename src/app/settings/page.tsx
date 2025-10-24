"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import LeetCodeConnection from "../../components/LeetCodeConnection";
import EmailReminderSettings from "../../components/EmailReminderSettings";
import styles from "./page.module.css";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>
            Manage your LeetCode account and email reminders
          </p>
        </div>

        <div className={styles.content}>
          <LeetCodeConnection />
          <EmailReminderSettings />
        </div>
      </div>
    </ProtectedRoute>
  );
}
