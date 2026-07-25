import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as StatusBarSync from '../StatusBarSync/StatusBarSync.ts'

export const id = CommandId.GitSync

export const execute = async () => {
  await StatusBarSync.setSpinning(true)
  try {
    return await GitWorker.invoke('Command.gitSync')
  } finally {
    try {
      await StatusBarSync.refresh()
    } finally {
      await StatusBarSync.setSpinning(false)
    }
  }
}
