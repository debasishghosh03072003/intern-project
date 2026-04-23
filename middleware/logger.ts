import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/utils/logger";

// Handler that takes only req (collection routes)
type SimpleHandler = (req: NextRequest) => Promise<NextResponse>;

// Handler that takes req + Next.js dynamic route context (dynamic segment routes)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ParamsHandler = (req: NextRequest, ctx: any) => Promise<NextResponse>;

export function withLogging(handler: SimpleHandler): SimpleHandler;
export function withLogging(handler: ParamsHandler): ParamsHandler;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withLogging(handler: any): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: NextRequest, ctx?: any): Promise<NextResponse> => {
    const start = Date.now();
    const { method, nextUrl } = req;
    const path = nextUrl.pathname;

    logger.debug(`→ ${method} ${path}`);

    const response = ctx ? await handler(req, ctx) : await handler(req);

    const duration = Date.now() - start;
    logger.request(method, path, response.status, duration);

    return response;
  };
}
