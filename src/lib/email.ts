import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Get the from email address - defaults to your custom domain or test domain
const getFromEmail = () => {
  const domain = process.env.EMAIL_FROM_DOMAIN || 'resend.dev';
  const emailAddress = domain === 'resend.dev' 
    ? 'onboarding@resend.dev' 
    : `LeetCode Reminder <noreply@${domain}>`;
  return emailAddress;
};

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface ReminderEmailData {
  to: string;
  username: string;
  leetcodeUsername: string;
  currentStreak: number;
  longestStreak: number;
  lastSolvedDate: Date | null;
  reminderTime: string;
}

export class EmailService {
  /**
   * Send a reminder email to user
   */
  static async sendReminderEmail(data: ReminderEmailData): Promise<boolean> {
    try {
      const html = this.generateReminderEmailHTML(data);
      const text = this.generateReminderEmailText(data);

      const emailData: EmailData = {
        to: data.to,
        subject: `⏰ LeetCode Reminder - Keep Your Streak Going!`,
        html,
        text,
      };

      const result = await resend.emails.send({
        from: getFromEmail(),
        to: [data.to],
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      });

      console.log('Email sent successfully:', result);
      console.log('Email details:', {
        to: data.to,
        subject: emailData.subject,
        from: getFromEmail()
      });
      return true;
    } catch (error) {
      console.error('Failed to send reminder email:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        to: data.to,
        subject: `⏰ LeetCode Reminder - Keep Your Streak Going!`
      });
      return false;
    }
  }

  /**
   * Send a welcome email after LeetCode connection
   */
  static async sendWelcomeEmail(to: string, username: string, leetcodeUsername: string): Promise<boolean> {
    try {
      const html = this.generateWelcomeEmailHTML(username, leetcodeUsername);
      const text = this.generateWelcomeEmailText(username, leetcodeUsername);

      const result = await resend.emails.send({
        from: getFromEmail(),
        to: [to],
        subject: `🎉 Welcome to LeetCode Reminder!`,
        html,
        text,
      });

      console.log('Welcome email sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  /**
   * Generate HTML content for reminder email
   */
  private static generateReminderEmailHTML(data: ReminderEmailData): string {
    const daysSinceLastSolved = data.lastSolvedDate 
      ? Math.floor((Date.now() - data.lastSolvedDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>LeetCode Reminder</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat { text-align: center; }
            .stat-number { font-size: 2em; font-weight: bold; color: #667eea; }
            .stat-label { color: #666; font-size: 0.9em; }
            .cta { background: #667eea; color: white; padding: 15px 30px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 0.9em; margin-top: 30px; }
            .streak-warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>⏰ LeetCode Reminder</h1>
            <p>Time to solve some problems!</p>
          </div>
          
          <div class="content">
            <h2>Hi ${data.username}! 👋</h2>
            
            <p>It's ${data.reminderTime} and you haven't solved any LeetCode problems today. Don't let your streak break!</p>
            
            ${data.currentStreak > 0 ? `
              <div class="streak-warning">
                <strong>⚠️ Streak Alert!</strong> You're on a ${data.currentStreak}-day streak. 
                ${daysSinceLastSolved > 0 ? `It's been ${daysSinceLastSolved} day${daysSinceLastSolved > 1 ? 's' : ''} since your last solve.` : ''}
              </div>
            ` : ''}
            
            <div class="stats">
              <div class="stat">
                <div class="stat-number">${data.currentStreak}</div>
                <div class="stat-label">Current Streak</div>
              </div>
              <div class="stat">
                <div class="stat-number">${data.longestStreak}</div>
                <div class="stat-label">Longest Streak</div>
              </div>
            </div>
            
            <p>Ready to keep your coding momentum going? Here are some suggestions:</p>
            <ul>
              <li>🎯 Start with an easy problem to get back in the groove</li>
              <li>📚 Review a problem you solved before</li>
              <li>🔥 Try a new algorithm or data structure</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="https://leetcode.com/problemset/all/" class="cta">Start Solving Now</a>
            </div>
            
            <p><strong>Your LeetCode Profile:</strong> <a href="https://leetcode.com/${data.leetcodeUsername}/">leetcode.com/${data.leetcodeUsername}</a></p>
          </div>
          
          <div class="footer">
            <p>This reminder was sent at ${data.reminderTime} because you haven't solved any problems today.</p>
            <p>You can manage your reminder settings in your dashboard.</p>
            <p>Keep coding! 🚀</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate text content for reminder email
   */
  private static generateReminderEmailText(data: ReminderEmailData): string {
    const daysSinceLastSolved = data.lastSolvedDate 
      ? Math.floor((Date.now() - data.lastSolvedDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return `
LeetCode Reminder - Keep Your Streak Going!

Hi ${data.username}!

It's ${data.reminderTime} and you haven't solved any LeetCode problems today. Don't let your streak break!

${data.currentStreak > 0 ? `STREAK ALERT: You're on a ${data.currentStreak}-day streak. ${daysSinceLastSolved > 0 ? `It's been ${daysSinceLastSolved} day${daysSinceLastSolved > 1 ? 's' : ''} since your last solve.` : ''}` : ''}

Your Stats:
- Current Streak: ${data.currentStreak} days
- Longest Streak: ${data.longestStreak} days

Ready to keep your coding momentum going? Here are some suggestions:
- Start with an easy problem to get back in the groove
- Review a problem you solved before
- Try a new algorithm or data structure

Start solving now: https://leetcode.com/problemset/all/

Your LeetCode Profile: https://leetcode.com/${data.leetcodeUsername}/

This reminder was sent at ${data.reminderTime} because you haven't solved any problems today.
You can manage your reminder settings in your dashboard.

Keep coding! 🚀
    `.trim();
  }

  /**
   * Generate HTML content for welcome email
   */
  private static generateWelcomeEmailHTML(username: string, leetcodeUsername: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to LeetCode Reminder</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
            .cta { background: #667eea; color: white; padding: 15px 30px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 0.9em; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to LeetCode Reminder!</h1>
            <p>Your coding journey just got better</p>
          </div>
          
          <div class="content">
            <h2>Hi ${username}! 👋</h2>
            
            <p>Great news! Your LeetCode account (<strong>${leetcodeUsername}</strong>) has been successfully connected to our reminder system.</p>
            
            <h3>What happens next?</h3>
            <ul>
              <li>📊 We'll track your daily coding progress</li>
              <li>⏰ You'll receive reminders when you haven't solved problems</li>
              <li>📈 We'll help you maintain your coding streak</li>
              <li>🎯 You can set multiple reminder times throughout the day</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="https://leetcode.com/problemset/all/" class="cta">Start Your First Problem</a>
            </div>
            
            <p><strong>Your LeetCode Profile:</strong> <a href="https://leetcode.com/${leetcodeUsername}/">leetcode.com/${leetcodeUsername}</a></p>
          </div>
          
          <div class="footer">
            <p>Happy coding! 🚀</p>
            <p>You can manage your reminder settings anytime in your dashboard.</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate text content for welcome email
   */
  private static generateWelcomeEmailText(username: string, leetcodeUsername: string): string {
    return `
Welcome to LeetCode Reminder!

Hi ${username}!

Great news! Your LeetCode account (${leetcodeUsername}) has been successfully connected to our reminder system.

What happens next?
- We'll track your daily coding progress
- You'll receive reminders when you haven't solved problems
- We'll help you maintain your coding streak
- You can set multiple reminder times throughout the day

Start your first problem: https://leetcode.com/problemset/all/

Your LeetCode Profile: https://leetcode.com/${leetcodeUsername}/

Happy coding! 🚀

You can manage your reminder settings anytime in your dashboard.
    `.trim();
  }
}
