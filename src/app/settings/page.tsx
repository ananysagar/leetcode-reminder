"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import LeetCodeConnection from "../../components/LeetCodeConnection";
import EmailReminderSettings from "../../components/EmailReminderSettings";
import styles from "./page.module.css";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Header />
        <div className={styles.main}>
          <Sidebar />
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>Settings</h1>
              <p className={styles.subtitle}>
                Manage your LeetCode account and email reminders
              </p>
            </div>

            <div className={styles.settingsContent}>
              <LeetCodeConnection />
              <EmailReminderSettings />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
