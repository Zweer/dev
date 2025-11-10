import { unlink } from 'node:fs/promises';
import { join } from 'node:path';

import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import inquirer from 'inquirer';

export async function removeAgent(name: string): Promise<void> {
  const agentPath = join('.cao/agents', `${name}.md`);
  await unlink(agentPath);
}

export const removeCommand = new Command()
  .name('remove')
  .description('Remove a local agent')
  .argument('<name>', 'Agent name to remove')
  .option('-y, --yes', 'Skip confirmation')
  .action(async (name, options) => {
    if (!options.yes) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Are you sure you want to remove ${name}?`,
          default: false,
        },
      ]);

      if (!confirm) {
        console.log(chalk.yellow('Cancelled'));
        return;
      }
    }

    try {
      await removeAgent(name);
      console.log(chalk.green(`✔ Agent ${name} removed`));
    } catch (error) {
      console.error(chalk.red(`✖ Failed to remove agent ${name}`));
      console.error(error);
      process.exit(1);
    }
  });
