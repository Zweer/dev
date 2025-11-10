import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../cli/utils/agents.js', () => ({
  getAllAgents: vi.fn().mockResolvedValue([
    { name: 'agent1', path: '/path/1', category: 'web' },
    { name: 'agent2', path: '/path/2', category: 'services' },
    { name: 'agent3', path: '/path/3', category: 'web' },
  ]),
}));

vi.mock('../../../cli/utils/cao.js', () => ({
  getInstalledAgents: vi.fn().mockResolvedValue(['agent1', 'agent3']),
}));

import { groupAgentsByCategory, listCommand } from '../../../cli/commands/cao/list.js';
import type { Agent } from '../../../cli/utils/agents.js';

describe('list command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('command structure', () => {
    it('should be defined', () => {
      expect(listCommand).toBeDefined();
    });

    it('should have correct name', () => {
      expect(listCommand.name()).toBe('list');
    });

    it('should have description', () => {
      expect(listCommand.description()).toBe('List all available agents');
    });
  });

  describe('command execution', () => {
    it('should list all agents with status', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await listCommand.parseAsync(['node', 'test'], { from: 'user' });

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Available Agents'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('agent1'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('agent2'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('2 installed'));

      consoleSpy.mockRestore();
    });

    it('should filter installed agents with --installed flag', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await listCommand.parseAsync(['node', 'test', '--installed'], { from: 'user' });

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Installed Agents'));
      const calls = consoleSpy.mock.calls.map((call) => call[0]).join('\n');
      expect(calls).toContain('agent1');
      expect(calls).toContain('agent3');
      expect(calls).not.toContain('agent2');

      consoleSpy.mockRestore();
    });
  });

  describe('groupAgentsByCategory', () => {
    it('should group agents by category', () => {
      const agents: Agent[] = [
        { name: 'agent1', path: '/path/1', category: 'web' },
        { name: 'agent2', path: '/path/2', category: 'web' },
        { name: 'agent3', path: '/path/3', category: 'services' },
      ];

      const grouped = groupAgentsByCategory(agents);

      expect(grouped.web).toHaveLength(2);
      expect(grouped.services).toHaveLength(1);
    });

    it('should group agents with subcategories', () => {
      const agents: Agent[] = [
        { name: 'agent1', path: '/path/1', category: 'web', subcategory: 'frontend' },
        { name: 'agent2', path: '/path/2', category: 'web', subcategory: 'backend' },
        { name: 'agent3', path: '/path/3', category: 'web' },
      ];

      const grouped = groupAgentsByCategory(agents);

      expect(grouped['web/frontend']).toHaveLength(1);
      expect(grouped['web/backend']).toHaveLength(1);
      expect(grouped.web).toHaveLength(1);
    });

    it('should handle empty array', () => {
      const grouped = groupAgentsByCategory([]);

      expect(Object.keys(grouped)).toHaveLength(0);
    });

    it('should handle multiple categories', () => {
      const agents: Agent[] = [
        { name: 'a1', path: '/1', category: 'web' },
        { name: 'a2', path: '/2', category: 'services' },
        { name: 'a3', path: '/3', category: 'mobile' },
        { name: 'a4', path: '/4', category: 'quality' },
      ];

      const grouped = groupAgentsByCategory(agents);

      expect(Object.keys(grouped)).toHaveLength(4);
      expect(grouped.web).toHaveLength(1);
      expect(grouped.services).toHaveLength(1);
      expect(grouped.mobile).toHaveLength(1);
      expect(grouped.quality).toHaveLength(1);
    });
  });
});
