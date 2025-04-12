import { NextFunction, Request, Response } from "express";
import { getLogger, initializeLogger } from "./global-logger";
import { LoggerOptions } from "./types";

export function logger(options: LoggerOptions = {}) {
  // Initialize the global logger if it's being configured
  const loggerInstance = Object.keys(options).length > 0 && !getLogger().isInitialized
    ? initializeLogger(options)
    : getLogger();

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip logging for specified paths
    if (options.skip?.includes(req.path)) {
      return next();
    }

    const startTime = Date.now();

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
      const duration = Date.now() - startTime;

      loggerInstance.info({
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
      const duration = Date.now() - startTime;

      loggerInstance.error({
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
