import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 * @param {{cwd:string, gitPath:string, message:string}} options
 */
export const commit = async ({ cwd, gitPath, message }) => {
  await GitWorker.invoke(GitWorkerCommandType.GitCommit, {
    cwd,
    gitPath,
    message,
  })
}
