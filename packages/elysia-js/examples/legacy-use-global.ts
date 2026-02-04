import { info, logger } from "@rasla/logify";
import { Elysia } from "elysia";

// Configure ONLY via middleware (legacy style) by passing useGlobal: true
// This will cause the middleware to use the global logger rather than creating a dedicated HTTP logger.

const app = new Elysia()
  .use(
    logger({
      useGlobal: true,
      format:
        "[{timestamp}] {level} {method} {path} {statusCode} {duration}ms :: {message}",
      level: "debug",
    }),
  )
  .get("/", () => {
    info("This log shares the same format as HTTP logs");
    return { legacy: true };
  })
  .listen(3000);

console.log(`Legacy unified logger example running on :${app.server?.port}`);
