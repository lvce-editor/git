import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitGetCommits

export const execute = async () => {
  return GitWorker.invoke(GitWorkerCommandType.GitGetCommits, {})
}
