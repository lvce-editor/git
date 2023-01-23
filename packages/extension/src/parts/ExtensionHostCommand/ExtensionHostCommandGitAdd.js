import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorkerAdd from '../GitWorkerAdd/GitWorkerAdd.js'

export const id = CommandId.GitAddAll

/**
 * @param {string} file
 */
export const execute = async (file) => {
  await GitWorkerAdd.execute(file)
}
