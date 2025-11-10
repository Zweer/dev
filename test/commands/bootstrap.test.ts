import { exec } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { bootstrap } from '../../cli/commands/bootstrap.js';

vi.mock('node:fs/promises');
vi.mock('node:child_process');
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn().mockResolvedValue({
      name: '@test/package',
      description: 'Test package',
      author: 'Test Author',
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

describe('bootstrap command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // biome-ignore lint/suspicious/noExplicitAny: exec has complex overloaded types
    vi.mocked(exec).mockImplementation((_cmd: any, callback: any) => {
      callback(null, { stdout: '', stderr: '' });
      // biome-ignore lint/suspicious/noExplicitAny: mock return type
      return {} as any;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create package.json', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith(
      'package.json',
      expect.stringContaining('"name": "@zweer/new-package"'),
    );
  });

  it('should create tsconfig.json', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith(
      'tsconfig.json',
      expect.stringContaining('@tsconfig/node22'),
    );
  });

  it('should create biome.json', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith('biome.json', expect.stringContaining('biomejs.dev'));
  });

  it('should create vitest.config.ts', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith(
      'vitest.config.ts',
      expect.stringContaining('defineConfig'),
    );
  });

  it('should create .lintstagedrc', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith('.lintstagedrc', expect.stringContaining('biome'));
  });

  it('should create .gitignore', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith('.gitignore', expect.stringContaining('node_modules'));
  });

  it('should create .editorconfig', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith('.editorconfig', expect.stringContaining('utf-8'));
  });

  it('should create .npmpackagejsonlintrc.json', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith(
      '.npmpackagejsonlintrc.json',
      expect.stringContaining('require-author'),
    );
  });

  it('should create directories', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(mkdir).toHaveBeenCalledWith('src', { recursive: true });
    expect(mkdir).toHaveBeenCalledWith('test', { recursive: true });
    expect(mkdir).toHaveBeenCalledWith('.husky', { recursive: true });
  });

  it('should create sample files', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith('src/index.ts', expect.stringContaining('export'));
    expect(writeFile).toHaveBeenCalledWith('test/index.test.ts', expect.stringContaining('vitest'));
  });

  it('should create README', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith('README.md', expect.stringContaining('Installation'));
  });

  it('should create .husky/pre-commit', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(writeFile).toHaveBeenCalledWith(
      '.husky/pre-commit',
      expect.stringContaining('lint-staged'),
    );
  });

  it('should install dependencies', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(execAsync).toHaveBeenCalledWith('npm install');
  });

  it('should initialize git', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(execAsync).toHaveBeenCalledWith('git init');
    expect(execAsync).toHaveBeenCalledWith('git add .');
    expect(execAsync).toHaveBeenCalledWith('git commit -m "chore: initial commit"');
  });

  it('should make pre-commit executable', async () => {
    vi.mocked(execAsync).mockResolvedValue({ stdout: '', stderr: '' });

    await bootstrap.parseAsync(['node', 'test', '--yes'], { from: 'user' });

    expect(execAsync).toHaveBeenCalledWith('chmod +x .husky/pre-commit');
  });
});
