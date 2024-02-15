import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitCheckout

export const execute = async (ref) => {
  return GitWorker.invoke('Command.gitCheckout', ref)
}
