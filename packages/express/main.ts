import Express from "express";
import { debug, error, info, initializeLogger, logger, warn } from "./src";

// Initialize the global logger with custom configuration
initializeLogger({
  file: true,
  filePath: "./logs/app.log",
  includeIp: true,
  level: "debug", // Set to 'debug' to see all log levels
  format: "[{timestamp}] {level} {method} {path} {statusCode} {duration}ms{ip}",
});

const app = Express();

// Use the logger middleware (which now uses the global configuration)
app.use(logger());

// Example routes that demonstrate different log levels
app.get("/", (req, res) => {
  debug("Processing request to the root endpoint");
  info("Hello World endpoint called");
  res.send("Hello World!");
});

app.get("/debug", (req, res) => {
  debug("This is a debug message");
  res.send("Check your console for the debug message");
});

app.get("/info", (req, res) => {
  info("This is an info message");
  res.send("Check your console for the info message");
});

app.get("/warn", (req, res) => {
  warn("This is a warning message");
  res.send("Check your console for the warning message");
});

app.get("/error", (req, res) => {
  error("This is an error message");
  res.send("Check your console for the error message");
});

app.get("/performance-issue", (req, res) => {
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

  res.send(`Intensive operation completed in ${duration}ms`);
});

// Error handling
app.use(
  (
    err: Error,
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    error(`Error handler caught: ${err.message}`);
    res.status(500).send("An error occurred");
  }
);

app.listen(3000, () => {
  console.log("Server started on port 3000");
  info(`Server started at http://localhost:3000`);
});
