# Testing Strategy

## Test Framework

### Vitest
- All tests use **Vitest** (NOT Jest, Mocha, or others)
- Configuration in `vitest.config.ts` at root
- v8 coverage provider
- Coverage reporters: text, json, json-summary

## Test Structure

### File Organization
```
src/
└── feature.ts
test/
└── feature.test.ts
```

### Test Pattern (AAA)
```typescript
import { describe, it, expect } from 'vitest';

describe('FeatureName', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = doSomething(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

## Mocking

### When to Mock
- External APIs, file system, git commands, network requests

### When NOT to Mock
- Internal functions, simple utilities, pure functions

## Best Practices

### Test Naming
- Use `should` in test names: "should throw error when input is invalid"

### Independence
- Each test must be independent — no shared state
- Use `beforeEach` for setup

### Edge Cases
- Empty arrays/strings, null/undefined, invalid input, boundary values

### Coverage
- Exclude barrel re-exports (`index.ts`) and type files (`types.ts`)
- Include all source files in coverage
