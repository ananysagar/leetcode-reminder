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

    // Fetch user stats from LeetCode
    const userStats = await LeetCodeAPI.getUserStats(user.leetcodeUsername);

    if (!userStats) {
      return NextResponse.json(
        { message: "Failed to fetch LeetCode user stats" },
        { status: 500 },
      );
    }

    return NextResponse.json({ userStats });
  } catch (error) {
    console.error("LeetCode user stats error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
