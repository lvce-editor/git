import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitUnstageAll

/**
 */
export const execute = async () => {
  return GitWorker.invoke('Command.gitUnstageAll')
}
