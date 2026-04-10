---
name: barrel-export
description: Auto-update barrel index.ts when a new source file is created in a package.
trigger: fileCreated
fileMatch: "**/packages/*/src/**/*.ts"
---

# Barrel Export Sync

When a new `.ts` file is created under `packages/*/src/`:

1. Find the nearest `index.ts` barrel file in the same `src/` directory
2. If it exists, add an `export * from './{filename}.js'` line (maintaining alphabetical order)
3. If no barrel exists, skip — don't create one automatically

Do NOT add exports for:
- Test files (`*.test.ts`, `*.spec.ts`)
- Type-only files (`types.ts`) — these should use `export type *`
- Internal/private files (prefixed with `_`)
