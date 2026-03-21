import { readFile, writeFile } from 'node:fs/promises';

import { Command } from '@commander-js/extra-typings';

import { CONFIG_FILES, copyConfig, copyWorkflows, fileExists } from '../utils/configs.js';

const DEV_DEPENDENCIES: Record<string, string> = {
  '@biomejs/biome': '^2.4.8',
  bonvoy: '^0.13.1',
  '@commitlint/cli': '^20.5.0',
  '@commitlint/config-conventional': '^20.5.0',
  '@tsconfig/node22': '^22.0.5',
  '@types/node': '^25.5.0',
  '@vitest/coverage-v8': '^4.1.0',
  concurrently: '^9.2.1',
  lefthook: '^2.1.4',
  'lockfile-lint': '^5.0.0',
  'ls-engines': '^0.10.0',
  'npm-package-json-lint': '^9.1.0',
  rimraf: '^6.1.3',
  'sort-package-json': '^3.6.1',
  tsdown: '^0.21.4',
  typescript: '^5.9.3',
  vitest: '^4.1.0',
};

const SCRIPTS: Record<string, string> = {
  build: 'tsdown',
  clean: 'rimraf dist',
  lint: 'concurrently npm:lint:* --prefixColors auto',
  'lint:engines': 'ls-engines',
  'lint:format': 'biome check --write',
  'lint:lockfile': 'lockfile-lint',
  'lint:package': 'npmPkgJsonLint .',
  'lint:sort_package': 'sort-package-json "package.json"',
  'lint:typecheck': 'tsc --noEmit',
  prepare: 'lefthook install',
  test: 'vitest run',
  'test:coverage': 'vitest run --coverage',
};

export const setup = new Command()
  .name('setup')
  .description('Add standard configuration to an existing project')
  .option('-y, --yes', 'Skip prompts and add all configurations')
  .action(async () => {
    const cwd = process.cwd();

    if (!(await fileExists('package.json'))) {
      console.error('package.json not found. Run this in a project directory.');
      process.exit(1);
    }

    // Copy config files (skip existing)
    for (const file of CONFIG_FILES) {
      const copied = await copyConfig(file, cwd);
      console.log(copied ? `  ✓ ${file.dest}` : `  · ${file.dest} (exists)`);
    }

    // Merge deps and scripts into package.json
    const pkg = JSON.parse(await readFile('package.json', 'utf-8'));
    pkg.devDependencies = { ...pkg.devDependencies, ...DEV_DEPENDENCIES };
    pkg.scripts = { ...pkg.scripts, ...SCRIPTS };
    if (!pkg.engines) pkg.engines = { node: '>= 22' };
    await writeFile('package.json', `${JSON.stringify(pkg, null, 2)}\n`);
    console.log('  ✓ package.json (deps + scripts merged)');

    // Copy base workflows
    await copyWorkflows('base', cwd);
    console.log('  ✓ .github/workflows/ (base)');

    console.log('\n✓ Setup complete!');
    console.log('\nNext: run `dev init-kiro` to set up AI-assisted development.');
  });
