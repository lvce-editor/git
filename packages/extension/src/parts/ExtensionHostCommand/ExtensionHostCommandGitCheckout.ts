import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = CommandId.GitCheckout

export const execute = async (ref) => {
  return GitWorker.invoke('Git.checkout', { ref })
}
