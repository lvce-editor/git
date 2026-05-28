import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'

export const id = CommandId.GitMerge

export const execute = (ref) => {
  return GitWorker.invoke('Command.gitMerge', ref)
}
