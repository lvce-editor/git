import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as ExtensionCommandType from '../ExtensionCommandType/ExtensionCommandType.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as Exec from '../Exec/Exec.js'
import * as GetGitPaths from '../GetGitPaths/GetGitPaths.js'

export const getFn = (method) => {
  switch (method) {
    case ExtensionCommandType.RepositoriesGetCurrent:
      return Repositories.getCurrent
    case ExtensionCommandType.ExecExec:
      return Exec.exec
    case ExtensionCommandType.ConfigurationGetGitPaths:
      return GetGitPaths.getGitPaths
    default:
      throw new CommandNotFoundError(method)
  }
}
