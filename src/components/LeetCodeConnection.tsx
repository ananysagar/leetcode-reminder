"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  connectLeetCode,
  fetchLeetCodeProfile,
  disconnectLeetCode,
  clearError,
} from "../store/slices/leetcodeSlice";
import { updateLeetcodeUsername } from "../store/slices/authSlice";
import styles from "./LeetCodeConnection.module.css";

export default function LeetCodeConnection() {
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, isLoading, error } = useAppSelector(
    (state) => state.leetcode,
  );

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leetcodeUsername.trim()) return;

    setIsConnecting(true);
    try {
      console.log(
        "Attempting to connect LeetCode username:",
        leetcodeUsername.trim(),
      );
      const result = await dispatch(
        connectLeetCode(leetcodeUsername.trim()),
      ).unwrap();
      console.log("LeetCode connection result:", result);

      // Update auth state with the new user data that includes leetcodeUsername
      if (result.user) {
        dispatch(updateLeetcodeUsername(result.user.leetcodeUsername || null));
        await dispatch(fetchLeetCodeProfile()).unwrap();
      }

      setLeetcodeUsername("");
    } catch (error) {
      console.error("Failed to connect LeetCode:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your LeetCode account?")) {
      return;
    }

    setIsDisconnecting(true);
    try {
      const result = await dispatch(disconnectLeetCode()).unwrap();
      
      // Update auth state to remove leetcodeUsername
      if (result.user) {
        dispatch(updateLeetcodeUsername(null));
      }
    } catch (error) {
      console.error("Failed to disconnect LeetCode:", error);
      alert("Failed to disconnect LeetCode account. Please try again.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (user?.leetcodeUsername) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>LeetCode Account</h3>
          <span className={styles.connected}>✅ Connected</span>
        </div>

        <div className={styles.profile}>
          <div className={styles.username}>
            <strong>Username:</strong> {user.leetcodeUsername}
          </div>

          {profile && (
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Solved:</span>
                <span className={styles.statValue}>{profile.totalSolved}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Easy:</span>
                <span className={styles.statValue}>{profile.easySolved}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Medium:</span>
                <span className={styles.statValue}>{profile.mediumSolved}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Hard:</span>
                <span className={styles.statValue}>{profile.hardSolved}</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleDisconnect}
          disabled={isDisconnecting}
          className={styles.disconnectButton}
        >
          {isDisconnecting ? "Disconnecting..." : "Disconnect Account"}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Connect LeetCode Account</h3>
        <span className={styles.notConnected}>❌ Not Connected</span>
      </div>

      <p className={styles.description}>
        Connect your LeetCode account to track your progress and receive
        personalized reminders.
      </p>

      <form onSubmit={handleConnect} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="leetcodeUsername" className={styles.label}>
            LeetCode Username
          </label>
          <input
            id="leetcodeUsername"
            type="text"
            value={leetcodeUsername}
            onChange={(e) => setLeetcodeUsername(e.target.value)}
            placeholder="Enter your LeetCode username"
            className={styles.input}
            required
          />
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
          type="submit"
          disabled={isLoading || isConnecting || !leetcodeUsername.trim()}
          className={styles.connectButton}
        >
          {isLoading || isConnecting ? (
            <>
              <div className={styles.spinner}></div>
              Connecting...
            </>
          ) : (
            "Connect Account"
          )}
        </button>
      </form>

      <div className={styles.help}>
        <p>
          <strong>How to find your LeetCode username:</strong>
        </p>
        <ol>
          <li>
            Go to{" "}
            <a
              href="https://leetcode.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              leetcode.com
            </a>
          </li>
          <li>Sign in to your account</li>
          <li>
            Your username is in the URL: leetcode.com/u/
            <strong>your-username</strong>/
          </li>
        </ol>
      </div>
    </div>
  );
}
