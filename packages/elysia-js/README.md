# Logify for Elysia.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A beautiful, fast, and type-safe logging middleware for Elysia.js applications. Get instant insights into your HTTP requests with colorized console output and structured file logging.

## ✨ Features

- 🎨 Beautiful console output with color-coded log levels
- ⚡ Zero-config with smart defaults
- 📊 Request duration and status code tracking
- 🌐 IP address logging with proxy support
- 📝 Structured logging with TypeScript support
- 🎯 Path-based request filtering
- 🔄 Automatic log directory creation
- 🎛️ Fully customizable log formats
- 🌍 Global logger instance for application-wide logging
- 📝 Convenient logging functions: debug(), info(), warn(), and error()

## 📦 Installation

```bash
bun add @rasla/logify
```

## 🚀 Quick Start

```typescript
import { Elysia } from "elysia";
import { logger } from "@rasla/logify";

const app = new Elysia()
  .use(logger())
  .get("/", () => "Hello World!")
  .listen(3000);
```

Output:

```
[2024-12-03T17:48:54.721Z] INFO [GET  ] / - 200 1ms
```

## 🌍 Global Logger

Logify provides a global logger that can be accessed from anywhere in your application:

```typescript
import { Elysia } from "elysia";
import {
  logger,
  initializeLogger,
  debug,
  info,
  warn,
  error,
} from "@rasla/logify";

// Configure the global logger once at startup
initializeLogger({
  level: "debug",
  file: true,
  filePath: "./logs/app.log",
});

// Now you can use logging functions anywhere in your code
const app = new Elysia()
  .use(logger()) // Uses the global logger configuration
  .get("/", () => {
    debug("Processing root request"); // Debug log
    return "Hello World!";
  })
  .get("/users", () => {
    info("Fetching users"); // Info log
    return ["Alice", "Bob"];
  })
  .post("/users", () => {
    warn("User validation skipped"); // Warning log
    return { created: true };
  })
  .get("/error", () => {
    error("Critical error occurred"); // Error log
    throw new Error("Something went wrong");
  })
  .listen(3000);
```

## 🎨 Configuration

```typescript
import { Elysia } from "elysia";
import { logger } from "@rasla/logify";

const app = new Elysia();

// All options are optional with smart defaults
app.use(
  logger({
    // Console logging (default: true)
    console: true,

    // File logging (default: false)
    file: true,
    filePath: "./logs/app.log",

    // Log level (default: "info")
    level: "debug", // "debug" | "info" | "warn" | "error"

    // Skip certain paths
    skip: ["/health", "/metrics"],

    // Include IP address (default: false)
    includeIp: true,

    // Custom format (see Format Tokens below)
    format:
      "[{timestamp}] {level} [{method}] {path} - {statusCode} {duration}ms{ip}",
  })
);

app.listen(3000);
```

## 📝 Format Tokens

Customize your log format using these tokens:

| Token          | Description   | Example                    |
| -------------- | ------------- | -------------------------- |
| `{timestamp}`  | ISO timestamp | `2024-12-03T17:48:54.721Z` |
| `{level}`      | Log level     | `INFO`, `ERROR`            |
| `{method}`     | HTTP method   | `GET`, `POST`              |
| `{path}`       | Request path  | `/api/users`               |
| `{statusCode}` | HTTP status   | `200`, `404`               |
| `{duration}`   | Request time  | `123ms`                    |
| `{ip}`         | Client IP     | `127.0.0.1`                |

## 🎯 Examples

### Basic API Server

```typescript
import { Elysia } from "elysia";
import { logger } from "@rasla/logify";

const app = new Elysia()
  .use(logger())
  .get("/", () => "Hello")
  .post("/users", ({ body }) => ({ created: true }))
  .get("/users/:id", ({ params: { id } }) => ({ id }))
  .listen(3000);
```

### Using Global Logger Functions

```typescript
import { Elysia } from "elysia";
import {
  logger,
  initializeLogger,
  debug,
  info,
  warn,
  error,
} from "@rasla/logify";

// Initialize once with your preferred configuration
initializeLogger({
  level: "debug",
  console: true,
  file: true,
  filePath: "./logs/app.log",
});

// Then use anywhere in your application
function userService() {
  debug("User service initialized");

  return {
    getUser(id: string) {
      info(`Getting user with ID: ${id}`);
      // Implementation...
    },
    createUser(data: any) {
      if (!data.email) {
        warn("Creating user without email");
      }
      // Implementation...
    },
    deleteUser(id: string) {
      error(`User deletion requested: ${id}`);
      // Implementation...
    },
  };
}

const app = new Elysia()
  .use(logger())
  .get("/users/:id", ({ params }) => {
    const service = userService();
    return service.getUser(params.id);
  })
  .listen(3000);
```

### Production Setup

```typescript
import { Elysia } from "elysia";
import { logger, initializeLogger } from "@rasla/logify";

// Configure global logger for production
initializeLogger({
  level: "info", // Only info and above in production
  file: true,
  filePath: "./logs/app.log",
  includeIp: true,
  format:
    "[{timestamp}] {level} [{method}] {path} - {statusCode} {duration}ms - {ip}",
});

const app = new Elysia();

// Use the configured logger middleware
app.use(logger({ skip: ["/health"] }));

// Routes
app
  .get("/", () => "API v1")
  .get("/health", () => "OK")
  .get("/users", () => db.users.findMany())
  .post("/users", ({ body }) => db.users.create({ data: body }))
  .listen(3000);
```

### Error Handling

```typescript
import { Elysia } from "elysia";
import { logger, error } from "@rasla/logify";

const app = new Elysia()
  .use(logger({ level: "debug" }))
  .get("/error", () => {
    error("Custom error before exception");
    throw new Error("Something went wrong");
  })
  .listen(3000);

// Middleware output: [2024-12-03T17:48:54.721Z] ERROR [GET  ] /error - 500 1ms
// Custom log: [2024-12-03T17:48:54.720Z] ERROR Custom error before exception
```

### Separate HTTP vs Global Logger (New in v5.1.0)

See: `examples/separate-http-global.ts`

Demonstrates using different formats: one for HTTP access logs and one for application logs.

### Legacy Unified Logger (useGlobal)

See: `examples/legacy-use-global.ts`

Shows how to retain pre-v5.1.0 behaviour where middleware and global logs share the same logger & format.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - Created by [0xRasla](https://github.com/0xRasla)

## 🔀 HTTP Logger vs Global Logger (v5.1.0+)

Starting from v5.1.0 the middleware creates its own dedicated HTTP logger instance by default. This lets you:

- Use one format for HTTP access logs
- Use a different format for your application / domain logs via the global logger

Example:

```ts
import { Elysia } from "elysia";
import { initializeLogger, logger, info } from "@rasla/logify";

// Global logger for application messages
initializeLogger({
  format: "[{timestamp}] {level}: {message}",
  level: "info",
});

const app = new Elysia()
  .use(
    logger({
      // Dedicated HTTP log format
      format:
        "[{timestamp}] {level} {method} {path} {statusCode} | Time: {duration}ms",
      level: "info",
    })
  )
  .get("/", () => {
    info("🚀 Elysia is running"); // Uses the global logger format
    return "Hello";
  });
```

If you want the old behaviour (middleware configuring & using the global logger), pass `useGlobal: true`:

```ts
app.use(logger({ format: "...", useGlobal: true }));
```

Performance measurement now uses `performance.now()` for higher precision; extremely fast requests will no longer appear as `0ms`.
