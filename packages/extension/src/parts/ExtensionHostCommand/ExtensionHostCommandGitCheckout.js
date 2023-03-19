import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitCheckout

export const execute = async (ref) => {
  return GitWorker.invoke(GitWorkerCommandType.GitCheckout, ref)
}
