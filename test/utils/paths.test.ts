import { existsSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { paths } from '../../cli/utils/paths.js';

describe('paths utility', () => {
  it('should have root path', () => {
    expect(paths.root).toBeDefined();
    expect(typeof paths.root).toBe('string');
  });

  it('should have agents directory', () => {
    expect(paths.agents).toBeDefined();
    expect(existsSync(paths.agents)).toBe(true);
  });

  it('should have templates directory', () => {
    expect(paths.templates).toBeDefined();
    expect(existsSync(paths.templates)).toBe(true);
  });
});
