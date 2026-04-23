import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export function successResponse<T>(
  data: T,
  message = "Success",
  status = 200,
  meta?: ApiResponse["meta"]
): NextResponse {
  const body: ApiResponse<T> = { success: true, message, data };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

export function errorResponse(
  message: string,
  status = 500,
  errors?: unknown
): NextResponse {
  const body: ApiResponse = { success: false, message };
  if (errors !== undefined) body.errors = errors;
  return NextResponse.json(body, { status });
}

export function validationErrorResponse(errors: unknown): NextResponse {
  return errorResponse("Validation failed", 422, errors);
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Forbidden: Insufficient permissions"): NextResponse {
  return errorResponse(message, 403);
}

export function notFoundResponse(resource = "Resource"): NextResponse {
  return errorResponse(`${resource} not found`, 404);
}
