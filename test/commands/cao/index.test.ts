import { describe, expect, it } from 'vitest';

import { caoCommand } from '../../../cli/commands/cao/index.js';

describe('cao command', () => {
  it('should be defined', () => {
    expect(caoCommand).toBeDefined();
  });

  it('should have correct name', () => {
    expect(caoCommand.name()).toBe('cao');
  });

  it('should have description', () => {
    expect(caoCommand.description()).toBe('Manage CAO (CLI Agent Orchestrator) and agents');
  });

  it('should have subcommands', () => {
    const subcommands = caoCommand.commands.map((cmd) => cmd.name());
    expect(subcommands).toContain('agent');
    expect(subcommands).toContain('install');
    expect(subcommands).toContain('sync');
    expect(subcommands).toContain('server');
    expect(subcommands).toContain('launch');
    expect(subcommands).toContain('list');
  });
});
