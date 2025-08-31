'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/slices/authSlice';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1 className={styles.logoText}>LeetCode Reminder</h1>
        </div>

        <div className={styles.userMenu}>
          <button
            className={styles.userButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={styles.userAvatar}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <span className={styles.userName}>{user?.username}</span>
            <svg
              className={`${styles.chevron} ${isMenuOpen ? styles.rotated : ''}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isMenuOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownItem}>
                <span>Email: {user?.email}</span>
              </div>
              {user?.leetcodeUsername && (
                <div className={styles.dropdownItem}>
                  <span>LeetCode: {user.leetcodeUsername}</span>
                </div>
              )}
              <div className={styles.divider}></div>
              <button
                className={styles.dropdownButton}
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 