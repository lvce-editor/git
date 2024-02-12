import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitCheckoutRef

// TODO move logic to git worker
export const execute = async () => {
  return GitWorker.invoke('Command.gitCheckoutRef')
  // console.log({ selectedPick })
}
