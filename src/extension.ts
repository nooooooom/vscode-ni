// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { getCommandName } from './constants'
import { Command, run } from './core'
import { meta } from './meta'

/**
 * This method is called when your extension is activated
 * your extension is activated the very first time the command is executed
 *
 * TODO: 
 * 1. Show "upgrade" and "uninstall" commands when npm package is selected in package.json
 * 2. Show "run" commands when script commands is selected in package.json
 *
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
  const ni = vscode.commands.registerCommand('ni', async (uri: vscode.Uri) => {
    await run('ni', uri)
  })

  context.subscriptions.push(
    ni,
    ...Object.entries(meta).map(([command, options]) => {
      return vscode.commands.registerCommand(getCommandName(command), (uri: vscode.Uri) => {
        run(command as Command, uri, options)
      })
    })
  )
}

// This method is called when your extension is deactivated
export function deactivate() {
  // Noop
}
