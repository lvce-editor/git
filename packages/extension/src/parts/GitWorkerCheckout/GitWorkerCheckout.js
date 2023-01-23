import * as GitWorker from '../GitWorker/GitWorker.js'

/**
 * @param {string} ref
 */
export const execute = async (ref) => {
  await GitWorker.invoke('Git.checkout', ref)
}
