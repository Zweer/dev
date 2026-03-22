import { readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fileExists } from '../../cli/utils/configs.js';

let tempDir: string;
let originalCwd: string;
let originalArgv: string[];
let exitSpy: ReturnType<typeof vi.spyOn>;

beforeEach(async () => {
  const { mkdtemp } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  tempDir = await mkdtemp(join(tmpdir(), 'dev-setup-'));
  originalCwd = process.cwd();
  originalArgv = process.argv;
  process.chdir(tempDir);
  exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
    throw new Error('process.exit called');
  }) as never);
});

afterEach(async () => {
  process.chdir(originalCwd);
  process.argv = originalArgv;
  exitSpy.mockRestore();
  await rm(tempDir, { recursive: true, force: true });
});

async function runSetup(args: string[] = []): Promise<void> {
  const mod = await import('../../cli/commands/setup.js');
  await mod.setup.parseAsync(['node', 'setup', ...args]);
}

describe('setup', () => {
  it('should exit with error if no package.json exists', async () => {
    await expect(runSetup()).rejects.toThrow('process.exit called');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('should merge devDependencies and scripts into existing package.json', async () => {
    await writeFile(
      join(tempDir, 'package.json'),
      JSON.stringify({
        name: 'existing-project',
        scripts: { start: 'node index.js' },
        devDependencies: { 'my-dep': '^1.0.0' },
      }),
    );

    await runSetup();

    const pkg = JSON.parse(await readFile(join(tempDir, 'package.json'), 'utf-8'));
    // Existing preserved
    expect(pkg.scripts.start).toBe('node index.js');
    expect(pkg.devDependencies['my-dep']).toBe('^1.0.0');
    // New ones added
    expect(pkg.scripts.build).toBe('tsdown');
    expect(pkg.scripts.test).toBe('vitest run');
    expect(pkg.devDependencies.vitest).toBeDefined();
    expect(pkg.devDependencies.typescript).toBeDefined();
  });

  it('should add engines field if missing', async () => {
    await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));

    await runSetup();

    const pkg = JSON.parse(await readFile(join(tempDir, 'package.json'), 'utf-8'));
    expect(pkg.engines.node).toBe('>= 22');
  });

  it('should not overwrite existing engines field', async () => {
    await writeFile(
      join(tempDir, 'package.json'),
      JSON.stringify({ name: 'test', engines: { node: '>= 20' } }),
    );

    await runSetup();

    const pkg = JSON.parse(await readFile(join(tempDir, 'package.json'), 'utf-8'));
    expect(pkg.engines.node).toBe('>= 20');
  });

  it('should copy golden config files', async () => {
    await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));

    await runSetup();

    expect(await fileExists(join(tempDir, 'biome.json'))).toBe(true);
    expect(await fileExists(join(tempDir, '.editorconfig'))).toBe(true);
    expect(await fileExists(join(tempDir, 'lefthook.yml'))).toBe(true);
  });

  it('should not overwrite existing config files', async () => {
    await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));
    await writeFile(join(tempDir, 'biome.json'), '{"custom": true}');

    await runSetup();

    const content = await readFile(join(tempDir, 'biome.json'), 'utf-8');
    expect(content).toBe('{"custom": true}');
  });

  it('should copy base workflows', async () => {
    await writeFile(join(tempDir, 'package.json'), JSON.stringify({ name: 'test' }));

    await runSetup();

    const wfDir = join(tempDir, '.github/workflows');
    expect(await fileExists(join(wfDir, 'ci.yml'))).toBe(true);
    expect(await fileExists(join(wfDir, 'pr.yml'))).toBe(true);
  });
});
