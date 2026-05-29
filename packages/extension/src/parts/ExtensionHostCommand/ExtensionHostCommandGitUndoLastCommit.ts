import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitUndoLastCommit

export const execute = async () => {
  return GitWorker.invoke(GitWorkerCommandType.CommandUndoLastCommit)
}
