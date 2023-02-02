export const EXTENSION_KEY = 'ni'

export const EXTENSION_NAME = 'vscode-ni'

export const COMMAND_KEYS = {
  ni: 'install',
  nr: 'run',
  nx: 'execute',
  nu: 'upgrade',
  nun: 'uninstall',
  nci: 'clean-install'
}

export const getCommandName = (command: string) => {
  return `${EXTENSION_KEY}.${command}`
}
