# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[5.0.1]: https://github.com/0xrasla/logify/releases/tag/elysia-v5.0.1
[5.0.0]: https://github.com/0xrasla/logify/releases/tag/elysia-v5.0.0
[4.0.0]: https://github.com/0xrasla/logify/releases/tag/elysia-v4.0.0
[5.1.0]: https://github.com/0xrasla/logify/releases/tag/elysia-v5.1.0
[5.1.1]: https://github.com/0xrasla/logify/releases/tag/elysia-v5.1.1
