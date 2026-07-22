import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as StatusBarSync from '../StatusBarSync/StatusBarSync.ts'

export const id = CommandId.GitPullRebase

export const execute = async () => {
  try {
    return await GitWorker.invoke('Command.gitPullRebase')
  } finally {
    await StatusBarSync.refresh()
  }
}
