import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitAdd

/**
 * @param {string} file
 */
export const execute = (file) => {
  return GitWorker.invoke('Command.gitAdd', file)
}
