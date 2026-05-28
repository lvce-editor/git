import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitAddRemote

export const execute = async (name, url) => {
  return GitWorker.invoke(GitWorkerCommandType.GitAddRemote, { name, url })
}
