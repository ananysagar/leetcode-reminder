import { prisma } from './prisma';
import { LeetCodeAPI } from './leetcode';
import { EmailService } from './email';

export class DailyEmailChecker {
  /**
   * Check all users and send reminder emails if needed
   * This function should be called by a cron job
   */
  static async checkAndSendReminders(): Promise<void> {
    try {
      console.log('Starting daily email check...');
      
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      console.log(`Checking reminders for time: ${currentTimeString}`);
      
      // Get all active email reminders for the current time
      const activeReminders = await prisma.emailReminder.findMany({
        where: {
          isActive: true,
          time: currentTimeString,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              leetcodeUsername: true,
            },
          },
          streakData: {
            select: {
              currentStreak: true,
              longestStreak: true,
              lastSolvedDate: true,
              isReminderEnabled: true,
            },
          },
        },
      });
      
      console.log(`Found ${activeReminders.length} active reminders for ${currentTimeString}`);
      
      for (const reminder of activeReminders) {
        await this.processReminder(reminder);
      }
      
      console.log('Daily email check completed');
    } catch (error) {
      console.error('Error in daily email check:', error);
    }
  }
  
  /**
   * Process a single reminder
   */
  private static async processReminder(reminder: any): Promise<void> {
    try {
      const { user, streakData } = reminder;
      
      // Skip if user doesn't have LeetCode username
      if (!user.leetcodeUsername) {
        console.log(`Skipping user ${user.username} - no LeetCode username`);
        return;
      }
      
      // Skip if reminders are disabled
      if (!streakData?.isReminderEnabled) {
        console.log(`Skipping user ${user.username} - reminders disabled`);
        return;
      }
      
      console.log(`Processing reminder for user: ${user.username}`);
      
      // Check if user has solved any problems today
      const hasSolvedToday = await LeetCodeAPI.hasSolvedToday(user.leetcodeUsername);
      
      if (hasSolvedToday) {
        console.log(`User ${user.username} has already solved problems today - no reminder needed`);
        
        // Update streak data if they solved today
        await this.updateStreakData(user.id, true);
        return;
      }
      
      console.log(`User ${user.username} hasn't solved problems today - sending reminder`);
      
      // Send reminder email
      const emailData = {
        to: user.email,
        username: user.username,
        leetcodeUsername: user.leetcodeUsername,
        currentStreak: streakData?.currentStreak || 0,
        longestStreak: streakData?.longestStreak || 0,
        lastSolvedDate: streakData?.lastSolvedDate,
        reminderTime: reminder.time,
      };
      
      const emailSent = await EmailService.sendReminderEmail(emailData);
      
      if (emailSent) {
        console.log(`Reminder email sent successfully to ${user.email}`);
        
        // Log the email sending event (optional - for analytics)
        await this.logEmailEvent(user.id, 'reminder_sent', reminder.time);
      } else {
        console.error(`Failed to send reminder email to ${user.email}`);
        await this.logEmailEvent(user.id, 'reminder_failed', reminder.time);
      }
      
    } catch (error) {
      console.error(`Error processing reminder for user ${reminder.user?.username}:`, error);
    }
  }
  
  /**
   * Update streak data based on today's activity
   */
  private static async updateStreakData(userId: string, solvedToday: boolean): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const streakData = await prisma.streakData.findUnique({
        where: { userId },
      });
      
      if (!streakData) {
        // Create new streak data
        await prisma.streakData.create({
          data: {
            userId,
            currentStreak: solvedToday ? 1 : 0,
            longestStreak: solvedToday ? 1 : 0,
            lastSolvedDate: solvedToday ? today : null,
          },
        });
        return;
      }
      
      const lastSolvedDate = streakData.lastSolvedDate;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newCurrentStreak = streakData.currentStreak;
      let newLongestStreak = streakData.longestStreak;
      
      if (solvedToday) {
        if (lastSolvedDate && lastSolvedDate.getTime() === yesterday.getTime()) {
          // Solved yesterday, continue streak
          newCurrentStreak = streakData.currentStreak + 1;
        } else if (lastSolvedDate && lastSolvedDate.getTime() === today.getTime()) {
          // Already solved today, keep current streak
          newCurrentStreak = streakData.currentStreak;
        } else {
          // New streak starting
          newCurrentStreak = 1;
        }
        
        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
        
        await prisma.streakData.update({
          where: { userId },
          data: {
            currentStreak: newCurrentStreak,
            longestStreak: newLongestStreak,
            lastSolvedDate: today,
          },
        });
      } else {
        // Didn't solve today, check if streak should be reset
        if (lastSolvedDate && lastSolvedDate.getTime() < yesterday.getTime()) {
          // Streak already broken, no need to update
        } else if (lastSolvedDate && lastSolvedDate.getTime() === yesterday.getTime()) {
          // Streak will be broken tomorrow if no solve today
          // We don't reset it yet, just log the potential break
        }
      }
      
    } catch (error) {
      console.error(`Error updating streak data for user ${userId}:`, error);
    }
  }
  
  /**
   * Log email events for analytics
   */
  private static async logEmailEvent(userId: string, eventType: string, reminderTime: string): Promise<void> {
    try {
      // You could create an EmailLog table for this
      console.log(`Email event logged: ${eventType} for user ${userId} at ${reminderTime}`);
      
      // For now, just log to console
      // In production, you might want to store this in a database table
    } catch (error) {
      console.error('Error logging email event:', error);
    }
  }
  
  /**
   * Send welcome email after LeetCode connection
   */
  static async sendWelcomeEmail(userId: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          username: true,
          leetcodeUsername: true,
        },
      });
      
      if (!user || !user.leetcodeUsername) {
        console.log('User not found or no LeetCode username');
        return;
      }
      
      const emailSent = await EmailService.sendWelcomeEmail(
        user.email,
        user.username,
        user.leetcodeUsername
      );
      
      if (emailSent) {
        console.log(`Welcome email sent to ${user.email}`);
      } else {
        console.error(`Failed to send welcome email to ${user.email}`);
      }
      
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }
}
