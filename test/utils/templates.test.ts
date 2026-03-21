import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { copyTemplate } from '../../cli/utils/templates.js';

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), 'dev-tpl-'));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe('copyTemplate', () => {
  it('should copy files with variable substitution', async () => {
    const src = join(tempDir, 'tpl');
    const dest = join(tempDir, 'out');
    await mkdir(src, { recursive: true });
    await mkdir(dest, { recursive: true });
    await writeFile(join(src, 'README.md'), '# {{name}}\n\nBy {{author}}');

    await copyTemplate(src, dest, { name: 'my-pkg', author: 'Test' });

    const content = await readFile(join(dest, 'README.md'), 'utf-8');
    expect(content).toBe('# my-pkg\n\nBy Test');
  });

  it('should recurse into subdirectories', async () => {
    const src = join(tempDir, 'tpl');
    const dest = join(tempDir, 'out');
    await mkdir(join(src, 'sub'), { recursive: true });
    await mkdir(dest, { recursive: true });
    await writeFile(join(src, 'sub', 'file.ts'), 'export const pkg = "{{name}}";');

    await copyTemplate(src, dest, { name: 'deep' });

    const content = await readFile(join(dest, 'sub', 'file.ts'), 'utf-8');
    expect(content).toBe('export const pkg = "deep";');
  });

  it('should handle files with no variables', async () => {
    const src = join(tempDir, 'tpl');
    const dest = join(tempDir, 'out');
    await mkdir(src, { recursive: true });
    await mkdir(dest, { recursive: true });
    await writeFile(join(src, 'plain.txt'), 'no vars here');

    await copyTemplate(src, dest, { name: 'x' });

    const content = await readFile(join(dest, 'plain.txt'), 'utf-8');
    expect(content).toBe('no vars here');
  });
});
