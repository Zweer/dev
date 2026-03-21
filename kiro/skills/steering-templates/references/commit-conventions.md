# Commit Conventions

**IMPORTANT**: The agent NEVER commits, pushes, or creates tags. The developer handles all git operations manually.

## Format

Use conventional commits with gitmoji as text (not emoji):

```
type(scope): :emoji_code: short description

Detailed explanation of what changed and why.
Include multiple lines if needed to fully describe:
- What was changed
- Why it was changed
- Any breaking changes or important notes
```

## Types

- `feat` — New feature (`:sparkles:`)
- `fix` — Bug fix (`:bug:`)
- `perf` — Performance improvement (`:zap:`)
- `docs` — Documentation (`:memo:`)
- `chore` — Maintenance tasks (`:wrench:`, `:arrow_up:`, `:bookmark:`)
- `refactor` — Code refactoring (`:recycle:`)
- `test` — Tests (`:white_check_mark:`)
- `style` — Code formatting (`:art:`)
- `ci` — CI/CD changes (`:construction_worker:`)
- `build` — Build system (`:hammer:`)

## Scope

Use only ONE scope per commit — typically the package, module, or component affected.

If `.vscode/settings.json` exists with `conventionalCommits.scopes`, use those values.
Scope is optional for cross-cutting changes.

## Gitmoji

**Always use text codes** (`:sparkles:`), **never actual emoji** (✨).

## Body

**Always include a detailed body** explaining:
1. What was changed
2. Why it was changed
3. Any important context or side effects

## Breaking Changes

Add `!` after the type/scope and include `BREAKING CHANGE:` in the body:

```
feat(api)!: :boom: remove deprecated methods

BREAKING CHANGE: Removed old API methods deprecated in v0.5.
```
