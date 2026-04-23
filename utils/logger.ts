type LogLevel = "info" | "warn" | "error" | "debug";

const isDev = process.env.NODE_ENV !== "production";

function formatMessage(level: LogLevel, message: string, ...args: unknown[]): string {
  const timestamp = new Date().toISOString();
  const extra = args.length ? " " + args.map((a) => JSON.stringify(a)).join(" ") : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${extra}`;
}

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(formatMessage("info", message, ...args));
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(formatMessage("warn", message, ...args));
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(formatMessage("error", message, ...args));
  },
  debug: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.debug(formatMessage("debug", message, ...args));
    }
  },
  request: (method: string, path: string, status: number, durationMs: number) => {
    const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
    logger[level](`${method} ${path} → ${status} (${durationMs}ms)`);
  },
};
