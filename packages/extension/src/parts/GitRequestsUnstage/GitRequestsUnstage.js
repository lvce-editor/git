import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string }} options
 */
export const unstage = async ({ cwd, gitPath, file }) => {
  await GitWorker.invoke(GitWorkerCommandType.GitUnstage, {
    cwd,
    gitPath,
    file,
  })
}
