import { Elysia } from "elysia";
import { easyLogger } from "../src";

// Advanced usage with custom configuration
const app = new Elysia()
  .use(
    easyLogger({
      console: true,
      file: true,
      filePath: "./logs/advanced.log",
      includeIp: true,
      level: "debug",
      skip: ["/health", "/metrics"],
      format: "[{timestamp}] {level} [{method}] {path} - Status: {statusCode} - Time: {duration}ms{ip}",
    })
  )
  .get("/", () => "Hello from advanced example!")
  .get("/health", () => "OK") // This route will be skipped from logging
  .get("/error", () => {
    throw new Error("Test error handling");
  })
  .listen(3001);

console.log(
  `🦊 Advanced example running at ${app.server?.hostname}:${app.server?.port}`
);
