import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitAddRemote

export const execute = async (name, url) => {
  return GitWorker.invoke(GitWorkerCommandType.GitAddRemote, { name, url })
}
