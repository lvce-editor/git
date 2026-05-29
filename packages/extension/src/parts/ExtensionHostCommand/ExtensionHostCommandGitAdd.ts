import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = CommandId.GitAdd

/**
 * @param {string} file
 */
export const execute = (file) => {
  return GitWorker.invoke('Command.gitAdd', file)
}
