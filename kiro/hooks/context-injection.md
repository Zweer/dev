---
name: context-injection
description: Load relevant steering docs when specific file types are edited.
trigger: fileEdited
fileMatch: "**/*.{ts,json,yml,yaml,md}"
---

# Context Injection

When a file is edited, load the relevant steering doc to ensure consistency:

| File pattern | Load steering |
|---|---|
| `*.test.ts`, `*.spec.ts` | `testing.md` |
| `biome.json`, `lefthook.yml`, `tsdown.config.ts`, `tsconfig.json` | `build-tooling.md` |
| `*.ts` (source code) | `code-style.md` |
| `CHANGELOG.md`, `.github/**` | `commit-conventions.md` |
| `**/*.svelte`, `**/app/**`, `**/pages/**` | `web-nextjs.md` (if exists) |

Only load the steering doc if it exists in `.kiro/steering/`. Skip silently if not found.
