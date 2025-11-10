import { exec } from 'node:child_process';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

const execAsync = promisify(exec);

const DEV_DEPENDENCIES = {
  '@biomejs/biome': '^2.3.4',
  '@semantic-release/changelog': '^6.0.3',
  '@semantic-release/git': '^10.0.1',
  '@tsconfig/node22': '^22.0.2',
  '@types/node': '^24.10.0',
  '@vitest/coverage-v8': '^4.0.8',
  concurrently: '^9.2.1',
  husky: '^9.1.7',
  'lint-staged': '^16.2.6',
  'lockfile-lint': '^4.14.1',
  'ls-engines': '^0.9.3',
  'npm-package-json-lint': '^8.0.0',
  'npm-package-json-lint-config-default': '^7.0.1',
  publint: '^0.3.15',
  rimraf: '^6.1.0',
  'semantic-release': '^25.0.2',
  typescript: '^5.9.3',
  vitest: '^4.0.8',
};

const SCRIPTS = {
  lint: 'concurrently npm:lint:* --prefixColors auto',
  'lint:format': 'biome check --write',
  'lint:lockfile': 'lockfile-lint --path package-lock.json',
  'lint:engines': 'ls-engines',
  'lint:package': 'npmPkgJsonLint .',
  'lint:publish': 'publint --strict',
  test: 'vitest run',
  'test:coverage': 'vitest run --coverage',
  check: 'npm run clean && npm run test:coverage && npm run build && npm run lint && npm run clean',
  prepare: 'husky',
  clean: 'rimraf --glob ./{src,test}/**/*.{d.ts,js} ./vitest*.{d.ts,js}',
  prebuild: 'npm run clean',
  build: 'tsc',
  release: 'semantic-release',
};

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export const setup = new Command()
  .name('setup')
  .description('Add standard configuration to an existing project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(async (options) => {
    const answers = options.yes
      ? { configs: ['all'] }
      : await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'configs',
            message: 'Select configurations to add:',
            choices: [
              { name: 'All', value: 'all', checked: true },
              { name: 'TypeScript (tsconfig.json)', value: 'typescript' },
              { name: 'Biome (biome.json)', value: 'biome' },
              { name: 'Vitest (vitest.config.ts)', value: 'vitest' },
              { name: 'Lint-staged (.lintstagedrc)', value: 'lintstaged' },
              { name: 'EditorConfig (.editorconfig)', value: 'editorconfig' },
              { name: 'Package JSON Lint (.npmpackagejsonlintrc.json)', value: 'packagejsonlint' },
              { name: 'Husky (.husky/pre-commit)', value: 'husky' },
              { name: 'Dependencies', value: 'deps' },
              { name: 'Scripts', value: 'scripts' },
            ],
          },
        ]);

    const selected = answers.configs.includes('all')
      ? [
          'typescript',
          'biome',
          'vitest',
          'lintstaged',
          'editorconfig',
          'packagejsonlint',
          'husky',
          'deps',
          'scripts',
        ]
      : answers.configs;

    const spinner = ora('Setting up project...').start();

    try {
      // Update package.json
      if (selected.includes('deps') || selected.includes('scripts')) {
        const pkgPath = 'package.json';
        if (!(await fileExists(pkgPath))) {
          spinner.fail(chalk.red('package.json not found. Run this in a project directory.'));
          process.exit(1);
        }

        const pkgContent = await readFile(pkgPath, 'utf-8');
        const pkg = JSON.parse(pkgContent);

        if (selected.includes('deps')) {
          spinner.text = 'Adding dependencies...';
          pkg.devDependencies = { ...pkg.devDependencies, ...DEV_DEPENDENCIES };
        }

        if (selected.includes('scripts')) {
          spinner.text = 'Adding scripts...';
          pkg.scripts = { ...pkg.scripts, ...SCRIPTS };

          if (!pkg.engines) {
            pkg.engines = { node: '>= 20.17' };
          }

          if (!pkg.publishConfig) {
            pkg.publishConfig = { access: 'public', provenance: true };
          }

          if (!pkg.release) {
            pkg.release = {
              plugins: [
                '@semantic-release/commit-analyzer',
                '@semantic-release/release-notes-generator',
                '@semantic-release/changelog',
                '@semantic-release/npm',
                '@semantic-release/github',
                '@semantic-release/git',
              ],
            };
          }
        }

        await writeFile(pkgPath, JSON.stringify(pkg, null, 2));
      }

      // TypeScript
      if (selected.includes('typescript') && !(await fileExists('tsconfig.json'))) {
        spinner.text = 'Creating tsconfig.json...';
        const tsconfig = {
          extends: '@tsconfig/node22/tsconfig.json',
          compilerOptions: {
            declaration: true,
            skipLibCheck: true,
          },
        };
        await writeFile('tsconfig.json', JSON.stringify(tsconfig, null, 2));
      }

      // Biome
      if (selected.includes('biome') && !(await fileExists('biome.json'))) {
        spinner.text = 'Creating biome.json...';
        const biome = {
          $schema: 'https://biomejs.dev/schemas/2.3.4/schema.json',
          vcs: { enabled: true, clientKind: 'git', useIgnoreFile: true },
          files: { ignoreUnknown: false },
          formatter: { enabled: true, useEditorconfig: true, lineWidth: 100 },
          linter: {
            enabled: true,
            rules: { recommended: true, suspicious: { noUnknownAtRules: 'off' } },
            domains: { test: 'recommended' },
          },
          javascript: { formatter: { quoteStyle: 'single' } },
          assist: {
            enabled: true,
            actions: {
              source: {
                organizeImports: {
                  level: 'on',
                  options: {
                    groups: [
                      ':URL:',
                      ':BLANK_LINE:',
                      [':BUN:', ':NODE:'],
                      ':BLANK_LINE:',
                      [':PACKAGE_WITH_PROTOCOL:', ':PACKAGE:'],
                      ':BLANK_LINE:',
                      ':ALIAS:',
                      ':BLANK_LINE:',
                      ':PATH:',
                    ],
                  },
                },
              },
            },
          },
        };
        await writeFile('biome.json', JSON.stringify(biome, null, 2));
      }

      // Vitest
      if (selected.includes('vitest') && !(await fileExists('vitest.config.ts'))) {
        spinner.text = 'Creating vitest.config.ts...';
        const vitestConfig = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
`;
        await writeFile('vitest.config.ts', vitestConfig);
      }

      // Lint-staged
      if (selected.includes('lintstaged') && !(await fileExists('.lintstagedrc'))) {
        spinner.text = 'Creating .lintstagedrc...';
        const lintStaged = `"*.{ts,tsx}":
  - "bash -c 'npm test'"

"package.json":
  - "bash -c 'npm test'"
  - "bash -c 'npm run build'"
  - "bash -c 'npm run lint:lockfile'"
  - "bash -c 'npm run lint:engines'"
  - "bash -c 'npm run lint:publish'"
  - "bash -c 'npm run clean'"

"*.{ts,tsx,json,yaml,graphql,md,css,scss,html}":
  - "biome check --write --no-errors-on-unmatched --files-ignore-unknown=true"
`;
        await writeFile('.lintstagedrc', lintStaged);
      }

      // EditorConfig
      if (selected.includes('editorconfig') && !(await fileExists('.editorconfig'))) {
        spinner.text = 'Creating .editorconfig...';
        const editorconfig = `# http://editorconfig.org/
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
`;
        await writeFile('.editorconfig', editorconfig);
      }

      // Package JSON Lint
      if (
        selected.includes('packagejsonlint') &&
        !(await fileExists('.npmpackagejsonlintrc.json'))
      ) {
        spinner.text = 'Creating .npmpackagejsonlintrc.json...';

        // Get author from package.json if it exists
        let author = 'Your Name <your.email@example.com>';
        try {
          const pkgContent = await readFile('package.json', 'utf-8');
          const pkg = JSON.parse(pkgContent);
          if (pkg.author) {
            author = pkg.author;
          }
        } catch {
          // Ignore if package.json doesn't exist or can't be read
        }

        const npmPackageJsonLintrc = {
          rules: {
            'require-author': 'error',
            'require-description': 'error',
            'require-engines': 'error',
            'require-license': 'error',
            'require-name': 'error',
            'require-repository': 'error',
            'require-version': 'error',
            'require-bugs': 'error',
            'require-homepage': 'error',
            'require-keywords': 'error',
            'bin-type': 'error',
            'config-type': 'error',
            'description-type': 'error',
            'devDependencies-type': 'error',
            'directories-type': 'error',
            'engines-type': 'error',
            'files-type': 'error',
            'homepage-type': 'error',
            'keywords-type': 'error',
            'license-type': 'error',
            'main-type': 'error',
            'man-type': 'error',
            'name-type': 'error',
            'preferGlobal-type': 'error',
            'private-type': 'error',
            'repository-type': 'error',
            'scripts-type': 'error',
            'version-type': 'error',
            'valid-values-author': ['error', [author]],
            'valid-values-private': ['error', [false]],
            'no-restricted-dependencies': ['error', ['gulping-npm-package-json-lint']],
            'no-restricted-pre-release-dependencies': ['error', ['gulping-npm-package-json-lint']],
            'no-restricted-devDependencies': ['error', ['gulping-npm-package-json-lint']],
            'no-restricted-pre-release-devDependencies': [
              'error',
              ['gulping-npm-package-json-lint'],
            ],
            'name-format': 'error',
            'version-format': 'error',
          },
        };

        await writeFile(
          '.npmpackagejsonlintrc.json',
          JSON.stringify(npmPackageJsonLintrc, null, 2),
        );
      }

      // Husky
      if (selected.includes('husky')) {
        spinner.text = 'Creating .husky/pre-commit...';
        await mkdir('.husky', { recursive: true });

        if (!(await fileExists('.husky/pre-commit'))) {
          const preCommit = `export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"

lint-staged --concurrent false
git update-index --again
`;
          await writeFile('.husky/pre-commit', preCommit);
          await execAsync('chmod +x .husky/pre-commit');
        }
      }

      // Install dependencies
      if (selected.includes('deps')) {
        spinner.text = 'Installing dependencies...';
        await execAsync('npm install');
      }

      spinner.succeed(chalk.green('✓ Project setup complete!'));

      console.log('\nAdded configurations:');
      if (selected.includes('typescript')) console.log(chalk.cyan('  ✓ tsconfig.json'));
      if (selected.includes('biome')) console.log(chalk.cyan('  ✓ biome.json'));
      if (selected.includes('vitest')) console.log(chalk.cyan('  ✓ vitest.config.ts'));
      if (selected.includes('lintstaged')) console.log(chalk.cyan('  ✓ .lintstagedrc'));
      if (selected.includes('editorconfig')) console.log(chalk.cyan('  ✓ .editorconfig'));
      if (selected.includes('packagejsonlint'))
        console.log(chalk.cyan('  ✓ .npmpackagejsonlintrc.json'));
      if (selected.includes('husky')) console.log(chalk.cyan('  ✓ .husky/pre-commit'));
      if (selected.includes('deps')) console.log(chalk.cyan('  ✓ Dependencies'));
      if (selected.includes('scripts')) console.log(chalk.cyan('  ✓ Scripts'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to setup project'));
      console.error(error);
      process.exit(1);
    }
  });
