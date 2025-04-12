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
- 🌍 Global logger instance for application-wide logging
- 📝 Convenient logging functions: debug(), info(), warn(), and error()

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

## 🌍 Global Logger

Logify provides a global logger that can be accessed from anywhere in your application:

```typescript
import express from 'express';
import { 
  logger, 
  initializeLogger, 
  debug, 
  info, 
  warn, 
  error 
} from '@rasla/express-logify';

// Configure the global logger once at startup
initializeLogger({
  level: 'debug',
  file: true,
  filePath: './logs/app.log'
});

// Now you can use logging functions anywhere in your code
const app = express();

app.use(logger()); // Uses the global logger configuration

app.get('/', (req, res) => {
  debug('Processing root request'); // Debug log
  res.send('Hello World!');
});

app.get('/users', (req, res) => {
  info('Fetching users'); // Info log
  res.json(['Alice', 'Bob']);
});

app.post('/users', express.json(), (req, res) => {
  warn('User validation skipped'); // Warning log
  res.json({ created: true });
});

app.get('/error', (req, res, next) => {
  error('Critical error occurred'); // Error log
  next(new Error('Something went wrong'));
});

app.listen(3000);
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

### Using Global Logger Functions

```typescript
import express from 'express';
import { 
  logger, 
  initializeLogger, 
  debug, 
  info, 
  warn, 
  error 
} from '@rasla/express-logify';

// Initialize once with your preferred configuration
initializeLogger({
  level: 'debug',
  console: true,
  file: true,
  filePath: './logs/app.log'
});

// Then use anywhere in your application
function userService() {
  debug('User service initialized');
  
  return {
    getUser(id: string) {
      info(`Getting user with ID: ${id}`);
      // Implementation...
      return { id };
    },
    createUser(data: any) {
      if (!data.email) {
        warn('Creating user without email');
      }
      // Implementation...
      return { created: true };
    },
    deleteUser(id: string) {
      error(`User deletion requested: ${id}`);
      // Implementation...
      return { deleted: true };
    }
  };
}

const app = express();
app.use(logger());
app.use(express.json());

app.get('/users/:id', (req, res) => {
  const service = userService();
  const user = service.getUser(req.params.id);
  res.json(user);
});

app.post('/users', (req, res) => {
  const service = userService();
  const result = service.createUser(req.body);
  res.json(result);
});

app.listen(3000);
```

### Production Setup

```typescript
import express from 'express';
import { logger, initializeLogger } from '@rasla/express-logify';

// Configure global logger for production
initializeLogger({
  level: 'info', // Only info and above in production
  file: true,
  filePath: './logs/app.log',
  includeIp: true,
  format: '[{timestamp}] {level} [{method}] {path} - {statusCode} {duration}ms - {ip}',
});

const app = express();

// Use the configured logger middleware
app.use(logger({ skip: ['/health'] }));

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
import { logger, error } from '@rasla/express-logify';

const app = express();

app.use(logger({ level: 'debug' }));

app.get('/error', (req, res, next) => {
  error('Custom error before exception');
  next(new Error('Something went wrong'));
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  error(`Error handled: ${err.message}`);
  res.status(500).json({ error: err.message });
});

app.listen(3000);
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - Created by [0xRasla](https://github.com/0xRasla)
