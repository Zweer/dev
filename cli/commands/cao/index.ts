import { Command } from '@commander-js/extra-typings';

import { initCommand } from './init.js';
import { installCommand } from './install.js';
import { launchCommand } from './launch.js';
import { listCommand } from './list.js';
import { serverCommand } from './server.js';

export const caoCommand = new Command()
  .name('cao')
  .description('Manage CAO (CLI Agent Orchestrator) and agents')
  .addCommand(initCommand)
  .addCommand(installCommand)
  .addCommand(serverCommand)
  .addCommand(launchCommand)
  .addCommand(listCommand);
