import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createAgent,
  createCommand,
  getDefaultConfig,
} from '../../../../cli/commands/cao/agent/create.js';

vi.mock('node:fs/promises');
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn().mockResolvedValue({
      name: 'test_agent',
      projectName: 'TestProject',
      techStack: 'React',
      projectStructure: 'src/',
    }),
  },
}));
vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    text: '',
  })),
}));

describe('cao agent create command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDefaultConfig', () => {
    it('should return default config', () => {
      const config = getDefaultConfig('/path/to/project', 'my_agent', 'orchestrator');

      expect(config).toEqual({
        name: 'my_agent',
        projectName: 'project',
        projectPath: '/path/to/project',
        techStack: 'Next.js, TypeScript, PostgreSQL',
        projectStructure: 'app/, components/, lib/',
        template: 'orchestrator',
      });
    });

    it('should use project name as default agent name', () => {
      const config = getDefaultConfig('/path/to/my-project');

      expect(config.name).toBe('my-project_orchestrator');
    });
  });

  describe('createAgent', () => {
    it('should create agent from template', async () => {
      vi.mocked(readFile).mockResolvedValue('Template {{PROJECT_NAME}}');

      const config = getDefaultConfig('/project', 'test_agent', 'orchestrator');
      await createAgent(config);

      expect(mkdir).toHaveBeenCalledWith('/project/.cao/agents', { recursive: true });
      expect(writeFile).toHaveBeenCalledWith(
        '/project/.cao/agents/test_agent.md',
        'Template project',
      );
    });

    it('should replace all placeholders', async () => {
      vi.mocked(readFile).mockResolvedValue(
        '{{PROJECT_NAME}} {{PROJECT_PATH}} {{TECH_STACK}} {{PROJECT_STRUCTURE}}',
      );

      const config = {
        name: 'agent',
        projectName: 'MyProject',
        projectPath: '/path',
        techStack: 'React',
        projectStructure: 'src/',
        template: 'orchestrator',
      };

      await createAgent(config);

      const writeCall = vi.mocked(writeFile).mock.calls[0];
      expect(writeCall[1]).toBe('MyProject /path React src/');
    });
  });

  describe('createCommand', () => {
    it('should have correct name and description', () => {
      expect(createCommand.name()).toBe('create');
      expect(createCommand.description()).toBe('Create a new agent in current project');
    });

    it('should accept name argument', () => {
      const args = createCommand.registeredArguments;
      expect(args).toHaveLength(1);
      expect(args[0].name()).toBe('name');
    });

    it('should have template and yes options', () => {
      const options = createCommand.options;
      expect(options.some((o) => o.long === '--template')).toBe(true);
      expect(options.some((o) => o.long === '--yes')).toBe(true);
    });

    it('should create agent with --yes flag', async () => {
      vi.mocked(readFile).mockResolvedValue('Template');

      await createCommand.parseAsync(['node', 'test', 'my_agent', '--yes'], { from: 'user' });

      expect(mkdir).toHaveBeenCalled();
      expect(writeFile).toHaveBeenCalled();
    });
  });
});
