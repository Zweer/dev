#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';

import { caoCommand } from './commands/cao/index.js';

const program = new Command()
  .name('dev')
  .description('Shared configurations & AI agents for software projects')
  .version('0.1.0');

program.addCommand(caoCommand);

program.parse();
