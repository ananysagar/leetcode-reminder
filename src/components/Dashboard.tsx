"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchUserStats } from "../store/slices/leetcodeSlice";
import Header from "./Header";
import Sidebar from "./Sidebar";
import LeetCodeDashboard from "./LeetCodeDashboard";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { userStats } = useAppSelector((state) => state.leetcode);

  useEffect(() => {
    if (user?.leetcodeUsername) {
      dispatch(fetchUserStats());
    }
  }, [dispatch, user?.leetcodeUsername]);

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
              <h3>Max Streak</h3>
              <p className={styles.statValue}>
                {userStats?.streak ?? 0} days
              </p>
            </div>
            <div className={styles.statCard}>
              <h3>Total Active Days</h3>
              <p className={styles.statValue}>
                {userStats?.totalActiveDays ?? 0} days
              </p>
            </div>
            <div className={styles.statCard}>
              <h3>Study Sheets</h3>
              <p className={styles.statValue}>0 active</p>
            </div>
          </div>

          <LeetCodeDashboard />

          <div className={styles.quickActions}>
            <h2>Quick Actions</h2>
            <div className={styles.actionGrid}>
              <Link href="/settings" className={styles.actionButton}>
                <span>⚙️</span>
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
