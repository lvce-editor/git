import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitCommitStaged

export const execute = async (message) => {
  return GitWorker.invoke(GitWorkerCommandType.GitCommit, { message })
}
