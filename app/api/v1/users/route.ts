import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { authenticate } from "@/middleware/auth";
import { forbiddenResponse, successResponse } from "@/utils/response";
import { handleError } from "@/utils/errorHandler";
import { withLogging } from "@/middleware/logger";
import { getPaginationOptions, buildPaginationMeta } from "@/utils/pagination";

async function handler(req: NextRequest) {
  try {
    // Authenticate
    const auth = authenticate(req);
    if (!("user" in auth)) return auth; // Returns error response

    // Admin only
    if (auth.user.role !== "admin") {
      return forbiddenResponse();
    }

    await connectDB();

    const { searchParams } = req.nextUrl;
    const { page, limit, skip } = getPaginationOptions(
      searchParams.get("page"),
      searchParams.get("limit")
    );

    const [users, total] = await Promise.all([
      User.find({})
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({}),
    ]);

    return successResponse(
      users,
      "Users retrieved successfully",
      200,
      buildPaginationMeta(page, limit, total)
    );
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withLogging(handler);
