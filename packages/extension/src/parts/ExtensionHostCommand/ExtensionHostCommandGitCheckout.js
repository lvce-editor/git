import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorkerCheckout from '../GitWorkerCheckout/GitWorkerCheckout.js'

export const id = CommandId.GitCheckout

/**
 * @param {string} ref
 */
export const execute = async (ref) => {
  await GitWorkerCheckout.execute(ref)
}
