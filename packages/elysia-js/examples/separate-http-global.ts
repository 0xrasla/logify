import { Elysia } from "elysia";
import { info, initializeLogger, logger } from "../src";

// Global logger configuration for application/business logs ONLY
initializeLogger({
  level: "info",
  format: "[{timestamp}] {level}: {message}",
});

const app = new Elysia()
  // HTTP middleware uses its OWN logger instance with a dedicated HTTP format
  .use(
    logger({
      format:
        "[{timestamp}] {level} {method} {path} {statusCode} | Time: {duration}ms",
      level: "info",
    })
  )
  .get("/", () => {
    // This log is produced by the GLOBAL logger (different format)
    info("🚀 Elysia is running");
    return { status: "ok" };
  })
  .get("/users", () => {
    info("Fetching users (business log)");
    return [{ id: 1, name: "Alice" }];
  })
  .listen(3000);

console.log(
  `HTTP logger vs Global logger example running on :${app.server?.port}`
);
