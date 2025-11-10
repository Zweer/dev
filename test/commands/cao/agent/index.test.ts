import { describe, expect, it } from 'vitest';

import { agentCommand } from '../../../../cli/commands/cao/agent/index.js';

describe('cao agent command group', () => {
  it('should have correct name and description', () => {
    expect(agentCommand.name()).toBe('agent');
    expect(agentCommand.description()).toBe('Manage local project agents');
  });

  it('should have create subcommand', () => {
    const commands = agentCommand.commands;
    expect(commands.some((c) => c.name() === 'create')).toBe(true);
  });

  it('should have list subcommand', () => {
    const commands = agentCommand.commands;
    expect(commands.some((c) => c.name() === 'list')).toBe(true);
  });

  it('should have remove subcommand', () => {
    const commands = agentCommand.commands;
    expect(commands.some((c) => c.name() === 'remove')).toBe(true);
  });
});
