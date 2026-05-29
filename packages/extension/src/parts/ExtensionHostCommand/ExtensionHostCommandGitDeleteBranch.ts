import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitDeleteBranch

export const execute = async (name) => {
  return GitWorker.invoke(GitWorkerCommandType.GitDeleteBranch, { name })
}
