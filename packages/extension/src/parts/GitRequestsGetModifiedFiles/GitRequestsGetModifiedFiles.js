import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 * @param {{cwd:string, gitPath:string }} options
 */
export const getModifiedFiles = async ({ cwd, gitPath }) => {
  const rpc = await GitWorker.getInstance()
  const result = await rpc.invoke(
    GitWorkerCommandType.GetModifiedFiles,
    cwd,
    gitPath
  )
  return result
}
