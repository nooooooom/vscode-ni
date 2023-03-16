import { NiCommands } from '@nooooooom/unpm'

export const EXTENSION_KEY = 'ni'

export const EXTENSION_NAME = 'vscode-ni'

export const COMMAND_NAMES: Record<NiCommands, string> = {
  ni: 'install',
  nr: 'run',
  nix: 'execute',
  nu: 'upgrade',
  nun: 'uninstall',
  nci: 'clean-install',
  na: 'agent'
}

export const getCommandName = (command: string) => {
  return `${EXTENSION_KEY}.${command}`
}
