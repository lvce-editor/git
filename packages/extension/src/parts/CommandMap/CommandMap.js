import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as ExtensionCommandType from '../ExtensionCommandType/ExtensionCommandType.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as Exec from '../Exec/Exec.js'
import * as QuickPick from '../QuickPick/QuickPick.js'

export const getFn = (method) => {
  switch (method) {
    case ExtensionCommandType.RepositoriesGetCurrent:
      return Repositories.getCurrent
    case ExtensionCommandType.ExecExec:
      return Exec.exec
    case ExtensionCommandType.QuickPickShow:
      return QuickPick.show
    default:
      throw new CommandNotFoundError(method)
  }
}
