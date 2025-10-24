import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "../../../../lib/auth";
import { LeetCodeAPI } from "../../../../lib/leetcode";

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

    if (!user.leetcodeUsername) {
      return NextResponse.json(
        { message: "LeetCode username not connected" },
        { status: 400 },
      );
    }

    // Check if user has solved any problem today
    const hasSolvedToday = await LeetCodeAPI.hasSolvedToday(
      user.leetcodeUsername,
    );
    const todaySubmissions = await LeetCodeAPI.getTodaySubmissions(
      user.leetcodeUsername,
    );

    return NextResponse.json({
      hasSolvedToday,
      todaySubmissions,
      count: todaySubmissions.filter((s) => s.statusDisplay === "Accepted")
        .length,
    });
  } catch (error) {
    console.error("LeetCode check today error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
