"use client";

import { Provider } from "react-redux";
import { store } from "../store";
import { useEffect } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // Start the cron scheduler
    const interval = setInterval(async () => {
      try {
        // Call the cron endpoint to check for reminders
        await fetch('/api/cron/start', {
          method: 'GET',
        });
      } catch (error) {
        console.error('Cron check failed:', error);
      }
    }, 60 * 1000); // Every minute

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
