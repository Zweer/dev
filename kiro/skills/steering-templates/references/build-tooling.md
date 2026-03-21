# Build & Tooling

## Build System

### tsdown
- **tsdown** for building all packages (NOT tsc, esbuild, rollup)
- Configuration: `tsdown.config.ts` at root
- Workspace mode for monorepos
- Outputs: `.mjs` + `.d.ts` + sourcemaps
- tsc is only used for type-checking (`tsc --noEmit`)

### Build Commands
```bash
npm run build              # Build with tsdown
npm run clean              # Remove dist/
npm run lint:typecheck     # Type-check only (tsc --noEmit)
```

## Linting & Formatting

### Biome
- **Biome** for linting and formatting (NOT ESLint/Prettier)
- Single quotes, 100 line width
- Uses `.editorconfig` for indent settings
- Import sorting with grouped blank lines

### Commands
```bash
npm run lint               # All linters in parallel
npm run lint:format        # Biome check + fix
npm run lint:typecheck     # TypeScript check
npm run lint:lockfile      # Lockfile security
npm run lint:package       # package.json validation
npm run lint:sort_package  # Sort package.json keys
npm run lint:engines       # Validate engine compatibility
```

## Git Hooks

### Lefthook
- **Lefthook** for git hooks (NOT husky + lint-staged)
- Configuration: `lefthook.yml` at root
- Pre-commit: biome → lockfile → package-lint → sort → build → typecheck → test
- Commit-msg: commitlint validation
- Built-in staging support (`stage_fixed: true`)

## Package Manager

### npm
- Use **npm** (NOT pnpm or yarn)
- Lock file: `package-lock.json`
- Workspaces enabled in root `package.json` for monorepos

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run build` | Build with tsdown |
| `npm run clean` | Remove dist/ |
| `npm run lint` | All linters in parallel |
| `npm test` | Run tests |
| `npm run test:coverage` | Tests with coverage |
