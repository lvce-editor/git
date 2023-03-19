import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitAddAll

/**
 * @param {string} file
 */
export const execute = async (file) => {
  return GitWorker.invoke(GitWorkerCommandType.GitPush, file)
}
