import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getInstalledAgents: vi.fn().mockResolvedValue(['agent1', 'agent2']),
  uninstallAgent: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../cli/utils/cao.js', () => mocks);

import { uninstallCommand } from '../../../cli/commands/cao/uninstall.js';

describe('uninstall command', () => {
  let processExitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getInstalledAgents.mockResolvedValue(['agent1', 'agent2']);
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    processExitSpy.mockRestore();
  });

  it('should uninstall an installed agent', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await uninstallCommand.parseAsync(['agent1'], { from: 'user' });

    expect(mocks.uninstallAgent).toHaveBeenCalledWith('agent1');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('uninstalled successfully'));
    expect(processExitSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should fail when agent is not installed', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await uninstallCommand.parseAsync(['nonexistent'], { from: 'user' });

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('not installed'));
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
  });
});
