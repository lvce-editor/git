import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as StatusBarCheckout from '../StatusBarCheckout/StatusBarCheckout.ts'
import * as StatusBarSync from '../StatusBarSync/StatusBarSync.ts'

export const id = CommandId.GitCheckout

export const execute = async (ref) => {
  const result = await GitWorker.invoke('Git.checkout', { ref })
  await StatusBarCheckout.refresh()
  await StatusBarSync.refresh()
  return result
}
