import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = CommandId.GitMerge

export const execute = (ref) => {
  return GitWorker.invoke('Command.gitMerge', ref)
}
