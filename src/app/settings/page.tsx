'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import styles from './page.module.css';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h1>Settings</h1>
        <p>Coming soon...</p>
      </div>
    </ProtectedRoute>
  );
} 