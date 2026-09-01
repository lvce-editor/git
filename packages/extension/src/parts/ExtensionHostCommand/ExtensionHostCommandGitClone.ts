import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitClone

export const execute = async (): Promise<string | undefined> => {
  return GitWorker.invoke(GitWorkerCommandType.CommandClone)
}
