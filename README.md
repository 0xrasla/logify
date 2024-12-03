# Easy Logger for Elysia.js

[![npm version](https://badge.fury.io/js/easy-logger-elysia.svg)](https://www.npmjs.com/package/easy-logger-elysia)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, flexible, and easy-to-use logging middleware for Elysia.js applications. This logger provides beautiful console output and optional file logging capabilities with minimal configuration.

## 🚀 Features

- 🎨 Beautiful console output with color-coded log levels
- 📝 Request/Response logging with duration tracking
- 🌐 IP address logging support
- 📁 File logging with automatic directory creation
- ⚡ Zero-config setup with sensible defaults
- 🔧 Highly customizable log formats
- 🎯 Path-based logging skip
- 🪶 Lightweight with minimal dependencies
- 💪 TypeScript support with full type definitions

## 📦 Installation

```bash
bun add easy-logger-elysia
```

## 🏃 Quick Start

```typescript
import { Elysia } from 'elysia'
import { easyLogger } from 'easy-logger-elysia'

const app = new Elysia()
  .use(easyLogger())
  .get('/', () => 'Hello World!')
  .listen(3000)
```

## 🎨 Configuration Options

```typescript
interface LoggerOptions {
  console?: boolean;    // Enable console logging (default: true)
  file?: boolean;       // Enable file logging (default: false)
  filePath?: string;    // Custom file path for logs (default: './logs/app.log')
  level?: LogLevel;     // Minimum log level (default: 'info')
  format?: string;      // Custom format for log messages
  skip?: string[];      // Paths to skip from logging
  includeIp?: boolean;  // Include IP address in logs (default: false)
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
```

## 📝 Log Formats

The logger supports both string messages and structured logging:

```typescript
// String message
logger.info('Simple message');

// Structured logging
logger.info({
  method: 'GET',
  path: '/api',
  statusCode: 200,
  duration: 5,
  ip: '127.0.0.1'
});
```

### Format Tokens

Available tokens for custom formats:
- `{timestamp}` - ISO timestamp
- `{level}` - Log level (DEBUG, INFO, WARN, ERROR)
- `{method}` - HTTP method
- `{path}` - Request path
- `{statusCode}` - HTTP status code
- `{duration}` - Request duration in ms
- `{message}` - Log message
- `{ip}` - Client IP address (when enabled)

## 📚 Examples

### Basic Usage
```typescript
import { Elysia } from 'elysia'
import { easyLogger } from 'easy-logger-elysia'

const app = new Elysia()
  .use(easyLogger())
  .get('/', () => 'Hello World!')
  .listen(3000)
```

### Advanced Configuration
```typescript
const app = new Elysia()
  .use(easyLogger({
    console: true,
    file: true,
    filePath: './logs/app.log',
    includeIp: true,
    level: 'debug',
    skip: ['/health', '/metrics'],
    format: '[{timestamp}] {level} [{method}] {path} - Status: {statusCode} - Time: {duration}ms{ip}'
  }))
```

### Custom Format with Emojis
```typescript
const app = new Elysia()
  .use(easyLogger({
    format: '🚀 {timestamp} | {level} | {method} {path} | Status: {statusCode} | Time: {duration}ms{ip}'
  }))
```

More examples can be found in the [examples](./examples) directory:
- [Basic Usage](./examples/basic-usage.ts)
- [Advanced Usage](./examples/advanced-usage.ts)
- [Custom Format](./examples/custom-format.ts)

## 📁 Project Structure

```
easy-logger/
├── src/
│   ├── index.ts        # Main entry point
│   ├── logger.ts       # Logger implementation
│   ├── middleware.ts   # Elysia middleware
│   └── types.ts        # TypeScript types
├── examples/
│   ├── basic-usage.ts
│   ├── advanced-usage.ts
│   └── custom-format.ts
├── package.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Support

If you find this project useful, please give it a ⭐️ on GitHub! If you have any questions or need help:

- 📫 Open an [issue](https://github.com/yourusername/easy-logger/issues)
- 💬 Start a [discussion](https://github.com/yourusername/easy-logger/discussions)
- 📖 Check the [examples](./examples) directory

## 🌟 Acknowledgments

- Elysia.js team for the amazing framework
- All our contributors who help make this project better
