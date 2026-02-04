# Contributing to Logify

Thanks for your interest in contributing!

## Ways to contribute

- Report bugs or request features via GitHub Issues
- Improve documentation (README, examples)
- Fix bugs, add tests, or add new features

## Development setup

This repo is a monorepo with multiple packages under `packages/`.

### Prerequisites

- Node.js (see package `engines`)
- Bun (recommended; used for builds/tests in this repo)

### Install dependencies

From the repo root:

- `cd packages/elysia-js && bun install`
- `cd packages/express && bun install` (if working on Express package)

## Running checks

For Elysia package:

- `cd packages/elysia-js`
- `bun run typecheck`
- `bun test`
- `bun run build`

## Coding guidelines

- Keep changes focused and minimal
- Prefer adding/adjusting tests when changing behavior
- Avoid unrelated formatting-only changes
- Keep public APIs stable unless a breaking change is intended

## Commit messages

Use clear, conventional-style messages when possible, e.g.:

- `fix(elysia): handle 404 IP extraction`
- `feat(express): add option X`
- `docs: improve README`

## Pull requests

- Explain the problem and the approach
- Link issues (e.g. `Fixes #12`) where applicable
- Ensure CI/tests pass

## Code of Conduct

By participating in this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).
