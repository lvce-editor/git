import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = CommandId.GitDiscard

/**
 * @param {string} file
 */
export const execute = async (file) => {
  return GitWorker.invoke('Command.gitDiscard', file)
}
