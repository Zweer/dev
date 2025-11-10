import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { installAgent } from '../../utils/cao.js';

export async function executeSync(): Promise<{ installed: number; failed: number }> {
  const caoAgentsDir = '.cao/agents';
  let installed = 0;
  let failed = 0;

  try {
    const files = await readdir(caoAgentsDir);
    const agentFiles = files.filter((f) => f.endsWith('.md'));

    for (const file of agentFiles) {
      const agentPath = join(caoAgentsDir, file);
      try {
        await installAgent(agentPath);
        console.log(chalk.green(`  ✔ ${file}`));
        installed++;
      } catch (error) {
        console.log(chalk.red(`  ✖ ${file}`));
        console.error(chalk.dim(`    ${error}`));
        failed++;
      }
    }
  } catch (error) {
    throw new Error(`Failed to read .cao/agents directory: ${error}`);
  }

  return { installed, failed };
}

export const syncCommand = new Command()
  .name('sync')
  .description('Sync all local agents from .cao/agents/')
  .action(async () => {
    console.log(chalk.cyan('Syncing local agents...\n'));

    try {
      const { installed, failed } = await executeSync();

      console.log();
      if (failed === 0) {
        console.log(chalk.green(`✔ All ${installed} agents synced successfully`));
      } else {
        console.log(chalk.yellow(`⚠ Synced ${installed} agents, ${failed} failed`));
      }
    } catch (error) {
      console.error(chalk.red('✖ Failed to sync agents'));
      console.error(error);
      process.exit(1);
    }
  });
