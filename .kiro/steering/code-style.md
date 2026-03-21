# Code Style & Best Practices

## TypeScript

### Strict Mode
- Always use strict mode (enabled in `tsconfig.json`)
- No `any` types — use `unknown` or proper types
- Explicit return types on all exported functions
- Explicit parameter types always

### Module System
- ES modules only (`"type": "module"` in package.json)
- Use `.js` extensions in imports (TypeScript requirement for ES modules)
- Example: `import { foo } from './bar.js'` (not `./bar` or `./bar.ts`)

### Naming Conventions
- **camelCase** for variables, functions, methods
- **PascalCase** for classes, interfaces, types
- **UPPER_SNAKE_CASE** for constants
- **kebab-case** for file names

### Code Organization
```typescript
// 1. Imports (external first, then internal)
import { execa } from 'execa';
import type { Config } from './types.js';

// 2. Types/Interfaces
export interface MyConfig {
  option: string;
}

// 3. Constants
const DEFAULT_TIMEOUT = 5000;

// 4. Classes/Functions
export class MyClass {}
```

### Type Definitions
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, intersections, mapped types
- Export all public types
- Use `readonly` for immutable properties

## Code Quality

### Minimal Code
- Write only what's necessary
- No premature abstractions
- No unused code or imports
- No commented-out code in commits

### Error Handling
- Always throw typed errors with clear messages
- Include context in error messages
- Use `try/catch` for async operations

### Async/Await
- Prefer `async/await` over `.then()/.catch()`
- Always handle errors in async functions
- Use `Promise.all()` for parallel operations

## Dependencies

### Minimal Dependencies
- Only add dependencies when absolutely necessary
- Prefer native Node.js APIs when possible
- Use `^` for dependencies (allow minor/patch updates)
- Keep dependencies up to date — run `npm outdated` regularly
- Security updates must be applied immediately

## Comments & Documentation

### When to Comment
- Complex algorithms or non-obvious logic
- Public APIs (JSDoc)
- Workarounds or hacks (with explanation)

### When NOT to Comment
- Obvious code
- Redundant information
- Commented-out code (delete it)
