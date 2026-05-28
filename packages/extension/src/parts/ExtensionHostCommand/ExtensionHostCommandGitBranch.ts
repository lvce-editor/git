import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitBranch

export const execute = async (name) => {
  return GitWorker.invoke(GitWorkerCommandType.GitBranch, { name })
}
