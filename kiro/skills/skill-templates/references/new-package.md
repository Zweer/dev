# Create New Package in Monorepo

## 1. Detect project structure

Check if the project uses:
- npm workspaces (`package.json` has `"workspaces"` field)
- Workspace pattern (e.g., `packages/*`)
- Naming convention (scoped like `@org/name` or unscoped)

## 2. Read existing package metadata

From root `package.json` or an existing package, extract:
- `author`, `license`, `repository`, `homepage`, `bugs`

## 3. Create directory structure

```bash
mkdir -p <workspace-path>/<name>/{src,test}
```

## 4. Create package.json

```json
{
  "name": "<package-name>",
  "version": "0.0.0",
  "description": "<Short description>",
  "type": "module",
  "exports": {
    ".": "./dist/index.js",
    "./package.json": "./package.json"
  },
  "files": ["dist"],
  "dependencies": {},
  "engines": { "node": ">=<version from root>" }
}
```

Use `^` for internal deps (e.g., `"@org/core": "^1.0.0"`).

## 5. Create src/index.ts

Minimal entry point with a placeholder export.

## 6. Create test file

Match the project's test framework (Vitest):

```typescript
import { describe, it, expect } from 'vitest';
import { hello } from '../src/index.js';

describe('Package', () => {
  it('should work', () => {
    expect(hello()).toBe('Hello from new package');
  });
});
```

## 7. Create README.md and CHANGELOG.md

## 8. Add scope to .vscode/settings.json

If `conventionalCommits.scopes` exists, add the package name (without scope prefix).

## 9. Install, build, test

```bash
npm install && npm run build && npm test
```

**Note**: tsconfig.json is NOT needed per package — TypeScript uses the root tsconfig.json.
