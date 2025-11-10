import { Command } from '@commander-js/extra-typings';

import { createCommand } from './create.js';
import { listCommand } from './list.js';
import { removeCommand } from './remove.js';

export const agentCommand = new Command().name('agent').description('Manage local project agents');

agentCommand.addCommand(createCommand);
agentCommand.addCommand(listCommand);
agentCommand.addCommand(removeCommand);
