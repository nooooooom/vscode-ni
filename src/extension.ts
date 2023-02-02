// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { execaCommand } from 'execa'
import { COMMAND_KEYS, EXTENSION_NAME, getCommandName } from './constants'

// This method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const install = vscode.commands.registerCommand(
    getCommandName(COMMAND_KEYS.Install),
    async (uri: vscode.Uri) => {
      if (uri) {
        await execaCommand(`ni -C ${uri.fsPath}`, {
          stdio: 'inherit',
          encoding: 'utf-8',
          cwd: process.cwd()
        })
        vscode.window.showInformationMessage('success')
      } else {
        vscode.window.showErrorMessage(`${EXTENSION_NAME}: No folder path selected`)
      }
    }
  )

  context.subscriptions.push(install)
}

// This method is called when your extension is deactivated
export function deactivate() {
  // Noop
}
