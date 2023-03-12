import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 *
 * @param {{cwd:string, message:string, gitPath:string }} options
 */
export const addAllAndCommit = async ({ cwd, gitPath, message }) => {
  await GitWorker.invoke(GitWorkerCommandType.GitAddAllAndCommit, {
    message,
    cwd,
    gitPath,
  })
}
