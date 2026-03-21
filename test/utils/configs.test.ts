import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  CONFIG_FILES,
  copyConfig,
  copyWorkflows,
  fileExists,
  mergePackageJson,
} from '../../cli/utils/configs.js';

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), 'dev-test-'));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe('fileExists', () => {
  it('should return true for existing file', async () => {
    const file = join(tempDir, 'test.txt');
    await writeFile(file, 'hello');
    expect(await fileExists(file)).toBe(true);
  });

  it('should return false for non-existing file', async () => {
    expect(await fileExists(join(tempDir, 'nope.txt'))).toBe(false);
  });
});

describe('CONFIG_FILES', () => {
  it('should have 9 config files', () => {
    expect(CONFIG_FILES).toHaveLength(9);
  });

  it('should include biome.json', () => {
    expect(CONFIG_FILES.find((f) => f.dest === 'biome.json')).toBeDefined();
  });

  it('should map editorconfig to .editorconfig', () => {
    const ec = CONFIG_FILES.find((f) => f.src === 'editorconfig');
    expect(ec?.dest).toBe('.editorconfig');
  });
});

describe('copyConfig', () => {
  it('should copy a config file to target', async () => {
    const file = CONFIG_FILES[0]; // biome.json
    const copied = await copyConfig(file, tempDir);
    expect(copied).toBe(true);
    expect(await fileExists(join(tempDir, file.dest))).toBe(true);
  });

  it('should skip if file already exists', async () => {
    const file = CONFIG_FILES[0];
    await writeFile(join(tempDir, file.dest), 'existing');
    const copied = await copyConfig(file, tempDir);
    expect(copied).toBe(false);
    // Should not overwrite
    const content = await readFile(join(tempDir, file.dest), 'utf-8');
    expect(content).toBe('existing');
  });
});

describe('copyWorkflows', () => {
  it('should copy base workflows', async () => {
    await copyWorkflows('base', tempDir);
    const wfDir = join(tempDir, '.github/workflows');
    expect(await fileExists(join(wfDir, 'ci.yml'))).toBe(true);
    expect(await fileExists(join(wfDir, 'pr.yml'))).toBe(true);
    expect(await fileExists(join(wfDir, 'security.yml'))).toBe(true);
    expect(await fileExists(join(wfDir, 'dependabot-auto-merge.yml'))).toBe(true);
  });

  it('should not overwrite existing workflows', async () => {
    const wfDir = join(tempDir, '.github/workflows');
    const { mkdir } = await import('node:fs/promises');
    await mkdir(wfDir, { recursive: true });
    await writeFile(join(wfDir, 'ci.yml'), 'custom');

    await copyWorkflows('base', tempDir);
    const content = await readFile(join(wfDir, 'ci.yml'), 'utf-8');
    expect(content).toBe('custom');
  });
});

describe('mergePackageJson', () => {
  it('should merge scripts and devDependencies', async () => {
    await writeFile(
      join(tempDir, 'package.json'),
      JSON.stringify({ name: 'test', scripts: { existing: 'true' } }),
    );

    await mergePackageJson(tempDir, {
      scripts: { build: 'tsdown' },
      devDependencies: { vitest: '^4.0.0' },
    });

    const pkg = JSON.parse(await readFile(join(tempDir, 'package.json'), 'utf-8'));
    expect(pkg.scripts.existing).toBe('true');
    expect(pkg.scripts.build).toBe('tsdown');
    expect(pkg.devDependencies.vitest).toBe('^4.0.0');
  });
});
