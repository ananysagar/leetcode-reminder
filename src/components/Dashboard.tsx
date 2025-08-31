'use client';

import { useAppSelector } from '../hooks/redux';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <Sidebar />
        <div className={styles.content}>
          <div className={styles.welcome}>
            <h1 className={styles.title}>Welcome back, {user?.username}!</h1>
            <p className={styles.subtitle}>
              Ready to continue your LeetCode journey?
            </p>
          </div>
          
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <h3>Current Streak</h3>
              <p className={styles.statValue}>0 days</p>
            </div>
            <div className={styles.statCard}>
              <h3>Problems Solved</h3>
              <p className={styles.statValue}>0</p>
            </div>
            <div className={styles.statCard}>
              <h3>Study Sheets</h3>
              <p className={styles.statValue}>0 active</p>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h2>Quick Actions</h2>
            <div className={styles.actionGrid}>
              <button className={styles.actionButton}>
                <span>🎯</span>
                <span>Start Timer</span>
              </button>
              <button className={styles.actionButton}>
                <span>📚</span>
                <span>View Sheets</span>
              </button>
              <button className={styles.actionButton}>
                <span>📊</span>
                <span>Analytics</span>
              </button>
              <button className={styles.actionButton}>
                <span>⚙️</span>
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 