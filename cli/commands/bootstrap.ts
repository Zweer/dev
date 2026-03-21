import { exec } from 'node:child_process';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

import { Command } from '@commander-js/extra-typings';

import { CONFIG_FILES, copyConfig, copyWorkflows } from '../utils/configs.js';
import { paths } from '../utils/paths.js';

const execAsync = promisify(exec);

const DEV_DEPENDENCIES: Record<string, string> = {
  '@biomejs/biome': '^2.4.8',
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

interface TemplateVars {
  name: string;
  scope: string;
  description: string;
  author: string;
  homepage: string;
  bugs: string;
  repository: string;
}

async function copyTemplate(
  templateDir: string,
  targetDir: string,
  vars: TemplateVars,
): Promise<void> {
  const entries = await readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const src = join(templateDir, entry.name);
    const dest = join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await mkdir(dest, { recursive: true });
      await copyTemplate(src, dest, vars);
    } else {
      let content = await readFile(src, 'utf-8');
      for (const [key, value] of Object.entries(vars)) {
        content = content.replaceAll(`{{${key}}}`, value);
      }
      await writeFile(dest, content);
    }
  }
}

export const bootstrap = new Command()
  .name('bootstrap')
  .description('Bootstrap a new project with standard configuration')
  .argument('[name]', 'Package name', '@zweer/new-package')
  .option('-t, --type <type>', 'Project type: monorepo or single', 'single')
  .action(async (name, options) => {
    const scope = name.includes('/') ? name.split('/')[0] : '';
    const repoName = name.includes('/') ? name.split('/')[1] : name;
    const templateDir = join(paths.root, 'templates', options.type);

    const vars: TemplateVars = {
      name,
      scope,
      description: '',
      author: 'Zweer <n.olivieriachille@gmail.com>',
      homepage: `https://github.com/Zweer/${repoName}#readme`,
      bugs: `https://github.com/Zweer/${repoName}/issues`,
      repository: `git+https://github.com/Zweer/${repoName}.git`,
    };

    // Copy template with variable substitution
    const cwd = process.cwd();
    await copyTemplate(templateDir, cwd, vars);

    // Inject devDependencies into the generated package.json
    const pkgPath = join(cwd, 'package.json');
    const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
    pkg.devDependencies = DEV_DEPENDENCIES;
    pkg.homepage = vars.homepage;
    pkg.bugs = { url: vars.bugs };
    pkg.repository = { type: 'git', url: vars.repository };
    await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

    // Copy golden configs (biome, editorconfig, lefthook, etc.)
    for (const file of CONFIG_FILES) {
      await copyConfig(file, cwd);
    }

    // Copy base workflows
    await copyWorkflows('base', cwd);

    // Create .gitignore
    await writeFile(
      join(cwd, '.gitignore'),
      'dist/\nnode_modules/\ncoverage/\n*.lcov\n*.tsbuildinfo\n*.log\n.env\n.env.*\n!.env.example\n',
    );

    // Install deps + init git
    console.log('Installing dependencies...');
    await execAsync('npm install');

    console.log('Initializing git...');
    await execAsync('git init && git add . && git commit -m "chore: initial commit"');

    console.log(`\n✓ Project bootstrapped! (${options.type})`);
    console.log('\nNext: run `dev init-kiro` to set up AI-assisted development.');
  });
