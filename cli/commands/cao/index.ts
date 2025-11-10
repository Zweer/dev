import { Command } from '@commander-js/extra-typings';

import { agentCommand } from './agent/index.js';
import { initCommand } from './init.js';
import { installCommand } from './install.js';
import { launchCommand } from './launch.js';
import { listCommand } from './list.js';
import { serverCommand } from './server.js';
import { syncCommand } from './sync.js';

export const caoCommand = new Command()
  .name('cao')
  .description('Manage CAO (CLI Agent Orchestrator) and agents')
  .addCommand(initCommand)
  .addCommand(agentCommand)
  .addCommand(installCommand)
  .addCommand(syncCommand)
  .addCommand(serverCommand)
  .addCommand(launchCommand)
  .addCommand(listCommand);
