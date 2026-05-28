import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitUndoLastCommit

export const execute = async () => {
  return GitWorker.invoke(GitWorkerCommandType.CommandUndoLastCommit)
}
