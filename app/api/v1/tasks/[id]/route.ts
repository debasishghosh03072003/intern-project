import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import User from "@/models/User";
import { authenticate } from "@/middleware/auth";
import { UpdateTaskSchema } from "@/lib/validators";
import {
  successResponse,
  notFoundResponse,
  forbiddenResponse,
  validationErrorResponse,
  errorResponse,
} from "@/utils/response";
import { handleError } from "@/utils/errorHandler";
import { withLogging } from "@/middleware/logger";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

// ─── GET /api/v1/tasks/[id] ────────────────────────────────────────────────────
async function getTaskById(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) return errorResponse("Invalid task ID", 400);

    const auth = authenticate(req);
    if (!("user" in auth)) return auth;

    await connectDB();

    const task = await Task.findById(id).populate("userId", "name email role").lean();
    if (!task) return notFoundResponse("Task");

    // Users can only view their own tasks
    if (auth.user.role !== "admin" && task.userId.toString() !== auth.user.userId) {
      return forbiddenResponse();
    }

    return successResponse(task, "Task retrieved successfully");
  } catch (error) {
    return handleError(error);
  }
}

// ─── PUT /api/v1/tasks/[id] ────────────────────────────────────────────────────
async function updateTask(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) return errorResponse("Invalid task ID", 400);

    const auth = authenticate(req);
    if (!("user" in auth)) return auth;

    await connectDB();

    const task = await Task.findById(id);
    if (!task) return notFoundResponse("Task");

    if (auth.user.role !== "admin" && task.userId.toString() !== auth.user.userId) {
      return forbiddenResponse();
    }

    const body = await req.json();
    const parsed = UpdateTaskSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return validationErrorResponse(errors);
    }

    if (Object.keys(parsed.data).length === 0) {
      return errorResponse("No valid fields provided for update", 400);
    }

    const updated = await Task.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    )
      .populate("userId", "name email role")
      .lean();

    return successResponse(updated, "Task updated successfully");
  } catch (error) {
    return handleError(error);
  }
}

// ─── DELETE /api/v1/tasks/[id] ─────────────────────────────────────────────────
async function deleteTask(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) return errorResponse("Invalid task ID", 400);

    const auth = authenticate(req);
    if (!("user" in auth)) return auth;

    await connectDB();

    const task = await Task.findById(id);
    if (!task) return notFoundResponse("Task");

    if (auth.user.role !== "admin" && task.userId.toString() !== auth.user.userId) {
      return forbiddenResponse();
    }

    await Task.findByIdAndDelete(id);

    return successResponse(null, "Task deleted successfully");
  } catch (error) {
    return handleError(error);
  }
}

export const GET    = withLogging(getTaskById);
export const PUT    = withLogging(updateTask);
export const DELETE = withLogging(deleteTask);
