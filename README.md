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

### Production Setup

```typescript
import { Elysia } from "elysia";
import { logger } from "@rasla/logify";

const app = new Elysia();

// Production configuration
app.use(
  logger({
    // Enable file logging
    file: true,
    filePath: "./logs/app.log",

    // Include IP for security
    includeIp: true,

    // Skip health checks
    skip: ["/health"],

    // Detailed format
    format:
      "[{timestamp}] {level} [{method}] {path} - {statusCode} {duration}ms - {ip}",
  })
);

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
import { logger } from "@rasla/logify";

const app = new Elysia()
  .use(logger({ level: "debug" }))
  .get("/error", () => {
    throw new Error("Something went wrong");
  })
  .listen(3000);

// Output: [2024-12-03T17:48:54.721Z] ERROR [GET  ] /error - 500 1ms
```

## 📄 License

MIT License - Created by [0xRasla](https://github.com/0xRasla)
