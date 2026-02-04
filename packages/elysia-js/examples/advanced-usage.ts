import { logger } from "@rasla/logify";
import { Elysia } from "elysia";

// Advanced usage with custom configuration
const app = new Elysia()
  .use(
    logger({
      console: true,
      file: true,
      filePath: "./logs/app.log",
      level: "debug",
      skip: ["/health", "/metrics"],
      includeIp: true,
    }),
  )
  .get("/", () => "Hello World!")
  .get("/health", () => "OK") // This route will be skipped from logging
  .get("/metrics", () => ({ uptime: process.uptime() }))
  .get("/error", () => {
    throw new Error("Test error handling");
  })
  .listen(3000);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`,
);
