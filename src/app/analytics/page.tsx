'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import styles from './page.module.css';

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h1>Analytics</h1>
        <p>Coming soon...</p>
      </div>
    </ProtectedRoute>
  );
} 