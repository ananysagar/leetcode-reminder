import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getUserFromToken } from "../../../../lib/auth";

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

    // Remove LeetCode username from user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { leetcodeUsername: null },
      select: {
        id: true,
        email: true,
        username: true,
        leetcodeUsername: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "LeetCode account disconnected successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("LeetCode disconnect error:", error);
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

