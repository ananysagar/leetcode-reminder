"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { logout } from "../store/slices/authSlice";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Don't show navbar on dashboard (it has its own header)
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <h1 className={styles.logoText}>LeetCode Reminder</h1>
          </Link>
        </div>
        <div className={styles.navButtons}>
          {isAuthenticated ? (
            <>
              <span className={styles.userInfo}>
                Welcome, {user?.username || "User"}!
              </span>
              <Link href="/dashboard" className={styles.dashboardButton}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginButton}>
                Login
              </Link>
              <Link href="/sign-up" className={styles.signupButton}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
