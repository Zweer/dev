import { readdir } from 'node:fs/promises';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { executeSync, syncCommand } from '../../../cli/commands/cao/sync.js';
import * as cao from '../../../cli/utils/cao.js';

vi.mock('node:fs/promises');
vi.mock('../../../cli/utils/cao.js');

describe('cao sync command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('executeSync', () => {
    it('should sync all agents in .cao/agents/', async () => {
      vi.mocked(readdir).mockResolvedValue(['agent1.md', 'agent2.md'] as unknown as Awaited<
        ReturnType<typeof readdir>
      >);
      vi.mocked(cao.installAgent).mockResolvedValue();

      const result = await executeSync();

      expect(readdir).toHaveBeenCalledWith('.cao/agents');
      expect(cao.installAgent).toHaveBeenCalledTimes(2);
      expect(cao.installAgent).toHaveBeenCalledWith('.cao/agents/agent1.md');
      expect(cao.installAgent).toHaveBeenCalledWith('.cao/agents/agent2.md');
      expect(result).toEqual({ installed: 2, failed: 0 });
    });

    it('should handle failed installations', async () => {
      vi.mocked(readdir).mockResolvedValue(['agent1.md', 'agent2.md'] as unknown as Awaited<
        ReturnType<typeof readdir>
      >);
      vi.mocked(cao.installAgent)
        .mockResolvedValueOnce()
        .mockRejectedValueOnce(new Error('Install failed'));

      const result = await executeSync();

      expect(result).toEqual({ installed: 1, failed: 1 });
    });

    it('should throw if .cao/agents directory does not exist', async () => {
      vi.mocked(readdir).mockRejectedValue(new Error('ENOENT'));

      await expect(executeSync()).rejects.toThrow('Failed to read .cao/agents directory');
    });
  });

  describe('syncCommand', () => {
    it('should have correct name and description', () => {
      expect(syncCommand.name()).toBe('sync');
      expect(syncCommand.description()).toBe('Sync all local agents from .cao/agents/');
    });

    it('should sync agents when executed', async () => {
      vi.mocked(readdir).mockResolvedValue(['agent1.md'] as unknown as Awaited<
        ReturnType<typeof readdir>
      >);
      vi.mocked(cao.installAgent).mockResolvedValue();

      await syncCommand.parseAsync(['node', 'test'], { from: 'user' });

      expect(readdir).toHaveBeenCalledWith('.cao/agents');
      expect(cao.installAgent).toHaveBeenCalled();
    });
  });
});
