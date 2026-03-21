import { describe, expect, it } from 'vitest';

import { hello } from '../src/index.js';

describe('hello', () => {
  it('should greet by name', () => {
    expect(hello('World')).toBe('Hello, World!');
  });
});
