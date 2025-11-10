import { readdir } from 'node:fs/promises';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getLocalAgents, listCommand } from '../../../../cli/commands/cao/agent/list.js';

vi.mock('node:fs/promises');

describe('cao agent list command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLocalAgents', () => {
    it('should return list of local agents', async () => {
      vi.mocked(readdir).mockResolvedValue([
        'orchestrator.md',
        'specialist.md',
      ] as unknown as Awaited<ReturnType<typeof readdir>>);

      const agents = await getLocalAgents();

      expect(agents).toEqual(['orchestrator', 'specialist']);
    });

    it('should return empty array if directory does not exist', async () => {
      vi.mocked(readdir).mockRejectedValue(new Error('ENOENT'));

      const agents = await getLocalAgents();

      expect(agents).toEqual([]);
    });

    it('should filter only .md files', async () => {
      vi.mocked(readdir).mockResolvedValue([
        'agent.md',
        'test.txt',
        'other.json',
      ] as unknown as Awaited<ReturnType<typeof readdir>>);

      const agents = await getLocalAgents();

      expect(agents).toEqual(['agent']);
    });
  });

  describe('listCommand', () => {
    it('should have correct name and description', () => {
      expect(listCommand.name()).toBe('list');
      expect(listCommand.description()).toBe('List all local agents in .cao/agents/');
    });

    it('should list agents when they exist', async () => {
      vi.mocked(readdir).mockResolvedValue(['agent1.md', 'agent2.md'] as unknown as Awaited<
        ReturnType<typeof readdir>
      >);

      await listCommand.parseAsync(['node', 'test'], { from: 'user' });

      expect(readdir).toHaveBeenCalledWith('.cao/agents');
    });

    it('should handle no agents', async () => {
      vi.mocked(readdir).mockRejectedValue(new Error('ENOENT'));

      await listCommand.parseAsync(['node', 'test'], { from: 'user' });

      expect(readdir).toHaveBeenCalledWith('.cao/agents');
    });
  });
});
