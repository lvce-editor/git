import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.ts'
import * as Config from '../Config/Config.ts'
import * as Exec from '../Exec/Exec.ts'
import * as ExtensionCommandType from '../ExtensionCommandType/ExtensionCommandType.ts'
import * as QuickPick from '../QuickPick/QuickPick.ts'

export const commandMap = {
  [ExtensionCommandType.ExecExec]: Exec.exec,
  [ExtensionCommandType.QuickPickShow]: QuickPick.show,
  [ExtensionCommandType.ConfigGetWorkspaceFolder]: Config.getWorkspaceFolder,
  [ExtensionCommandType.ConfigGetGitPaths]: Config.getGitPaths,
  [ExtensionCommandType.ConfigConfirmDiscard]: Config.confirmDiscard,
  [ExtensionCommandType.ConfirmPrompt]: Config.confirmPrompt,
  [ExtensionCommandType.ConfigShowErrorMessage]: Config.showErrorMessage,
  ['FileSystem.exists']: Config.exists,
  ['FileSystem.mkdir']: Config.mkdir,
  ['FileSystem.remove']: Config.remove,
  ['FileSystem.write']: Config.write,
  ['FileSystem.writeFile']: Config.write,
  ['FileSystem.read']: Config.readFile,
  ['FileSystem.readdir']: Config.readDir,
  ['FileSystem.stat']: Config.stat,
  ['Layout.handleWorkspaceRefresh']: Config.handleWorkspaceRefresh,
  ['Main.openUri']: Config.openUri,
}

export const getFn = (method) => {
  const fn = commandMap[method]
  if (!fn) {
    throw new CommandNotFoundError(method)
  }
}
