import { Elysia } from "elysia";
import { debug, error, info, initializeLogger, logger, warn } from "../src";

// Initialize the global logger with custom options
initializeLogger({
  level: "debug", // Set minimum log level to debug to see all logs
  console: true,
  file: true,
  filePath: "./logs/app.log",
  includeIp: true,
  format: "[{timestamp}] {level} - {message} - {method} {path}{ip}",
});

// Now the global logger is configured and can be used anywhere in the app

const app = new Elysia()
  .use(logger()) // The middleware uses the already configured global logger
  .get("/", () => {
    // Using global logger functions directly in route handlers
    debug("Processing root route request");
    return "Hello World!";
  })
  .get("/debug", () => {
    debug("This is a debug message");
    return "Check your console for the debug message";
  })
  .get("/info", () => {
    info("This is an info message");
    return "Check your console for the info message";
  })
  .get("/warn", () => {
    warn("This is a warning message");
    return "Check your console for the warning message";
  })
  .get("/error", () => {
    error("This is an error message");
    return "Check your console for the error message";
  })
  .get("/custom", () => {
    // You can also pass objects with custom fields
    info({
      message: "Custom log entry",
      path: "/custom-path",
      method: "CUSTOM",
      statusCode: 201,
      duration: 150,
    });
    return "Custom log entry recorded";
  })
  .listen(3000);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
