import { NextFunction, Request, Response } from "express";
import { getLogger } from "./global-logger";
import { Logger } from "./logger";
import { LoggerOptions } from "./types";

export function logger(options: LoggerOptions = {}) {
  const useGlobal = (options as any).useGlobal === true;
  const httpLogger = useGlobal ? getLogger() : new Logger(options);

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip logging for specified paths
    if (options.skip?.includes(req.path)) {
      return next();
    }

  const startTime = performance.now();

    // Get IP address
    const ip =
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "";

    // Store the original end function
    const originalEnd = res.end;

    // Override end function to capture response
    res.end = function (
      chunk: any,
      encoding?: string | (() => void),
      cb?: () => void
    ) {
      const duration = Number((performance.now() - startTime).toFixed(2));

      httpLogger.info({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        ip,
        message: `${req.method} ${req.path}`,
      });

      if (typeof encoding === "function") {
        // @ts-ignore
        return originalEnd.call(this, chunk, encoding);
      }
      // @ts-ignore
      return originalEnd.call(this, chunk, encoding, cb);
    } as any; // Type assertion needed due to complex express types

    // Error handling
    res.on("error", (error: Error) => {
      const duration = Number((performance.now() - startTime).toFixed(2));

      httpLogger.error({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        ip,
        message: error.message,
      });
    });

    next();
  };
}
