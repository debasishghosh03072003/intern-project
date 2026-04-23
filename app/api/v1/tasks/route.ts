import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import User from "@/models/User";
import { authenticate } from "@/middleware/auth";
import { CreateTaskSchema } from "@/lib/validators";
import { successResponse, validationErrorResponse, forbiddenResponse } from "@/utils/response";
import { handleError } from "@/utils/errorHandler";
import { withLogging } from "@/middleware/logger";
import { getPaginationOptions, buildPaginationMeta } from "@/utils/pagination";

// ─── POST /api/v1/tasks ────────────────────────────────────────────────────────
async function createTask(req: NextRequest) {
  try {
    const auth = authenticate(req);
    if (!("user" in auth)) return auth;

    await connectDB();

    const body = await req.json();
    const parsed = CreateTaskSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return validationErrorResponse(errors);
    }

    const task = await Task.create({
      ...parsed.data,
      userId: auth.user.userId,
    });

    return successResponse(task, "Task created successfully", 201);
  } catch (error) {
    return handleError(error);
  }
}

// ─── GET /api/v1/tasks ─────────────────────────────────────────────────────────
async function getTasks(req: NextRequest) {
  try {
    const auth = authenticate(req);
    if (!("user" in auth)) return auth;

    await connectDB();

    const { searchParams } = req.nextUrl;
    const { page, limit, skip } = getPaginationOptions(
      searchParams.get("page"),
      searchParams.get("limit")
    );
    const statusFilter = searchParams.get("status");

    // Admin sees all tasks; users see only their own
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (auth.user.role !== "admin") {
      query.userId = auth.user.userId;
    }
    if (statusFilter && ["pending", "in-progress", "completed"].includes(statusFilter)) {
      query.status = statusFilter;
    }

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Task.countDocuments(query),
    ]);

    return successResponse(
      tasks,
      "Tasks retrieved successfully",
      200,
      buildPaginationMeta(page, limit, total)
    );
  } catch (error) {
    return handleError(error);
  }
}

export const POST = withLogging(createTask);
export const GET = withLogging(getTasks);
