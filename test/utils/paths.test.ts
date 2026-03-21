import { describe, expect, it } from 'vitest';

import { paths } from '../../cli/utils/paths.js';

describe('paths', () => {
  it('should have root, configs, kiro, workflows', () => {
    expect(paths).toHaveProperty('root');
    expect(paths).toHaveProperty('configs');
    expect(paths).toHaveProperty('kiro');
    expect(paths).toHaveProperty('workflows');
  });

  it('should have configs under root', () => {
    expect(paths.configs).toContain(paths.root);
  });

  it('should have kiro under root', () => {
    expect(paths.kiro).toContain(paths.root);
  });

  it('should have workflows under root', () => {
    expect(paths.workflows).toContain(paths.root);
  });
});
