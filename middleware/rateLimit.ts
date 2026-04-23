import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store per IP — use Redis in production
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number; // window in milliseconds
}

const defaultOptions: RateLimitOptions = {
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10), // 1 minute
};

export function rateLimit(options: Partial<RateLimitOptions> = {}) {
  const { maxRequests, windowMs } = { ...defaultOptions, ...options };

  return function rateLimitMiddleware(
    handler: (req: NextRequest) => Promise<NextResponse>
  ) {
    return async (req: NextRequest): Promise<NextResponse> => {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";

      const now = Date.now();
      const record = rateLimitStore.get(ip);

      if (!record || now > record.resetAt) {
        rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
      } else {
        record.count += 1;
        if (record.count > maxRequests) {
          return NextResponse.json(
            { success: false, message: "Too many requests. Please try again later." },
            {
              status: 429,
              headers: {
                "Retry-After": String(Math.ceil((record.resetAt - now) / 1000)),
                "X-RateLimit-Limit": String(maxRequests),
                "X-RateLimit-Remaining": "0",
              },
            }
          );
        }
      }

      const response = await handler(req);

      const current = rateLimitStore.get(ip);
      if (current) {
        response.headers.set("X-RateLimit-Limit", String(maxRequests));
        response.headers.set(
          "X-RateLimit-Remaining",
          String(Math.max(0, maxRequests - current.count))
        );
      }

      return response;
    };
  };
}
