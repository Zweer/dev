import { beforeEach, describe, expect, it, vi } from 'vitest';

import { executeServer, serverCommand } from '../../cli/commands/server.js';
import * as cao from '../../cli/utils/cao.js';

// Mock cao utilities
vi.mock('../../cli/utils/cao.js', () => ({
  startServer: vi.fn(),
}));

describe('server command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('command structure', () => {
    it('should be defined', () => {
      expect(serverCommand).toBeDefined();
    });

    it('should have correct name', () => {
      expect(serverCommand.name()).toBe('server');
    });

    it('should have description', () => {
      expect(serverCommand.description()).toBe('Launch the CAO server');
    });
  });

  describe('executeServer', () => {
    it('should call startServer', async () => {
      await executeServer();

      expect(cao.startServer).toHaveBeenCalled();
    });
  });
});
