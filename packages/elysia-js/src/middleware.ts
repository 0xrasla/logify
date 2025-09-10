import { Elysia } from "elysia";
import { getLogger, initializeLogger } from "./global-logger";
import { LoggerOptions } from "./types";

export function logger(options: LoggerOptions = {}) {
  // Initialize the global logger only if options contain meaningful configuration
  const loggerInstance =
    Object.keys(options).length > 0 ? initializeLogger(options) : getLogger();

  return new Elysia()
    .derive(
      {
        as: "scoped",
      },
      ({ headers }) => {
        return {
          startTime: Date.now(),
          ip:
            headers["x-forwarded-for"] ||
            headers["x-real-ip"] ||
            headers["x-client-ip"] ||
            "",
        };
      }
    )
    .onAfterHandle({ as: "global" }, (ctx) => {
      const url = new URL(ctx.request.url);
      if (options.skip?.includes(url.pathname)) {
        return;
      }

      const duration = Date.now() - (ctx.startTime || Date.now());

      loggerInstance.info({
        method: ctx.request.method,
        path: url.pathname,
        statusCode: typeof ctx.set.status === "number" ? ctx.set.status : 200,
        duration,
        ip: ctx.ip,
        message: `${ctx.request.method} ${url.pathname}`,
      });
    })
    .onError(({ error, request, ip, startTime, set }) => {
      const url = new URL(request.url);
      const duration = Date.now() - (startTime || Date.now()) || 1;

      // Create a safe error message as error might not always have a message property
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : String(error);

      loggerInstance.error({
        method: request.method,
        path: url.pathname,
        statusCode: typeof set.status === "number" ? set.status : 500,
        duration,
        ip: ip,
        message: errorMessage,
      });
    });
}
