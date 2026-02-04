import { Elysia } from "elysia";
import { initializeLogger } from "./global-logger";
import { Logger } from "./logger";
import { LoggerOptions } from "./types";

/**
 * HTTP logger middleware for Elysia.
 *
 * This now logs ONLY HTTP request/response cycles with its own (http) logger instance
 * allowing the global logger (initialized via `initializeLogger`) to be used for
 * application / business logs with a different format.
 *
 * To preserve previous behaviour (middleware configuring & using the global logger)
 * pass `{ useGlobal: true }`.
 */
export function logger(options: LoggerOptions = {}) {
  const useGlobal = (options as any).useGlobal === true;

  // Default IP headers to check (in priority order)
  const defaultIpHeaders = ["x-forwarded-for", "x-real-ip", "x-client-ip"];
  const ipHeaders = options.ipHeaders || defaultIpHeaders;

  /**
   * Helper function to resolve client IP from request headers.
   * Checks custom headers in priority order, falls back to empty string.
   */
  const getIp = (headers: Record<string, string | undefined>): string => {
    for (const header of ipHeaders) {
      const value = headers[header.toLowerCase()];
      if (value) {
        // x-forwarded-for may contain comma-separated IPs, take the first one
        return value.split(",")[0].trim();
      }
    }
    return "";
  };

  // Decide which logger instance to use for HTTP logs
  // - use global logger if explicitly requested (and initialize it with options)
  // - otherwise create a dedicated HTTP logger (does NOT overwrite the global one)
  const httpLogger = useGlobal
    ? initializeLogger(options)
    : new Logger(options);

  return new Elysia()
    .derive(
      {
        as: "scoped",
      },
      ({ headers }) => {
        return {
          // High resolution start time for accurate duration measurement
          startTime: performance.now(),
          // Use helper function to resolve IP from custom headers
          ip: getIp(headers as Record<string, string | undefined>),
          // Track if error handler was triggered to avoid double logging
          errorLogged: false,
        };
      },
    )
    .onAfterResponse({ as: "global" }, (ctx) => {
      // Skip if already logged by error handler
      if ((ctx as any).errorLogged) {
        return;
      }

      const url = new URL(ctx.request.url);
      if (options.skip?.includes(url.pathname)) {
        return;
      }
      const duration = Number(
        (performance.now() - (ctx.startTime || performance.now())).toFixed(2),
      );

      // Get status code from ctx.set.status - this is now accurate in onAfterResponse
      const statusCode =
        typeof ctx.set.status === "number" ? ctx.set.status : 200;

      // Use appropriate log level based on status code
      const logMethod = statusCode >= 400 ? "warn" : "info";

      httpLogger[logMethod]({
        method: ctx.request.method,
        path: url.pathname,
        statusCode,
        duration,
        ip: ctx.ip,
        message: `${ctx.request.method} ${url.pathname}`,
      });
    })
    .onError(({ error, request, startTime, set, ...ctx }) => {
      // Mark error as logged to prevent double logging in onAfterResponse
      (ctx as any).errorLogged = true;

      const url = new URL(request.url);
      const duration =
        Number(
          (performance.now() - (startTime || performance.now())).toFixed(2),
        ) || 0.01;

      // Create a safe error message as error might not always have a message property
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : String(error);

      // Get IP from request headers using helper function (ctx.ip may be undefined in error handlers)
      const headers = Object.fromEntries(request.headers.entries());
      const clientIp = getIp(headers);

      httpLogger.error({
        method: request.method,
        path: url.pathname,
        statusCode: typeof set.status === "number" ? set.status : 500,
        duration,
        ip: clientIp,
        message: errorMessage,
      });
    });
}
