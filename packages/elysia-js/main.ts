import { Elysia } from "elysia";
import { debug, error, info, initializeLogger, logger, warn } from "./src";

// Initialize the global logger with custom configuration
initializeLogger({
  file: true,
  filePath: "./logs/app.log",
  includeIp: true,
  level: "debug", // Set to 'debug' to see all log levels
  format: "[{timestamp}] {level} {method} {path} {statusCode} {duration}ms{ip}",
});

const app = new Elysia();

// Use the logger middleware (which now uses the global configuration)
app.use(logger());

app.get("/", () => {
  debug("Processing request to the root endpoint");
  info("Hello World endpoint called");
  return "Hello World!";
});

app.get("/debug", () => {
  debug("This is a debug message");
  return "Check your console for the debug message";
});

app.get("/info", () => {
  info("This is an info message");
  return "Check your console for the info message";
});

app.get("/warn", () => {
  warn("This is a warning message");
  return "Check your console for the warning message";
});

app.get("/error", () => {
  error("This is an error message");
  return "Check your console for the error message";
});

app.get("/performance-issue", () => {
  debug("Starting intensive operation");

  // Log before the intensive operation
  info("Starting intensive calculation");

  // Simulate an intensive operation
  const start = Date.now();
  for (let i = 0; i < 1000000; i++) {
    // Heavy computation simulation
    Math.sqrt(i);
  }
  const duration = Date.now() - start;

  // Log after the intensive operation with timing
  warn(
    `Intensive operation completed in ${duration}ms - performance may be affected`
  );

  return `Intensive operation completed in ${duration}ms`;
});

app.get("/custom", () => {
  // You can also pass objects with custom fields
  console.log("Custom log entry started");
  info({
    message: "Custom log entry",
    method: "CUSTOM",
    statusCode: 200,
    duration: 150,
  });
  console.log("Custom log entry recorded");
  return "Custom log entry recorded";
});

app.listen(3000, () => {
  console.log(
    `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
  );
  info(`Server started at http://${app.server?.hostname}:${app.server?.port}`);
});
