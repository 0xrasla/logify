import { Elysia } from "elysia";
import { logger } from "@rasla/logify";

// Example with custom format and manual logging
const app = new Elysia()
  .use(
    logger({
      format:
        "🚀 {timestamp} | {level} | {method} {path} | Status: {statusCode} | Time: {duration}ms{ip}",
      includeIp: true,
    }),
  )
  .get("/", ({ log }) => {
    // Manual logging examples
    log.debug("Debug message");
    log.info("Info message");
    log.warn("Warning message");

    // Object-style logging
    log.info({
      method: "CUSTOM",
      path: "/custom-action",
      statusCode: 200,
      duration: 50,
      message: "Custom action performed",
    });

    return "Check your console for different log formats!";
  })
  .listen(3002);

console.log(
  `🦊 Custom format example running at ${app.server?.hostname}:${app.server?.port}`,
);
