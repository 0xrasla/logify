import { logger } from "@rasla/logify";
import { Elysia } from "elysia";

// Basic usage with default options
const app = new Elysia()
  .use(logger())
  .get("/", () => "Hello World!")
  .listen(3000);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
