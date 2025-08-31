'use client';

import Link from 'next/link';
import Navbar from './Navbar';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Master LeetCode with
            <span className={styles.gradientText}> Smart Reminders</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Never break your coding streak again. Get personalized email reminders, 
            track your progress across study sheets, and stay motivated with our 
            comprehensive LeetCode practice tracker.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/sign-up" className={styles.primaryButton}>
              Get Started Free
            </Link>
            <Link href="/login" className={styles.secondaryButton}>
              Already have an account?
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.codeWindow}>
            <div className={styles.codeHeader}>
              <div className={styles.codeDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className={styles.codeTitle}>leetcode_reminder.py</span>
            </div>
            <div className={styles.codeContent}>
              <pre>
{`class LeetCodeTracker:
    def __init__(self):
        self.streak = 0
        self.problems_solved = []
    
    def solve_problem(self, problem):
        self.problems_solved.append(problem)
        self.streak += 1
        return "Great job! Keep going!"`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>Why Choose LeetCode Reminder?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📧</div>
              <h3>Smart Email Reminders</h3>
              <p>Get personalized reminders at 9 PM if you haven't solved a problem today. Never break your streak again!</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📚</div>
              <h3>Study Sheets Management</h3>
              <p>Track progress across NeetCode 150, Blind 75, Love Babbar, and more. Cross-sheet synchronization included.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⏱️</div>
              <h3>Pomodoro Timer</h3>
              <p>Stay focused with customizable timers for different problem types. Track your study sessions.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Progress Analytics</h3>
              <p>Visualize your progress with detailed charts and insights. Track your improvement over time.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔗</div>
              <h3>Direct LeetCode Integration</h3>
              <p>Connect your LeetCode account and automatically sync your submissions and progress.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Goal Setting</h3>
              <p>Set daily and weekly goals. Get motivated with achievement tracking and milestones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <h2>Ready to Transform Your LeetCode Journey?</h2>
          <p>Join thousands of developers who are already improving their coding skills with our platform.</p>
          <Link href="/sign-up" className={styles.ctaButton}>
            Start Your Free Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p>&copy; 2024 LeetCode Reminder. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  );
} 