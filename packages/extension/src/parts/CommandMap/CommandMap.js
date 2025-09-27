import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as Config from '../Config/Config.js'
import * as Exec from '../Exec/Exec.js'
import * as ExtensionCommandType from '../ExtensionCommandType/ExtensionCommandType.js'
import * as QuickPick from '../QuickPick/QuickPick.js'

export const getFn = (method) => {
  switch (method) {
    case ExtensionCommandType.ExecExec:
      return Exec.exec
    case ExtensionCommandType.QuickPickShow:
      return QuickPick.show
    case ExtensionCommandType.ConfigGetWorkspaceFolder:
      return Config.getWorkspaceFolder
    case ExtensionCommandType.ConfigGetGitPaths:
      return Config.getGitPaths
    case ExtensionCommandType.ConfigConfirmDiscard:
      return Config.confirmDiscard
    case ExtensionCommandType.ConfirmPrompt:
      return Config.confirmPrompt
    case ExtensionCommandType.ConfigShowErrorMessage:
      return Config.showErrorMessage
    case 'FileSystem.exists':
      return Config.exists
    default:
      throw new CommandNotFoundError(method)
  }
}
