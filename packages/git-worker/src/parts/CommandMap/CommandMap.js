import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'
import * as GetChangedFiles from '../GetChangedFiles/GetChangedFiles.js'

export const getFn = (method) => {
  switch (method) {
    case GitWorkerCommandType.GitGetChangedFiles:
      return GetChangedFiles.getChangedFiles
    default:
      throw new CommandNotFoundError(method)
  }
}
