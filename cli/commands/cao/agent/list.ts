import { readdir } from 'node:fs/promises';

import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

export async function getLocalAgents(): Promise<string[]> {
  const caoAgentsDir = '.cao/agents';

  try {
    const files = await readdir(caoAgentsDir);
    return files.filter((f) => f.endsWith('.md')).map((f) => f.replace('.md', ''));
  } catch {
    return [];
  }
}

export const listCommand = new Command()
  .name('list')
  .description('List all local agents in .cao/agents/')
  .action(async () => {
    const agents = await getLocalAgents();

    if (agents.length === 0) {
      console.log(chalk.yellow('No local agents found in .cao/agents/'));
      console.log(chalk.dim('\nCreate one with: dev cao agent create <name>'));
      return;
    }

    console.log(chalk.bold(`\nLocal Agents (${agents.length}):\n`));

    for (const agent of agents) {
      console.log(chalk.cyan(`  • ${agent}`));
    }

    console.log();
  });
