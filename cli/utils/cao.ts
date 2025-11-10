import { exec, spawn } from 'node:child_process';
import { readdir, unlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const CAO_AGENT_DIR = join(homedir(), '.aws', 'cli-agent-orchestrator', 'agent-context');

export async function runCommand(command: string): Promise<{ stdout: string; stderr: string }> {
  return execAsync(command);
}

export async function runInteractiveCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      shell: true,
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

export async function installCao(): Promise<void> {
  // Install tmux config
  await runInteractiveCommand(
    'curl -s https://raw.githubusercontent.com/awslabs/cli-agent-orchestrator/refs/heads/main/tmux-install.sh -o /tmp/tmux-install.sh && bash /tmp/tmux-install.sh || true',
  );

  // Install uv
  await runInteractiveCommand('curl -LsSf https://astral.sh/uv/install.sh | sh');

  // Install CAO
  await runInteractiveCommand(
    'uv tool install git+https://github.com/awslabs/cli-agent-orchestrator.git@main --upgrade',
  );
}

export async function installAgent(agentPath: string): Promise<void> {
  await runInteractiveCommand(`cao install "${agentPath}"`);
}

export async function launchAgent(agentName: string): Promise<void> {
  await runInteractiveCommand(`cao launch --agents ${agentName}`);
}

export async function startServer(): Promise<void> {
  await runInteractiveCommand('cao-server');
}

export async function getInstalledAgents(): Promise<string[]> {
  try {
    const files = await readdir(CAO_AGENT_DIR);
    return files.filter((f) => f.endsWith('.md')).map((f) => f.replace('.md', ''));
  } catch {
    return [];
  }
}

export async function uninstallAgent(agentName: string): Promise<void> {
  await unlink(join(CAO_AGENT_DIR, `${agentName}.md`));
}
