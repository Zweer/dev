import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  executeInstallAgents,
  executeInstallCao,
  installCommand,
} from '../../../cli/commands/cao/install.js';
import * as agents from '../../../cli/utils/agents.js';
import * as cao from '../../../cli/utils/cao.js';

// Mock cao utilities
vi.mock('../../../cli/utils/cao.js', () => ({
  installCao: vi.fn(),
  installAgent: vi.fn(),
}));

// Mock agents utility
vi.mock('../../../cli/utils/agents.js', () => ({
  getAllAgents: vi.fn(),
}));

describe('install command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('command structure', () => {
    it('should be defined', () => {
      expect(installCommand).toBeDefined();
    });

    it('should have correct name', () => {
      expect(installCommand.name()).toBe('install');
    });

    it('should have description', () => {
      expect(installCommand.description()).toBe('Install CAO and all common agents');
    });

    it('should have --cao-only option', () => {
      const options = installCommand.options;
      const caoOnlyOption = options.find((opt) => opt.long === '--cao-only');
      expect(caoOnlyOption).toBeDefined();
    });

    it('should have --agents-only option', () => {
      const options = installCommand.options;
      const agentsOnlyOption = options.find((opt) => opt.long === '--agents-only');
      expect(agentsOnlyOption).toBeDefined();
    });
  });

  describe('executeInstallCao', () => {
    it('should call installCao', async () => {
      await executeInstallCao();

      expect(cao.installCao).toHaveBeenCalled();
    });
  });

  describe('executeInstallAgents', () => {
    it('should install all agents and return counts', async () => {
      vi.mocked(agents.getAllAgents).mockResolvedValue([
        { name: 'agent1', path: '/path/1', category: 'web' },
        { name: 'agent2', path: '/path/2', category: 'services' },
        { name: 'agent3', path: '/path/3', category: 'mobile' },
      ]);
      vi.mocked(cao.installAgent).mockResolvedValue(undefined);

      const result = await executeInstallAgents();

      expect(result.installed).toBe(3);
      expect(result.failed).toBe(0);
      expect(cao.installAgent).toHaveBeenCalledTimes(3);
    });

    it('should handle failed installations', async () => {
      vi.mocked(agents.getAllAgents).mockResolvedValue([
        { name: 'agent1', path: '/path/1', category: 'web' },
        { name: 'agent2', path: '/path/2', category: 'services' },
      ]);
      vi.mocked(cao.installAgent)
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Failed'));

      const result = await executeInstallAgents();

      expect(result.installed).toBe(1);
      expect(result.failed).toBe(1);
    });

    it('should continue on errors', async () => {
      vi.mocked(agents.getAllAgents).mockResolvedValue([
        { name: 'agent1', path: '/path/1', category: 'web' },
        { name: 'agent2', path: '/path/2', category: 'services' },
        { name: 'agent3', path: '/path/3', category: 'mobile' },
      ]);
      vi.mocked(cao.installAgent)
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Failed'));

      const result = await executeInstallAgents();

      expect(result.installed).toBe(1);
      expect(result.failed).toBe(2);
      expect(cao.installAgent).toHaveBeenCalledTimes(3);
    });
  });
});
