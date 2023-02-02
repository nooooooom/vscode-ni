import * as vscode from 'vscode'
import type { Uri } from 'vscode'
import { statSync } from 'node:fs'
import { execaCommand } from 'execa'
import { COMMAND_KEYS, EXTENSION_NAME } from '../constants'
import { resolve } from 'node:path'

export type Command = keyof typeof COMMAND_KEYS

export function runNi(command: Command, directory: string, inlineOptions: string = '') {
  const cwd = process.cwd()
  const commandName = COMMAND_KEYS[command] || command

  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: `${EXTENSION_NAME}: ${commandName}`,
      cancellable: true
    },
    () => {
      return execaCommand(`${command} -C ${resolve(cwd, directory)} ${inlineOptions}`, {
        stdio: 'inherit',
        encoding: 'utf-8',
        cwd
      })
        .then(() => {
          vscode.window.showInformationMessage(`${commandName} success`)
        })
        .catch((reason) => {
          vscode.window.showErrorMessage(`${EXTENSION_NAME}: ${reason.message}`)
        })
    }
  )
}

export interface RunOptions {
  showInputBox?: boolean
}

export function run(command: Command, uri: Uri, options: RunOptions = {}) {
  if (uri) {
    if (options.showInputBox) {
      vscode.window
        .showInputBox({
          placeHolder: ''
        })
        .then((value) => value !== undefined && runNi(command, resolveDirectory(uri), value))
    } else {
      runNi(command, resolveDirectory(uri))
    }
  } else {
    vscode.window.showErrorMessage(`${EXTENSION_NAME}: No folder path selected`)
  }
}

function resolveDirectory(uri: Uri) {
  const { fsPath } = uri
  const directory = !statSync(fsPath).isDirectory() ? resolve(fsPath, '../') : fsPath

  if (process.platform === 'win32') {
    const systemDrivePath = /^[a-z]+:/.exec(directory)?.[0]
    if (systemDrivePath) {
      return `${systemDrivePath.toUpperCase()}${directory.slice(systemDrivePath.length)}`
    }
  }

  return directory
}
