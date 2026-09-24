import * as StatusTrace from '../StatusTrace/StatusTrace.ts'
import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitGetInvocations

export const execute = async (trace = false) => {
  if (trace) return StatusTrace.get()
  return GitWorker.invoke(GitWorkerCommandType.GitGetInvocations)
}
