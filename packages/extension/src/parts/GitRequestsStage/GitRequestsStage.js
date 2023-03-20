import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 *
 * @param {{cwd:string,gitPath:string , file:string }} options
 */
export const stage = async ({ cwd, gitPath, file }) => {
  await GitWorker.invoke(GitWorkerCommandType.GitStage, {
    cwd,
    gitPath,
    file,
  })
}
