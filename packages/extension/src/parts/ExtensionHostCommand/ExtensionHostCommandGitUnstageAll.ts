import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = CommandId.GitUnstageAll

/**
 */
export const execute = async () => {
  return GitWorker.invoke('Command.gitUnstageAll')
}
