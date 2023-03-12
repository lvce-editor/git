import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 *
 * @param {{cwd:string, gitPath:string }} options
 */
export const fetch = async ({ cwd, gitPath }) => {
  await GitWorker.invoke(GitWorkerCommandType.GitFetch, {
    cwd,
    gitPath,
  })
}
