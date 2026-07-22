import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'
import * as StatusBarSync from '../StatusBarSync/StatusBarSync.ts'

export const id = CommandId.GitCommit

export const execute = async (message) => {
  try {
    return await GitWorker.invoke(GitWorkerCommandType.GitCommit, { message })
  } finally {
    await StatusBarSync.refresh()
  }
}
