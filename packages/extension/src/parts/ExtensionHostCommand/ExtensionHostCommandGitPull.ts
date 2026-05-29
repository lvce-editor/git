import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = CommandId.GitPull

type PullOptions = {
  readonly from?: readonly string[]
}

export const execute = (options: PullOptions = {}) => {
  return GitWorker.invoke('Command.gitPull', options)
}
