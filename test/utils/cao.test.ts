import type { ChildProcess, ExecException } from 'node:child_process';

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
});
