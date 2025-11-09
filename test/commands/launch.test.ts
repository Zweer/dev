import { beforeEach, describe, expect, it, vi } from 'vitest';

import { executeLaunch, launchCommand } from '../../cli/commands/launch.js';
import * as cao from '../../cli/utils/cao.js';

// Mock cao utilities
vi.mock('../../cli/utils/cao.js', () => ({
  launchAgent: vi.fn(),
}));

describe('launch command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('command structure', () => {
    it('should be defined', () => {
      expect(launchCommand).toBeDefined();
    });

    it('should have correct name', () => {
      expect(launchCommand.name()).toBe('launch');
    });

    it('should have description', () => {
      expect(launchCommand.description()).toBe('Launch a specific agent');
    });

    it('should require agent argument', () => {
      const args = launchCommand.registeredArguments;
      expect(args).toHaveLength(1);
      expect(args[0].name()).toBe('agent');
      expect(args[0].required).toBe(true);
    });
  });

  describe('executeLaunch', () => {
    it('should call launchAgent with agent name', async () => {
      await executeLaunch('dev_frontend');

      expect(cao.launchAgent).toHaveBeenCalledWith('dev_frontend');
    });

    it('should handle different agent names', async () => {
      await executeLaunch('my_custom_agent');

      expect(cao.launchAgent).toHaveBeenCalledWith('my_custom_agent');
    });
  });
});
