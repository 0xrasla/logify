# Changelog

All notable changes to this package will be documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

## [1.1.0] - 2025-09-20

### Added
- Middleware now uses a dedicated HTTP logger instance by default allowing a distinct global logger format (implements feature request #6 parity with Elysia version).
- New option `useGlobal: true` to have the middleware use the global logger (legacy behaviour).

### Changed
- Request duration now measured using `performance.now()` with 2 decimal precision for more accurate timings of fast responses.

### Notes
- If you previously relied on passing formatting options to `logger()` to configure the global logger, call `initializeLogger()` separately or set `useGlobal: true`.

## [1.0.0] - 2025-09-??
- Initial release.

[1.1.0]: https://github.com/0xrasla/logify/releases/tag/express-v1.1.0
[1.0.0]: https://github.com/0xrasla/logify/releases/tag/express-v1.0.0
