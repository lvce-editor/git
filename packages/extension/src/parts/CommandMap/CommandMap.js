import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as Config from '../Config/Config.js'
import * as Exec from '../Exec/Exec.js'
import * as ExtensionCommandType from '../ExtensionCommandType/ExtensionCommandType.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as QuickPick from '../QuickPick/QuickPick.js'

export const getFn = (method) => {
  switch (method) {
    case ExtensionCommandType.RepositoriesGetCurrent:
      return Repositories.getCurrent
    case ExtensionCommandType.ExecExec:
      return Exec.exec
    case ExtensionCommandType.QuickPickShow:
      return QuickPick.show
    case ExtensionCommandType.ConfigGetWorkspaceFolder:
      return Config.getWorkspaceFolder
    case ExtensionCommandType.ConfigGetGitPaths:
      return Config.getGitPaths
    default:
      throw new CommandNotFoundError(method)
  }
}
