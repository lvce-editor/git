import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = CommandId.GitOpenFile

/**
 * @param {string} file
 */
export const execute = async (file) => {
  return GitWorker.invoke('Command.openFile', file)
}
