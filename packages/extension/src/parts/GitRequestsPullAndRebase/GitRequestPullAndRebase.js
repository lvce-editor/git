import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 *
 * @param {{cwd:string, gitPath:string }} options
 */
export const pullAndRebase = async ({ cwd, gitPath }) => {
  return GitWorker.invoke(GitWorkerCommandType.GitPullAndRebase, {
    cwd,
    gitPath,
  })
}
