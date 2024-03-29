import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitDiscard

/**
 * @param {string} file
 */
export const execute = async (file) => {
  return GitWorker.invoke('Command.gitDiscard', file)
}
