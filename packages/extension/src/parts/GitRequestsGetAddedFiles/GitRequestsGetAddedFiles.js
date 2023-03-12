import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 * @param {{cwd:string, gitPath:string }} options
 */
export const getAddedFiles = async ({ cwd, gitPath }) => {
  return GitWorker.invoke(GitWorkerCommandType.GitGetAddedFiles, {
    cwd,
    gitPath,
  })
}
