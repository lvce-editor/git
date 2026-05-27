import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitGetCommits

export const execute = async () => {
  return GitWorker.invoke(GitWorkerCommandType.GitGetCommits)
}
