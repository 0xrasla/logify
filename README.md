# Logify

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A beautiful, fast, and type-safe logging middleware for Node.js web applications. Get instant insights into your HTTP requests with colorized console output and structured file logging.

## 📦 Packages

This monorepo contains the following packages:

- [@rasla/logify](./packages/elysia-js) - Logging middleware for Elysia.js
- [@rasla/express-logify](./packages/express) - Logging middleware for Express.js

## ✨ Features

- 🎨 Beautiful console output with color-coded log levels
- ⚡ Zero-config with smart defaults
- 📊 Request duration and status code tracking
- 🌐 IP address logging with proxy support
- 📝 Structured logging with TypeScript support
- 🎯 Path-based request filtering
- 🔄 Automatic log directory creation
- 🎛️ Fully customizable log formats

## 📥 Installation

Choose the package that matches your framework:

### For Elysia.js
```bash
bun add @rasla/logify
```

### For Express.js
```bash
npm install @rasla/express-logify
# or
yarn add @rasla/express-logify
# or
pnpm add @rasla/express-logify
```

## 🚀 Quick Start

### Elysia.js
```typescript
import { Elysia } from "elysia";
import { logger } from "@rasla/logify";

const app = new Elysia()
  .use(logger())
  .get("/", () => "Hello World!")
  .listen(3000);
```

### Express.js
```typescript
import express from 'express';
import { logger } from '@rasla/express-logify';

const app = express();

app.use(logger());
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000);
```

## 🎨 Configuration

Both packages support the same configuration options:

```typescript
{
  // Console logging (default: true)
  console: true,

  // File logging (default: false)
  file: true,
  filePath: './logs/app.log',

  // Log level (default: "info")
  level: 'debug', // "debug" | "info" | "warn" | "error"

  // Skip certain paths
  skip: ['/health', '/metrics'],

  // Include IP address (default: false)
  includeIp: true,

  // Custom format (see Format Tokens below)
  format: '[{timestamp}] {level} [{method}] {path} - {statusCode} {duration}ms{ip}',
}
```

## 📝 Format Tokens

Customize your log format using these tokens:

| Token | Description | Example |
|-------|-------------|---------|
| `{timestamp}` | ISO timestamp | `2024-12-03T17:48:54.721Z` |
| `{level}` | Log level | `INFO`, `ERROR` |
| `{method}` | HTTP method | `GET`, `POST` |
| `{path}` | Request path | `/api/users` |
| `{statusCode}` | HTTP status | `200`, `404` |
| `{duration}` | Request time | `123ms` |
| `{ip}` | Client IP | `127.0.0.1` |

## 🎯 Examples

Check out the examples in each package:
- [Elysia.js Examples](./packages/elysia-js/examples)
- [Express.js Examples](./packages/express/examples)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - Created by [0xRasla](https://github.com/0xRasla)
