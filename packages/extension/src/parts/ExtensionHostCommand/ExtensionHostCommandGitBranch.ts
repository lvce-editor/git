import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitBranch

export const execute = async (name) => {
  if (typeof name !== 'string') {
    return
  }
  return GitWorker.invoke(GitWorkerCommandType.GitBranch, { name })
}
