import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { RegisterSchema } from "@/lib/validators";
import { successResponse, errorResponse, validationErrorResponse } from "@/utils/response";
import { handleError } from "@/utils/errorHandler";
import { withLogging } from "@/middleware/logger";
import { rateLimit } from "@/middleware/rateLimit";

const SALT_ROUNDS = 12;

const rateLimiter = rateLimit({ maxRequests: 10, windowMs: 60_000 });

async function handler(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return validationErrorResponse(errors);
    }

    const { name, email, password, role } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return errorResponse("Email is already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({ name, email, password: hashedPassword, role });

    return successResponse(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      "User registered successfully",
      201
    );
  } catch (error) {
    return handleError(error);
  }
}

export const POST = rateLimiter(withLogging(handler));
