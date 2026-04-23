import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { LoginSchema } from "@/lib/validators";
import { signToken } from "@/utils/jwt";
import { successResponse, errorResponse, validationErrorResponse } from "@/utils/response";
import { handleError } from "@/utils/errorHandler";
import { withLogging } from "@/middleware/logger";
import { rateLimit } from "@/middleware/rateLimit";

const rateLimiter = rateLimit({ maxRequests: 20, windowMs: 60_000 });

async function handler(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return validationErrorResponse(errors);
    }

    const { email, password } = parsed.data;

    // +password required — it's excluded by default (select: false)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return successResponse(
      {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful"
    );
  } catch (error) {
    return handleError(error);
  }
}

export const POST = rateLimiter(withLogging(handler));
