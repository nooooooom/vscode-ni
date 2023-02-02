export const EXTENSION_KEY = 'ni'

export const EXTENSION_NAME = 'vscode-ni'

export const COMMAND_KEYS = {
  Install: 'install'
}

export const getCommandName = (command: string) => {
  return `${EXTENSION_KEY}.${command}`
}
