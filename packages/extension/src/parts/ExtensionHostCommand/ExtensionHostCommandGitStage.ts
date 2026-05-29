import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = CommandId.GitStage

/**
 * @param {string} file
 */
export const execute = async (file) => {
  return GitWorker.invoke('Command.gitStage', file)
}
