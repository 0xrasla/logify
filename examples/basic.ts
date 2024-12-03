import { Elysia } from "elysia";
import { logger } from "../src";

const app = new Elysia()
  .use(
    logger({
      // Enable both console and file logging
      console: true,
      file: true,
      filePath: "./logs/app.log",

      // Include IP address
      includeIp: true,

      // Custom format
      format: "[{timestamp}] {level} [{method}] {path} - {statusCode} {duration}ms - {ip}",
    })
  )
  // Basic routes
  .get("/", () => "Hello World!")
  
  // Async route with delay
  .get("/slow", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "Slow response";
  })
  
  // Route with error
  .get("/error", () => {
    throw new Error("Something went wrong");
  })
  
  // Route with params
  .get("/users/:id", ({ params: { id } }) => ({ id }))
  
  // POST route
  .post("/users", ({ body }) => ({ created: true, body }));

// Start server
app.listen(3000);
