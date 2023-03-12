import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 *
 * @param {{cwd:string, gitPath: string}} options
 */
export const version = async ({ cwd, gitPath }) => {
  return GitWorker.invoke(GitWorkerCommandType.GitVersion, {
    cwd,
    gitPath,
  })
}
