import { Command } from '@commander-js/extra-typings';

import { agentCommand } from './agent/index.js';
import { installCommand } from './install.js';
import { launchCommand } from './launch.js';
import { listCommand } from './list.js';
import { serverCommand } from './server.js';
import { statusCommand } from './status.js';
import { syncCommand } from './sync.js';
import { uninstallCommand } from './uninstall.js';

export const caoCommand = new Command()
  .name('cao')
  .description('Manage CAO (CLI Agent Orchestrator) and agents')
  .addCommand(agentCommand)
  .addCommand(installCommand)
  .addCommand(uninstallCommand)
  .addCommand(syncCommand)
  .addCommand(serverCommand)
  .addCommand(launchCommand)
  .addCommand(listCommand)
  .addCommand(statusCommand);
