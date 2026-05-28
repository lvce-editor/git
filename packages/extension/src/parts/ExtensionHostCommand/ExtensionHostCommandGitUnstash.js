import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitUnstash

export const execute = async (options = undefined) => {
  if (options && typeof options === 'object') {
    return GitWorker.invoke(GitWorkerCommandType.GitUnstash, options)
  }
  return GitWorker.invoke('Command.gitUnstash')
}
