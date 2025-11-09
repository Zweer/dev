import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { paths } from '../cli/utils/paths.js';

describe('CLI structure', () => {
  it('should have all required directories', () => {
    expect(existsSync(paths.agents)).toBe(true);
    expect(existsSync(paths.templates)).toBe(true);
  });

  it('should have orchestrator template', () => {
    const templatePath = join(paths.templates, 'orchestrator.md');
    expect(existsSync(templatePath)).toBe(true);
  });

  it('should have agent categories', () => {
    const categories = ['web', 'services', 'infrastructure', 'mobile', 'quality'];

    for (const category of categories) {
      const categoryPath = join(paths.agents, category);
      expect(existsSync(categoryPath)).toBe(true);
    }
  });
});
