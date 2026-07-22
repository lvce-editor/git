import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'
import * as StatusBarSync from '../StatusBarSync/StatusBarSync.ts'

export const id = CommandId.GitPush

export const execute = async (options = undefined) => {
  try {
    if (options && typeof options === 'object') {
      return await GitWorker.invoke(GitWorkerCommandType.GitPush, options)
    }
    return await GitWorker.invoke('Command.gitPush')
  } finally {
    await StatusBarSync.refresh()
  }
}
