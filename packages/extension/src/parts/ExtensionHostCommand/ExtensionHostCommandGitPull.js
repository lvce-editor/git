import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitPull

export const execute = async () => {
  return GitWorker.invoke(GitWorkerCommandType.GitPull)
}
