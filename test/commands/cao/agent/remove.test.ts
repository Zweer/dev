import { unlink } from 'node:fs/promises';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { removeAgent, removeCommand } from '../../../../cli/commands/cao/agent/remove.js';

vi.mock('node:fs/promises');

describe('cao agent remove command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('removeAgent', () => {
    it('should remove agent file', async () => {
      vi.mocked(unlink).mockResolvedValue();

      await removeAgent('test_agent');

      expect(unlink).toHaveBeenCalledWith('.cao/agents/test_agent.md');
    });

    it('should throw if file does not exist', async () => {
      vi.mocked(unlink).mockRejectedValue(new Error('ENOENT'));

      await expect(removeAgent('nonexistent')).rejects.toThrow('ENOENT');
    });

    it('should handle different agent names', async () => {
      vi.mocked(unlink).mockResolvedValue();

      await removeAgent('my_custom_agent');

      expect(unlink).toHaveBeenCalledWith('.cao/agents/my_custom_agent.md');
    });
  });

  describe('removeCommand', () => {
    it('should have correct name and description', () => {
      expect(removeCommand.name()).toBe('remove');
      expect(removeCommand.description()).toBe('Remove a local agent');
    });

    it('should require name argument', () => {
      const args = removeCommand.registeredArguments;
      expect(args).toHaveLength(1);
      expect(args[0].name()).toBe('name');
      expect(args[0].required).toBe(true);
    });

    it('should have yes option', () => {
      const options = removeCommand.options;
      expect(options.some((o) => o.long === '--yes')).toBe(true);
    });
  });
});
