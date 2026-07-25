import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'
import * as StatusBarSync from '../StatusBarSync/StatusBarSync.ts'

export const id = CommandId.GitCommitAndSync

export const execute = async (message) => {
  await StatusBarSync.setSpinning(true)
  try {
    await GitWorker.invoke(GitWorkerCommandType.GitCommit, { message })
    await GitWorker.invoke('Command.gitSync')
  } finally {
    try {
      await StatusBarSync.refresh()
    } finally {
      await StatusBarSync.setSpinning(false)
    }
  }
}
