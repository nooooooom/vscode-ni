import * as vscode from 'vscode'
import type { Uri } from 'vscode'
import { statSync } from 'node:fs'
import { execaCommand } from 'execa'
import { COMMAND_NAMES, EXTENSION_NAME } from '../constants'
import { resolve } from 'node:path'
import { Agent, Agents, detect, NiCommands, resolveNiCommandStatement } from '@nooooooom/unpm'

export interface RunOptions {
  showInputBox?: boolean
}

export async function run(command: NiCommands, uri: Uri, options: RunOptions = {}) {
  if (uri) {
    const dir = resolveDirectory(uri)
    let agent: Agent | null | undefined = await detect({
      cwd: dir
    })
    let inlineOptions = ''

    if (!agent) {
      agent = (await vscode.window.showQuickPick(Agents, {
        placeHolder: 'No npm agent detected in the current project, place pick a agent'
      })) as Agent

      if (!agent) {
        vscode.window.showErrorMessage(
          `${EXTENSION_NAME}: No npm agent detected in the current project`
        )
        return
      }
    }

    if (options.showInputBox) {
      inlineOptions =
        (await vscode.window.showInputBox({
          placeHolder: inlineOptions
        })) || inlineOptions
    }

    inlineOptions = inlineOptions.trim()

    if (!inlineOptions && command === 'nr') {
      return
    }

    const commandStatement = resolveNiCommandStatement(
      command,
      agent,
      inlineOptions ? inlineOptions.split(' ') : []
    )

    if (!commandStatement) {
      vscode.window.showErrorMessage(
        `${EXTENSION_NAME}: Unable to parse command statement for corresponding command`
      )
      return
    }

    const cwd = process.cwd()
    const commandName = COMMAND_NAMES[command]

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: `${EXTENSION_NAME}: ${commandName}`,
        cancellable: true
      },
      () => {
        return execaCommand(commandStatement, {
          stdio: 'inherit',
          encoding: 'utf-8',
          cwd: resolve(cwd, dir)
        })
          .then(() => {
            vscode.window.showInformationMessage(`${EXTENSION_NAME}: ${commandName} success`)
          })
          .catch((reason) => {
            vscode.window.showErrorMessage(`${EXTENSION_NAME}: ${reason.message}`)
          })
      }
    )
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
