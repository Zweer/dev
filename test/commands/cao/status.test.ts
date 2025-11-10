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

import { statusCommand } from '../../../cli/commands/cao/status.js';

describe('status command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display installation status', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await statusCommand.parseAsync(['node', 'test'], { from: 'user' });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Agent Installation Status'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Installed: 2'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Not installed: 1'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Total: 3'));

    consoleSpy.mockRestore();
  });

  it('should list not installed agents', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await statusCommand.parseAsync(['node', 'test'], { from: 'user' });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Not installed agents'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('agent2'));

    consoleSpy.mockRestore();
  });

  it('should not show not installed section when all are installed', async () => {
    const { getAllAgents } = await import('../../../cli/utils/agents.js');
    const { getInstalledAgents } = await import('../../../cli/utils/cao.js');

    vi.mocked(getAllAgents).mockResolvedValueOnce([
      { name: 'agent1', path: '/path/1', category: 'web' },
    ]);
    vi.mocked(getInstalledAgents).mockResolvedValueOnce(['agent1']);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await statusCommand.parseAsync(['node', 'test'], { from: 'user' });

    const calls = consoleSpy.mock.calls.map((call) => call[0]).join('\n');
    expect(calls).not.toContain('Not installed agents');

    consoleSpy.mockRestore();
  });
});
