import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as ExtensionCommandType from '../ExtensionCommandType/ExtensionCommandType.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as Exec from '../Exec/Exec.js'

export const getFn = (method) => {
  switch (method) {
    case ExtensionCommandType.RepositoriesGetCurrent:
      return Repositories.getCurrent
    case ExtensionCommandType.ExecExec:
      return Exec.exec
    default:
      throw new CommandNotFoundError(method)
  }
}
