import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitApplyStash

export const execute = async (options = undefined) => {
  if (options && typeof options === 'object') {
    return GitWorker.invoke(GitWorkerCommandType.GitApplyStash, options)
  }
  return GitWorker.invoke('Command.gitApplyStash')
}
