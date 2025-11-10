import { exec } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

const execAsync = promisify(exec);

export const bootstrap = new Command()
  .name('bootstrap')
  .description('Bootstrap a new npm package with standard configuration')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(async (options) => {
    const answers = options.yes
      ? {
          name: '@zweer/new-package',
          description: 'A new package',
          author: 'Zweer <n.olivieriachille@gmail.com>',
        }
      : await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Package name:',
            default: '@zweer/new-package',
          },
          {
            type: 'input',
            name: 'description',
            message: 'Description:',
            default: 'A new package',
          },
          {
            type: 'input',
            name: 'author',
            message: 'Author:',
            default: 'Zweer <n.olivieriachille@gmail.com>',
          },
        ]);

    const spinner = ora('Bootstrapping project...').start();

    try {
      // Create package.json
      const packageJson = {
        name: answers.name,
        version: '0.0.0',
        description: answers.description,
        type: 'module',
        scripts: {
          lint: 'concurrently npm:lint:* --prefixColors auto',
          'lint:format': 'biome check --write',
          'lint:lockfile': 'lockfile-lint --path package-lock.json',
          'lint:engines': 'ls-engines',
          'lint:publish': 'publint --strict',
          test: 'vitest run',
          'test:coverage': 'vitest run --coverage',
          check:
            'npm run clean && npm run test:coverage && npm run build && npm run lint && npm run clean',
          prepare: 'husky',
          clean: 'rimraf --glob ./{src,test}/**/*.{d.ts,js} ./vitest*.{d.ts,js}',
          prebuild: 'npm run clean',
          build: 'tsc',
          release: 'semantic-release',
        },
        engines: {
          node: '>= 20.17',
        },
        publishConfig: {
          access: 'public',
          provenance: true,
        },
        release: {
          plugins: [
            '@semantic-release/commit-analyzer',
            '@semantic-release/release-notes-generator',
            '@semantic-release/changelog',
            '@semantic-release/npm',
            '@semantic-release/github',
            '@semantic-release/git',
          ],
        },
        keywords: [],
        author: answers.author,
        license: 'MIT',
        dependencies: {},
        devDependencies: {
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
          publint: '^0.3.15',
          rimraf: '^6.1.0',
          'semantic-release': '^25.0.2',
          typescript: '^5.9.3',
          vitest: '^4.0.8',
        },
      };

      await writeFile('package.json', JSON.stringify(packageJson, null, 2));

      // Create tsconfig.json
      const tsconfig = {
        extends: '@tsconfig/node22/tsconfig.json',
        compilerOptions: {
          declaration: true,
          skipLibCheck: true,
        },
      };

      await writeFile('tsconfig.json', JSON.stringify(tsconfig, null, 2));

      // Create biome.json
      const biome = {
        $schema: 'https://biomejs.dev/schemas/2.3.4/schema.json',
        vcs: {
          enabled: true,
          clientKind: 'git',
          useIgnoreFile: true,
        },
        files: {
          ignoreUnknown: false,
        },
        formatter: {
          enabled: true,
          useEditorconfig: true,
          lineWidth: 100,
        },
        linter: {
          enabled: true,
          rules: {
            recommended: true,
            suspicious: {
              noUnknownAtRules: 'off',
            },
          },
          domains: {
            test: 'recommended',
          },
        },
        javascript: {
          formatter: {
            quoteStyle: 'single',
          },
        },
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

      // Create vitest.config.ts
      const vitestConfig = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
`;

      await writeFile('vitest.config.ts', vitestConfig);

      // Create .lintstagedrc
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

      // Create .gitignore
      const gitignore = `# Typescript
*.js
*.d.ts

# Logs
logs
*.log
npm-debug.log*

# Coverage
coverage
*.lcov
.nyc_output

# Dependencies
node_modules/

# TypeScript cache
*.tsbuildinfo

# dotenv
.env
.env.*
!.env.example

# Build output
dist
`;

      await writeFile('.gitignore', gitignore);

      // Create .editorconfig
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

      // Create directories
      await mkdir('src', { recursive: true });
      await mkdir('test', { recursive: true });
      await mkdir('.husky', { recursive: true });

      // Create sample files
      await writeFile(
        'src/index.ts',
        `export function hello(name: string): string {
  return \`Hello, \${name}!\`;
}
`,
      );

      await writeFile(
        'test/index.test.ts',
        `import { describe, expect, it } from 'vitest';

import { hello } from '../src/index.js';

describe('hello', () => {
  it('should greet', () => {
    expect(hello('World')).toBe('Hello, World!');
  });
});
`,
      );

      // Create README
      const readme = `# ${answers.name}

${answers.description}

## Installation

\`\`\`bash
npm install ${answers.name}
\`\`\`

## Usage

\`\`\`typescript
import { hello } from '${answers.name}';

console.log(hello('World'));
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Lint
npm run lint
\`\`\`

## License

MIT
`;

      await writeFile('README.md', readme);

      spinner.text = 'Installing dependencies...';
      await execAsync('npm install');

      // Create .husky/pre-commit
      const preCommit = `export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"

lint-staged --concurrent false
git update-index --again
`;

      await writeFile('.husky/pre-commit', preCommit);
      await execAsync('chmod +x .husky/pre-commit');

      spinner.text = 'Initializing git...';
      await execAsync('git init');
      await execAsync('git add .');
      await execAsync('git commit -m "chore: initial commit"');

      spinner.succeed(chalk.green('✓ Project bootstrapped successfully!'));

      console.log('\nNext steps:');
      console.log(chalk.cyan('  npm test') + ' - Run tests');
      console.log(chalk.cyan('  npm run build') + ' - Build the project');
      console.log(chalk.cyan('  npm run lint') + ' - Lint the code');
    } catch (error) {
      spinner.fail(chalk.red('Failed to bootstrap project'));
      console.error(error);
      process.exit(1);
    }
  });
