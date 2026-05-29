import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitUnstash

export const execute = async (options = undefined) => {
  if (options && typeof options === 'object') {
    return GitWorker.invoke(GitWorkerCommandType.GitUnstash, options)
  }
  return GitWorker.invoke('Command.gitUnstash')
}
