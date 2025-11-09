import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { startServer } from '../../utils/cao.js';

export async function executeServer(): Promise<void> {
  await startServer();
}

export const serverCommand = new Command()
  .name('server')
  .description('Launch the CAO server')
  .action(async () => {
    console.log(chalk.cyan('🚀 Starting CAO server...\n'));

    try {
      await executeServer();
    } catch (error) {
      console.error(chalk.red('Failed to start server'));
      console.error(error);
      process.exit(1);
    }
  });
