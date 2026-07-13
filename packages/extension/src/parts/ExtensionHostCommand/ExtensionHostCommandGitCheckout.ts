import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as StatusBarCheckout from '../StatusBarCheckout/StatusBarCheckout.ts'

export const id = CommandId.GitCheckout

export const execute = async (ref) => {
  const result = await GitWorker.invoke('Git.checkout', { ref })
  await StatusBarCheckout.refresh()
  return result
}
