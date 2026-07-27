# Logify

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Un middleware de registro (logging) hermoso, rápido y type-safe para aplicaciones web de Node.js. Obtén información instantánea de tus solicitudes HTTP con salida de consola coloreada y registro estructurado en archivos.

## 📦 Paquetes

Este monorepo contiene los siguientes paquetes:

- [@rasla/logify](./packages/elysia-js) - Middleware de logging para Elysia.js
- [@rasla/express-logify](./packages/express) - Middleware de logging para Express.js

## ✨ Características

- 🎨 Hermosa salida de consola con niveles de log codificados por colores
- ⚡ Cero configuración con valores predeterminados inteligentes
- 📊 Seguimiento de la duración de la solicitud y del código de estado
- 🌐 Registro de dirección IP con soporte para proxy
- 📝 Registro estructurado con soporte para TypeScript
- 🎯 Filtrado de solicitudes basado en rutas
- 🔄 Creación automática del directorio de logs
- 🎛️ Formatos de log totalmente personalizables
- 🌍 Instancia de logger global para registros en toda la aplicación
- 📝 Funciones de logging convenientes: debug(), info(), warn(), y error()

## 📥 Instalación

Elige el paquete que coincida con tu framework:

### Para Elysia.js

```bash
bun add @rasla/logify
```

### Para Express.js

```bash
npm install @rasla/express-logify
# o
yarn add @rasla/express-logify
# o
pnpm add @rasla/express-logify
```

## 🚀 Inicio Rápido

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
import express from "express";
import { logger } from "@rasla/express-logify";

const app = express();

app.use(logger());
app.get("/", (req, res) => res.send("Hello World!"));

app.listen(3000);
```

## 🌍 Logger Global

Ambos paquetes incluyen ahora un logger global al que se puede acceder desde cualquier parte de tu aplicación:

````typescript
// Elysia.js
import {
  initializeLogger,
  debug,
  info,
  warn,
  error
} from "@rasla/logify";

// Express.js
import {
  initializeLogger,
  debug,
  info,
  warn,
  error
} from "@rasla/express-logify";

// Configurar una vez al iniciar
initializeLogger({
  level: "debug",
  file: true,
  filePath: "./logs/app.log"
});

// Usar en cualquier lugar de tu código
debug("This is a debug message");
info("This is an info message");
warn("This is a warning message");
error("This is an error message");
| `{statusCode}` | HTTP status | `200`, `404` |
| `{duration}` | Request time | `123ms` |
| `{ip}` | Client IP | `127.0.0.1` |
````

## 🎯 Ejemplos

Echa un vistazo a los ejemplos en cada paquete:
- [Ejemplos de Elysia.js](./packages/elysia-js/examples)
- [Ejemplos de Express.js](./packages/express/examples)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! No dudes en enviar un Pull Request.

## 🎨 Configuración

Ambos paquetes admiten las mismas opciones de configuración:

```typescript
{
  // Registro en consola (predeterminado: true)
  console: true,

  // Registro en archivo (predeterminado: false)
  file: true,
  filePath: './logs/app.log',

  // Nivel de log (predeterminado: "info")
  level: 'debug', // "debug" | "info" | "warn" | "error"

  // Omitir ciertas rutas
  skip: ['/health', '/metrics'],

  // Incluir dirección IP (predeterminado: false)
  includeIp: true,

  // Formato personalizado (ver Tokens de Formato más abajo)
  format: '[{timestamp}] {level} [{method}] {path} - {statusCode} {duration}ms{ip}',
}
````

## 📝 Tokens de Formato

Personaliza el formato de tus logs usando estos tokens:

| Token          | Descripción   | Ejemplo                    |
| -------------- | ------------- | -------------------------- |
| `{timestamp}`  | Timestamp ISO  | `2024-12-03T17:48:54.721Z` |
| `{level}`      | Nivel de log   | `INFO`, `ERROR`            |
| `{method}`     | Método HTTP   | `GET`, `POST`              |
| `{path}`       | Ruta de solicitud | `/api/users`               |
| `{statusCode}` | Estado HTTP   | `200`, `404`               |
| `{duration}`   | Tiempo de solicitud | `123ms`                    |
| `{ip}`         | IP del cliente | `127.0.0.1`                |

## 🎯 Ejemplos

Echa un vistazo a los ejemplos en cada paquete:

- [Ejemplos de Elysia.js](./packages/elysia-js/examples)
- [Ejemplos de Express.js](./packages/express/examples)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! No dudes en enviar un Pull Request.

## 📄 Licencia

Licencia MIT - Creado por [0xRasla](https://github.com/0xRasla)
