import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

/**
 *
 * @param {{cwd:string, gitPath: string,  tag: string}} options
 */
export const tag = async ({ cwd, gitPath, tag }) => {
  return GitWorker.invoke(GitWorkerCommandType.GitTag, {
    cwd,
    gitPath,
    tag,
  })
}
