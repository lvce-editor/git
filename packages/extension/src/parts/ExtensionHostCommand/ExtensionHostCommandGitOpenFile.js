import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitOpenFile

/**
 * @param {string} file
 */
export const execute = async (file) => {
  return GitWorker.invoke('Command.openFile', file)
}
