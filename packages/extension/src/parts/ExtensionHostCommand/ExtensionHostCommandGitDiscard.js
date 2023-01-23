import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorkerDiscard from '../GitWorkerDiscard/GitWorkerDiscard.js'

export const id = CommandId.GitAddAll

/**
 * @param {string} file
 */
export const execute = async (file) => {
  await GitWorkerDiscard.execute(file)
}
