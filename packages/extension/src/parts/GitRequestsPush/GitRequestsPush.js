import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 *
 * @param {{cwd:string, gitPath:string }} options
 */
export const push = async ({ cwd, gitPath }) => {
  return GitWorker.invoke(GitWorkerCommandType.GitPush, {
    cwd,
    gitPath,
  })
}
