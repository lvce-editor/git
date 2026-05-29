import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = CommandId.GitCheckoutRef

// TODO move logic to git worker
export const execute = async () => {
  return GitWorker.invoke('Command.gitCheckoutRef')
  // console.log({ selectedPick })
}
