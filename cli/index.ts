#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Command } from '@commander-js/extra-typings';

import { bootstrap } from './commands/bootstrap.js';
import { initKiro } from './commands/init-kiro.js';
import { setup } from './commands/setup.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json'), 'utf-8')) as {
  name: string;
  description: string;
  version: string;
};

const program = new Command().name(pkg.name).description(pkg.description).version(pkg.version);

program.addCommand(bootstrap);
program.addCommand(setup);
program.addCommand(initKiro);

program.parse();
