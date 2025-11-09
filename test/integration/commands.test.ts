import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initCommand } from '../../cli/commands/init.js';
import { installCommand } from '../../cli/commands/install.js';
import { launchCommand } from '../../cli/commands/launch.js';
import { listCommand } from '../../cli/commands/list.js';
import { serverCommand } from '../../cli/commands/server.js';

// Mock fs/promises for init
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

// Mock cao utilities
vi.mock('../../cli/utils/cao.js', () => ({
  installCao: vi.fn().mockResolvedValue(undefined),
  installAgent: vi.fn().mockResolvedValue(undefined),
  launchAgent: vi.fn().mockResolvedValue(undefined),
  startServer: vi.fn().mockResolvedValue(undefined),
}));

// Mock agents utility
vi.mock('../../cli/utils/agents.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../cli/utils/agents.js')>();
  return {
    ...actual,
    getAllAgents: vi.fn().mockResolvedValue([
      { name: 'agent1', path: '/path/1', category: 'web' },
      { name: 'agent2', path: '/path/2', category: 'services' },
    ]),
  };
});

describe('commands integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list command', () => {
    it('should execute without errors', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        listCommand.parseAsync(['node', 'test'], { from: 'user' }),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('init command', () => {
    it('should execute with --yes flag', async () => {
      const templateContent = '---\nname: {{PROJECT_NAME}}\n---\nContent';
      vi.mocked(readFile).mockResolvedValue(templateContent);
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        initCommand.parseAsync(['node', 'test', '--yes'], { from: 'user' }),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('install command', () => {
    it('should execute with default options', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        installCommand.parseAsync(['node', 'test'], { from: 'user' }),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should execute with --cao-only', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        installCommand.parseAsync(['node', 'test', '--cao-only'], { from: 'user' }),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should execute with --agents-only', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        installCommand.parseAsync(['node', 'test', '--agents-only'], { from: 'user' }),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('server command', () => {
    it('should execute without errors', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        serverCommand.parseAsync(['node', 'test'], { from: 'user' }),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('launch command', () => {
    it('should execute without errors', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        launchCommand.parseAsync(['node', 'test', 'dev_frontend'], { from: 'user' }),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });
  });
});
