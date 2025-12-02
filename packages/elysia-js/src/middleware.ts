import { Elysia } from "elysia";
import { getLogger } from "./global-logger";
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

  // Decide which logger instance to use for HTTP logs
  // - use global logger if explicitly requested
  // - otherwise create a dedicated HTTP logger (does NOT overwrite the global one)
  const httpLogger = useGlobal ? getLogger() : new Logger(options);

  return new Elysia()
    .derive(
      {
        as: "scoped",
      },
      ({ headers }) => {
        return {
          // High resolution start time for accurate duration measurement
          startTime: performance.now(),
          ip:
            headers["x-forwarded-for"] ||
            headers["x-real-ip"] ||
            headers["x-client-ip"] ||
            "",
          // Track if error handler was triggered to avoid double logging
          errorLogged: false,
        };
      }
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
        (performance.now() - (ctx.startTime || performance.now())).toFixed(2)
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
    .onError(({ error, request, ip, startTime, set, ...ctx }) => {
      // Mark error as logged to prevent double logging in onAfterResponse
      (ctx as any).errorLogged = true;

      const url = new URL(request.url);
      const duration =
        Number(
          (performance.now() - (startTime || performance.now())).toFixed(2)
        ) || 0.01;

      // Create a safe error message as error might not always have a message property
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : String(error);

      httpLogger.error({
        method: request.method,
        path: url.pathname,
        statusCode: typeof set.status === "number" ? set.status : 500,
        duration,
        ip: ip,
        message: errorMessage,
      });
    });
}
