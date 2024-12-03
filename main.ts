import { Elysia } from "elysia";
import { logger } from "./src";

const app = new Elysia()
  .use(
    logger({
      console: true,
      file: true,
      filePath: "./logs/app.log",
      includeIp: true,
      level: "info",
      skip: ["/error"],
      format:
        "[{timestamp}] {level} {method} {path} {statusCode} {duration}ms{ip}",
    })
  )
  .get("/", () => "Hello World!")
  .get("/error", () => {
    throw new Error("This is a test error");
  })
  .listen(3000);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
