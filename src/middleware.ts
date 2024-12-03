import { Elysia } from "elysia";
import { EasyLogger } from "./logger";
import { LoggerOptions } from "./types";

export function easyLogger(options: LoggerOptions = {}) {
  const logger = new EasyLogger(options);

  return new Elysia()
    .derive(({ request }) => {
      return {
        startTime: Date.now(),
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          (request as any).socket?.remoteAddress ||
          "unknown",
      };
    })
    .onRequest(({ request, store }) => {
      const message = options.includeIp
        ? `${request.method} ${request.url} from ${store.ip}`
        : `${request.method} ${request.url}`;
      logger.info(message);
    })
    .onAfterResponse(({ request, response, store }) => {
      const duration = Date.now() - store.startTime;
      const status = response instanceof Response ? response.status : 200;
      const url = new URL(request.url);

      if (options.skip?.includes(url.pathname)) {
        return;
      }

      logger.log("info", {
        timestamp: new Date(),
        level: "info",
        method: request.method,
        path: url.pathname,
        statusCode: status,
        duration,
        ip: store.ip,
      });
    })
    .onError(({ error, request, store }) => {
      const duration = Date.now() - store.startTime;
      const url = new URL(request.url);

      logger.error({
        timestamp: new Date(),
        level: "error",
        method: request.method,
        path: url.pathname,
        statusCode: 500,
        duration,
        message: error.message,
        ip: store.ip,
      });
    });
}
