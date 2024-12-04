# Logify for Express.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A beautiful, fast, and type-safe logging middleware for Express.js applications. Get instant insights into your HTTP requests with colorized console output and structured file logging.

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
npm install @rasla/express-logify
# or
yarn add @rasla/express-logify
# or
pnpm add @rasla/express-logify
```

## 🚀 Quick Start

```typescript
import express from 'express';
import { logger } from '@rasla/express-logify';

const app = express();

app.use(logger());
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000);
```

Output:
```
[2024-12-03T17:48:54.721Z] INFO [GET  ] / - 200 1ms
```

## 🎨 Configuration

```typescript
import express from 'express';
import { logger } from '@rasla/express-logify';

const app = express();

// All options are optional with smart defaults
app.use(
  logger({
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
    format:
      '[{timestamp}] {level} [{method}] {path} - {statusCode} {duration}ms{ip}',
  })
);

app.listen(3000);
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

### Basic API Server

```typescript
import express from 'express';
import { logger } from '@rasla/express-logify';

const app = express();

app.use(logger());

app.get('/', (req, res) => res.send('Hello'));
app.post('/users', express.json(), (req, res) => res.json({ created: true }));
app.get('/users/:id', (req, res) => res.json({ id: req.params.id }));

app.listen(3000);
```

### Production Setup

```typescript
import express from 'express';
import { logger } from '@rasla/express-logify';

const app = express();

// Production configuration
app.use(
  logger({
    // Enable file logging
    file: true,
    filePath: './logs/app.log',

    // Include IP for security
    includeIp: true,

    // Skip health checks
    skip: ['/health'],

    // Detailed format
    format:
      '[{timestamp}] {level} [{method}] {path} - {statusCode} {duration}ms - {ip}',
  })
);

// Routes
app
  .get('/', (req, res) => res.send('API v1'))
  .get('/health', (req, res) => res.send('OK'))
  .get('/users', (req, res) => res.json({ users: [] }))
  .post('/users', express.json(), (req, res) => res.json({ created: true }));

app.listen(3000);
```

### Error Handling

```typescript
import express from 'express';
import { logger } from '@rasla/express-logify';

const app = express();

app.use(logger({ level: 'debug' }));

app.get('/error', (req, res) => {
  throw new Error('Something went wrong');
});

app.listen(3000);

// Output: [2024-12-03T17:48:54.721Z] ERROR [GET  ] /error - 500 1ms
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - Created by [0xRasla](https://github.com/0xRasla)
