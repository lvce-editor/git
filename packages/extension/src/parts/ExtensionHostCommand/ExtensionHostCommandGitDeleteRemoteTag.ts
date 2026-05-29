import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitDeleteRemoteTag

export const execute = async (tag) => {
  return GitWorker.invoke(GitWorkerCommandType.GitDeleteRemoteTag, { tag })
}
