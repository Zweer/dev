import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export async function runCommand(command: string): Promise<{ stdout: string; stderr: string }> {
  return execAsync(command);
}

export async function installCao(): Promise<void> {
  // Install tmux config
  await runCommand(
    'curl -s https://raw.githubusercontent.com/awslabs/cli-agent-orchestrator/refs/heads/main/tmux-install.sh -o /tmp/tmux-install.sh && bash /tmp/tmux-install.sh || true',
  );

  // Install uv
  await runCommand('curl -LsSf https://astral.sh/uv/install.sh | sh');

  // Install CAO
  await runCommand(
    'uv tool install git+https://github.com/awslabs/cli-agent-orchestrator.git@main --upgrade',
  );
}

export async function installAgent(agentPath: string): Promise<void> {
  await runCommand(`cao install "${agentPath}"`);
}

export async function launchAgent(agentName: string): Promise<void> {
  await runCommand(`cao launch --agents ${agentName}`);
}

export async function startServer(): Promise<void> {
  await runCommand('cao-server');
}
