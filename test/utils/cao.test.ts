import type { ChildProcess, ExecException } from 'node:child_process';
import { EventEmitter } from 'node:events';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as cao from '../../cli/utils/cao.js';

// Mock the entire cao module instead of child_process
vi.mock('node:child_process', () => ({
  exec: vi.fn(
    (
      _cmd: string,
      callback: (error: ExecException | null, stdout: string, stderr: string) => void,
    ): ChildProcess => {
      callback(null, '', '');
      return {} as ChildProcess;
    },
  ),
  spawn: vi.fn(() => {
    const mockProcess = new EventEmitter() as ChildProcess;
    setTimeout(() => mockProcess.emit('close', 0), 0);
    return mockProcess;
  }),
}));

vi.mock('node:fs/promises', () => ({
  readdir: vi.fn().mockResolvedValue(['agent1.md', 'agent2.md', 'not-an-agent.txt']),
  unlink: vi.fn().mockResolvedValue(undefined),
}));

describe('cao utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('runCommand', () => {
    it('should be a function', () => {
      expect(typeof cao.runCommand).toBe('function');
    });

    it('should return a promise', () => {
      const result = cao.runCommand('echo test');
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('installCao', () => {
    it('should be a function', () => {
      expect(typeof cao.installCao).toBe('function');
    });

    it('should return a promise', () => {
      const result = cao.installCao();
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('installAgent', () => {
    it('should be a function', () => {
      expect(typeof cao.installAgent).toBe('function');
    });

    it('should return a promise', () => {
      const result = cao.installAgent('/path/to/agent.md');
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('launchAgent', () => {
    it('should be a function', () => {
      expect(typeof cao.launchAgent).toBe('function');
    });

    it('should return a promise', () => {
      const result = cao.launchAgent('dev_frontend');
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('startServer', () => {
    it('should be a function', () => {
      expect(typeof cao.startServer).toBe('function');
    });

    it('should return a promise', () => {
      const result = cao.startServer();
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('getInstalledAgents', () => {
    it('should return list of installed agents', async () => {
      const agents = await cao.getInstalledAgents();
      expect(agents).toEqual(['agent1', 'agent2']);
    });

    it('should filter out non-md files', async () => {
      const agents = await cao.getInstalledAgents();
      expect(agents).not.toContain('not-an-agent');
    });

    it('should return empty array on error', async () => {
      const { readdir } = await import('node:fs/promises');
      vi.mocked(readdir).mockRejectedValueOnce(new Error('Directory not found'));

      const agents = await cao.getInstalledAgents();
      expect(agents).toEqual([]);
    });
  });

  describe('uninstallAgent', () => {
    it('should call unlink with correct path', async () => {
      const { unlink } = await import('node:fs/promises');

      await cao.uninstallAgent('test_agent');

      expect(unlink).toHaveBeenCalledWith(expect.stringContaining('test_agent.md'));
    });
  });
});
