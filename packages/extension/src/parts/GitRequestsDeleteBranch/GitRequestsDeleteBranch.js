import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 * @param {{cwd:string,gitPath:string, name:string}} options
 */
export const deleteBranch = async ({ cwd, gitPath }) => {
  await GitWorker.invoke(GitWorkerCommandType.GitDeleteBranch, {
    cwd,
    gitPath,
  })
}
