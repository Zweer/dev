import { exec } from 'node:child_process';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setup } from '../../cli/commands/setup.js';

vi.mock('node:fs/promises');
vi.mock('node:child_process');
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn().mockResolvedValue({
      configs: ['all'],
    }),
  },
}));
vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    text: '',
  })),
}));

const execAsync = promisify(exec);

describe('setup command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(access).mockResolvedValue(undefined);
    vi.mocked(readFile).mockResolvedValue(
      JSON.stringify({
        name: 'existing-project',
        version: '1.0.0',
        scripts: {},
        devDependencies: {},
      }),
    );
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should check for package.json', async () => {
    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(access).toHaveBeenCalledWith('package.json');
  });

  it('should merge dependencies into existing package.json', async () => {
    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    const writeCall = vi.mocked(writeFile).mock.calls.find((call) => call[0] === 'package.json');
    expect(writeCall).toBeDefined();

    const pkg = JSON.parse(writeCall?.[1] as string);
    expect(pkg.devDependencies).toHaveProperty('@biomejs/biome');
    expect(pkg.devDependencies).toHaveProperty('typescript');
    expect(pkg.devDependencies).toHaveProperty('vitest');
  });

  it('should merge scripts into existing package.json', async () => {
    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    const writeCall = vi.mocked(writeFile).mock.calls.find((call) => call[0] === 'package.json');
    expect(writeCall).toBeDefined();

    const pkg = JSON.parse(writeCall?.[1] as string);
    expect(pkg.scripts).toHaveProperty('lint');
    expect(pkg.scripts).toHaveProperty('test');
    expect(pkg.scripts).toHaveProperty('build');
  });

  it('should add engines if not present', async () => {
    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    const writeCall = vi.mocked(writeFile).mock.calls.find((call) => call[0] === 'package.json');
    const pkg = JSON.parse(writeCall?.[1] as string);

    expect(pkg.engines).toEqual({ node: '>= 20.17' });
  });

  it('should add publishConfig if not present', async () => {
    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    const writeCall = vi.mocked(writeFile).mock.calls.find((call) => call[0] === 'package.json');
    const pkg = JSON.parse(writeCall?.[1] as string);

    expect(pkg.publishConfig).toEqual({ access: 'public', provenance: true });
  });

  it('should add semantic-release config if not present', async () => {
    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    const writeCall = vi.mocked(writeFile).mock.calls.find((call) => call[0] === 'package.json');
    const pkg = JSON.parse(writeCall?.[1] as string);

    expect(pkg.release).toBeDefined();
    expect(pkg.release.plugins).toContain('@semantic-release/commit-analyzer');
  });

  it('should skip existing files', async () => {
    vi.mocked(access).mockImplementation(async (path) => {
      if (path === 'tsconfig.json') throw new Error('not found');
      return undefined;
    });

    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    const tsconfigWrite = vi
      .mocked(writeFile)
      .mock.calls.find((call) => call[0] === 'tsconfig.json');
    expect(tsconfigWrite).toBeDefined();
  });

  it('should create tsconfig.json if not exists', async () => {
    vi.mocked(access).mockImplementation(async (path) => {
      if (path === 'tsconfig.json') throw new Error('not found');
      return undefined;
    });

    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith(
      'tsconfig.json',
      expect.stringContaining('@tsconfig/node22'),
    );
  });

  it('should create biome.json if not exists', async () => {
    vi.mocked(access).mockImplementation(async (path) => {
      if (path === 'biome.json') throw new Error('not found');
      return undefined;
    });

    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith('biome.json', expect.stringContaining('biomejs.dev'));
  });

  it('should create vitest.config.ts if not exists', async () => {
    vi.mocked(access).mockImplementation(async (path) => {
      if (path === 'vitest.config.ts') throw new Error('not found');
      return undefined;
    });

    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith(
      'vitest.config.ts',
      expect.stringContaining('defineConfig'),
    );
  });

  it('should create .lintstagedrc if not exists', async () => {
    vi.mocked(access).mockImplementation(async (path) => {
      if (path === '.lintstagedrc') throw new Error('not found');
      return undefined;
    });

    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith('.lintstagedrc', expect.stringContaining('biome'));
  });

  it('should create .editorconfig if not exists', async () => {
    vi.mocked(access).mockImplementation(async (path) => {
      if (path === '.editorconfig') throw new Error('not found');
      return undefined;
    });

    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith('.editorconfig', expect.stringContaining('utf-8'));
  });

  it('should create .husky directory', async () => {
    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(mkdir).toHaveBeenCalledWith('.husky', { recursive: true });
  });

  it('should create .husky/pre-commit if not exists', async () => {
    vi.mocked(access).mockImplementation(async (path) => {
      if (path === '.husky/pre-commit') throw new Error('not found');
      return undefined;
    });

    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith(
      '.husky/pre-commit',
      expect.stringContaining('lint-staged'),
    );
  });

  it('should make pre-commit executable', async () => {
    vi.mocked(access).mockImplementation(async (path) => {
      if (path === '.husky/pre-commit') throw new Error('not found');
      return undefined;
    });

    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(execAsync).toHaveBeenCalledWith('chmod +x .husky/pre-commit');
  });

  it('should install dependencies', async () => {
    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(execAsync).toHaveBeenCalledWith('npm install');
  });

  it('should preserve existing package.json values', async () => {
    vi.mocked(readFile).mockResolvedValue(
      JSON.stringify({
        name: 'existing-project',
        version: '1.0.0',
        scripts: { start: 'node index.js' },
        devDependencies: { eslint: '^8.0.0' },
      }),
    );

    await setup.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    const writeCall = vi.mocked(writeFile).mock.calls.find((call) => call[0] === 'package.json');
    const pkg = JSON.parse(writeCall?.[1] as string);

    expect(pkg.scripts.start).toBe('node index.js');
    expect(pkg.devDependencies.eslint).toBe('^8.0.0');
  });
});
