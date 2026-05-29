import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = CommandId.GitCherryPick

export const execute = (ref) => {
  return GitWorker.invoke(GitWorkerCommandType.GitCherryPick, { ref })
}
