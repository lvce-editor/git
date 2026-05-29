import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitCommit

export const execute = async (message) => {
  return GitWorker.invoke(GitWorkerCommandType.GitCommit, { message })
}
