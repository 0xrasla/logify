# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.2.1] - 2026-02-04

### Fixed

- **404 IP Logging**: Fixed issue where 404 responses weren't capturing client IP. Changed derive scope from `scoped` to `global` to ensure IP extraction runs for all requests including unmatched routes.
- Renamed internal `ip` property to `clientIp` to avoid conflicts with Elysia's built-in `ip` property.

### Added

- New test suite (`tests/ip-headers.test.ts`) for comprehensive testing of IP header features.
- New example (`examples/custom-ip-headers.ts`) demonstrating Cloudflare and proxy IP header configuration.

## [5.2.0] - 2026-02-04

### Added

- **Custom IP Headers**: New `ipHeaders` option allows specifying custom IP header priority order. Useful for proxies like Cloudflare (`cf-connecting-ip`), nginx, and other reverse proxies. Default headers: `['x-forwarded-for', 'x-real-ip', 'x-client-ip']`. Fixes [#12](https://github.com/0xrasla/logify/issues/12).

### Fixed

- **Missing IP on 404/Errors**: Fixed issue where client IP was undefined in error handler logs (including 404 "Route not found" errors). The error handler now properly resolves the IP from request headers using the configurable `ipHeaders` option. Fixes [#12](https://github.com/0xrasla/logify/issues/12).
- **useGlobal Bug**: Fixed `useGlobal: true` not honoring custom logger options. Previously, `getLogger()` returned a logger with default values instead of using the configured options. Now correctly calls `initializeLogger(options)` when `useGlobal` is enabled. Fixes [#12](https://github.com/0xrasla/logify/issues/12).

### Changed

- IP resolution now handles comma-separated values in `x-forwarded-for` header by extracting the first (client) IP.
- Improved code organization with dedicated `getIp()` helper function for consistent IP resolution across handlers.

### Example Usage

```typescript
import { Elysia } from "elysia";
import { logger } from "@rasla/logify";

const app = new Elysia()
  .use(
    logger({
      includeIp: true,
      ipHeaders: ["cf-connecting-ip", "x-real-ip", "x-forwarded-for"], // Cloudflare priority
    }),
  )
  .listen(3000);
```

## [5.1.3] - 2026-01-13

### Fixed

- Fixed TypeScript type compatibility issue with Elysia ^1.4.21 and newer versions. Updated Elysia dependency from `^1.4.6` to `^1.4.21` to resolve `TS2769` type errors caused by adapter type mismatches between different Elysia versions. Fixes [#10](https://github.com/0xrasla/logify/issues/10).

### Changed

- Updated `elysia` dependency to `^1.4.21` for better type safety and compatibility with latest Elysia releases.

### Upgrade Notes

- Safe patch release. Users experiencing TypeScript errors after upgrading to Elysia 1.4.21+ should update to this version.

## [5.1.2] - 2025-12-02

### Fixed

- Fixed incorrect status code logging where responses with `status(500, ...)` were logged as 200. Changed from `onAfterHandle` to `onAfterResponse` hook to capture the finalized response status code. Fixes [#9](https://github.com/0xrasla/logify/issues/9).

### Changed

- HTTP logging now uses appropriate log level based on status code: `warn` for 4xx/5xx responses, `info` for successful responses.
- Added `errorLogged` flag to prevent double logging when errors are handled by the `onError` hook.

## [5.1.1] - 2025-09-20

### Added

- New examples: `separate-http-global.ts` and `legacy-use-global.ts` demonstrating dual-format logging and legacy unified mode.

### Changed

- Updated dependencies: bumped `elysia` to `^1.4.6` and refreshed dev tooling versions (`@typescript-eslint/*`, `@types/*`, `eslint`).
- README expanded with sections referencing new examples and clarifying HTTP vs global logger usage.

### Internal

- Minor docs polish and consistency improvements; no runtime API changes.

### Upgrade Notes

- Safe patch release; no code changes required for users upgrading from 5.1.0.

## [5.1.0] - 2025-09-20

### Added

- Separation of concerns: Middleware now creates its own HTTP logger instance by default so global logger (initialized via `initializeLogger`) can use a different format for application logs. Implements feature request [#6](https://github.com/0xrasla/logify/issues/6).
- New option `useGlobal: true` to keep legacy behaviour where middleware uses the global logger.

### Changed

- HTTP request duration now measured with `performance.now()` for sub-millisecond precision and more reliable logging of very fast responses (previously could show `0ms`). Durations now formatted to 2 decimal places.

### Notes

- If you previously passed formatting options to `logger()` expecting them to update the global logger, you should now call `initializeLogger()` explicitly or pass `useGlobal: true`.

## [5.0.1] - 2025-09-10

### Fixed

- Middleware now logs the actual HTTP response status code instead of always defaulting to `200` (success) or `500` (error). Fixes [#5](https://github.com/0xrasla/logify/issues/5).

## [5.0.0] - 2025-09-01

### Added

- Major release with expanded logging customization and global logger improvements.

## [4.0.0] - 2025-08-15

### Changed

- Previous stable release prior to v5 feature set.

[5.2.1]: https://github.com/0xrasla/logify/releases/tag/elysia-v5.2.1
[5.2.0]: https://github.com/0xrasla/logify/releases/tag/elysia-v5.2.0
[5.1.3]: https://github.com/0xrasla/logify/releases/tag/elysia-v5.1.3
[5.1.2]: https://github.com/0xrasla/logify/releases/tag/elysia-v5.1.2
[5.0.1]: https://github.com/0xrasla/logify/releases/tag/elysia-v5.0.1
[5.0.0]: https://github.com/0xrasla/logify/releases/tag/elysia-v5.0.0
[4.0.0]: https://github.com/0xrasla/logify/releases/tag/elysia-v4.0.0
[5.1.0]: https://github.com/0xrasla/logify/releases/tag/elysia-v5.1.0
[5.1.1]: https://github.com/0xrasla/logify/releases/tag/elysia-v5.1.1
