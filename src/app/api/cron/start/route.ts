import { NextRequest, NextResponse } from 'next/server';
import { DailyEmailChecker } from '../../../../lib/dailyEmailChecker';

/**
 * Manual Cron Trigger Endpoint
 * 
 * This endpoint can be called to manually trigger the email reminder check.
 * Useful for testing and as a fallback if cron jobs aren't set up.
 * 
 * In production, you should use a proper cron service like:
 * - Vercel Cron Jobs
 * - AWS EventBridge
 * - GitHub Actions
 * - External cron service (cron-job.org, etc.)
 */

export async function GET(request: NextRequest) {
  try {
    console.log('Manual cron trigger activated');
    
    // Run the daily email checker
    await DailyEmailChecker.checkAndSendReminders();
    
    return NextResponse.json({
      message: 'Reminder check completed successfully',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Manual cron trigger error:', error);
    return NextResponse.json(
      { 
        message: 'Manual cron trigger failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

