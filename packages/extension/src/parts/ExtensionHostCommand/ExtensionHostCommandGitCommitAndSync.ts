import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const id = CommandId.GitCommitAndSync

export const execute = async (message) => {
  await GitWorker.invoke(GitWorkerCommandType.GitCommit, { message })
  await GitWorker.invoke('Command.gitSync')
}
