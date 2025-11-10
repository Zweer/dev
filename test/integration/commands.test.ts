import { beforeEach, describe, expect, it, vi } from 'vitest';

import { installCommand } from '../../cli/commands/cao/install.js';
import { launchCommand } from '../../cli/commands/cao/launch.js';
import { listCommand } from '../../cli/commands/cao/list.js';
import { serverCommand } from '../../cli/commands/cao/server.js';

// Mock cao utilities
vi.mock('../../cli/utils/cao.js', () => ({
  installCao: vi.fn().mockResolvedValue(undefined),
  installAgent: vi.fn().mockResolvedValue(undefined),
  launchAgent: vi.fn().mockResolvedValue(undefined),
  startServer: vi.fn().mockResolvedValue(undefined),
  getInstalledAgents: vi.fn().mockResolvedValue(['agent1']),
  uninstallAgent: vi.fn().mockResolvedValue(undefined),
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

describe('cao commands integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list command', () => {
    it('should execute without errors', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        listCommand.parseAsync(['node', 'test', 'list'], { from: 'user' }),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('install command', () => {
    it('should execute with default options', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        installCommand.parseAsync(['node', 'test', 'install'], { from: 'user' }),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should execute with --cao-only', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        installCommand.parseAsync(['node', 'test', 'install', '--cao-only'], { from: 'user' }),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should execute with --agents-only', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        installCommand.parseAsync(['node', 'test', 'install', '--agents-only'], { from: 'user' }),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('server command', () => {
    it('should execute without errors', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        serverCommand.parseAsync(['node', 'test', 'server'], { from: 'user' }),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('launch command', () => {
    it('should execute without errors', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(
        launchCommand.parseAsync(['node', 'test', 'launch', 'dev_frontend'], { from: 'user' }),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });
  });
});
