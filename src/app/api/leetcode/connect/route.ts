import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getUserFromToken } from "../../../../lib/auth";
import { LeetCodeAPI } from "../../../../lib/leetcode";

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

    const { leetcodeUsername } = await request.json();

    if (!leetcodeUsername) {
      return NextResponse.json(
        { message: "LeetCode username is required" },
        { status: 400 },
      );
    }

    // Validate LeetCode username (optional validation for now)
    // We'll validate it when we actually fetch the profile
    // const isValid = await LeetCodeAPI.validateUsername(leetcodeUsername);
    // if (!isValid) {
    //   return NextResponse.json(
    //     { message: 'Invalid LeetCode username' },
    //     { status: 400 }
    //   );
    // }

    // Update user's LeetCode username
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { leetcodeUsername },
      select: {
        id: true,
        email: true,
        username: true,
        leetcodeUsername: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // For now, just connect the username without fetching profile data
    // Profile data will be fetched when the user visits the dashboard
    let profile = null;

    // Send welcome email (async, don't wait for it)
    try {
      const { DailyEmailChecker } = await import('../../../../lib/dailyEmailChecker');
      DailyEmailChecker.sendWelcomeEmail(user.id).catch(error => {
        console.warn('Failed to send welcome email:', error);
      });
    } catch (error) {
      console.warn('Failed to import email service:', error);
    }

    return NextResponse.json({
      message: "LeetCode account connected successfully",
      user: updatedUser,
      profile,
    });
  } catch (error) {
    console.error("LeetCode connect error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json(
      {
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: 500 },
    );
  }
}
