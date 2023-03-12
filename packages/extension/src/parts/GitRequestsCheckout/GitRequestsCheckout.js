import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 * @param {{cwd:string, ref:string, gitPath:string  }} options
 */
export const checkout = async ({ cwd, gitPath, ref }) => {
  await GitWorker.invoke(GitWorkerCommandType.GitCheckout, {
    cwd,
    gitPath,
    ref,
  })
}
