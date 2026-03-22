import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fileExists } from '../../cli/utils/configs.js';

// Mock child_process to avoid real npm install / git init
vi.mock('node:child_process', () => ({
  exec: vi.fn((_cmd: string, cb: (err: null, result: { stdout: string; stderr: string }) => void) =>
    cb(null, { stdout: '', stderr: '' }),
  ),
}));

let tempDir: string;
let originalCwd: string;
let originalArgv: string[];

beforeEach(async () => {
  const { mkdtemp } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  tempDir = await mkdtemp(join(tmpdir(), 'dev-bootstrap-'));
  originalCwd = process.cwd();
  originalArgv = process.argv;
  process.chdir(tempDir);
});

afterEach(async () => {
  process.chdir(originalCwd);
  process.argv = originalArgv;
  await rm(tempDir, { recursive: true, force: true });
});

async function runBootstrap(args: string[]): Promise<void> {
  // Re-import to get fresh command instance each time
  const mod = await import('../../cli/commands/bootstrap.js');
  await mod.bootstrap.parseAsync(['node', 'bootstrap', ...args]);
}

describe('bootstrap', () => {
  it('should create package.json with correct name and devDependencies', async () => {
    await runBootstrap(['@zweer/test-pkg']);

    const pkg = JSON.parse(await readFile(join(tempDir, 'package.json'), 'utf-8'));
    expect(pkg.name).toBe('@zweer/test-pkg');
    expect(pkg.devDependencies).toHaveProperty('vitest');
    expect(pkg.devDependencies).toHaveProperty('typescript');
    expect(pkg.devDependencies).toHaveProperty('@biomejs/biome');
  });

  it('should copy golden config files', async () => {
    await runBootstrap(['my-pkg']);

    expect(await fileExists(join(tempDir, 'biome.json'))).toBe(true);
    expect(await fileExists(join(tempDir, '.editorconfig'))).toBe(true);
    expect(await fileExists(join(tempDir, 'lefthook.yml'))).toBe(true);
    expect(await fileExists(join(tempDir, 'tsconfig.json'))).toBe(true);
    expect(await fileExists(join(tempDir, 'vitest.config.ts'))).toBe(true);
    expect(await fileExists(join(tempDir, 'commitlint.config.ts'))).toBe(true);
  });

  it('should copy base workflows', async () => {
    await runBootstrap(['my-pkg']);

    const wfDir = join(tempDir, '.github/workflows');
    expect(await fileExists(join(wfDir, 'ci.yml'))).toBe(true);
    expect(await fileExists(join(wfDir, 'pr.yml'))).toBe(true);
    expect(await fileExists(join(wfDir, 'security.yml'))).toBe(true);
  });

  it('should create .gitignore', async () => {
    await runBootstrap(['my-pkg']);

    const gitignore = await readFile(join(tempDir, '.gitignore'), 'utf-8');
    expect(gitignore).toContain('node_modules/');
    expect(gitignore).toContain('dist/');
    expect(gitignore).toContain('coverage/');
  });

  it('should scaffold template files', async () => {
    await runBootstrap(['@zweer/test-pkg']);

    expect(await fileExists(join(tempDir, 'src/index.ts'))).toBe(true);
    expect(await fileExists(join(tempDir, 'README.md'))).toBe(true);

    const readme = await readFile(join(tempDir, 'README.md'), 'utf-8');
    expect(readme).toContain('@zweer/test-pkg');
  });

  it('should set repository metadata from scoped name', async () => {
    await runBootstrap(['@zweer/my-lib']);

    const pkg = JSON.parse(await readFile(join(tempDir, 'package.json'), 'utf-8'));
    expect(pkg.homepage).toBe('https://github.com/Zweer/my-lib#readme');
    expect(pkg.bugs.url).toBe('https://github.com/Zweer/my-lib/issues');
    expect(pkg.repository.url).toBe('git+https://github.com/Zweer/my-lib.git');
  });

  it('should call npm install and git init', async () => {
    const { exec } = await import('node:child_process');
    await runBootstrap(['my-pkg']);

    const calls = (exec as ReturnType<typeof vi.fn>).mock.calls.map((c: unknown[]) => c[0]);
    expect(calls.some((c: string) => c.includes('npm install'))).toBe(true);
    expect(calls.some((c: string) => c.includes('git init'))).toBe(true);
  });
});
