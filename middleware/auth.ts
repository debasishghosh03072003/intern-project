import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/jwt";
import type { JwtPayload } from "@/utils/jwt";
import { unauthorizedResponse, forbiddenResponse } from "@/utils/response";

export type { JwtPayload };

/**
 * Extracts and verifies the Bearer JWT from the Authorization header.
 * Returns { user: JwtPayload } on success, or a NextResponse error.
 */
export function authenticate(
  req: NextRequest
): { user: JwtPayload } | ReturnType<typeof unauthorizedResponse> {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorizedResponse("Missing or malformed Authorization header");
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return unauthorizedResponse("No token provided");
  }

  try {
    const user = verifyToken(token);
    return { user };
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "TokenExpiredError") {
        return unauthorizedResponse("Token has expired");
      }
      if (err.name === "JsonWebTokenError") {
        return unauthorizedResponse("Invalid token");
      }
    }
    return unauthorizedResponse("Authentication failed");
  }
}

/**
 * Returns a 403 forbidden response if the user is not an admin.
 * Returns null if the user IS an admin (access granted).
 */
export function requireAdmin(
  user: JwtPayload
): ReturnType<typeof forbiddenResponse> | null {
  if (user.role !== "admin") {
    return forbiddenResponse();
  }
  return null;
}
