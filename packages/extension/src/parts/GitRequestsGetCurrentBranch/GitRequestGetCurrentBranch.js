import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 *
 * @param {{cwd:string, gitPath:string }} options
 */
export const getCurrentBranch = async ({ cwd, gitPath }) => {
  const branch = await GitWorker.invoke(
    GitWorkerCommandType.GitGetCurrentBranch,
    {
      cwd,
      gitPath,
    }
  )
  return branch
}
