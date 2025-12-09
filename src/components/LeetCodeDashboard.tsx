"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchLeetCodeProfile,
  checkTodaySubmissions,
  fetchRecentSubmissions,
} from "../store/slices/leetcodeSlice";
import styles from "./LeetCodeDashboard.module.css";

export default function LeetCodeDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    profile,
    hasSolvedToday,
    todaySubmissions,
    recentSubmissions,
    isLoading,
  } = useAppSelector((state) => state.leetcode);

  useEffect(() => {
    if (user?.leetcodeUsername) {
      dispatch(fetchLeetCodeProfile());
      dispatch(checkTodaySubmissions());
      dispatch(fetchRecentSubmissions(10));
    }
  }, [dispatch, user?.leetcodeUsername]);

  if (!user?.leetcodeUsername) {
    return (
      <div className={styles.container}>
        <div className={styles.notConnected}>
          <h3>LeetCode Account Not Connected</h3>
          <p>
            Connect your LeetCode account to track your progress and see your
            daily activity.
          </p>
          <Link href="/settings" className={styles.connectLink}>
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading LeetCode data...</p>
        </div>
      </div>
    );
  }

  const todaySolvedCount = todaySubmissions.filter(
    (s) => s.statusDisplay === "Accepted",
  ).length;
  const todayTotalCount = todaySubmissions.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>LeetCode Progress</h3>
        <div className={styles.status}>
          {hasSolvedToday ? (
            <span className={styles.solved}>✅ Solved Today</span>
          ) : (
            <span className={styles.notSolved}>❌ Not Solved Today</span>
          )}
        </div>
      </div>

      {profile && (
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{profile.totalSolved}</div>
            <div className={styles.statLabel}>Total Solved</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{profile.easySolved}</div>
            <div className={styles.statLabel}>Easy</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{profile.mediumSolved}</div>
            <div className={styles.statLabel}>Medium</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{profile.hardSolved}</div>
            <div className={styles.statLabel}>Hard</div>
          </div>
        </div>
      )}

      <div className={styles.todaySection}>
        <h4 className={styles.sectionTitle}>Today's Activity</h4>
        {todayTotalCount > 0 ? (
          <div className={styles.todayStats}>
            <div className={styles.todayStat}>
              <span className={styles.todayValue}>{todaySolvedCount}</span>
              <span className={styles.todayLabel}>Solved</span>
            </div>
            <div className={styles.todayStat}>
              <span className={styles.todayValue}>{todayTotalCount}</span>
              <span className={styles.todayLabel}>Total Submissions</span>
            </div>
          </div>
        ) : (
          <p className={styles.noActivity}>No submissions today</p>
        )}
      </div>

      {recentSubmissions.length > 0 && (
        <div className={styles.recentSection}>
          <h4 className={styles.sectionTitle}>Recent Submissions</h4>
          <div className={styles.submissionsList}>
            {recentSubmissions.slice(0, 5).map((submission, index) => (
              <div key={index} className={styles.submissionItem}>
                <div className={styles.submissionInfo}>
                  <span className={styles.submissionTitle}>
                    {submission.title}
                  </span>
                  <span className={styles.submissionLang}>
                    {submission.lang}
                  </span>
                </div>
                <div className={styles.submissionStatus}>
                  <span
                    className={`${styles.statusBadge} ${
                      submission.statusDisplay === "Accepted"
                        ? styles.accepted
                        : styles.other
                    }`}
                  >
                    {submission.statusDisplay}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <a
          href="https://leetcode.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.actionButton}
        >
          Go to LeetCode
        </a>
        <Link href="/settings" className={styles.actionButton}>
          Settings
        </Link>
      </div>
    </div>
  );
}
