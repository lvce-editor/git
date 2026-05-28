import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitCherryPick

export const execute = (ref) => {
  return GitWorker.invoke(GitWorkerCommandType.GitCherryPick, { ref })
}
