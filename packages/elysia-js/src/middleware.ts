import { Elysia } from "elysia";
import { Logger } from "./logger";
import { LoggerOptions } from "./types";

export function logger(options: LoggerOptions = {}) {
  const logger = new Logger(options);

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

      logger.info({
        method: ctx.request.method,
        path: url.pathname,
        statusCode: 200,
        duration,
        ip: ctx.ip,
        message: `${ctx.request.method} ${url.pathname}`,
      });
    })
    .onError(({ error, request, ip, startTime }) => {
      const url = new URL(request.url);
      const duration = Date.now() - (startTime || Date.now()) || 1;

      logger.error({
        method: request.method,
        path: url.pathname,
        statusCode: 500,
        duration,
        ip: ip,
        message: error.message,
      });
    });
}
