import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitSetConfig

export const execute = async (key, value) => {
  return GitWorker.invoke(GitWorkerCommandType.GitSetConfig, { key, value })
}
