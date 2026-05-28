import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitDeleteRemoteTag

export const execute = async (tag) => {
  return GitWorker.invoke(GitWorkerCommandType.GitDeleteRemoteTag, { tag })
}
