import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getUserFromToken } from "../../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Get user's streak data and email reminders
    const streakData = await prisma.streakData.findUnique({
      where: { userId: user.id },
      include: {
        emailReminders: {
          orderBy: { time: "asc" },
        },
      },
    });

    if (!streakData) {
      return NextResponse.json(
        { message: "Streak data not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      streakData,
      emailReminders: streakData.emailReminders,
    });
  } catch (error) {
    console.error("Get reminder settings error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user from token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { isReminderEnabled, reminderTimes } = await request.json();

    // Validate reminder times
    if (reminderTimes && Array.isArray(reminderTimes)) {
      for (const time of reminderTimes) {
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
          return NextResponse.json(
            { message: "Invalid time format. Use HH:MM format." },
            { status: 400 },
          );
        }
      }
    }

    // Update streak data
    const updatedStreakData = await prisma.streakData.upsert({
      where: { userId: user.id },
      update: {
        isReminderEnabled:
          isReminderEnabled !== undefined ? isReminderEnabled : true,
      },
      create: {
        userId: user.id,
        isReminderEnabled:
          isReminderEnabled !== undefined ? isReminderEnabled : true,
      },
    });

    // Update email reminders if provided
    if (reminderTimes && Array.isArray(reminderTimes)) {
      // Delete existing reminders
      await prisma.emailReminder.deleteMany({
        where: { userId: user.id },
      });

      // Create new reminders
      if (reminderTimes.length > 0) {
        await prisma.emailReminder.createMany({
          data: reminderTimes.map((time: string) => ({
            userId: user.id,
            time,
            isActive: true,
          })),
        });
      }
    }

    // Fetch updated data
    const finalStreakData = await prisma.streakData.findUnique({
      where: { userId: user.id },
      include: {
        emailReminders: {
          orderBy: { time: "asc" },
        },
      },
    });

    return NextResponse.json({
      message: "Reminder settings updated successfully",
      streakData: finalStreakData,
    });
  } catch (error) {
    console.error("Update reminder settings error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
