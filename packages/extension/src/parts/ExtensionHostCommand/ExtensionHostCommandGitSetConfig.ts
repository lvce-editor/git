import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitSetConfig

export const execute = async (key, value) => {
  return GitWorker.invoke(GitWorkerCommandType.GitSetConfig, { key, value })
}
