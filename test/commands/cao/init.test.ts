import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createOrchestrator,
  getDefaultConfig,
  initCommand,
  type OrchestratorConfig,
} from '../../../cli/commands/cao/init.js';

// Mock fs/promises
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

describe('init command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('command structure', () => {
    it('should be defined', () => {
      expect(initCommand).toBeDefined();
    });

    it('should have correct name', () => {
      expect(initCommand.name()).toBe('init');
    });

    it('should have description', () => {
      expect(initCommand.description()).toBe('Create orchestrator in current project');
    });

    it('should have optional name argument', () => {
      const args = initCommand.registeredArguments;
      expect(args).toHaveLength(1);
      expect(args[0].name()).toBe('name');
      expect(args[0].required).toBe(false);
    });

    it('should have --yes option', () => {
      const options = initCommand.options;
      const yesOption = options.find((opt) => opt.short === '-y');
      expect(yesOption).toBeDefined();
      expect(yesOption?.long).toBe('--yes');
    });
  });

  describe('getDefaultConfig', () => {
    it('should return default config', () => {
      const config = getDefaultConfig('/path/to/my-project');

      expect(config.projectName).toBe('my-project');
      expect(config.name).toBe('my-project_orchestrator');
      expect(config.projectPath).toBe('/path/to/my-project');
      expect(config.techStack).toBe('Next.js, TypeScript, PostgreSQL');
      expect(config.projectStructure).toBe('app/, components/, lib/');
    });

    it('should use custom name if provided', () => {
      const config = getDefaultConfig('/path/to/my-project', 'custom_orchestrator');

      expect(config.name).toBe('custom_orchestrator');
    });

    it('should handle root path', () => {
      const config = getDefaultConfig('/');

      expect(config.projectName).toBe('');
      expect(config.projectPath).toBe('/');
    });
  });

  describe('createOrchestrator', () => {
    it('should read template and create orchestrator file', async () => {
      const templateContent =
        '---\nname: {{PROJECT_NAME}}_orchestrator\n---\n# {{PROJECT_NAME}}\nPath: {{PROJECT_PATH}}\nStack: {{TECH_STACK}}\nStructure: {{PROJECT_STRUCTURE}}';
      vi.mocked(readFile).mockResolvedValue(templateContent);
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const config: OrchestratorConfig = {
        name: 'test_orchestrator',
        projectName: 'test-project',
        projectPath: '/tmp/test',
        techStack: 'Next.js',
        projectStructure: 'app/',
      };

      const result = await createOrchestrator(config);

      expect(readFile).toHaveBeenCalledWith(expect.stringContaining('orchestrator.md'), 'utf-8');
      expect(mkdir).toHaveBeenCalledWith('/tmp/test/.cao/agents', { recursive: true });
      expect(writeFile).toHaveBeenCalledWith(
        '/tmp/test/.cao/agents/test_orchestrator.md',
        expect.stringContaining('test-project'),
      );
      expect(result.orchestratorPath).toBe('/tmp/test/.cao/agents/test_orchestrator.md');
    });

    it('should replace all placeholders', async () => {
      const templateContent =
        '{{PROJECT_NAME}} {{PROJECT_PATH}} {{TECH_STACK}} {{PROJECT_STRUCTURE}}';
      vi.mocked(readFile).mockResolvedValue(templateContent);
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const config: OrchestratorConfig = {
        name: 'test',
        projectName: 'MyProject',
        projectPath: '/my/path',
        techStack: 'React',
        projectStructure: 'src/',
      };

      await createOrchestrator(config);

      const writtenContent = vi.mocked(writeFile).mock.calls[0][1] as string;
      expect(writtenContent).toBe('MyProject /my/path React src/');
      expect(writtenContent).not.toContain('{{');
    });
  });
});
