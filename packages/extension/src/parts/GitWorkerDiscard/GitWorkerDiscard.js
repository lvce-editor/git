import * as GitWorker from '../GitWorker/GitWorker.js'

/**
 * @param {string} file
 */
export const execute = async (file) => {
  await GitWorker.invoke('Git.discard', file)
}
